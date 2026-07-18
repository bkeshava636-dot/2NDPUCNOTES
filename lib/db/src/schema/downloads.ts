import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { ordersTable } from "./orders";
import { cardsTable } from "./cards";

export const downloadsTable = pgTable("downloads", {
  id:           serial("id").primaryKey(),
  orderId:      text("order_id").notNull().references(() => ordersTable.id),
  cardId:       integer("card_id").notNull().references(() => cardsTable.id),
  downloadedAt: timestamp("downloaded_at", { withTimezone: true }).notNull().defaultNow(),
  ipAddress:    text("ip_address"),
  deviceInfo:   text("device_info"),
});

export const insertDownloadSchema = createInsertSchema(downloadsTable).omit({ id: true, downloadedAt: true });
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloadsTable.$inferSelect;
