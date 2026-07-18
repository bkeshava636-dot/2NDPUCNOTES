import { Router } from "express";
import { db } from "@workspace/db";
import { sectionsTable, cardsTable, ordersTable } from "@workspace/db";
import { eq, and, ilike, or, sql, asc } from "drizzle-orm";

const router = Router();

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
    const sections = await db.select().from(sectionsTable).where(eq(sectionsTable.isVisible, true)).orderBy(asc(sectionsTable.sortOrder));
    const cardCounts = await db
      .select({ sectionId: cardsTable.sectionId, count: sql<number>`count(*)::int` })
      .from(cardsTable)
      .where(and(eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false)))
      .groupBy(cardsTable.sectionId);
    const countMap = Object.fromEntries(cardCounts.map((r) => [r.sectionId, r.count]));
    res.json(sections.map((s) => ({ ...s, cardCount: countMap[s.id] ?? 0 })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch sections" });
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
    const { search, subject, resourceType, isFree, sectionId, featured } = req.query as Record<string, string>;
    const conditions: ReturnType<typeof eq>[] = [
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
    if (subject) conditions.push(eq(cardsTable.subject, subject));
    if (resourceType) conditions.push(eq(cardsTable.resourceType, resourceType));
    if (isFree === "true") conditions.push(eq(cardsTable.isFree, true));
    if (isFree === "false") conditions.push(eq(cardsTable.isFree, false));
    if (sectionId) conditions.push(eq(cardsTable.sectionId, parseInt(sectionId)));
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
