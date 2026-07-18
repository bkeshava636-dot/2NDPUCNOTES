import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, cardsTable, downloadsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { supabase, BUCKET_NOTES } from "../supabase.js";

const router = Router();

router.get("/purchases", async (req, res) => {
  try {
    const { phone } = req.query as Record<string, string>;
    if (!phone) {
      res.status(400).json({ error: "phone is required" });
      return;
    }
    const orders = await db
      .select({ order: ordersTable, cardTitle: cardsTable.title })
      .from(ordersTable)
      .leftJoin(cardsTable, eq(ordersTable.cardId, cardsTable.id))
      .where(and(eq(ordersTable.customerPhone, phone), eq(ordersTable.status, "paid")));
    res.json(
      orders.map(({ order, cardTitle }) => ({
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
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

router.get("/purchases/:orderId/download/:cardId", async (req, res) => {
  try {
    const { orderId, cardId } = req.params;
    const cardIdNum = parseInt(cardId);
    if (isNaN(cardIdNum)) {
      res.status(400).json({ error: "Invalid cardId" });
      return;
    }
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(and(eq(ordersTable.id, orderId), eq(ordersTable.cardId, cardIdNum), eq(ordersTable.status, "paid")));
    if (!order) {
      res.status(403).json({ error: "Purchase not found or unauthorized" });
      return;
    }
    const [card] = await db.select().from(cardsTable).where(eq(cardsTable.id, cardIdNum));
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }
    if (!card.pdfFileKey) {
      res.status(404).json({ error: "No file available" });
      return;
    }
    const { data, error } = await supabase.storage
      .from(BUCKET_NOTES)
      .createSignedUrl(card.pdfFileKey, 3600);
    if (error || !data?.signedUrl) {
      req.log.error(error);
      res.status(500).json({ error: "Could not generate download link" });
      return;
    }
    // Log the download event
    await db.insert(downloadsTable).values({
      orderId,
      cardId: cardIdNum,
      ipAddress: (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || null,
      deviceInfo: (req.headers["user-agent"] as string) || null,
    });
    res.redirect(302, data.signedUrl);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Download failed" });
  }
});

router.get("/purchases/sign/:key", async (req, res) => {
  try {
    const key = decodeURIComponent(req.params.key);
    const { data, error } = await supabase.storage
      .from(BUCKET_NOTES)
      .createSignedUrl(key, 300);
    if (error || !data?.signedUrl) {
      res.status(500).json({ error: "Could not generate preview link" });
      return;
    }
    res.redirect(302, data.signedUrl);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Preview failed" });
  }
});

export default router;
