import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sectionsTable } from "./sections";

export const cardsTable = pgTable("cards", {
  id:                  serial("id").primaryKey(),
  sectionId:           integer("section_id").notNull().references(() => sectionsTable.id),
  title:               text("title").notNull(),
  description:         text("description"),
  subject:             text("subject"),
  chapter:             text("chapter"),
  semester:            text("semester"),
  board:               text("board").notNull().default("Karnataka"),
  classLevel:          text("class_level").notNull().default("2nd PUC"),
  resourceType:        text("resource_type").notNull().default("Notes"),
  isFree:              boolean("is_free").notNull().default(false),
  pricePaise:          integer("price_paise").notNull().default(0),
  discountPricePaise:  integer("discount_price_paise"),
  telegramLink:        text("telegram_link"),
  isNew:               boolean("is_new").notNull().default(false),
  thumbnailUrl:        text("thumbnail_url"),
  previewImageUrls:    text("preview_image_urls").array().notNull().default([]),
  pdfFileKey:          text("pdf_file_key"),
  pageCount:           integer("page_count"),
  fileSizeKb:          integer("file_size_kb"),
  isFeatured:          boolean("is_featured").notNull().default(false),
  isVisible:           boolean("is_visible").notNull().default(true),
  isDeleted:           boolean("is_deleted").notNull().default(false),
  sortOrder:           integer("sort_order").notNull().default(0),
  createdAt:           timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:           timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCardSchema = createInsertSchema(cardsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cardsTable.$inferSelect;
