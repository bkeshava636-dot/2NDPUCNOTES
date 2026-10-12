import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { db } from "@workspace/db";
import { sectionsTable, cardsTable, ordersTable, customersTable, downloadsTable, pageViewsTable, feedbackTable } from "@workspace/db";
import { eq, sql, asc, desc, and } from "drizzle-orm";
import { supabase, BUCKET_NOTES, BUCKET_IMAGES } from "../supabase.js";
import { ensureDefaultSections, DEFAULT_CORE_SECTIONS } from "../lib/ensure-sections.js";

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

// In-memory cache for fast lookup & explicit logout invalidation
const sessions = new Set<string>();
const revokedSessions = new Set<string>();

function signAdminToken(timestamp: number): string {
  const data = `adm_${timestamp}`;
  const hmac = crypto.createHmac("sha256", ADMIN_PASSWORD!).update(data).digest("hex");
  return `adm_${timestamp}_${hmac}`;
}

function isValidAdminToken(token: string): boolean {
  if (!token) return false;
  if (revokedSessions.has(token)) return false;
  if (sessions.has(token)) return true;

  if (token.startsWith("adm_")) {
    const parts = token.split("_");
    if (parts.length === 3) {
      const ts = parseInt(parts[1], 10);
      if (isNaN(ts)) return false;
      // 7 days expiration
      const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - ts > maxAgeMs) return false;
      const expected = signAdminToken(ts);
      try {
        if (crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
          sessions.add(token);
          return true;
        }
      } catch {
        return false;
      }
    }
  }
  return false;
}

function requireAdmin(req: any, res: any, next: any) {
  const token = req.headers["x-admin-token"] as string;
  if (!token || !isValidAdminToken(token)) {
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

  const token = signAdminToken(Date.now());
  sessions.add(token);

  res.json({
    success: true,
    message: "Logged in",
    token,
  });
});

router.post("/admin/logout", requireAdmin, (req, res) => {
  const token = req.headers["x-admin-token"] as string;
  if (token) {
    sessions.delete(token);
    revokedSessions.add(token);
  }
  res.json({ success: true });
});

router.get("/admin/me", (req, res) => {
  const token = req.headers["x-admin-token"] as string;
  if (!token || !isValidAdminToken(token)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ isAdmin: true });
});

// ── Stats ───────────────────────────────────────────────────────────────────

router.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    await ensureDefaultSections();

    // Query each metric with safe fallbacks so one missing or empty table doesn't cause a 500
    const revenuePromise = db
      .select({ total: sql<number>`coalesce(sum(amount_paise), 0)::int` })
      .from(ordersTable)
      .where(eq(ordersTable.status, "paid"))
      .then((rows) => rows[0]?.total ?? 0)
      .catch((err) => {
        req.log?.error?.(err, "Failed to query total revenue");
        return 0;
      });

    const ordersPromise = db
      .select({ count: sql<number>`count(*)::int` })
      .from(ordersTable)
      .where(eq(ordersTable.status, "paid"))
      .then((rows) => rows[0]?.count ?? 0)
      .catch((err) => {
        req.log?.error?.(err, "Failed to query orders count");
        return 0;
      });

    const cardsPromise = db
      .select({ count: sql<number>`count(*)::int` })
      .from(cardsTable)
      .where(eq(cardsTable.isDeleted, false))
      .then((rows) => rows[0]?.count ?? 0)
      .catch((err) => {
        req.log?.error?.(err, "Failed to query cards count");
        return 0;
      });

    const sectionsPromise = db
      .select({ count: sql<number>`count(*)::int` })
      .from(sectionsTable)
      .then((rows) => rows[0]?.count ?? 0)
      .catch((err) => {
        req.log?.error?.(err, "Failed to query sections count");
        return 0;
      });

    const customersPromise = db
      .select({ count: sql<number>`count(distinct customer_phone)::int` })
      .from(ordersTable)
      .where(eq(ordersTable.status, "paid"))
      .then((rows) => rows[0]?.count ?? 0)
      .catch((err) => {
        req.log?.error?.(err, "Failed to query customers count");
        return 0;
      });

    const downloadsPromise = db
      .select({ count: sql<number>`count(*)::int` })
      .from(downloadsTable)
      .then((rows) => rows[0]?.count ?? 0)
      .catch((err) => {
        req.log?.error?.(err, "Failed to query downloads count");
        return 0;
      });

    const recentOrdersPromise = db
      .select({ order: ordersTable, cardTitle: cardsTable.title })
      .from(ordersTable)
      .leftJoin(cardsTable, eq(ordersTable.cardId, cardsTable.id))
      .orderBy(desc(ordersTable.createdAt))
      .limit(10)
      .catch((err) => {
        req.log?.error?.(err, "Failed to query recent orders");
        return [];
      });

    const pageViewsPromise = db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageViewsTable)
      .then((rows) => rows[0]?.count ?? 0)
      .catch((err) => {
        req.log?.error?.(err, "Failed to query page views count");
        return 0;
      });

    const [totalRevenuePaise, totalOrders, totalCards, totalSections, totalCustomers, totalDownloads, totalPageViews, recentOrders] =
      await Promise.all([
        revenuePromise,
        ordersPromise,
        cardsPromise,
        sectionsPromise,
        customersPromise,
        downloadsPromise,
        pageViewsPromise,
        recentOrdersPromise,
      ]);

    res.json({
      totalRevenuePaise,
      totalOrders,
      totalCards,
      totalSections,
      totalCustomers,
      totalDownloads,
      totalPageViews,
      recentOrders: (recentOrders || []).map(({ order, cardTitle }: any) => ({
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
  } catch (err: any) {
    req.log?.error?.(err, "Unexpected error in /admin/stats");
    res.status(500).json({ 
      error: "Failed to fetch stats", 
      detail: err?.message || String(err) 
    });
  }
});

// ── Sections ────────────────────────────────────────────────────────────────

router.get("/admin/sections", requireAdmin, async (req, res) => {
  try {
    await ensureDefaultSections();
    const sects = await db.select().from(sectionsTable).orderBy(asc(sectionsTable.sortOrder));
    const cardCounts = await db
      .select({ sectionId: cardsTable.sectionId, count: sql<number>`count(*)::int` })
      .from(cardsTable)
      .where(eq(cardsTable.isDeleted, false))
      .groupBy(cardsTable.sectionId);
    const countMap = Object.fromEntries(cardCounts.map((r) => [r.sectionId, r.count]));

    if (sects.length === 0) {
      res.json(DEFAULT_CORE_SECTIONS.map((s, idx) => ({
        id: idx + 1,
        ...s,
        isVisible: true,
        cardCount: 0,
      })));
      return;
    }

    res.json(sects.map((s) => ({ ...s, cardCount: countMap[s.id] ?? 0 })));
  } catch (err) {
    req.log.error(err);
    res.json(DEFAULT_CORE_SECTIONS.map((s, idx) => ({
      id: idx + 1,
      ...s,
      isVisible: true,
      cardCount: 0,
    })));
  }
});

router.post("/admin/sections", requireAdmin, async (req, res) => {
  try {
    const { name, description, isVisible, officialSourceUrl } = req.body;
    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const [maxOrder] = await db.select({ max: sql<number>`coalesce(max(sort_order),0)::int` }).from(sectionsTable);
    const [section] = await db
      .insert(sectionsTable)
      .values({
        name,
        slug: slugify(name),
        description: description || null,
        officialSourceUrl: officialSourceUrl || null,
        isVisible: isVisible ?? true,
        sortOrder: maxOrder.max + 1,
      })
      .returning();
    res.status(201).json({ ...section, cardCount: 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create section" });
  }
});

const updateSectionHandler = async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const { name, description, isVisible, sortOrder, officialSourceUrl } = req.body;
    const updates: Record<string, unknown> = {};
    if (name !== undefined) { updates.name = name; updates.slug = slugify(name); }
    if (description !== undefined) updates.description = description;
    if (officialSourceUrl !== undefined) updates.officialSourceUrl = officialSourceUrl;
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
};

router.patch("/admin/sections/:id", requireAdmin, updateSectionHandler);
router.put("/admin/sections/:id", requireAdmin, updateSectionHandler);

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
    const { sectionId, subject, resourceType, subtype, isFree } = req.query as Record<string, string>;
    const conditions = [eq(cardsTable.isDeleted, false)];
    if (sectionId) conditions.push(eq(cardsTable.sectionId, parseInt(sectionId)));
    if (subject) conditions.push(eq(cardsTable.subject, subject));
    if (resourceType) conditions.push(eq(cardsTable.resourceType, resourceType));
    if (subtype) conditions.push(eq(cardsTable.subtype, subtype));
    if (isFree === "true") conditions.push(eq(cardsTable.isFree, true));
    if (isFree === "false") conditions.push(eq(cardsTable.isFree, false));

    const rows = await db
      .select({ card: cardsTable, sectionName: sectionsTable.name })
      .from(cardsTable)
      .leftJoin(sectionsTable, eq(cardsTable.sectionId, sectionsTable.id))
      .where(and(...conditions))
      .orderBy(asc(cardsTable.sortOrder));
    res.json(rows.map(({ card, sectionName }) => ({ ...card, sectionName: sectionName ?? "" })));
  } catch (err: any) {
    req.log?.error?.(err, "Error fetching cards from database");
    // Return empty list safely so the admin UI renders instead of crashing with HTTP 500
    res.json([]);
  }
});

router.post("/admin/cards", requireAdmin, async (req, res) => {
  try {
    const {
      sectionId, title, description, subject, chapter, semester,
      board, classLevel, resourceType, subtype, isRecommended, answerKeyUrl, officialSourceUrl,
      additionalCategories,
      isFree, pricePaise, discountPricePaise, telegramLink, isNew,
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
        subtype: subtype || null,
        isRecommended: isRecommended ?? false,
        answerKeyUrl: answerKeyUrl || null,
        officialSourceUrl: officialSourceUrl || null,
        additionalCategories: Array.isArray(additionalCategories) ? additionalCategories : [],
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

const updateCardHandler = async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const fields = [
      "sectionId", "title", "description", "subject", "chapter", "semester",
      "board", "classLevel", "resourceType", "subtype", "isRecommended", "answerKeyUrl", "officialSourceUrl",
      "additionalCategories",
      "isFree", "pricePaise", "discountPricePaise", "telegramLink", "isNew",
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
};

router.patch("/admin/cards/:id", requireAdmin, updateCardHandler);
router.put("/admin/cards/:id", requireAdmin, updateCardHandler);

router.delete("/admin/cards/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const [card] = await db.select().from(cardsTable).where(eq(cardsTable.id, id));
    if (card?.pdfFileKey && !card.pdfFileKey.startsWith("http://") && !card.pdfFileKey.startsWith("https://")) {
      await supabase.storage.from(BUCKET_NOTES).remove([card.pdfFileKey]).catch(() => {});
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
  } catch (err: any) {
    req.log?.error?.(err, "Failed to fetch orders");
    res.json({ orders: [], total: 0, page: 1 });
  }
});

// ── Customers ──────────────────────────────────────────────────────────────

router.get("/admin/customers", requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || "1") || 1);
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || "20") || 20));
    const search = ((req.query.search as string) || "").trim();
    const offset = (page - 1) * limit;

    let searchCondition = undefined;
    if (search) {
      const pattern = `%${search}%`;
      searchCondition = sql`(${customersTable.fullName} ILIKE ${pattern} OR ${customersTable.phone} ILIKE ${pattern} OR ${customersTable.email} ILIKE ${pattern})`;
    }

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(customersTable)
      .where(searchCondition)
      .catch(() => [{ count: 0 }]);

    const customers = await db
      .select()
      .from(customersTable)
      .where(searchCondition)
      .orderBy(desc(customersTable.createdAt))
      .limit(limit)
      .offset(offset)
      .catch(() => []);

    const customerIds = customers.map((c) => c.id);
    let orderStatsMap: Record<number, { paidOrdersCount: number; totalSpentPaise: number }> = {};

    if (customerIds.length > 0) {
      const orderStats = await db
        .select({
          customerId: ordersTable.customerId,
          paidOrdersCount: sql<number>`count(case when ${ordersTable.status} = 'paid' then 1 end)::int`,
          totalSpentPaise: sql<number>`coalesce(sum(case when ${ordersTable.status} = 'paid' then ${ordersTable.amountPaise} else 0 end), 0)::int`,
        })
        .from(ordersTable)
        .where(sql`${ordersTable.customerId} IN ${customerIds}`)
        .groupBy(ordersTable.customerId)
        .catch(() => []);

      for (const stat of orderStats) {
        if (stat.customerId) {
          orderStatsMap[stat.customerId] = {
            paidOrdersCount: stat.paidOrdersCount,
            totalSpentPaise: stat.totalSpentPaise,
          };
        }
      }
    }

    res.json({
      customers: customers.map((c) => ({
        id: c.id,
        fullName: c.fullName,
        phone: c.phone,
        email: c.email,
        createdAt: c.createdAt,
        paidOrdersCount: orderStatsMap[c.id]?.paidOrdersCount ?? 0,
        totalSpentPaise: orderStatsMap[c.id]?.totalSpentPaise ?? 0,
      })),
      total: totalRow?.count ?? 0,
      page,
      limit,
    });
  } catch (err: any) {
    req.log?.error?.(err, "Failed to fetch customers");
    res.json({ customers: [], total: 0, page: 1, limit: 20 });
  }
});

// ── Downloads Audit ────────────────────────────────────────────────────────

router.get("/admin/downloads", requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || "1") || 1);
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || "20") || 20));
    const search = ((req.query.search as string) || "").trim();
    const offset = (page - 1) * limit;

    let searchCondition = undefined;
    if (search) {
      const pattern = `%${search}%`;
      searchCondition = sql`(${downloadsTable.orderId} ILIKE ${pattern} OR ${cardsTable.title} ILIKE ${pattern} OR ${ordersTable.customerName} ILIKE ${pattern} OR ${ordersTable.customerPhone} ILIKE ${pattern})`;
    }

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(downloadsTable)
      .leftJoin(cardsTable, eq(downloadsTable.cardId, cardsTable.id))
      .leftJoin(ordersTable, eq(downloadsTable.orderId, ordersTable.id))
      .where(searchCondition)
      .catch(() => [{ count: 0 }]);

    const rows = await db
      .select({
        download: downloadsTable,
        cardTitle: cardsTable.title,
        customerName: ordersTable.customerName,
        customerPhone: ordersTable.customerPhone,
      })
      .from(downloadsTable)
      .leftJoin(cardsTable, eq(downloadsTable.cardId, cardsTable.id))
      .leftJoin(ordersTable, eq(downloadsTable.orderId, ordersTable.id))
      .where(searchCondition)
      .orderBy(desc(downloadsTable.downloadedAt))
      .limit(limit)
      .offset(offset)
      .catch(() => []);

    res.json({
      downloads: rows.map(({ download, cardTitle, customerName, customerPhone }) => ({
        id: download.id,
        orderId: download.orderId,
        cardId: download.cardId,
        cardTitle: cardTitle ?? "Unknown Resource",
        customerName: customerName ?? "Guest",
        customerPhone: customerPhone ?? "—",
        downloadedAt: download.downloadedAt,
        ipAddress: download.ipAddress,
        deviceInfo: download.deviceInfo,
      })),
      total: totalRow?.count ?? 0,
      page,
      limit,
    });
  } catch (err: any) {
    req.log?.error?.(err, "Failed to fetch downloads");
    res.json({ downloads: [], total: 0, page: 1, limit: 20 });
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

// ── Analytics ────────────────────────────────────────────────────────────────

router.get("/admin/analytics", requireAdmin, async (req, res) => {
  try {
    await ensureDefaultSections();
    const range = (req.query.range as string) || "30d"; // 24h, 7d, 30d, all
    let timeCondition = sql`1=1`;
    if (range === "24h") {
      timeCondition = sql`${pageViewsTable.createdAt} >= NOW() - INTERVAL '24 hours'`;
    } else if (range === "7d") {
      timeCondition = sql`${pageViewsTable.createdAt} >= NOW() - INTERVAL '7 days'`;
    } else if (range === "30d") {
      timeCondition = sql`${pageViewsTable.createdAt} >= NOW() - INTERVAL '30 days'`;
    }

    // 1. Total views in range & all time
    const [rangeTotalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageViewsTable)
      .where(timeCondition);
    const rangeTotal = rangeTotalRow?.count ?? 0;

    const [allTimeTotalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageViewsTable);
    const allTimeTotal = allTimeTotalRow?.count ?? 0;

    // 2. Unique visitors (by distinct visitor_id or ip_address)
    const [uniqueVisitorsRow] = await db
      .select({ count: sql<number>`count(DISTINCT coalesce(${pageViewsTable.visitorId}, ${pageViewsTable.ipAddress}))::int` })
      .from(pageViewsTable)
      .where(timeCondition);
    const uniqueVisitors = uniqueVisitorsRow?.count ?? 0;

    // 3. Today's views
    const [todayRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageViewsTable)
      .where(sql`${pageViewsTable.createdAt} >= CURRENT_DATE`);
    const todayViews = todayRow?.count ?? 0;

    // 4. Breakdown by page/path
    const topPages = await db
      .select({
        path: pageViewsTable.path,
        pageTitle: sql<string>`coalesce(max(${pageViewsTable.pageTitle}), max(${pageViewsTable.path}))`,
        views: sql<number>`count(*)::int`,
        uniqueVisitors: sql<number>`count(DISTINCT coalesce(${pageViewsTable.visitorId}, ${pageViewsTable.ipAddress}))::int`,
      })
      .from(pageViewsTable)
      .where(timeCondition)
      .groupBy(pageViewsTable.path)
      .orderBy(desc(sql`count(*)`))
      .limit(25);

    // 5. Daily trend (for charts / timelines)
    const dailyTrend = await db
      .select({
        date: sql<string>`TO_CHAR(${pageViewsTable.createdAt}, 'YYYY-MM-DD')`,
        views: sql<number>`count(*)::int`,
        visitors: sql<number>`count(DISTINCT coalesce(${pageViewsTable.visitorId}, ${pageViewsTable.ipAddress}))::int`,
      })
      .from(pageViewsTable)
      .where(timeCondition)
      .groupBy(sql`TO_CHAR(${pageViewsTable.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(asc(sql`TO_CHAR(${pageViewsTable.createdAt}, 'YYYY-MM-DD')`))
      .limit(30);

    // 6. Recent live pageviews log
    const recentViews = await db
      .select()
      .from(pageViewsTable)
      .orderBy(desc(pageViewsTable.createdAt))
      .limit(30);

    res.json({
      range,
      rangeTotal,
      allTimeTotal,
      uniqueVisitors,
      todayViews,
      topPages,
      dailyTrend,
      recentViews,
    });
  } catch (err: any) {
    req.log?.error?.(err, "Failed to fetch analytics");
    res.status(500).json({ error: "Failed to fetch analytics", detail: err?.message || String(err) });
  }
});

// ── User Feedback & Issue Reports ──────────────────────────────────────────

router.get("/admin/feedback", requireAdmin, async (req, res) => {
  try {
    await ensureDefaultSections();
    const list = await db
      .select()
      .from(feedbackTable)
      .orderBy(desc(feedbackTable.createdAt))
      .limit(100);

    const [stats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        newCount: sql<number>`count(*) filter (where status = 'new')::int`,
        reportsCount: sql<number>`count(*) filter (where type = 'bug_report' or type = 'broken_link')::int`,
      })
      .from(feedbackTable);

    res.json({
      feedback: list,
      stats: {
        total: stats?.total || 0,
        newCount: stats?.newCount || 0,
        reportsCount: stats?.reportsCount || 0,
      },
    });
  } catch (err: any) {
    req.log?.error?.(err, "Failed to fetch feedback");
    res.status(500).json({ error: "Failed to fetch feedback", detail: err?.message || String(err) });
  }
});

router.patch("/admin/feedback/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (isNaN(id) || !status) {
      res.status(400).json({ error: "Invalid id or status" });
      return;
    }

    const [updated] = await db
      .update(feedbackTable)
      .set({ status })
      .where(eq(feedbackTable.id, id))
      .returning();

    res.json(updated);
  } catch (err: any) {
    req.log?.error?.(err, "Failed to update feedback status");
    res.status(500).json({ error: "Failed to update feedback" });
  }
});

export default router;
