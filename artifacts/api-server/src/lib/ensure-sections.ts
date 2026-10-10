import { db, sectionsTable } from "@workspace/db";

export const DEFAULT_CORE_SECTIONS = [
  { name: "Physics", slug: "physics", description: "Comprehensive 2nd PUC Physics notes, derivations, and question banks", sortOrder: 1 },
  { name: "Chemistry", slug: "chemistry", description: "Organic, inorganic, and physical chemistry notes and reactions", sortOrder: 2 },
  { name: "Mathematics", slug: "mathematics", description: "Calculus, vectors, probability, and algebra solutions", sortOrder: 3 },
  { name: "Biology", slug: "biology", description: "Botany and zoology diagrams, summaries, and key concepts", sortOrder: 4 },
  { name: "English", slug: "english", description: "2nd PUC English literature notes, summaries, grammar, and model answers", sortOrder: 5 },
  { name: "Hindi", slug: "hindi", description: "Sahitya, kavita, nibandh, and grammar notes for 2nd PUC Hindi", sortOrder: 6 },
  { name: "Kannada", slug: "kannada", description: "Kannada sahitya, gadya, padya, and grammar study materials", sortOrder: 7 },
  { name: "Sanskrit", slug: "sanskrit", description: "Sanskrit slokas, vyakarana, translation, and chapter notes", sortOrder: 8 },
];

let seeded = false;

export async function ensureDefaultSections(): Promise<void> {
  if (seeded) return;
  try {
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
