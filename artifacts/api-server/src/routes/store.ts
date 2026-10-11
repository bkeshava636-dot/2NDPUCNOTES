import { Router } from "express";
import { db } from "@workspace/db";
import { sectionsTable, cardsTable, ordersTable } from "@workspace/db";
import { eq, and, ilike, or, sql, asc, inArray } from "drizzle-orm";
import { ensureDefaultSections, DEFAULT_CORE_SECTIONS } from "../lib/ensure-sections.js";

const router = Router();

// Enable fast browser caching for public storefront reads
router.use((req, res, next) => {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
  }
  next();
});

router.get("/store/stats", async (req, res) => {
  try {
    const base = and(eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false));
    const [totalResources] = await db.select({ count: sql<number>`count(*)::int` }).from(cardsTable).where(base);
    const [freeResources] = await db.select({ count: sql<number>`count(*)::int` }).from(cardsTable).where(and(eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false), eq(cardsTable.isFree, true)));
    const [paidResources] = await db.select({ count: sql<number>`count(*)::int` }).from(cardsTable).where(and(eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false), eq(cardsTable.isFree, false)));
    const [totalSections] = await db.select({ count: sql<number>`count(*)::int` }).from(sectionsTable).where(eq(sectionsTable.isVisible, true));
    const [totalOrders] = await db.select({ count: sql<number>`count(*)::int` }).from(ordersTable).where(eq(ordersTable.status, "paid"));
    res.json({
      totalResources: totalResources.count,
      freeResources: freeResources.count,
      paidResources: paidResources.count,
      totalSections: totalSections.count,
      totalOrders: totalOrders.count,
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
      .select({ id: cardsTable.id, sectionId: cardsTable.sectionId, subject: cardsTable.subject })
      .from(cardsTable)
      .where(and(eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false)));

    const countMap: Record<number, number> = {};
    for (const s of sections) {
      const sNameLower = s.name.toLowerCase();
      const count = allVisibleCards.filter((c) => 
        c.sectionId === s.id || 
        (c.subject && c.subject.toLowerCase() === sNameLower)
      ).length;
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
    if (resourceType) conditions.push(eq(cardsTable.resourceType, resourceType));
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

export default router;
