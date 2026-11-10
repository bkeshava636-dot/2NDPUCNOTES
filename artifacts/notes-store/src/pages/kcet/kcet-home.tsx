import { useState, useMemo, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  fetchKcetStats,
  fetchKcetSubjects,
  fetchKcetCategories,
  fetchKcetMaterials,
  getKcetViewUrl,
  getKcetDownloadUrl,
  KcetMaterial,
} from "@/lib/kcet-api";
import { KcetDynamicIcon } from "@/components/kcet/kcet-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  Download,
  Eye,
  ExternalLink,
  Rocket,
  Sparkles,
  Calendar,
  BookOpen,
  FileText,
  UploadCloud,
  X,
  Filter,
  Target,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SeoHead } from "@/components/seo-head";

export default function KcetHome() {
  const searchStr = useSearch();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewMaterial, setPreviewMaterial] = useState<KcetMaterial | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchStr);
    const subParam = params.get("subject");
    const catParam = params.get("category");
    if (subParam) {
      setSelectedSubject(subParam);
      setSelectedCategory("all");
      setSelectedChapter("all");
    } else if (catParam) {
      setSelectedCategory(catParam);
      setSelectedSubject("all");
      setSelectedChapter("all");
    }
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

  const { availableChapters, availableYears } = useMemo(() => {
    const list = allMaterials || [];
    const scoped = list.filter((m) => {
      if (selectedSubject !== "all" && m.subject.toLowerCase() !== selectedSubject.toLowerCase()) return false;
      if (selectedCategory !== "all" && m.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      return true;
    });

    const chaptersSet = new Set<string>();
    const yearsSet = new Set<number>();
    for (const m of scoped) {
      if (m.chapter && m.chapter.trim()) chaptersSet.add(m.chapter.trim());
      if (m.year) yearsSet.add(m.year);
    }

    return {
      availableChapters: Array.from(chaptersSet).sort(),
      availableYears: Array.from(yearsSet).sort((a, b) => b - a),
    };
  }, [allMaterials, selectedSubject, selectedCategory]);

  const filteredMaterials = useMemo(() => {
    const list = allMaterials || [];
    const q = searchQuery.trim().toLowerCase();

    return list.filter((m) => {
      if (selectedSubject !== "all" && m.subject.toLowerCase() !== selectedSubject.toLowerCase()) return false;
      if (selectedCategory !== "all" && m.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      if (selectedChapter !== "all" && (m.chapter || "").trim().toLowerCase() !== selectedChapter.toLowerCase()) return false;
      if (selectedYear !== "all" && String(m.year || "") !== selectedYear) return false;
      if (q) {
        const hay = `${m.title} ${m.description || ""} ${m.chapter || ""} ${m.subject} ${m.category} ${m.year || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allMaterials, selectedSubject, selectedCategory, selectedChapter, selectedYear, searchQuery]);

  const hasActiveFilters =
    selectedSubject !== "all" ||
    selectedCategory !== "all" ||
    selectedChapter !== "all" ||
    selectedYear !== "all" ||
    searchQuery.trim().length > 0;

  const clearFilters = () => {
    setSelectedSubject("all");
    setSelectedCategory("all");
    setSelectedChapter("all");
    setSelectedYear("all");
    setSearchQuery("");
  };

  const handleSubjectSelect = (subName: string) => {
    setSelectedSubject((prev) => (prev === subName ? "all" : subName));
    setSelectedChapter("all");
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

      {/* 2. Core KCET Subjects */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2">
              <span>Select Subject</span>
              {selectedSubject !== "all" && (
                <Badge className="bg-sky-100 dark:bg-cyan-500/20 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-cyan-400/40 text-[11px]">
                  {selectedSubject}
                </Badge>
              )}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-slate-400">Filter competitive materials by KCET exam subject</p>
          </div>
          {selectedSubject !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSubject("all")}
              className="text-xs text-sky-600 dark:text-cyan-400 hover:text-sky-700 dark:hover:text-cyan-300 hover:bg-sky-50 dark:hover:bg-cyan-500/10"
            >
              Show All Subjects
            </Button>
          )}
        </div>

        {subjectsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {(subjects || []).map((sub) => {
              const isSelected = selectedSubject.toLowerCase() === sub.name.toLowerCase();
              const count = (allMaterials || []).filter(
                (m) => m.subject.toLowerCase() === sub.name.toLowerCase()
              ).length;

              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSubjectSelect(sub.name)}
                  className={`group relative text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer overflow-hidden ${
                    isSelected
                      ? "bg-sky-50/70 dark:bg-[#0d1736] border-sky-500 dark:border-cyan-400 shadow-sm dark:shadow-[0_0_24px_rgba(6,182,212,0.28)]"
                      : "bg-white dark:bg-[#090f24]/90 border-[#e2e8f0] dark:border-slate-800 hover:border-sky-300 dark:hover:border-cyan-500/50 hover:bg-[#f8fafc] dark:hover:bg-[#0d1530] shadow-2xs"
                  }`}
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sub.gradient} ${
                      isSelected ? "opacity-100" : "opacity-75 group-hover:opacity-100"
                    }`}
                  />
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
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Material Categories Tabs + Chapter & Year Filters */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3">
          {/* Categories Horizontal Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedYear("all");
              }}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white border-sky-600 dark:border-cyan-400 shadow-xs"
                  : "bg-white dark:bg-[#090f24] text-[#475569] dark:text-slate-300 border-[#e2e8f0] dark:border-slate-800 hover:border-sky-300 dark:hover:border-cyan-500/40 hover:text-[#0f172a] dark:hover:text-white"
              }`}
            >
              All Categories
            </button>

            {categoriesLoading
              ? [1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-9 w-24 rounded-xl shrink-0" />
                ))
              : (categories || []).map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(isActive ? "all" : cat.name);
                        setSelectedYear("all");
                      }}
                      className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-violet-600 text-white border-sky-600 dark:border-cyan-400 shadow-xs"
                          : "bg-white dark:bg-[#090f24] text-[#475569] dark:text-slate-300 border-[#e2e8f0] dark:border-slate-800 hover:border-sky-300 dark:hover:border-cyan-500/40 hover:text-[#0f172a] dark:hover:text-white"
                      }`}
                    >
                      <KcetDynamicIcon name={cat.iconName} className="h-3.5 w-3.5" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
          </div>

          {/* Secondary Filter Bar: Chapter Dropdown & PYQ Year Pills */}
          {(availableChapters.length > 0 || availableYears.length > 0 || hasActiveFilters) && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#090f24]/80 border border-[#e2e8f0] dark:border-slate-800/90 shadow-2xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748b] dark:text-slate-400">
                  <Filter className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-400" />
                  <span>Filter:</span>
                </div>

                {availableChapters.length > 0 && (
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    aria-label="Filter by chapter"
                    className="h-8 rounded-lg bg-[#f8fafc] dark:bg-[#050814] border border-[#cbd5e1] dark:border-slate-700 text-xs text-[#0f172a] dark:text-slate-200 px-2.5 focus:outline-none focus:border-sky-500 dark:focus:border-cyan-400"
                  >
                    <option value="all">All Chapters / Topics</option>
                    {availableChapters.map((ch) => (
                      <option key={ch} value={ch}>
                        {ch}
                      </option>
                    ))}
                  </select>
                )}

                {availableYears.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-mono text-[#64748b] dark:text-slate-400 flex items-center gap-1 ml-1">
                      <Calendar className="h-3 w-3 text-indigo-600 dark:text-violet-400" /> Year:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedYear("all")}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border transition-colors ${
                        selectedYear === "all"
                          ? "bg-indigo-50 dark:bg-violet-500/25 border-indigo-300 dark:border-violet-400 text-indigo-700 dark:text-violet-200"
                          : "bg-[#f8fafc] dark:bg-[#050814] border-[#e2e8f0] dark:border-slate-800 text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white"
                      }`}
                    >
                      All
                    </button>
                    {availableYears.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setSelectedYear(selectedYear === String(yr) ? "all" : String(yr))}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border transition-colors ${
                          selectedYear === String(yr)
                            ? "bg-indigo-50 dark:bg-violet-500/25 border-indigo-300 dark:border-violet-400 text-indigo-700 dark:text-violet-200"
                            : "bg-[#f8fafc] dark:bg-[#050814] border-[#e2e8f0] dark:border-slate-800 text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white"
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 px-2.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Reset Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 4. Materials Grid */}
        {materialsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-sky-300 dark:border-cyan-500/30 bg-white dark:bg-[#080e23]/80 p-8 sm:p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-400/30 text-sky-600 dark:text-cyan-400">
              <FileText className="h-7 w-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">
                {hasActiveFilters ? "No KCET materials match these filters" : "KCET Arena Ready for Resources"}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] dark:text-slate-400 leading-relaxed">
                {hasActiveFilters
                  ? "Try clearing your active subject, category, chapter, or year filter to see all available materials."
                  : "Upload KCET Notes, PYQs, Mock Papers, or Formula Sheets via the KCET Admin Board or share directly via Student Contribution!"}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-sky-300 dark:border-cyan-500/40 text-sky-700 dark:text-cyan-300 hover:bg-sky-50 dark:hover:bg-cyan-500/10"
                >
                  Show All Materials
                </Button>
              )}
              <Link href="/kcet/contribute">
                <Button className="gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 hover:opacity-95 text-white font-bold shadow-xs">
                  <UploadCloud className="h-4 w-4" />
                  Share a KCET PDF
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((mat) => (
              <article
                key={mat.id}
                className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24]/95 hover:border-sky-400 dark:hover:border-cyan-500/50 shadow-2xs hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(6,182,212,0.14)] p-5 transition-all duration-200"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge className="bg-sky-50 dark:bg-cyan-500/15 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-cyan-400/30 text-[10px] font-bold">
                      {mat.subject}
                    </Badge>
                    <Badge className="bg-indigo-50 dark:bg-violet-500/15 text-indigo-700 dark:text-violet-300 border border-indigo-200 dark:border-violet-400/30 text-[10px] font-bold">
                      {mat.category}
                    </Badge>
                    {mat.year && (
                      <Badge className="bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-400/30 text-[10px] font-mono font-bold">
                        {mat.year}
                      </Badge>
                    )}
                    {mat.isFeatured && (
                      <Badge className="bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-400/30 text-[10px] font-bold">
                        Top Pick
                      </Badge>
                    )}
                  </div>

                  {/* Title & Chapter */}
                  <div>
                    <h3 className="font-bold text-base text-[#0f172a] dark:text-white leading-snug line-clamp-2">
                      {mat.title}
                    </h3>
                    {mat.chapter && (
                      <p className="mt-1 text-xs font-medium text-sky-600 dark:text-cyan-400/90 truncate">
                        Chapter: {mat.chapter}
                      </p>
                    )}
                  </div>

                  {mat.description && (
                    <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed line-clamp-2">
                      {mat.description}
                    </p>
                  )}
                </div>

                {/* Metadata + Actions */}
                <div className="pt-4 mt-4 border-t border-[#f1f5f9] dark:border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b] dark:text-slate-400">
                    <div className="flex items-center gap-3">
                      {mat.pageCount && <span>{mat.pageCount} Pages</span>}
                      {mat.fileSizeKb && <span>{(mat.fileSizeKb / 1024).toFixed(1)} MB</span>}
                      {!mat.pageCount && !mat.fileSizeKb && <span>Verified PDF</span>}
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {mat.downloadCount.toLocaleString()} DLs
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewMaterial(mat)}
                      className="gap-1.5 h-9 text-xs font-semibold border-[#cbd5e1] dark:border-slate-700 bg-[#f8fafc] dark:bg-[#050814] text-[#334155] dark:text-slate-200 hover:bg-[#eff6ff] dark:hover:bg-slate-800 hover:text-[#0f172a] dark:hover:text-white hover:border-sky-400 dark:hover:border-cyan-400/50 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-400" />
                      <span>View PDF</span>
                    </Button>

                    <a
                      href={getKcetDownloadUrl(mat.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-md text-xs font-bold bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 hover:opacity-95 text-white shadow-xs transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

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

      {/* PDF Reader Preview Modal */}
      <Dialog open={Boolean(previewMaterial)} onOpenChange={(open) => !open && setPreviewMaterial(null)}>
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-[#060a19] border-[#e2e8f0] dark:border-cyan-500/40 text-[#0f172a] dark:text-white">
          <DialogHeader className="px-5 py-3.5 border-b border-[#e2e8f0] dark:border-slate-800 flex flex-row items-center justify-between gap-3">
            <div className="min-w-0 pr-6">
              <DialogTitle className="text-sm sm:text-base font-bold text-[#0f172a] dark:text-white truncate">
                {previewMaterial?.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#64748b] dark:text-slate-400 truncate">
                {previewMaterial?.subject} • {previewMaterial?.category}
                {previewMaterial?.chapter ? ` • ${previewMaterial.chapter}` : ""}
              </DialogDescription>
            </div>
            {previewMaterial && (
              <div className="flex items-center gap-2 shrink-0 mr-6">
                <a
                  href={getKcetViewUrl(previewMaterial.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#f1f5f9] dark:bg-white/5 hover:bg-[#e2e8f0] dark:hover:bg-white/10 text-[#334155] dark:text-slate-200 border border-[#cbd5e1] dark:border-slate-700"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open Tab</span>
                </a>
                <a
                  href={getKcetDownloadUrl(previewMaterial.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>
              </div>
            )}
          </DialogHeader>

          <div className="flex-1 bg-[#f1f5f9] dark:bg-[#03050d] relative">
            {previewMaterial && (
              <iframe
                src={getKcetViewUrl(previewMaterial.id)}
                title={previewMaterial.title}
                className="w-full h-full border-0"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
