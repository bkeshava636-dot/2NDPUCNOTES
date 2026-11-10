import { useState, useMemo, useEffect } from "react";
import { Link, useSearch, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  fetchKcetStats,
  fetchKcetSubjects,
  fetchKcetCategories,
  fetchKcetMaterials,
  KcetMaterial,
} from "@/lib/kcet-api";
import { KcetDynamicIcon } from "@/components/kcet/kcet-icons";
import {
  KcetMaterialCard,
  KcetMaterialsBrowser,
  KcetPdfPreviewModal,
} from "@/components/kcet/kcet-materials-browser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Download,
  Rocket,
  Sparkles,
  BookOpen,
  UploadCloud,
  X,
  Target,
  Clock,
  CheckCircle2,
  ArrowRight,
  Layers,
} from "lucide-react";
import { SeoHead } from "@/components/seo-head";

export default function KcetHome() {
  const searchStr = useSearch();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [querySubject, setQuerySubject] = useState<string | undefined>(undefined);
  const [queryCategory, setQueryCategory] = useState<string | undefined>(undefined);
  const [previewMaterial, setPreviewMaterial] = useState<KcetMaterial | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchStr);
    const subParam = params.get("subject");
    const catParam = params.get("category");
    setQuerySubject(subParam || undefined);
    setQueryCategory(catParam || undefined);
  }, [searchStr]);

  const { data: stats } = useQuery({
    queryKey: ["kcet-stats"],
    queryFn: fetchKcetStats,
    staleTime: 60_000,
  });

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["kcet-subjects"],
    queryFn: fetchKcetSubjects,
    staleTime: 60_000,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["kcet-categories"],
    queryFn: fetchKcetCategories,
    staleTime: 60_000,
  });

  const { data: allMaterials, isLoading: materialsLoading } = useQuery({
    queryKey: ["kcet-materials"],
    queryFn: () => fetchKcetMaterials(),
    staleTime: 30_000,
  });

  const subjectCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of allMaterials || []) {
      const key = m.subject.toLowerCase();
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [allMaterials]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of allMaterials || []) {
      const key = m.category.toLowerCase();
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [allMaterials]);

  const featuredMaterials = useMemo(() => {
    return (allMaterials || []).filter((m) => m.isFeatured).slice(0, 3);
  }, [allMaterials]);

  const isSearchingOrParamFiltered =
    searchQuery.trim().length > 0 || Boolean(querySubject) || Boolean(queryCategory);

  const clearSearchAndParams = () => {
    setSearchQuery("");
    setQuerySubject(undefined);
    setQueryCategory(undefined);
    if (searchStr) {
      setLocation("/kcet");
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-8 sm:space-y-10">
      <SeoHead
        title="KCET Competitive Arena — Physics, Chemistry, Maths & Biology Notes, PYQs, Formulas | 2PUC"
        description="Free Karnataka KCET Notes, Previous Year Question Papers (PYQs), Mock Tests, Syllabus Weightage, Objective Books & Formula Sheets for Physics, Chemistry, Mathematics, and Biology."
        keywords="kcet notes, kcet pyqs, kcet formula sheet, kcet syllabus weightage, karnataka cet physics chemistry maths biology"
        canonicalPath="/kcet"
      />

      {/* 1. Hero Arena (Light & Dark aware) */}
      <section className="relative rounded-3xl border border-sky-200 dark:border-cyan-500/30 bg-gradient-to-br from-[#eff8ff] via-white to-[#eef2ff] dark:from-[#0a1128] dark:via-[#070b1d] dark:to-[#110a28] p-6 sm:p-10 overflow-hidden shadow-xs dark:shadow-[0_0_50px_rgba(6,182,212,0.12)] transition-colors">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-400/15 dark:bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-400/15 dark:bg-violet-600/15 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-400/35 text-sky-700 dark:text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Rocket className="h-3.5 w-3.5" />
            <span>KCET Competitive Arena</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-[#0f172a] dark:text-white leading-[1.15]">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-violet-400">Karnataka CET</span> with Speed &amp; Precision
          </h1>

          <p className="text-sm sm:text-base text-[#475569] dark:text-slate-300 leading-relaxed max-w-2xl">
            Curated competitive-exam library featuring high-yield revision notes, year-wise KCET PYQs, formula cheat sheets, objective books, and timed mock papers across Physics, Chemistry, Mathematics &amp; Biology.
          </p>

          {/* Search Bar Scoped Strictly to KCET */}
          <div className="pt-2 max-w-xl">
            <div className="relative flex items-center rounded-2xl bg-white dark:bg-[#050814]/90 border border-[#cbd5e1] dark:border-cyan-500/40 focus-within:border-sky-500 dark:focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-sky-500/20 dark:focus-within:shadow-[0_0_20px_rgba(6,182,212,0.28)] transition-all px-3.5 h-12 shadow-2xs">
              <Search className="h-4 w-4 text-sky-600 dark:text-cyan-400 shrink-0 mr-2.5" />
              <Input
                id="kcet-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search KCET chapters, PYQs, formulas, mock tests..."
                className="border-0 bg-transparent text-sm text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-full px-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Live Arena Telemetry Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-mono text-[#334155] dark:text-slate-300">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-400" />
              <span className="font-bold text-[#0f172a] dark:text-white">{stats?.totalMaterials ?? 0}</span>
              <span className="text-[#64748b] dark:text-slate-400">KCET Resources</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 shadow-2xs">
              <BookOpen className="h-3.5 w-3.5 text-indigo-600 dark:text-violet-400" />
              <span className="font-bold text-[#0f172a] dark:text-white">{stats?.totalSubjects ?? 4}</span>
              <span className="text-[#64748b] dark:text-slate-400">Subjects</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 shadow-2xs">
              <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-[#0f172a] dark:text-white">{(stats?.totalDownloads ?? 0).toLocaleString()}</span>
              <span className="text-[#64748b] dark:text-slate-400">Downloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Active Search / Query Results View */}
      {isSearchingOrParamFiltered ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e8f0] dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
                <span>
                  {searchQuery.trim()
                    ? `Search results for "${searchQuery.trim()}"`
                    : `${querySubject || queryCategory} Materials`}
                </span>
              </h2>
              <p className="text-xs text-[#64748b] dark:text-slate-400">
                Scoped strictly to KCET resources
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearSearchAndParams}
              className="gap-1.5 text-xs border-sky-300 dark:border-cyan-500/40 text-sky-700 dark:text-cyan-300 hover:bg-sky-50 dark:hover:bg-cyan-500/10"
            >
              <X className="h-3.5 w-3.5" />
              <span>Back to Subjects &amp; Categories</span>
            </Button>
          </div>

          <KcetMaterialsBrowser
            materials={allMaterials || []}
            subjects={subjects || []}
            categories={categories || []}
            lockedSubject={querySubject}
            lockedCategory={queryCategory}
            externalSearch={searchQuery}
            hideSearchInput
            isLoading={materialsLoading}
            onClearAll={clearSearchAndParams}
          />
        </section>
      ) : (
        <>
          {/* 2. Browse by Subject Cards -> navigates to /kcet/subject/:slug */}
          <section id="kcet-subjects" className="space-y-4 scroll-mt-20">
            <div className="flex items-center justify-between gap-2 border-b border-[#e2e8f0] dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-white tracking-tight">
                    Select Subject
                  </h2>
                  <Badge className="bg-sky-100 dark:bg-cyan-500/15 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-cyan-400/30 text-[11px]">
                    {(subjects || []).length} Subjects
                  </Badge>
                </div>
                <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                  Open a subject hub for chapter notes, formulas, PYQs, and tests
                </p>
              </div>
            </div>

            {subjectsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {(subjects || []).map((sub) => {
                  const count = subjectCounts.get(sub.name.toLowerCase()) || 0;
                  return (
                    <Link key={sub.id} href={`/kcet/subject/${sub.slug}`}>
                      <div className="group relative h-full text-left rounded-2xl p-4 sm:p-5 border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24]/90 hover:border-sky-400 dark:hover:border-cyan-500/50 hover:bg-[#f8fafc] dark:hover:bg-[#0d1530] shadow-2xs hover:shadow-md dark:hover:shadow-[0_0_24px_rgba(6,182,212,0.16)] transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between">
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sub.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                        />

                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sub.gradient} text-white shadow-sm`}
                            >
                              <KcetDynamicIcon name={sub.iconName} className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#f1f5f9] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 text-[#475569] dark:text-slate-300">
                              {count} PDFs
                            </span>
                          </div>
                          <h3 className="mt-3.5 font-bold text-base text-[#0f172a] dark:text-white group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors">
                            {sub.name}
                          </h3>
                          {sub.description && (
                            <p className="mt-1 text-xs text-[#64748b] dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {sub.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] dark:border-slate-800/70 flex items-center justify-between text-[11px] font-semibold text-sky-600 dark:text-cyan-400">
                          <span>Open {sub.name}</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* 3. Browse by Material Category Cards -> navigates to /kcet/category/:slug */}
          <section id="kcet-categories" className="space-y-4 scroll-mt-20">
            <div className="flex items-center justify-between gap-2 border-b border-[#e2e8f0] dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2">
                    <Layers className="h-4.5 w-4.5 text-indigo-600 dark:text-violet-400" />
                    <span>Browse by Material Category</span>
                  </h2>
                  <Badge className="bg-indigo-100 dark:bg-violet-500/15 text-indigo-700 dark:text-violet-300 border border-indigo-200 dark:border-violet-400/30 text-[11px]">
                    {(categories || []).length} Categories
                  </Badge>
                </div>
                <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                  Explore dedicated KCET material collections — Notes, PYQs, Mock Papers, Syllabus, Objective Books &amp; Formulas
                </p>
              </div>
            </div>

            {categoriesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-36 rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {(categories || []).map((cat) => {
                  const count = categoryCounts.get(cat.name.toLowerCase()) || 0;
                  return (
                    <Link key={cat.id} href={`/kcet/category/${cat.slug}`}>
                      <div className="group h-full bg-white dark:bg-[#090f24]/95 border border-[#e2e8f0] dark:border-slate-800 hover:border-indigo-400 dark:hover:border-violet-400/60 hover:bg-[#fafcff] dark:hover:bg-[#0e1633] rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md dark:hover:shadow-[0_0_24px_rgba(139,92,246,0.16)] active:scale-[0.99]">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-cyan-500/15 dark:to-violet-500/20 text-indigo-600 dark:text-cyan-300 border border-indigo-100 dark:border-cyan-400/25 shadow-2xs">
                              <KcetDynamicIcon name={cat.iconName} className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#f1f5f9] dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 text-[#475569] dark:text-slate-300">
                              {count} {count === 1 ? "PDF" : "PDFs"}
                            </span>
                          </div>

                          <h3 className="font-bold text-base text-[#0f172a] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                            {cat.description ||
                              `Browse curated Karnataka CET ${cat.name} PDFs across Physics, Chemistry, Maths & Biology.`}
                          </p>
                        </div>

                        <div className="mt-4 pt-2.5 border-t border-[#f1f5f9] dark:border-slate-800/70 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-violet-300">
                          <span>Browse {cat.name}</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* 4. Compact Featured Top Picks (only rendered if featured resources exist, max 3) */}
          {featuredMaterials.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#e2e8f0] dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Featured Top Picks</span>
                  </h2>
                  <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                    High-yield KCET resources highlighted by educators
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredMaterials.map((mat) => (
                  <KcetMaterialCard
                    key={mat.id}
                    material={mat}
                    onPreview={setPreviewMaterial}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* 5. KCET Exam Structure & Competitive Strategy Guide */}
      <section className="rounded-3xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24]/90 p-6 sm:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] dark:border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-violet-500/15 border border-indigo-200 dark:border-violet-400/30 text-indigo-600 dark:text-violet-300 shrink-0">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0f172a] dark:text-white">Karnataka CET (KCET) Exam Blueprint &amp; Strategy</h2>
            <p className="text-xs text-[#64748b] dark:text-slate-400">KEA Official Examination Structure • PCM / PCB Competitive Overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sky-700 dark:text-cyan-300">
              <Clock className="h-4 w-4" />
              <span>Paper Format &amp; Timing</span>
            </div>
            <p className="text-[#475569] dark:text-slate-400 leading-relaxed">
              60 objective MCQs per subject (Physics, Chemistry, Mathematics, Biology) in 80 minutes each — roughly <strong className="text-[#0f172a] dark:text-white">80 seconds per question</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>Marking &amp; Zero Negative</span>
            </div>
            <p className="text-[#475569] dark:text-slate-400 leading-relaxed">
              Every correct response awards <strong className="text-[#0f172a] dark:text-white">+1 Mark</strong> with <strong className="text-emerald-600 dark:text-emerald-400">zero negative marking</strong>. Always attempt all 60 questions per subject.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
              <span>1st &amp; 2nd PUC Syllabus Weightage</span>
            </div>
            <p className="text-[#475569] dark:text-slate-400 leading-relaxed">
              Approximately <strong className="text-[#0f172a] dark:text-white">70–75% questions</strong> come from 2nd PUC topics and <strong className="text-[#0f172a] dark:text-white">25–30%</strong> from 1st PUC NCERT core fundamentals.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Student Community Contribution CTA */}
      <section className="rounded-3xl border border-sky-200 dark:border-cyan-500/30 bg-gradient-to-r from-[#eff8ff] via-white to-[#eef2ff] dark:from-cyan-950/40 dark:via-[#090f24] dark:to-violet-950/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-2xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 dark:text-cyan-300 uppercase tracking-wider">
            <UploadCloud className="h-4 w-4" />
            <span>KCET Student Community</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-white">Have KCET Shortcuts, Formula Sheets, or PYQs?</h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 max-w-xl">
            Share your handwritten KCET notes, coaching mock papers, or chapter MCQ PDFs to help thousands of Karnataka CET aspirants.
          </p>
        </div>

        <Link href="/kcet/contribute" className="shrink-0">
          <Button className="gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-violet-600 hover:opacity-95 text-white font-bold shadow-sm">
            <span>Share KCET Material</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* PDF Reader Preview Modal (used for Featured Picks) */}
      <KcetPdfPreviewModal material={previewMaterial} onClose={() => setPreviewMaterial(null)} />
    </div>
  );
}
