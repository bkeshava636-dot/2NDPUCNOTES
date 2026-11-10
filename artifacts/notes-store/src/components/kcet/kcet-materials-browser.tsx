import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import {
  KcetCategory,
  KcetMaterial,
  KcetSubject,
  getKcetDownloadUrl,
  getKcetViewUrl,
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
  Calendar,
  FileText,
  UploadCloud,
  X,
  Filter,
} from "lucide-react";

/**
 * Reusable PDF preview modal for KCET materials.
 */
export function KcetPdfPreviewModal({
  material,
  onClose,
}: {
  material: KcetMaterial | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(material)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-[#060a19] border-[#e2e8f0] dark:border-cyan-500/40 text-[#0f172a] dark:text-white">
        <DialogHeader className="px-5 py-3.5 border-b border-[#e2e8f0] dark:border-slate-800 flex flex-row items-center justify-between gap-3">
          <div className="min-w-0 pr-6">
            <DialogTitle className="text-sm sm:text-base font-bold text-[#0f172a] dark:text-white truncate">
              {material?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748b] dark:text-slate-400 truncate">
              {material?.subject} • {material?.category}
              {material?.chapter ? ` • ${material.chapter}` : ""}
            </DialogDescription>
          </div>
          {material && (
            <div className="flex items-center gap-2 shrink-0 mr-6">
              <a
                href={getKcetViewUrl(material.id)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#f1f5f9] dark:bg-white/5 hover:bg-[#e2e8f0] dark:hover:bg-white/10 text-[#334155] dark:text-slate-200 border border-[#cbd5e1] dark:border-slate-700"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Open Tab</span>
              </a>
              <a
                href={getKcetDownloadUrl(material.id)}
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
          {material && (
            <iframe
              src={getKcetViewUrl(material.id)}
              title={material.title}
              className="w-full h-full border-0"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Reusable single KCET resource card with View PDF & Download actions.
 */
export function KcetMaterialCard({
  material,
  onPreview,
}: {
  material: KcetMaterial;
  onPreview: (mat: KcetMaterial) => void;
}) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24]/95 hover:border-sky-400 dark:hover:border-cyan-500/50 shadow-2xs hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(6,182,212,0.14)] p-5 transition-all duration-200">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge className="bg-sky-50 dark:bg-cyan-500/15 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-cyan-400/30 text-[10px] font-bold">
            {material.subject}
          </Badge>
          <Badge className="bg-indigo-50 dark:bg-violet-500/15 text-indigo-700 dark:text-violet-300 border border-indigo-200 dark:border-violet-400/30 text-[10px] font-bold">
            {material.category}
          </Badge>
          {material.year && (
            <Badge className="bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-400/30 text-[10px] font-mono font-bold">
              {material.year}
            </Badge>
          )}
          {material.isFeatured && (
            <Badge className="bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-400/30 text-[10px] font-bold">
              Top Pick
            </Badge>
          )}
        </div>

        <div>
          <h3 className="font-bold text-base text-[#0f172a] dark:text-white leading-snug line-clamp-2">
            {material.title}
          </h3>
          {material.chapter && (
            <p className="mt-1 text-xs font-medium text-sky-600 dark:text-cyan-400/90 truncate">
              Chapter: {material.chapter}
            </p>
          )}
        </div>

        {material.description && (
          <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed line-clamp-2">
            {material.description}
          </p>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-[#f1f5f9] dark:border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748b] dark:text-slate-400">
          <div className="flex items-center gap-3">
            {material.pageCount && <span>{material.pageCount} Pages</span>}
            {material.fileSizeKb && <span>{(material.fileSizeKb / 1024).toFixed(1)} MB</span>}
            {!material.pageCount && !material.fileSizeKb && <span>Verified PDF</span>}
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {material.downloadCount.toLocaleString()} DLs
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPreview(material)}
            className="gap-1.5 h-9 text-xs font-semibold border-[#cbd5e1] dark:border-slate-700 bg-[#f8fafc] dark:bg-[#050814] text-[#334155] dark:text-slate-200 hover:bg-[#eff6ff] dark:hover:bg-slate-800 hover:text-[#0f172a] dark:hover:text-white hover:border-sky-400 dark:hover:border-cyan-400/50 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-400" />
            <span>View PDF</span>
          </Button>

          <a
            href={getKcetDownloadUrl(material.id)}
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
  );
}

interface KcetMaterialsBrowserProps {
  materials: KcetMaterial[];
  subjects?: KcetSubject[];
  categories?: KcetCategory[];
  lockedSubject?: string;
  lockedCategory?: string;
  externalSearch?: string;
  hideSearchInput?: boolean;
  isLoading?: boolean;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onClearAll?: () => void;
}

/**
 * Filterable material grid with subject/category pill filters, chapter dropdown,
 * PYQ year pills, and PDF preview modal for KCET dedicated pages and search results.
 */
export function KcetMaterialsBrowser({
  materials,
  subjects = [],
  categories = [],
  lockedSubject,
  lockedCategory,
  externalSearch,
  hideSearchInput = false,
  isLoading = false,
  searchPlaceholder = "Search chapters, topics, years...",
  emptyTitle,
  emptyDescription,
  onClearAll,
}: KcetMaterialsBrowserProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>(lockedSubject || "all");
  const [selectedCategory, setSelectedCategory] = useState<string>(lockedCategory || "all");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState<string>("");
  const [previewMaterial, setPreviewMaterial] = useState<KcetMaterial | null>(null);

  useEffect(() => {
    setSelectedSubject(lockedSubject || "all");
    setSelectedChapter("all");
  }, [lockedSubject]);

  useEffect(() => {
    setSelectedCategory(lockedCategory || "all");
    setSelectedYear("all");
  }, [lockedCategory]);

  const effectiveSearch = externalSearch !== undefined ? externalSearch : localSearch;
  const activeSubject = lockedSubject || selectedSubject;
  const activeCategory = lockedCategory || selectedCategory;

  const { availableChapters, availableYears } = useMemo(() => {
    const scoped = materials.filter((m) => {
      if (activeSubject !== "all" && m.subject.toLowerCase() !== activeSubject.toLowerCase()) return false;
      if (activeCategory !== "all" && m.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
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
  }, [materials, activeSubject, activeCategory]);

  const filteredMaterials = useMemo(() => {
    const q = effectiveSearch.trim().toLowerCase();
    return materials.filter((m) => {
      if (activeSubject !== "all" && m.subject.toLowerCase() !== activeSubject.toLowerCase()) return false;
      if (activeCategory !== "all" && m.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
      if (selectedChapter !== "all" && (m.chapter || "").trim().toLowerCase() !== selectedChapter.toLowerCase()) {
        return false;
      }
      if (selectedYear !== "all" && String(m.year || "") !== selectedYear) return false;
      if (q) {
        const hay = `${m.title} ${m.description || ""} ${m.chapter || ""} ${m.subject} ${m.category} ${m.year || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [materials, activeSubject, activeCategory, selectedChapter, selectedYear, effectiveSearch]);

  const hasSubFilters =
    (!lockedSubject && selectedSubject !== "all") ||
    (!lockedCategory && selectedCategory !== "all") ||
    selectedChapter !== "all" ||
    selectedYear !== "all" ||
    effectiveSearch.trim().length > 0;

  const resetSubFilters = () => {
    if (!lockedSubject) setSelectedSubject("all");
    if (!lockedCategory) setSelectedCategory("all");
    setSelectedChapter("all");
    setSelectedYear("all");
    setLocalSearch("");
    onClearAll?.();
  };

  return (
    <div className="space-y-5">
      {/* Local Search Bar (when not driven externally by Hero search) */}
      {!hideSearchInput && (
        <div className="relative flex items-center max-w-xl rounded-2xl bg-white dark:bg-[#050814]/90 border border-[#cbd5e1] dark:border-cyan-500/35 focus-within:border-sky-500 dark:focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-sky-500/20 px-3.5 h-11 shadow-2xs">
          <Search className="h-4 w-4 text-sky-600 dark:text-cyan-400 shrink-0 mr-2.5" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="border-0 bg-transparent text-sm text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] dark:placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-full px-0"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch("")}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Optional Subject Pills (shown on Category pages or combined search) */}
      {!lockedSubject && subjects.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setSelectedSubject("all");
              setSelectedChapter("all");
            }}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selectedSubject === "all"
                ? "bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white border-sky-600 dark:border-cyan-400 shadow-xs"
                : "bg-white dark:bg-[#090f24] text-[#475569] dark:text-slate-300 border-[#e2e8f0] dark:border-slate-800 hover:border-sky-300 dark:hover:border-cyan-500/40 hover:text-[#0f172a] dark:hover:text-white"
            }`}
          >
            All Subjects
          </button>
          {subjects.map((sub) => {
            const isActive = selectedSubject.toLowerCase() === sub.name.toLowerCase();
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  setSelectedSubject(isActive ? "all" : sub.name);
                  setSelectedChapter("all");
                }}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white border-sky-600 dark:border-cyan-400 shadow-xs"
                    : "bg-white dark:bg-[#090f24] text-[#475569] dark:text-slate-300 border-[#e2e8f0] dark:border-slate-800 hover:border-sky-300 dark:hover:border-cyan-500/40 hover:text-[#0f172a] dark:hover:text-white"
                }`}
              >
                <KcetDynamicIcon name={sub.iconName} className="h-3.5 w-3.5" />
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Optional Category Pills (shown on Subject pages or combined search) */}
      {!lockedCategory && categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedYear("all");
            }}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-violet-600 text-white border-sky-600 dark:border-cyan-400 shadow-xs"
                : "bg-white dark:bg-[#090f24] text-[#475569] dark:text-slate-300 border-[#e2e8f0] dark:border-slate-800 hover:border-sky-300 dark:hover:border-cyan-500/40 hover:text-[#0f172a] dark:hover:text-white"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(isActive ? "all" : cat.name);
                  setSelectedYear("all");
                }}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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
      )}

      {/* Chapter Dropdown & PYQ Year Pills */}
      {(availableChapters.length > 0 || availableYears.length > 0 || hasSubFilters) && (
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

          {hasSubFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetSubFilters}
              className="h-7 px-2.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Reset Filters
            </Button>
          )}
        </div>
      )}

      {/* Result Count */}
      {!isLoading && (
        <div className="flex items-center justify-between text-xs text-[#64748b] dark:text-slate-400 font-mono">
          <span>
            Showing <strong className="text-[#0f172a] dark:text-white">{filteredMaterials.length}</strong>{" "}
            {filteredMaterials.length === 1 ? "material" : "materials"}
          </span>
        </div>
      )}

      {/* Materials Grid */}
      {isLoading ? (
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
              {emptyTitle ||
                (hasSubFilters ? "No KCET materials match these filters" : "No materials uploaded here yet")}
            </h3>
            <p className="text-xs sm:text-sm text-[#64748b] dark:text-slate-400 leading-relaxed">
              {emptyDescription ||
                (hasSubFilters
                  ? "Try clearing your active filter or search term to view available resources."
                  : "Upload PDFs via the KCET Admin Board or contribute notes & PYQs through Student Contribution.")}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {hasSubFilters && (
              <Button
                onClick={resetSubFilters}
                variant="outline"
                className="border-sky-300 dark:border-cyan-500/40 text-sky-700 dark:text-cyan-300 hover:bg-sky-50 dark:hover:bg-cyan-500/10"
              >
                Clear Filters
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
            <KcetMaterialCard key={mat.id} material={mat} onPreview={setPreviewMaterial} />
          ))}
        </div>
      )}

      <KcetPdfPreviewModal material={previewMaterial} onClose={() => setPreviewMaterial(null)} />
    </div>
  );
}
