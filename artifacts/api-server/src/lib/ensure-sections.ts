import { db, sectionsTable } from "@workspace/db";
import { sql, eq } from "drizzle-orm";

export const DEFAULT_CORE_SECTIONS = [
  // Core Subjects (Browse by Subject)
  { name: "Physics", slug: "physics", description: "Comprehensive 2nd PUC Physics notes, derivations, and question banks", sortOrder: 1 },
  { name: "Chemistry", slug: "chemistry", description: "Organic, inorganic, and physical chemistry notes and reactions", sortOrder: 2 },
  { name: "Computer Science", slug: "computer-science", description: "2nd PUC Computer Science notes, programs, question banks, and practicals", sortOrder: 3 },
  { name: "Biology", slug: "biology", description: "Botany and zoology diagrams, summaries, and key concepts", sortOrder: 4 },
  { name: "Mathematics", slug: "mathematics", description: "Calculus, vectors, probability, and algebra solutions", sortOrder: 5 },
  { name: "English", slug: "english", description: "2nd PUC English literature notes, summaries, grammar, and model answers", sortOrder: 6 },
  { name: "Hindi", slug: "hindi", description: "Sahitya, kavita, nibandh, and grammar notes for 2nd PUC Hindi", sortOrder: 7 },
  { name: "Kannada", slug: "kannada", description: "Kannada sahitya, gadya, padya, and grammar study materials", sortOrder: 8 },
  { name: "Sanskrit", slug: "sanskrit", description: "Sanskrit slokas, vyakarana, translation, and chapter notes", sortOrder: 9 },

  // Resource Categories (Browse by Category)
  { 
    name: "Model Question Papers (MQP)", 
    slug: "mqp", 
    description: "Official Karnataka Board model question papers and blueprint-based sample tests with answer keys", 
    officialSourceUrl: "https://kseab.karnataka.gov.in/", 
    sortOrder: 10 
  },
  { 
    name: "Multiple Choice Questions (MCQ)", 
    slug: "mcq", 
    description: "Chapterwise multiple choice questions, assertion-reasoning, and objective practice sets", 
    sortOrder: 11 
  },
  { 
    name: "Question Bank", 
    slug: "question-bank", 
    description: "Curated question banks, important derivations, repeated board questions, and model answers", 
    officialSourceUrl: "https://kseab.karnataka.gov.in/", 
    sortOrder: 12 
  },
  { 
    name: "Practical", 
    slug: "practical", 
    description: "Practical marking schemes, lab manuals, viva questions, and procedural guides for Core Science subjects", 
    sortOrder: 13 
  },
  { 
    name: "Previous Year Question Papers (PYQs)", 
    slug: "pyq", 
    description: "Past Karnataka 2nd PUC examination question papers categorized by Midterm, Preparatory, and Annual exams", 
    sortOrder: 14 
  },
  { 
    name: "Passing Package", 
    slug: "passing-package", 
    description: "High-yield guaranteed scoring questions and simplified notes tailored for scoring passing and first-class marks", 
    sortOrder: 15 
  },
  { 
    name: "Publication Books", 
    slug: "publication-books", 
    description: "Reference material, workbook guides, and renowned publisher study packages", 
    sortOrder: 16 
  },
];

let seeded = false;
let seedingPromise: Promise<void> | null = null;

export async function ensureDefaultSections(): Promise<void> {
  if (seeded) return;
  if (seedingPromise) return seedingPromise;

  seedingPromise = (async () => {
    try {
      await db.execute(sql`
        ALTER TABLE cards ADD COLUMN IF NOT EXISTS subtype text;
        ALTER TABLE cards ADD COLUMN IF NOT EXISTS is_recommended boolean NOT NULL DEFAULT false;
        ALTER TABLE cards ADD COLUMN IF NOT EXISTS answer_key_url text;
        ALTER TABLE cards ADD COLUMN IF NOT EXISTS official_source_url text;
        ALTER TABLE cards ADD COLUMN IF NOT EXISTS additional_categories text[] DEFAULT '{}';
        ALTER TABLE sections ADD COLUMN IF NOT EXISTS official_source_url text;
        CREATE TABLE IF NOT EXISTS page_views (
          id SERIAL PRIMARY KEY,
          path TEXT NOT NULL,
          page_title TEXT,
          visitor_id TEXT,
          ip_address TEXT,
          user_agent TEXT,
          referrer TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
        CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);

        CREATE TABLE IF NOT EXISTS user_feedback (
          id SERIAL PRIMARY KEY,
          type TEXT NOT NULL DEFAULT 'feedback',
          rating TEXT,
          message TEXT NOT NULL,
          contact TEXT,
          page_url TEXT,
          user_agent TEXT,
          status TEXT NOT NULL DEFAULT 'new',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);
        CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status);

        CREATE TABLE IF NOT EXISTS support_donations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL DEFAULT 'Karnataka Student',
          phone TEXT,
          email TEXT,
          message TEXT,
          amount_paise INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          razorpay_order_id TEXT,
          razorpay_payment_id TEXT,
          razorpay_signature TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          paid_at TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS idx_support_donations_status ON support_donations(status);
      `).catch(() => {});

      const existing = await db.select().from(sectionsTable);
      const existingSlugs = new Set(existing.map((s) => s.slug.toLowerCase()));

      for (const def of DEFAULT_CORE_SECTIONS) {
        if (!existingSlugs.has(def.slug.toLowerCase())) {
          await db.insert(sectionsTable).values({
            name: def.name,
            slug: def.slug,
            description: def.description,
            sortOrder: def.sortOrder,
            officialSourceUrl: (def as any).officialSourceUrl || null,
            isVisible: true,
          }).catch(() => {});
        }
      }
      seeded = true;
    } catch (_err) {
      // Graceful fallback if database is not reachable
    } finally {
      seedingPromise = null;
    }
  })();

  return seedingPromise;
}
