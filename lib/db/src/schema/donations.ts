import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const donationsTable = pgTable("support_donations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Karnataka Student"),
  phone: text("phone"),
  email: text("email"),
  message: text("message"),
  amountPaise: integer("amount_paise").notNull(),
  status: text("status").notNull().default("pending"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const insertDonationSchema = createInsertSchema(donationsTable).omit({ id: true, createdAt: true });
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donationsTable.$inferSelect;
