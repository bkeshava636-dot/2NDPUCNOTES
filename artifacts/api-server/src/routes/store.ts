import { Router } from "express";
import { db } from "@workspace/db";
import { sectionsTable, cardsTable, ordersTable, pageViewsTable, feedbackTable } from "@workspace/db";
import { eq, and, ilike, or, sql, asc, inArray, gt } from "drizzle-orm";
import { ensureDefaultSections, DEFAULT_CORE_SECTIONS } from "../lib/ensure-sections.js";

const router = Router();

// Enable fast browser caching for public storefront reads
router.use((req, res, next) => {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
  }
  next();
});

router.get("/page-views/count", async (req, res) => {
  try {
    await ensureDefaultSections();
    const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(pageViewsTable);
    res.json({ count: row?.count ?? 0 });
  } catch (err) {
    res.json({ count: 0 });
  }
});

router.get("/store/stats", async (req, res) => {
  try {
    await ensureDefaultSections();
    const base = and(eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false));
    const [totalResources] = await db.select({ count: sql<number>`count(*)::int` }).from(cardsTable).where(base);
    const [freeResources] = await db.select({ count: sql<number>`count(*)::int` }).from(cardsTable).where(and(eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false), eq(cardsTable.isFree, true)));
    const [paidResources] = await db.select({ count: sql<number>`count(*)::int` }).from(cardsTable).where(and(eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false), eq(cardsTable.isFree, false)));
    const [totalSections] = await db.select({ count: sql<number>`count(*)::int` }).from(sectionsTable).where(eq(sectionsTable.isVisible, true));
    const [totalOrders] = await db.select({ count: sql<number>`count(*)::int` }).from(ordersTable).where(and(eq(ordersTable.status, "paid"), gt(ordersTable.amountPaise, 0)));
    const [totalViews] = await db.select({ count: sql<number>`count(*)::int` }).from(pageViewsTable);
    res.json({
      totalResources: totalResources.count,
      freeResources: freeResources.count,
      paidResources: paidResources.count,
      totalSections: totalSections.count,
      totalOrders: totalOrders.count,
      totalViews: totalViews?.count ?? 0,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/sections", async (req, res) => {
  try {
    await ensureDefaultSections();
    const sections = await db.select().from(sectionsTable).where(eq(sectionsTable.isVisible, true)).orderBy(asc(sectionsTable.sortOrder));
    const allVisibleCards = await db
      .select({
        id: cardsTable.id,
        sectionId: cardsTable.sectionId,
        subject: cardsTable.subject,
        resourceType: cardsTable.resourceType,
        additionalCategories: cardsTable.additionalCategories,
      })
      .from(cardsTable)
      .where(and(eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false)));

    const countMap: Record<number, number> = {};
    for (const s of sections) {
      const sNameLower = s.name.toLowerCase();
      const count = allVisibleCards.filter((c) => {
        const matchesSectionId = c.sectionId === s.id;
        const matchesSubject = c.subject && c.subject.toLowerCase() === sNameLower;
        const matchesType = c.resourceType && c.resourceType.toLowerCase() === sNameLower;
        const matchesAdditional = Array.isArray(c.additionalCategories) && c.additionalCategories.some((cat) => cat && cat.toLowerCase() === sNameLower);
        return matchesSectionId || matchesSubject || matchesType || matchesAdditional;
      }).length;
      countMap[s.id] = count;
    }
    
    if (sections.length === 0) {
      res.json(DEFAULT_CORE_SECTIONS.map((s, idx) => ({
        id: idx + 1,
        ...s,
        isVisible: true,
        cardCount: 0,
      })));
      return;
    }
    
    res.json(sections.map((s) => ({ ...s, cardCount: countMap[s.id] ?? 0 })));
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

router.get("/sections/:id/cards", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const cards = await db
      .select({ card: cardsTable, sectionName: sectionsTable.name })
      .from(cardsTable)
      .leftJoin(sectionsTable, eq(cardsTable.sectionId, sectionsTable.id))
      .where(and(eq(cardsTable.sectionId, id), eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false)))
      .orderBy(asc(cardsTable.sortOrder));
    res.json(cards.map(({ card, sectionName }) => ({ ...card, sectionName })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

router.get("/cards", async (req, res) => {
  try {
    const { search, subject, resourceType, isFree, sectionId, featured, subtype, isRecommended } = req.query as Record<string, string>;
    const conditions: any[] = [
      eq(cardsTable.isVisible, true),
      eq(cardsTable.isDeleted, false),
    ];
    if (search) {
      const likeCond = or(
        ilike(cardsTable.title, `%${search}%`),
        ilike(cardsTable.subject, `%${search}%`),
        ilike(cardsTable.chapter, `%${search}%`),
      );
      if (likeCond) conditions.push(likeCond);
    }
    if (subject) {
      const matching = await db
        .select({ id: sectionsTable.id })
        .from(sectionsTable)
        .where(ilike(sectionsTable.name, subject));
      const sectionIds = matching.map((s) => s.id);
      if (sectionIds.length > 0) {
        conditions.push(
          or(
            ilike(cardsTable.subject, `%${subject}%`),
            inArray(cardsTable.sectionId, sectionIds)
          )
        );
      } else {
        conditions.push(ilike(cardsTable.subject, `%${subject}%`));
      }
    }
    if (resourceType) {
      conditions.push(
        or(
          ilike(cardsTable.resourceType, `%${resourceType}%`),
          sql`EXISTS (SELECT 1 FROM unnest(${cardsTable.additionalCategories}) cat WHERE cat ILIKE ${'%' + resourceType + '%'})`
        )
      );
    }
    if (subtype) conditions.push(eq(cardsTable.subtype, subtype));
    if (isRecommended === "true") conditions.push(eq(cardsTable.isRecommended, true));
    if (isFree === "true") conditions.push(eq(cardsTable.isFree, true));
    if (isFree === "false") conditions.push(eq(cardsTable.isFree, false));
    if (sectionId) {
      const secId = parseInt(sectionId);
      if (!isNaN(secId)) {
        const [sec] = await db
          .select({ name: sectionsTable.name })
          .from(sectionsTable)
          .where(eq(sectionsTable.id, secId));
        if (sec) {
          conditions.push(
            or(
              eq(cardsTable.sectionId, secId),
              ilike(cardsTable.subject, `%${sec.name}%`)
            )
          );
        } else {
          conditions.push(eq(cardsTable.sectionId, secId));
        }
      }
    }
    if (featured === "true") conditions.push(eq(cardsTable.isFeatured, true));
    const cards = await db
      .select({ card: cardsTable, sectionName: sectionsTable.name })
      .from(cardsTable)
      .leftJoin(sectionsTable, eq(cardsTable.sectionId, sectionsTable.id))
      .where(and(...conditions))
      .orderBy(asc(cardsTable.sortOrder));
    res.json(cards.map(({ card, sectionName }) => ({ ...card, sectionName })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

router.get("/cards/resource-types", async (req, res) => {
  try {
    const types = await db
      .selectDistinct({ resourceType: cardsTable.resourceType })
      .from(cardsTable)
      .where(eq(cardsTable.isDeleted, false));
    res.json(types.map((t) => t.resourceType));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch resource types" });
  }
});

router.get("/cards/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const [row] = await db
      .select({ card: cardsTable, sectionName: sectionsTable.name })
      .from(cardsTable)
      .leftJoin(sectionsTable, eq(cardsTable.sectionId, sectionsTable.id))
      .where(and(eq(cardsTable.id, id), eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false)));
    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ...row.card, sectionName: row.sectionName });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch card" });
  }
});

// In-memory view deduplication & anti-spam rate limiting
const viewCooldowns = new Map<string, number>(); // `${key}:${path}` -> timestamp
const ipRateLimits = new Map<string, { count: number; resetAt: number }>(); // ip -> { count, resetAt }

// Periodic cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of viewCooldowns.entries()) {
    if (now - timestamp > 60000) viewCooldowns.delete(key);
  }
  for (const [ip, limit] of ipRateLimits.entries()) {
    if (now > limit.resetAt) ipRateLimits.delete(ip);
  }
}, 5 * 60 * 1000);

router.post("/analytics/view", async (req, res) => {
  try {
    await ensureDefaultSections();
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {}
    }
    const { path, pageTitle, visitorId, referrer } = body || {};
    if (!path || typeof path !== "string") {
      res.status(400).json({ error: "path is required" });
      return;
    }

    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    const userAgent = (req.headers["user-agent"] as string) || "";

    // 1. Filter automated bots, scrapers, and uptime monitors
    const lowerUa = userAgent.toLowerCase();
    if (
      lowerUa.includes("bot") ||
      lowerUa.includes("spider") ||
      lowerUa.includes("crawler") ||
      lowerUa.includes("curl") ||
      lowerUa.includes("wget") ||
      lowerUa.includes("python-requests")
    ) {
      res.json({ success: true, filtered: "bot" });
      return;
    }

    // 2. IP Rate Limiting: Max 25 pageview logs per minute per IP
    const now = Date.now();
    const currentLimit = ipRateLimits.get(ip);
    if (currentLimit && now < currentLimit.resetAt) {
      if (currentLimit.count >= 25) {
        // Drop excessive rapid requests from automated loops or extensions
        res.json({ success: true, rateLimited: true });
        return;
      }
      currentLimit.count++;
    } else {
      ipRateLimits.set(ip, { count: 1, resetAt: now + 60000 });
    }

    // 3. Deduplication Window: Don't log duplicate views for same visitor + path within 30 seconds
    const visitorKey = visitorId || ip;
    const cooldownKey = `${visitorKey}:${path}`;
    const lastViewedAt = viewCooldowns.get(cooldownKey);
    if (lastViewedAt && now - lastViewedAt < 30000) {
      res.json({ success: true, deduped: true });
      return;
    }
    viewCooldowns.set(cooldownKey, now);

    await db.insert(pageViewsTable).values({
      path: path.slice(0, 500),
      pageTitle: pageTitle ? String(pageTitle).slice(0, 300) : null,
      visitorId: visitorId ? String(visitorId).slice(0, 100) : null,
      ipAddress: ip ? String(ip).slice(0, 100) : null,
      userAgent: userAgent ? String(userAgent).slice(0, 500) : null,
      referrer: referrer ? String(referrer).slice(0, 500) : null,
    });

    res.json({ success: true });
  } catch (err) {
    req.log?.error?.(err, "Failed to record page view");
    res.json({ success: false }); // Non-blocking: fail quietly for client
  }
});

router.post("/feedback", async (req, res) => {
  try {
    await ensureDefaultSections();
    const { type = "feedback", rating, message, contact, pageUrl } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const userAgent = req.headers["user-agent"] || null;

    const [created] = await db
      .insert(feedbackTable)
      .values({
        type: String(type).slice(0, 50),
        rating: rating ? String(rating).slice(0, 50) : null,
        message: message.trim().slice(0, 2000),
        contact: contact ? String(contact).trim().slice(0, 200) : null,
        pageUrl: pageUrl ? String(pageUrl).slice(0, 500) : null,
        userAgent: userAgent ? String(userAgent).slice(0, 500) : null,
        status: "new",
      })
      .returning();

    res.json({ success: true, feedbackId: created?.id });
  } catch (err: any) {
    req.log?.error?.(err, "Failed to submit feedback");
    res.status(500).json({ error: "Failed to submit feedback", detail: err?.message || String(err) });
  }
});

export default router;
