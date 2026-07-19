import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { db } from "@workspace/db";
import { cardsTable, ordersTable, customersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { supabase, BUCKET_NOTES } from "../supabase.js";

const router = Router();

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay keys not configured");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

async function upsertCustomer(fullName: string, phone: string, email?: string | null): Promise<number> {
  const existing = await db.select().from(customersTable).where(eq(customersTable.phone, phone)).limit(1);
  if (existing.length > 0) {
    return existing[0].id;
  }
  const [created] = await db
    .insert(customersTable)
    .values({ fullName, phone, email: email || null })
    .returning();
  return created.id;
}

router.post("/checkout/create-razorpay-order", async (req, res) => {
  try {
    const { cardId, customerName, customerPhone, customerEmail } = req.body;
    if (!cardId || !customerName || !customerPhone) {
      res.status(400).json({ error: "cardId, customerName, customerPhone are required" });
      return;
    }
    const [card] = await db
      .select()
      .from(cardsTable)
      .where(and(eq(cardsTable.id, cardId), eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false)));
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }
    if (card.isFree) {
      res.status(400).json({ error: "Card is free — use the free-download endpoint" });
      return;
    }
    const razorpay = getRazorpay();
    const effectivePrice = card.discountPricePaise ?? card.pricePaise;
    const rzOrder = await razorpay.orders.create({
      amount: effectivePrice,
      currency: "INR",
      receipt: uuidv4().slice(0, 40),
    });
    const customerId = await upsertCustomer(customerName, customerPhone, customerEmail);
    const orderId = uuidv4();
    await db.insert(ordersTable).values({
      id: orderId,
      cardId: card.id,
      customerId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      amountPaise: effectivePrice,
      status: "pending",
      razorpayOrderId: rzOrder.id as string,
    });
    res.json({
      razorpayOrderId: rzOrder.id,
      orderId,
      amountPaise: effectivePrice,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      cardTitle: card.title,
      customerName,
      customerEmail: customerEmail || "",
      customerPhone,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.post("/checkout/verify", async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      res.status(400).json({ error: "Missing payment verification fields" });
      return;
    }
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      res.status(500).json({ error: "Server misconfiguration" });
      return;
    }
    const expectedSig = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    if (expectedSig !== razorpaySignature) {
      res.status(400).json({ error: "Invalid payment signature" });
      return;
    }
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.razorpayOrderId, razorpayOrderId));
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const [updated] = await db
      .update(ordersTable)
      .set({ status: "paid", paidAt: new Date(), razorpayPaymentId, razorpaySignature })
      .where(eq(ordersTable.id, order.id))
      .returning();
    const [card] = await db.select().from(cardsTable).where(eq(cardsTable.id, updated.cardId));
    res.json({
      id: updated.id,
      cardId: updated.cardId,
      cardTitle: card?.title ?? "",
      customerName: updated.customerName,
      customerPhone: updated.customerPhone,
      customerEmail: updated.customerEmail,
      amountPaise: updated.amountPaise,
      status: updated.status,
      razorpayOrderId: updated.razorpayOrderId,
      paidAt: updated.paidAt,
      createdAt: updated.createdAt,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

router.post("/checkout/free-download", async (req, res) => {
  try {
    const { cardId, customerName, customerPhone, customerEmail } = req.body;
    if (!cardId || !customerName || !customerPhone) {
      res.status(400).json({ error: "cardId, customerName, customerPhone are required" });
      return;
    }
    const [card] = await db
      .select()
      .from(cardsTable)
      .where(and(eq(cardsTable.id, cardId), eq(cardsTable.isVisible, true), eq(cardsTable.isDeleted, false)));
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }
    if (!card.isFree) {
      res.status(400).json({ error: "Card is not free — use the paid checkout endpoint" });
      return;
    }
    if (!card.pdfFileKey) {
      res.status(400).json({ error: "No file available for this resource" });
      return;
    }
    const customerId = await upsertCustomer(customerName, customerPhone, customerEmail);
    const orderId = uuidv4();
    await db.insert(ordersTable).values({
      id: orderId,
      cardId: card.id,
      customerId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      amountPaise: 0,
      status: "paid",
      paidAt: new Date(),
    });
   const { data, error } = await supabase.storage
  .from(BUCKET_NOTES)
  .createSignedUrl(card.pdfFileKey, 3600);

if (error || !data?.signedUrl) {
  req.log.error(error);
  res.status(500).json({ error: "Could not generate download link" });
  return;
}

res.json({
  orderId,
  downloadUrl: data.signedUrl,
  filename: `${card.title.replace(/[^a-z0-9]/gi, "_")}.pdf`,
});
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to process free download" });
  }
});

export default router;
