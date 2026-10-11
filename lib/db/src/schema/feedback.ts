import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const feedbackTable = pgTable("user_feedback", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().default("feedback"), // "feedback" | "bug_report" | "broken_link" | "content_error" | "general"
  rating: text("rating"), // "working_great" | "minor_issue" | "broken" | "5" | "4" | "3" | "2" | "1"
  message: text("message").notNull(),
  contact: text("contact"), // Optional email or phone
  pageUrl: text("page_url"),
  userAgent: text("user_agent"),
  status: text("status").notNull().default("new"), // "new" | "reviewed" | "resolved"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFeedbackSchema = createInsertSchema(feedbackTable).omit({ id: true, createdAt: true, status: true });
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type UserFeedback = typeof feedbackTable.$inferSelect;
