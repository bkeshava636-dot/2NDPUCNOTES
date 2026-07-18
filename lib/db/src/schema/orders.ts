import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { cardsTable } from "./cards";
import { customersTable } from "./customers";

export const ordersTable = pgTable("orders", {
  id:                  text("id").primaryKey(),
  cardId:              integer("card_id").notNull().references(() => cardsTable.id),
  customerId:          integer("customer_id").references(() => customersTable.id),
  customerName:        text("customer_name").notNull(),
  customerPhone:       text("customer_phone").notNull(),
  customerEmail:       text("customer_email"),
  amountPaise:         integer("amount_paise").notNull(),
  status:              text("status").notNull().default("pending"),
  paidAt:              timestamp("paid_at", { withTimezone: true }),
  razorpayOrderId:     text("razorpay_order_id"),
  razorpayPaymentId:   text("razorpay_payment_id"),
  razorpaySignature:   text("razorpay_signature"),
  createdAt:           timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:           timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
