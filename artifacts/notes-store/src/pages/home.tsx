import { useState } from "react";
import { Link } from "wouter";
import { useListSections, useListCards, listCards } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CardItem } from "@/components/card-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  MessageCircle,
  ArrowRight,
  X,
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  BookA,
  Scroll,
  GraduationCap,
  Languages,
  Laptop,
  FileText,
  HelpCircle,
  BookMarked,
  History,
  CheckCircle2,
  Layers,
  Sparkles
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TELEGRAM_LINK } from "@/lib/site-config";

// Defined lists for Core vs Language subjects
const CORE_SUBJECT_NAMES = ["Physics", "Chemistry", "Computer Science", "Biology"];
const LANGUAGE_OTHER_NAMES = ["Mathematics", "English", "Hindi", "Kannada", "Sanskrit"];

function getSubjectIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("phys")) return Atom;
  if (lower.includes("chem")) return FlaskConical;
  if (lower.includes("comp")) return Laptop;
  if (lower.includes("math")) return Calculator;
  if (lower.includes("bio")) return Dna;
  if (lower.includes("eng")) return BookA;
  if (lower.includes("hin")) return Scroll;
  if (lower.includes("kan")) return GraduationCap;
  if (lower.includes("san")) return Languages;
  return BookOpen;
}

type SubjectTheme = {
  bg: string;
  border: string;
  hoverBorder: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
  countColor: string;
};

const SUBJECT_THEMES: Record<string, SubjectTheme> = {
  physics: {
    bg: "bg-[#ebf3ff]",
    border: "border-[#dce8fa]",
    hoverBorder: "hover:border-[#b8d4f8]",
    iconBg: "bg-white",
    iconColor: "text-[#1856b8]",
    titleColor: "text-[#1856b8]",
    countColor: "text-[#5a7da8]",
  },
  chemistry: {
    bg: "bg-[#fdece9]",
    border: "border-[#f9dcd7]",
    hoverBorder: "hover:border-[#f3beba]",
    iconBg: "bg-white",
    iconColor: "text-[#c93b2b]",
    titleColor: "text-[#b83226]",
    countColor: "text-[#9e5d56]",
  },
  "computer-science": {
    bg: "bg-[#ecfeff]",
    border: "border-[#cffafe]",
    hoverBorder: "hover:border-[#a5f3fc]",
    iconBg: "bg-white",
    iconColor: "text-[#0891b2]",
    titleColor: "text-[#0e7490]",
    countColor: "text-[#155e75]",
  },
  biology: {
    bg: "bg-[#fdf5e2]",
    border: "border-[#f9ecc8]",
    hoverBorder: "hover:border-[#f2dba1]",
    iconBg: "bg-white",
    iconColor: "text-[#b26a00]",
    titleColor: "text-[#9e5e00]",
    countColor: "text-[#94784e]",
  },
  math: {
    bg: "bg-[#eaf5ec]",
    border: "border-[#d7ecdc]",
    hoverBorder: "hover:border-[#b8e0c1]",
    iconBg: "bg-white",
    iconColor: "text-[#197d3b]",
    titleColor: "text-[#167035]",
    countColor: "text-[#588366]",
  },
  english: {
    bg: "bg-[#f5f3ff]",
    border: "border-[#ede9fe]",
    hoverBorder: "hover:border-[#ddd6fe]",
    iconBg: "bg-white",
    iconColor: "text-[#7c3aed]",
    titleColor: "text-[#6d28d9]",
    countColor: "text-[#8b5cf6]",
  },
  hindi: {
    bg: "bg-[#fff7ed]",
    border: "border-[#ffedd5]",
    hoverBorder: "hover:border-[#fed7aa]",
    iconBg: "bg-white",
    iconColor: "text-[#ea580c]",
    titleColor: "text-[#c2410c]",
    countColor: "text-[#f97316]",
  },
  kannada: {
    bg: "bg-[#f0fdf4]",
    border: "border-[#dcfce7]",
    hoverBorder: "hover:border-[#bbf7d0]",
    iconBg: "bg-white",
    iconColor: "text-[#16a34a]",
    titleColor: "text-[#15803d]",
    countColor: "text-[#22c55e]",
  },
  sanskrit: {
    bg: "bg-[#fffbeb]",
    border: "border-[#fef3c7]",
    hoverBorder: "hover:border-[#fde68a]",
    iconBg: "bg-white",
    iconColor: "text-[#d97706]",
    titleColor: "text-[#b45309]",
    countColor: "text-[#f59e0b]",
  },
};

function getSubjectTheme(name: string): SubjectTheme {
  const lower = name.toLowerCase();
  if (lower.includes("phys")) return SUBJECT_THEMES.physics;
  if (lower.includes("chem")) return SUBJECT_THEMES.chemistry;
  if (lower.includes("comp")) return SUBJECT_THEMES["computer-science"];
  if (lower.includes("math")) return SUBJECT_THEMES.math;
  if (lower.includes("bio")) return SUBJECT_THEMES.biology;
  if (lower.includes("eng")) return SUBJECT_THEMES.english;
  if (lower.includes("hin")) return SUBJECT_THEMES.hindi;
  if (lower.includes("kan")) return SUBJECT_THEMES.kannada;
  if (lower.includes("san")) return SUBJECT_THEMES.sanskrit;
  return {
    bg: "bg-[#f0f4f9]",
    border: "border-[#e2e8f0]",
    hoverBorder: "hover:border-[#cbd5e1]",
    iconBg: "bg-white",
    iconColor: "text-[#1856b8]",
    titleColor: "text-[#112542]",
    countColor: "text-[#64748b]",
  };
}

const CATEGORY_ITEMS = [
  {
    title: "Model Question Papers (MQP)",
    slug: "mqp",
    desc: "Official model papers with answer keys",
    icon: FileText,
    badge: "Official",
  },
  {
    title: "MCQ",
    slug: "mcq",
    desc: "Chapterwise multiple choice practice",
    icon: HelpCircle,
    badge: "Practice",
  },
  {
    title: "Question Bank",
    slug: "question-bank",
    desc: "Board repeated questions & solutions",
    icon: BookMarked,
    badge: "Curated",
  },
  {
    title: "Practical",
    slug: "practical",
    desc: "Schemes, lab manuals & viva questions",
    icon: FlaskConical,
    badge: "Core Science",
  },
  {
    title: "Previous Year Question Papers (PYQs)",
    slug: "pyq",
    desc: "Midterm, preparatory & annual papers",
    icon: History,
    badge: "Past Papers",
  },
  {
    title: "Passing Package",
    slug: "passing-package",
    desc: "Guaranteed scoring high-yield notes",
    icon: CheckCircle2,
    badge: "Essential",
  },
  {
    title: "Publication Books",
    slug: "publication-books",
    desc: "Reference books and workbook solutions",
    icon: BookOpen,
    badge: "Reference",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState("");
  const queryClient = useQueryClient();

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

  // Split sections into Core Subjects and Languages/Other Subjects
  const coreSections = CORE_SUBJECT_NAMES.map((name) => {
    const s = sections?.find((sec) => sec.name.toLowerCase().includes(name.toLowerCase()));
    return {
      name,
      slug: s?.slug || name.toLowerCase().replace(/\s+/g, "-"),
      cardCount: s ? (s as any).cardCount : undefined,
      icon: getSubjectIcon(name),
      theme: getSubjectTheme(name),
    };
  });

  const languageSections = LANGUAGE_OTHER_NAMES.map((name) => {
    const s = sections?.find((sec) => sec.name.toLowerCase().includes(name.toLowerCase()));
    return {
      name,
      slug: s?.slug || name.toLowerCase().replace(/\s+/g, "-"),
      cardCount: s ? (s as any).cardCount : undefined,
      icon: getSubjectIcon(name),
      theme: getSubjectTheme(name),
    };
  });

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#f2f7fd] via-[#f8fbff] to-white border-b border-[#e8eff7] py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebf3ff] border border-[#dce8fa] text-[#1856b8] text-xs font-semibold mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Karnataka State Board</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#112542] tracking-tight mb-5">
            2PUC Notes Store
          </h1>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="relative max-w-lg mx-auto flex items-center bg-white rounded-lg border border-[#d9e2ec] p-1 shadow-2xs focus-within:border-[#1856b8] focus-within:ring-2 focus-within:ring-[#1856b8]/15 transition-all"
          >
            <div className="pl-3 text-[#94a3b8]">
              <Search className="h-4 w-4" />
            </div>
            <Input
              className="bg-transparent text-[#112542] placeholder:text-[#94a3b8] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 text-sm shadow-none"
              placeholder="Search by subject, chapter, title..."
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
                className="p-1 text-[#94a3b8] hover:text-[#5a6b82] transition-colors mr-1"
                aria-label="Clear search text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button
              type="submit"
              size="sm"
              className="shrink-0 rounded-md px-4 h-8 text-xs font-medium bg-[#0b57d0] hover:bg-[#094bb8] text-white shadow-none transition-colors"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto w-full px-4 py-10 sm:py-14 flex flex-col gap-12 sm:gap-16">
        {/* Search Results */}
        {submitted && (
          <section className="scroll-mt-20">
            <div className="flex items-center justify-between mb-5 border-b border-[#e2e8f0] pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#112542]">Results for "{submitted}"</h2>
              <Button variant="ghost" size="sm" onClick={handleClearSearch} className="text-[#1856b8] hover:text-[#0b57d0] text-xs">
                Clear
              </Button>
            </div>
            {searchLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
              </div>
            ) : searchResults?.length === 0 ? (
              <div className="text-center py-16 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-8">
                <BookOpen className="h-9 w-9 text-[#94a3b8] mx-auto mb-2" />
                <p className="text-[#5a6b82] font-medium text-sm">No results found. Try different keywords.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults?.map(card => <CardItem key={card.id} card={card} />)}
              </div>
            )}
          </section>
        )}

        {/* PART 1: Browse by Subject */}
        {!submitted && (
          <section className="space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#112542] tracking-tight">Browse by Subject</h2>
              <p className="text-sm text-[#5a6b82] mt-0.5">Explore curriculum-aligned notes by subject and topic</p>
            </div>

            {/* A. Core Subjects */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1856b8] bg-[#ebf3ff] px-2.5 py-0.5 rounded border border-[#dce8fa]">
                  Core Subjects
                </span>
                <span className="text-xs text-[#64748b]">Includes Practicals, Lab Manuals, Schemes & Notes</span>
              </div>

              {sectionsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {coreSections.map(subj => {
                    const Icon = subj.icon;
                    const theme = subj.theme;
                    return (
                      <Link 
                        key={subj.name} 
                        href={`/subject/${subj.slug}`}
                        onPointerEnter={() => prefetchSubject(subj.name)}
                        onFocus={() => prefetchSubject(subj.name)}
                      >
                        <div className={`group h-full ${theme.bg} border ${theme.border} ${theme.hoverBorder} rounded-xl p-4 transition-all cursor-pointer flex items-center justify-between shadow-2xs hover:shadow-xs`}>
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.iconBg} ${theme.iconColor} shadow-2xs`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className={`font-semibold text-sm ${theme.titleColor}`}>
                                {subj.name}
                              </h3>
                              <p className={`text-xs ${theme.countColor} mt-0.5`}>
                                {subj.cardCount !== undefined ? `${subj.cardCount} resources` : "View notes"}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className={`h-4 w-4 ${theme.countColor} group-hover:translate-x-0.5 transition-transform shrink-0`} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* B. Languages and Other Subjects */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6d28d9] bg-[#f5f3ff] px-2.5 py-0.5 rounded border border-[#ede9fe]">
                  Languages & Other Subjects
                </span>
                <span className="text-xs text-[#64748b]">Literature, Grammars, Question Banks & Model Papers</span>
              </div>

              {sectionsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {languageSections.map(subj => {
                    const Icon = subj.icon;
                    const theme = subj.theme;
                    return (
                      <Link 
                        key={subj.name} 
                        href={`/subject/${subj.slug}`}
                        onPointerEnter={() => prefetchSubject(subj.name)}
                        onFocus={() => prefetchSubject(subj.name)}
                      >
                        <div className={`group h-full ${theme.bg} border ${theme.border} ${theme.hoverBorder} rounded-xl p-4 transition-all cursor-pointer flex items-center justify-between shadow-2xs hover:shadow-xs`}>
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.iconBg} ${theme.iconColor} shadow-2xs`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className={`font-semibold text-sm ${theme.titleColor}`}>
                                {subj.name}
                              </h3>
                              <p className={`text-xs ${theme.countColor} mt-0.5`}>
                                {subj.cardCount !== undefined ? `${subj.cardCount} resources` : "View notes"}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className={`h-4 w-4 ${theme.countColor} group-hover:translate-x-0.5 transition-transform shrink-0`} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* PART 2: Browse by Category */}
        {!submitted && (
          <section className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#112542] tracking-tight">Browse by Category</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd]">
                  Resource Types
                </span>
              </div>
              <p className="text-sm text-[#5a6b82] mt-0.5">Filter all study materials by format, exam type, or question bank</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORY_ITEMS.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link 
                    key={cat.slug} 
                    href={`/category/${cat.slug}`}
                    onPointerEnter={prefetchCategory}
                    onFocus={prefetchCategory}
                  >
                    <div className="group h-full bg-white border border-[#e2e8f0] hover:border-[#1856b8]/40 hover:bg-[#fafcff] rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-semibold text-[#0284c7] bg-[#f0f9ff] px-2 py-0.5 rounded border border-[#bae6fd]">
                            {cat.badge}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#112542] group-hover:text-[#1856b8] transition-colors">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-[#5a6b82] mt-1 leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="flex items-center justify-end pt-3 mt-3 border-t border-[#f1f5f9] text-xs font-semibold text-[#1856b8] group-hover:translate-x-0.5 transition-transform">
                        <span>Browse resources &rarr;</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Featured Resources */}
        {!submitted && Array.isArray(featuredCards) && featuredCards.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#112542] tracking-tight">
                Featured Resources
              </h2>
              <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-xs font-semibold px-2 py-0.5 rounded-md">
                Popular
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredCards.slice(0, 6).map((card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          </section>
        )}

        {/* Telegram Contact Banner */}
        <section className="bg-[#eaf2fd] border border-[#dce7f7] rounded-xl p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0284c7] shadow-2xs">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#112542] text-base">Need help or have questions?</h3>
                <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">Reach out on Telegram for quick support</p>
              </div>
            </div>
            <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="shrink-0 w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto gap-2 px-4 h-9 font-medium text-xs rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-none transition-colors">
                <MessageCircle className="h-3.5 w-3.5" />
                Contact on Telegram
              </Button>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
