import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const kcetSubjectsTable = pgTable("kcet_subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  iconName: text("icon_name").notNull().default("Atom"),
  gradient: text("gradient").notNull().default("from-cyan-500 to-blue-600"),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const kcetCategoriesTable = pgTable("kcet_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  iconName: text("icon_name").notNull().default("FileText"),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const kcetMaterialsTable = pgTable("kcet_materials", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  chapter: text("chapter"),
  year: integer("year"),
  pdfUrl: text("pdf_url").notNull(),
  fileSizeKb: integer("file_size_kb"),
  pageCount: integer("page_count"),
  downloadCount: integer("download_count").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const kcetContributionsTable = pgTable("kcet_contributions", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  chapter: text("chapter"),
  year: integer("year"),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  contributorName: text("contributor_name"),
  contributorContact: text("contributor_contact"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const kcetDownloadsTable = pgTable("kcet_downloads", {
  id: serial("id").primaryKey(),
  materialId: integer("material_id").notNull(),
  ipAddress: text("ip_address"),
  deviceInfo: text("device_info"),
  downloadedAt: timestamp("downloaded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertKcetSubjectSchema = createInsertSchema(kcetSubjectsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertKcetCategorySchema = createInsertSchema(kcetCategoriesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertKcetMaterialSchema = createInsertSchema(kcetMaterialsTable).omit({ id: true, createdAt: true, updatedAt: true, downloadCount: true });
export const insertKcetContributionSchema = createInsertSchema(kcetContributionsTable).omit({ id: true, createdAt: true, updatedAt: true });

export type KcetSubject = typeof kcetSubjectsTable.$inferSelect;
export type KcetCategory = typeof kcetCategoriesTable.$inferSelect;
export type KcetMaterial = typeof kcetMaterialsTable.$inferSelect;
export type KcetContribution = typeof kcetContributionsTable.$inferSelect;
export type KcetDownload = typeof kcetDownloadsTable.$inferSelect;
