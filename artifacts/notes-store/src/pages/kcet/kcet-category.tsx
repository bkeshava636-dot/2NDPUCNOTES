import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  fetchKcetCategories,
  fetchKcetMaterials,
  fetchKcetSubjects,
} from "@/lib/kcet-api";
import { KcetDynamicIcon } from "@/components/kcet/kcet-icons";
import { KcetMaterialsBrowser } from "@/components/kcet/kcet-materials-browser";
import { SeoHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Layers, Sparkles } from "lucide-react";

export default function KcetCategoryPage() {
  const [, params] = useRoute("/kcet/category/:slug");
  const slug = decodeURIComponent(params?.slug || "").toLowerCase();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["kcet-categories"],
    queryFn: fetchKcetCategories,
    staleTime: 60_000,
  });

  const { data: subjects } = useQuery({
    queryKey: ["kcet-subjects"],
    queryFn: fetchKcetSubjects,
    staleTime: 60_000,
  });

  const { data: allMaterials, isLoading: materialsLoading } = useQuery({
    queryKey: ["kcet-materials"],
    queryFn: () => fetchKcetMaterials(),
    staleTime: 30_000,
  });

  const matchedCategory = (categories || []).find(
    (c) =>
      c.slug.toLowerCase() === slug ||
      c.name.toLowerCase() === slug ||
      c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );

  const categoryTitle = matchedCategory?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Category";
  const categoryMaterialsCount = (allMaterials || []).filter(
    (m) => m.category.toLowerCase() === categoryTitle.toLowerCase()
  ).length;

  return (
    <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-6 sm:space-y-8">
      <SeoHead
        title={`KCET ${categoryTitle} — Physics, Chemistry, Maths & Biology | 2PUC`}
        description={
          matchedCategory?.description ||
          `Download Karnataka KCET ${categoryTitle} PDFs across Physics, Chemistry, Mathematics, and Biology. Free chapter-wise competitive exam resources.`
        }
        keywords={`kcet ${categoryTitle.toLowerCase()}, karnataka cet ${categoryTitle.toLowerCase()}, kcet pdf, kcet physics chemistry maths biology`}
        canonicalPath={`/kcet/category/${slug}`}
      />

      {/* Breadcrumb Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/kcet">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs font-semibold text-[#475569] dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300 hover:bg-sky-50 dark:hover:bg-cyan-500/10 px-2.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to KCET Arena</span>
          </Button>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-[#64748b] dark:text-slate-400">
          <Link href="/kcet" className="hover:text-sky-600 dark:hover:text-cyan-300 transition-colors">
            KCET
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0f172a] dark:text-white">{categoryTitle}</span>
        </div>
      </div>

      {/* Category Header Banner */}
      {categoriesLoading ? (
        <Skeleton className="h-36 rounded-3xl" />
      ) : (
        <section className="relative rounded-3xl border border-sky-200 dark:border-cyan-500/30 bg-gradient-to-br from-[#eff8ff] via-white to-[#eef2ff] dark:from-[#0a1128] dark:via-[#070b1d] dark:to-[#110a28] p-6 sm:p-8 overflow-hidden shadow-xs dark:shadow-[0_0_40px_rgba(6,182,212,0.1)]">
          <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-sky-400/15 dark:bg-cyan-500/15 blur-3xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-violet-600 text-white shadow-sm">
                <KcetDynamicIcon name={matchedCategory?.iconName || "Layers"} className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-sky-700 dark:text-cyan-300 uppercase tracking-wider">
                  <Layers className="h-3 w-3" />
                  <span>KCET Category</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0f172a] dark:text-white">
                  {categoryTitle}
                </h1>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 max-w-2xl leading-relaxed">
                  {matchedCategory?.description ||
                    `Browse verified KCET ${categoryTitle} organized by subject, chapter, and exam year.`}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 self-start sm:self-center px-3.5 py-2 rounded-xl bg-white/90 dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 text-xs font-mono font-bold text-[#0f172a] dark:text-white shrink-0 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-400" />
              <span>{categoryMaterialsCount} PDFs</span>
            </div>
          </div>
        </section>
      )}

      {/* Filterable Materials Browser locked to this Category */}
      <KcetMaterialsBrowser
        materials={allMaterials || []}
        subjects={subjects || []}
        categories={categories || []}
        lockedCategory={matchedCategory?.name || categoryTitle}
        isLoading={materialsLoading || categoriesLoading}
        searchPlaceholder={`Search inside KCET ${categoryTitle}...`}
      />
    </div>
  );
}
