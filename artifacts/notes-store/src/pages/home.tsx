import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useListSections, useListCards, listCards } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CardItem } from "@/components/card-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  BookOpen,
  MessageCircle,
  ArrowRight,
  X,
  TrendingUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TELEGRAM_LINK } from "@/lib/site-config";
import {
  SCIENCE_SUBJECTS,
  LANGUAGE_SUBJECTS,
  RESOURCE_CATEGORIES,
} from "@/lib/site-navigation";
import { useLanguage } from "@/lib/language-context";

export default function Home() {
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [location] = useLocation();
  const { language, t } = useLanguage();

  // Handle focusSearch parameter if navigated from header search
  useEffect(() => {
    if (window.location.search.includes("focusSearch=1")) {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [location]);

  // Keyboard shortcut: '/' to focus search input
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { data: sections, isLoading: sectionsLoading } = useListSections();
  const { data: searchResults, isLoading: searchLoading } = useListCards(
    submitted ? { search: submitted } : undefined,
    {
      query: {
        enabled: !!submitted,
        queryKey: ["cards-search", submitted],
        placeholderData: (prev) => prev,
      },
    }
  );

  const featuredQuery = useListCards(
    { featured: true },
    {
      query: {
        enabled: !submitted,
        queryKey: ["cards-featured"],
        placeholderData: (prev) => prev,
      },
    }
  );

  const featuredCards = featuredQuery.data;

  const prefetchSubject = (name: string) => {
    queryClient.prefetchQuery({
      queryKey: ["subject-cards", name],
      queryFn: () => listCards({ subject: name }),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchCategory = () => {
    queryClient.prefetchQuery({
      queryKey: ["category-cards", "all"],
      queryFn: () => listCards({}),
      staleTime: 5 * 60 * 1000,
    });
  };

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(search.trim());
  }

  function handleClearSearch() {
    setSearch("");
    setSubmitted("");
  }

  function handleChipSearch(term: string) {
    setSearch(term);
    setSubmitted(term);
  }

  // Map API sections count to predefined subjects
  const scienceSections = SCIENCE_SUBJECTS.map((subj) => {
    const s = sections?.find((sec) => sec.name.toLowerCase().includes(subj.name.toLowerCase()));
    return {
      ...subj,
      cardCount: s ? (s as any).cardCount : undefined,
    };
  });

  const languageSections = LANGUAGE_SUBJECTS.map((subj) => {
    const s = sections?.find((sec) => sec.name.toLowerCase().includes(subj.name.toLowerCase()));
    return {
      ...subj,
      cardCount: s ? (s as any).cardCount : undefined,
    };
  });

  return (
    <div className="flex flex-col bg-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/40 to-white border-b border-[#e2e8f0]/80 pt-7 pb-8 sm:pt-10 sm:pb-11 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Main 2PUC Brand Heading */}
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <h1 className="text-4xl sm:text-5xl font-black text-[#0f172a] tracking-tight select-none inline-flex items-baseline justify-center">
              <span className="text-[#2563eb]">2</span>
              <span>PUC</span>
            </h1>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="relative max-w-lg mx-auto flex items-center bg-white rounded-xl border border-[#cbd5e1] p-1 shadow-xs focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/20 transition-all"
          >
            <div className="pl-3 sm:pl-3.5 text-[#94a3b8]">
              <Search className="h-4 w-4" />
            </div>
            <Input
              id="home-search-input"
              ref={searchInputRef}
              className="bg-transparent text-[#0f172a] placeholder:text-[#94a3b8] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-sm shadow-none font-medium"
              placeholder={t("Search by subject, chapter, or question bank...", "ವಿಷಯ, ಅಧ್ಯಾಯ ಅಥವಾ ಪ್ರಶ್ನೆ ಕೋಶ ಹುಡುಕಿ...")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value.trim()) setSubmitted("");
              }}
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 text-[#94a3b8] hover:text-[#475569] transition-colors mr-1"
                aria-label="Clear search text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button
              type="submit"
              size="sm"
              className="shrink-0 rounded-lg px-4 sm:px-5 h-8.5 text-xs font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-2xs transition-all"
            >
              {t("Search", "ಹುಡುಕಿ")}
            </Button>
          </form>

          {/* Quick Access Chips */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 mt-3 sm:mt-4 text-xs">
            <span className="text-[11px] font-semibold text-[#64748b] mr-1 hidden sm:inline">
              {t("Quick jump:", "ತ್ವರಿತ ಆಯ್ಕೆ:")}
            </span>
            {SCIENCE_SUBJECTS.map((subj) => (
              <button
                key={subj.slug}
                type="button"
                onClick={() => handleChipSearch(subj.name)}
                className="px-2.5 py-0.5 rounded-full bg-white hover:bg-[#eff6ff] text-[#334155] hover:text-[#2563eb] border border-[#cbd5e1] hover:border-[#bfdbfe] text-[11px] font-medium transition-all shadow-2xs active:scale-95"
              >
                {language === "kn" ? subj.kannadaName : subj.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content Area ── */}
      <div className="max-w-5xl mx-auto w-full px-4 py-8 sm:py-12 flex flex-col gap-10 sm:gap-14">
        {/* Search Results */}
        {submitted && (
          <section className="scroll-mt-20">
            <div className="flex items-center justify-between mb-5 border-b border-[#e2e8f0] pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#0f172a]">
                {t("Results for", "ಫಲಿತಾಂಶಗಳು:")} "{submitted}"
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="text-[#2563eb] hover:text-[#1d4ed8] text-xs font-semibold"
              >
                {t("Clear", "ರದ್ದುಮಾಡಿ")}
              </Button>
            </div>
            {searchLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : searchResults?.length === 0 ? (
              <div className="text-center py-16 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-8">
                <BookOpen className="h-9 w-9 text-[#94a3b8] mx-auto mb-2" />
                <p className="text-[#64748b] font-medium text-sm">
                  {t(
                    "No study materials found for this search. Try searching by subject or chapter name.",
                    "ಯಾವುದೇ ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ವಿಷಯ ಅಥವಾ ಅಧ್ಯಾಯವನ್ನು ಹುಡುಕಿ."
                  )}
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleChipSearch("Physics")}
                    className="text-xs"
                  >
                    Physics
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleChipSearch("Chemistry")}
                    className="text-xs"
                  >
                    Chemistry
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleChipSearch("Mathematics")}
                    className="text-xs"
                  >
                    Mathematics
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults?.map((card) => (
                  <CardItem key={card.id} card={card} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── PART 1: Browse by Subject ── */}
        {!submitted && (
          <section id="browse-by-subject" className="space-y-6 scroll-mt-20">
            <div className="border-b border-[#eef2f6] pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                {t("Browse by Subject", "ವಿಷಯವಾರು ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು")}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                {t(
                  "Curriculum-aligned 2nd PUC Science notes, formulas, schemes, and literature guides",
                  "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ಪಠ್ಯಕ್ರಮಕ್ಕೆ ಅನುಗುಣವಾದ ಅಧ್ಯಯನ ನೋಟ್ಸ್‌ಗಳು"
                )}
              </p>
            </div>

            {/* A. Science Subjects (5 items balanced on grid) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] bg-[#eff6ff] px-2.5 py-0.5 rounded border border-[#bfdbfe]">
                  {t("Science Subjects", "ವಿಜ್ಞಾನ ವಿಷಯಗಳು")}
                </span>
                <span className="text-xs text-[#64748b]">
                  {t("Physics, Chemistry, Mathematics, Biology & Computer Science", "ಭೌತ, ರಸಾಯನ, ಗಣಿತ, ಜೀವಶಾಸ್ತ್ರ & ಗಣಕ ವಿಜ್ಞಾನ")}
                </span>
              </div>

              {sectionsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                  {scienceSections.map((subj) => {
                    const Icon = subj.icon;
                    const theme = subj.theme;
                    return (
                      <Link
                        key={subj.name}
                        href={`/subject/${subj.slug}`}
                        onPointerEnter={() => prefetchSubject(subj.name)}
                        onFocus={() => prefetchSubject(subj.name)}
                      >
                        <div
                          className={`group h-full ${theme.bg} border ${theme.border} ${theme.hoverBorder} rounded-xl p-3 sm:p-3.5 transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs active:scale-[0.98] min-h-[92px]`}
                        >
                          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                            <div
                              className={`flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-lg ${theme.iconBg} ${theme.iconColor} shadow-2xs border border-white/60`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <h3 className={`font-semibold text-xs sm:text-sm ${theme.titleColor} truncate`}>
                                {language === "kn" ? subj.kannadaName : subj.name}
                              </h3>
                              <p className={`text-[10px] sm:text-[11px] ${theme.countColor} font-medium truncate`}>
                                {subj.cardCount !== undefined
                                  ? `${subj.cardCount} resources`
                                  : t("View notes", "ನೋಟ್ಸ್ ನೋಡಿ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end text-[10px] font-semibold text-[#2563eb] mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* B. Languages (4 items balanced in 4 columns) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6d28d9] bg-[#f5f3ff] px-2.5 py-0.5 rounded border border-[#ede9fe]">
                  {t("Languages", "ಭಾಷಾ ವಿಷಯಗಳು")}
                </span>
                <span className="text-xs text-[#64748b]">
                  {t("Kannada, English, Hindi & Sanskrit Literature and Grammar", "ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ & ಸಂಸ್ಕೃತ ಸಾಹಿತ್ಯ ಮತ್ತು ವ್ಯಾಕರಣ")}
                </span>
              </div>

              {sectionsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {languageSections.map((subj) => {
                    const Icon = subj.icon;
                    const theme = subj.theme;
                    return (
                      <Link
                        key={subj.name}
                        href={`/subject/${subj.slug}`}
                        onPointerEnter={() => prefetchSubject(subj.name)}
                        onFocus={() => prefetchSubject(subj.name)}
                      >
                        <div
                          className={`group h-full ${theme.bg} border ${theme.border} ${theme.hoverBorder} rounded-xl p-3 sm:p-3.5 transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs active:scale-[0.98] min-h-[92px]`}
                        >
                          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                            <div
                              className={`flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-lg ${theme.iconBg} ${theme.iconColor} shadow-2xs border border-white/60`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <h3 className={`font-semibold text-xs sm:text-sm ${theme.titleColor} truncate`}>
                                {language === "kn" ? subj.kannadaName : subj.name}
                              </h3>
                              <p className={`text-[10px] sm:text-[11px] ${theme.countColor} font-medium truncate`}>
                                {subj.cardCount !== undefined
                                  ? `${subj.cardCount} resources`
                                  : t("View notes", "ನೋಟ್ಸ್ ನೋಡಿ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end text-[10px] font-semibold text-[#6d28d9] mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── PART 2: Browse by Resource Type (Explicit Heading & Balanced 7 Cards) ── */}
        {!submitted && (
          <section id="resource-types" className="space-y-5 scroll-mt-20">
            <div className="border-b border-[#eef2f6] pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                  {t("Browse by Resource Type", "ಸಂಪನ್ಮೂಲ ಪ್ರಕಾರವಾರು ಹುಡುಕಿ")}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
                  {RESOURCE_CATEGORIES.length} {t("Formats", "ಪ್ರಕಾರಗಳು")}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                {t(
                  "Filter Karnataka 2nd PUC materials by notes, exam format, blueprint paper, or question bank",
                  "ಪರೀಕ್ಷಾ ಮಾದರಿ, ಬ್ಲೂಪ್ರಿಂಟ್ ಅಥವಾ ಹಿಂದಿನ ವರ್ಷದ ಪತ್ರಿಕೆಗಳ ಪ್ರಕಾರ ಹುಡುಕಿ"
                )}
              </p>
            </div>

            {/* Responsive grid handling all categories cleanly across all devices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
              {RESOURCE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onPointerEnter={prefetchCategory}
                    onFocus={prefetchCategory}
                  >
                    <div
                      className={`group h-full bg-white border border-[#e2e8f0] ${cat.theme.hoverBorder} hover:bg-[#fafcff] rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs active:scale-[0.99]`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cat.theme.iconBg} ${cat.theme.iconText} border border-slate-100 shadow-2xs`}
                          >
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <span
                            className={`text-[10px] font-semibold ${cat.theme.badgeText} ${cat.theme.badgeBg} px-2 py-0.5 rounded border ${cat.theme.badgeBorder}`}
                          >
                            {cat.badge}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#0f172a] group-hover:text-[#2563eb] transition-colors">
                          {language === "kn" ? cat.kannadaTitle : cat.title}
                        </h3>
                        <p className="text-xs text-[#64748b] mt-1 leading-relaxed line-clamp-2">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="flex items-center justify-end pt-3 mt-3 border-t border-[#f1f5f9] text-xs font-semibold text-[#2563eb]">
                        <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>{t("Explore", "ವೀಕ್ಷಿಸಿ")}</span>
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── PART 3: Featured Resources ── */}
        {!submitted && Array.isArray(featuredCards) && featuredCards.length > 0 && (
          <section className="space-y-4 scroll-mt-20">
            <div className="border-b border-[#eef2f6] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                  {t("Featured Resources", "ಪ್ರಮುಖ ಸಂಪನ್ಮೂಲಗಳು")}
                </h2>
                <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{t("Trending", "ಟ್ರೆಂಡಿಂಗ್")}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredCards.slice(0, 6).map((card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          </section>
        )}


        {/* ── PART 5: Community & Telegram Banner ── */}
        <section className="bg-gradient-to-r from-[#eff6ff] via-[#f0f9ff] to-[#f8fafc] border border-[#dbeafe] rounded-xl p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#2563eb] border border-[#bfdbfe] shadow-2xs">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] text-sm sm:text-base">
                  {t("Need help or have questions?", "ಸಹಾಯ ಬೇಕೇ ಅಥವಾ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ?")}
                </h3>
                <p className="text-[#64748b] text-xs sm:text-sm mt-0.5">
                  {t(
                    "Reach out on Telegram for prompt student support, study discussion, and updates",
                    "ತ್ವರಿತ ಸಹಾಯ ಮತ್ತು ನವೀಕರಣಗಳಿಗಾಗಿ ನಮ್ಮ ಟೆಲಿಗ್ರಾಂ ಗುಂಪಿಗೆ ಸೇರಿ"
                  )}
                </p>
              </div>
            </div>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 w-full sm:w-auto"
            >
              <Button
                size="sm"
                className="w-full sm:w-auto gap-2 px-4 h-9 font-semibold text-xs rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-2xs transition-all"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{t("Join 2PUC Community", "ಟೆಲಿಗ್ರಾಂನಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ")}</span>
              </Button>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
