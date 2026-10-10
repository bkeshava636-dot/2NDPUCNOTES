import { db, sectionsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

export const DEFAULT_CORE_SECTIONS = [
  { name: "Physics", slug: "physics", description: "Comprehensive 2nd PUC Physics notes, derivations, and question banks", sortOrder: 1 },
  { name: "Chemistry", slug: "chemistry", description: "Organic, inorganic, and physical chemistry notes and reactions", sortOrder: 2 },
  { name: "Computer Science", slug: "computer-science", description: "2nd PUC Computer Science notes, programs, question banks, and practicals", sortOrder: 3 },
  { name: "Biology", slug: "biology", description: "Botany and zoology diagrams, summaries, and key concepts", sortOrder: 4 },
  { name: "Mathematics", slug: "mathematics", description: "Calculus, vectors, probability, and algebra solutions", sortOrder: 5 },
  { name: "English", slug: "english", description: "2nd PUC English literature notes, summaries, grammar, and model answers", sortOrder: 6 },
  { name: "Hindi", slug: "hindi", description: "Sahitya, kavita, nibandh, and grammar notes for 2nd PUC Hindi", sortOrder: 7 },
  { name: "Kannada", slug: "kannada", description: "Kannada sahitya, gadya, padya, and grammar study materials", sortOrder: 8 },
  { name: "Sanskrit", slug: "sanskrit", description: "Sanskrit slokas, vyakarana, translation, and chapter notes", sortOrder: 9 },
];

let seeded = false;

export async function ensureDefaultSections(): Promise<void> {
  if (seeded) return;
  try {
    await db.execute(sql`
      ALTER TABLE cards ADD COLUMN IF NOT EXISTS subtype text;
      ALTER TABLE cards ADD COLUMN IF NOT EXISTS is_recommended boolean NOT NULL DEFAULT false;
      ALTER TABLE cards ADD COLUMN IF NOT EXISTS answer_key_url text;
      ALTER TABLE cards ADD COLUMN IF NOT EXISTS official_source_url text;
      ALTER TABLE sections ADD COLUMN IF NOT EXISTS official_source_url text;
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
          isVisible: true,
        }).catch(() => {});
      }
    }
    seeded = true;
  } catch (_err) {
    // Graceful fallback if database is not reachable
  }
}
