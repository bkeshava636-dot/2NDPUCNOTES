import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { db } from "@workspace/db";
import { sectionsTable, cardsTable, ordersTable } from "@workspace/db";
import { eq, sql, asc, desc, and } from "drizzle-orm";
import { supabase, BUCKET_NOTES, BUCKET_IMAGES } from "../supabase.js";

const router = Router();

const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const uploadImageMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error(
    "ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env"
  );
}
const sessions = new Set<string>();

function requireAdmin(req: any, res: any, next: any) {
  const token = req.headers["x-admin-token"] as string;
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ── Auth ────────────────────────────────────────────────────────────────────

router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    username !== ADMIN_USERNAME ||
    password !== ADMIN_PASSWORD
  ) {
    res.status(401).json({
      error: "Invalid username or password",
    });
    return;
  }

  const token = uuidv4();
  sessions.add(token);

  res.json({
    success: true,
    message: "Logged in",
    token,
  });
});

router.post("/admin/logout", requireAdmin, (req, res) => {
  const token = req.headers["x-admin-token"] as string;
  sessions.delete(token);
  res.json({ success: true });
});

router.get("/admin/me", (req, res) => {
  const token = req.headers["x-admin-token"] as string;
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ isAdmin: true });
});

// ── Stats ───────────────────────────────────────────────────────────────────

router.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    const [revenue] = await db.select({ total: sql<number>`coalesce(sum(amount_paise),0)::int` }).from(ordersTable).where(eq(ordersTable.status, "paid"));
    const [orders] = await db.select({ count: sql<number>`count(*)::int` }).from(ordersTable).where(eq(ordersTable.status, "paid"));
    const [cards] = await db.select({ count: sql<number>`count(*)::int` }).from(cardsTable).where(eq(cardsTable.isDeleted, false));
    const [sections] = await db.select({ count: sql<number>`count(*)::int` }).from(sectionsTable);
    const [customers] = await db.select({ count: sql<number>`count(distinct customer_phone)::int` }).from(ordersTable).where(eq(ordersTable.status, "paid"));
    const recentOrders = await db
      .select({ order: ordersTable, cardTitle: cardsTable.title })
      .from(ordersTable)
      .leftJoin(cardsTable, eq(ordersTable.cardId, cardsTable.id))
      .orderBy(desc(ordersTable.createdAt))
      .limit(10);
    res.json({
      totalRevenuePaise: revenue.total,
      totalOrders: orders.count,
      totalCards: cards.count,
      totalSections: sections.count,
      totalCustomers: customers.count,
      recentOrders: recentOrders.map(({ order, cardTitle }) => ({
        id: order.id,
        cardId: order.cardId,
        cardTitle: cardTitle ?? "",
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        amountPaise: order.amountPaise,
        status: order.status,
        razorpayOrderId: order.razorpayOrderId,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
      })),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ── Sections ────────────────────────────────────────────────────────────────

router.get("/admin/sections", requireAdmin, async (req, res) => {
  try {
    const sects = await db.select().from(sectionsTable).orderBy(asc(sectionsTable.sortOrder));
    const cardCounts = await db
      .select({ sectionId: cardsTable.sectionId, count: sql<number>`count(*)::int` })
      .from(cardsTable)
      .where(eq(cardsTable.isDeleted, false))
      .groupBy(cardsTable.sectionId);
    const countMap = Object.fromEntries(cardCounts.map((r) => [r.sectionId, r.count]));
    res.json(sects.map((s) => ({ ...s, cardCount: countMap[s.id] ?? 0 })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch sections" });
  }
});

router.post("/admin/sections", requireAdmin, async (req, res) => {
  try {
    const { name, description, isVisible } = req.body;
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const [maxOrder] = await db.select({ max: sql<number>`coalesce(max(sort_order),0)::int` }).from(sectionsTable);
    const [section] = await db
      .insert(sectionsTable)
      .values({ name, slug: slugify(name), description: description || null, isVisible: isVisible ?? true, sortOrder: maxOrder.max + 1 })
      .returning();
    res.status(201).json({ ...section, cardCount: 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create section" });
  }
});

router.patch("/admin/sections/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const { name, description, isVisible, sortOrder } = req.body;
    const updates: Record<string, unknown> = {};
    if (name !== undefined) { updates.name = name; updates.slug = slugify(name); }
    if (description !== undefined) updates.description = description;
    if (isVisible !== undefined) updates.isVisible = isVisible;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    const [updated] = await db.update(sectionsTable).set(updates).where(eq(sectionsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    const [cc] = await db.select({ count: sql<number>`count(*)::int` }).from(cardsTable).where(and(eq(cardsTable.sectionId, id), eq(cardsTable.isDeleted, false)));
    res.json({ ...updated, cardCount: cc.count });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update section" });
  }
});

router.delete("/admin/sections/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    await db.delete(sectionsTable).where(eq(sectionsTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete section" });
  }
});

router.post("/admin/sections/reorder", requireAdmin, async (req, res) => {
  try {
    const { ids } = req.body as { ids: number[] };
    if (!Array.isArray(ids)) { res.status(400).json({ error: "ids must be an array" }); return; }
    await Promise.all(ids.map((id, idx) => db.update(sectionsTable).set({ sortOrder: idx }).where(eq(sectionsTable.id, id))));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to reorder" });
  }
});

// ── Cards ───────────────────────────────────────────────────────────────────

router.get("/admin/cards", requireAdmin, async (req, res) => {
  try {
    const { sectionId } = req.query as Record<string, string>;
    const rows = await db
      .select({ card: cardsTable, sectionName: sectionsTable.name })
      .from(cardsTable)
      .leftJoin(sectionsTable, eq(cardsTable.sectionId, sectionsTable.id))
      .where(
        sectionId
          ? and(eq(cardsTable.sectionId, parseInt(sectionId)), eq(cardsTable.isDeleted, false))
          : eq(cardsTable.isDeleted, false)
      )
      .orderBy(asc(cardsTable.sortOrder));
    res.json(rows.map(({ card, sectionName }) => ({ ...card, sectionName })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

router.post("/admin/cards", requireAdmin, async (req, res) => {
  try {
    const {
      sectionId, title, description, subject, chapter, semester,
      board, classLevel, resourceType, isFree, pricePaise,
      discountPricePaise, telegramLink, isNew,
      thumbnailUrl, previewImageUrls, pdfFileKey,
      pageCount, fileSizeKb, isFeatured, isVisible,
    } = req.body;
    if (!sectionId || !title) {
      res.status(400).json({ error: "sectionId and title are required" });
      return;
    }
    const [maxOrder] = await db.select({ max: sql<number>`coalesce(max(sort_order),0)::int` }).from(cardsTable).where(eq(cardsTable.sectionId, sectionId));
    const [card] = await db
      .insert(cardsTable)
      .values({
        sectionId, title,
        description: description || null,
        subject: subject || null,
        chapter: chapter || null,
        semester: semester || null,
        board: board || "Karnataka",
        classLevel: classLevel || "2nd PUC",
        resourceType: resourceType || "Notes",
        isFree: isFree ?? false,
        pricePaise: pricePaise || 0,
        discountPricePaise: discountPricePaise || null,
        telegramLink: telegramLink || null,
        isNew: isNew ?? false,
        thumbnailUrl: thumbnailUrl || null,
        previewImageUrls: previewImageUrls || [],
        pdfFileKey: pdfFileKey || null,
        pageCount: pageCount || null,
        fileSizeKb: fileSizeKb || null,
        isFeatured: isFeatured ?? false,
        isVisible: isVisible ?? true,
        sortOrder: maxOrder.max + 1,
      })
      .returning();
    const [section] = await db.select().from(sectionsTable).where(eq(sectionsTable.id, sectionId));
    res.status(201).json({ ...card, sectionName: section?.name });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create card" });
  }
});

router.patch("/admin/cards/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const fields = [
      "sectionId", "title", "description", "subject", "chapter", "semester",
      "board", "classLevel", "resourceType", "isFree", "pricePaise",
      "discountPricePaise", "telegramLink", "isNew",
      "thumbnailUrl", "previewImageUrls", "pdfFileKey",
      "pageCount", "fileSizeKb", "isFeatured", "isVisible", "sortOrder",
    ];
    const updates: Record<string, unknown> = {};
    for (const f of fields) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }
    const [updated] = await db.update(cardsTable).set(updates).where(eq(cardsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    const [section] = await db.select().from(sectionsTable).where(eq(sectionsTable.id, updated.sectionId));
    res.json({ ...updated, sectionName: section?.name });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update card" });
  }
});

router.delete("/admin/cards/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const [card] = await db.select().from(cardsTable).where(eq(cardsTable.id, id));
    if (card?.pdfFileKey) {
      await supabase.storage.from(BUCKET_NOTES).remove([card.pdfFileKey]);
    }
    // Soft-delete — keeps order history intact
    await db.update(cardsTable).set({ isDeleted: true }).where(eq(cardsTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete card" });
  }
});

// ── Orders ──────────────────────────────────────────────────────────────────

router.get("/admin/orders", requireAdmin, async (req, res) => {
  try {
    const page = parseInt((req.query.page as string) || "1") || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const [total] = await db.select({ count: sql<number>`count(*)::int` }).from(ordersTable);
    const rows = await db
      .select({ order: ordersTable, cardTitle: cardsTable.title })
      .from(ordersTable)
      .leftJoin(cardsTable, eq(ordersTable.cardId, cardsTable.id))
      .orderBy(desc(ordersTable.createdAt))
      .limit(limit)
      .offset(offset);
    res.json({
      orders: rows.map(({ order, cardTitle }) => ({
        id: order.id,
        cardId: order.cardId,
        cardTitle: cardTitle ?? "",
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        amountPaise: order.amountPaise,
        status: order.status,
        razorpayOrderId: order.razorpayOrderId,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
      })),
      total: total.count,
      page,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ── File Uploads ────────────────────────────────────────────────────────────

router.post("/admin/upload/pdf", requireAdmin, uploadMemory.single("file"), async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  const key = `${uuidv4()}.pdf`;
  const { error } = await supabase.storage
    .from(BUCKET_NOTES)
    .upload(key, req.file.buffer, { contentType: req.file.mimetype || "application/pdf", upsert: false });
  if (error) { req.log.error(error); res.status(500).json({ error: "Upload to storage failed" }); return; }
  res.json({ key, url: `/api/purchases/sign/${encodeURIComponent(key)}` });
});

router.post("/admin/upload/image", requireAdmin, uploadImageMemory.single("file"), async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  const ext = req.file.originalname.split(".").pop() || "jpg";
  const key = `${uuidv4()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET_IMAGES)
    .upload(key, req.file.buffer, { contentType: req.file.mimetype || "image/jpeg", upsert: false });
  if (error) { req.log.error(error); res.status(500).json({ error: "Upload to storage failed" }); return; }
  const { data: publicData } = supabase.storage.from(BUCKET_IMAGES).getPublicUrl(key);
  res.json({ key, url: publicData.publicUrl });
});

export default router;
