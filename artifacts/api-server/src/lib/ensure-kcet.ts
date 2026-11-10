import { db, kcetSubjectsTable, kcetCategoriesTable } from "@workspace/db";
import { sql, eq } from "drizzle-orm";
import { supabase } from "../supabase.js";

export const BUCKET_KCET = "kcet-materials";

export const DEFAULT_KCET_SUBJECTS = [
  {
    name: "Physics",
    slug: "physics",
    description: "Mechanics, Electrodynamics, Optics, Modern Physics shortcuts & conceptual MCQs",
    iconName: "Atom",
    gradient: "from-cyan-500 to-blue-600",
    sortOrder: 1,
  },
  {
    name: "Chemistry",
    slug: "chemistry",
    description: "Physical numericals, Organic reaction maps, Inorganic trends & NCERT line MCQs",
    iconName: "FlaskConical",
    gradient: "from-fuchsia-500 to-purple-600",
    sortOrder: 2,
  },
  {
    name: "Mathematics",
    slug: "mathematics",
    description: "Calculus speed-tricks, Matrices, Vectors, 3D Geometry & Probability drills",
    iconName: "Sigma",
    gradient: "from-indigo-500 to-violet-600",
    sortOrder: 3,
  },
  {
    name: "Biology",
    slug: "biology",
    description: "Botany, Zoology, Genetics & Human Physiology rapid NCERT high-yield banks",
    iconName: "Dna",
    gradient: "from-emerald-500 to-teal-600",
    sortOrder: 4,
  },
];

export const DEFAULT_KCET_CATEGORIES = [
  {
    name: "Notes",
    slug: "notes",
    description: "Chapter-wise quick revision notes tailored for KCET objective speed",
    iconName: "BookOpen",
    sortOrder: 1,
  },
  {
    name: "PYQs",
    slug: "pyqs",
    description: "Previous Year Question papers with year-wise filtering & official keys",
    iconName: "History",
    sortOrder: 2,
  },
  {
    name: "Mock Papers",
    slug: "mock-papers",
    description: "Full-length 60-minute & subject-wise competitive practice tests",
    iconName: "FileCheck2",
    sortOrder: 3,
  },
  {
    name: "Syllabus",
    slug: "syllabus",
    description: "Official KEA KCET chapter weightage, deleted topics & blueprint analysis",
    iconName: "ListChecks",
    sortOrder: 4,
  },
  {
    name: "Objective Books",
    slug: "objective-books",
    description: "MCQ reference guides, MTG/NCERT fingertips & rank-booster PDFs",
    iconName: "Library",
    sortOrder: 5,
  },
  {
    name: "Formulas",
    slug: "formulas",
    description: "Chapter-wise formula sheets, reaction charts & rapid cheat sheets",
    iconName: "Zap",
    sortOrder: 6,
  },
];

let kcetInitialized = false;
let initPromise: Promise<void> | null = null;
let bucketEnsured = false;

export async function ensureKcetBucket(): Promise<string> {
  if (bucketEnsured) return BUCKET_KCET;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET_KCET);
    if (!exists) {
      await supabase.storage.createBucket(BUCKET_KCET, { public: false });
    }
    bucketEnsured = true;
  } catch {
    // Fallback cleanly if storage policy restricts listBuckets
  }
  return BUCKET_KCET;
}

export async function ensureKcetTablesAndDefaults(): Promise<void> {
  if (kcetInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS kcet_subjects (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          icon_name TEXT NOT NULL DEFAULT 'Atom',
          gradient TEXT NOT NULL DEFAULT 'from-cyan-500 to-blue-600',
          is_visible BOOLEAN NOT NULL DEFAULT true,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS kcet_categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          icon_name TEXT NOT NULL DEFAULT 'FileText',
          is_visible BOOLEAN NOT NULL DEFAULT true,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS kcet_materials (
          id SERIAL PRIMARY KEY,
          subject TEXT NOT NULL,
          category TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          chapter TEXT,
          year INTEGER,
          pdf_url TEXT NOT NULL,
          file_size_kb INTEGER,
          page_count INTEGER,
          download_count INTEGER NOT NULL DEFAULT 0,
          is_featured BOOLEAN NOT NULL DEFAULT false,
          is_visible BOOLEAN NOT NULL DEFAULT true,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS kcet_contributions (
          id SERIAL PRIMARY KEY,
          subject TEXT NOT NULL,
          category TEXT NOT NULL,
          title TEXT NOT NULL,
          chapter TEXT,
          year INTEGER,
          description TEXT,
          file_url TEXT NOT NULL,
          contributor_name TEXT,
          contributor_contact TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS kcet_downloads (
          id SERIAL PRIMARY KEY,
          material_id INTEGER NOT NULL,
          ip_address TEXT,
          device_info TEXT,
          downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_kcet_materials_subject ON kcet_materials(subject);
        CREATE INDEX IF NOT EXISTS idx_kcet_materials_category ON kcet_materials(category);
      `);

      // Seed default subjects if table is empty
      const existingSubjects = await db.select().from(kcetSubjectsTable);
      if (existingSubjects.length === 0) {
        for (const sub of DEFAULT_KCET_SUBJECTS) {
          const found = await db
            .select()
            .from(kcetSubjectsTable)
            .where(eq(kcetSubjectsTable.slug, sub.slug));
          if (found.length === 0) {
            await db.insert(kcetSubjectsTable).values(sub).onConflictDoNothing();
          }
        }
      }

      // Seed default categories if table is empty
      const existingCategories = await db.select().from(kcetCategoriesTable);
      if (existingCategories.length === 0) {
        for (const cat of DEFAULT_KCET_CATEGORIES) {
          const found = await db
            .select()
            .from(kcetCategoriesTable)
            .where(eq(kcetCategoriesTable.slug, cat.slug));
          if (found.length === 0) {
            await db.insert(kcetCategoriesTable).values(cat).onConflictDoNothing();
          }
        }
      }

      kcetInitialized = true;
    } catch (err) {
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}
