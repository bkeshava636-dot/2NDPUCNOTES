import { useState } from "react";
import { Link } from "wouter";
import { useListSections, useGetStoreStats, useListCards } from "@workspace/api-client-react";
import { CardItem } from "@/components/card-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  MessageCircle,
  ArrowRight,
  Sparkles,
  X,
  Atom,
  FlaskConical,
  Calculator,
  Dna
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TELEGRAM_LINK } from "@/lib/site-config";

const CORE_SUBJECTS = [
  { name: "Physics", icon: Atom },
  { name: "Chemistry", icon: FlaskConical },
  { name: "Mathematics", icon: Calculator },
  { name: "Biology", icon: Dna },
];

function getSubjectIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("phys")) return Atom;
  if (lower.includes("chem")) return FlaskConical;
  if (lower.includes("math")) return Calculator;
  if (lower.includes("bio")) return Dna;
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
  math: {
    bg: "bg-[#eaf5ec]",
    border: "border-[#d7ecdc]",
    hoverBorder: "hover:border-[#b8e0c1]",
    iconBg: "bg-white",
    iconColor: "text-[#197d3b]",
    titleColor: "text-[#167035]",
    countColor: "text-[#588366]",
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
};

function getSubjectTheme(name: string): SubjectTheme {
  const lower = name.toLowerCase();
  if (lower.includes("phys")) return SUBJECT_THEMES.physics;
  if (lower.includes("chem")) return SUBJECT_THEMES.chemistry;
  if (lower.includes("math")) return SUBJECT_THEMES.math;
  if (lower.includes("bio")) return SUBJECT_THEMES.biology;
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

export default function Home() {
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState("");
  const { data: sections, isLoading: sectionsLoading } = useListSections();
  const { data: stats } = useGetStoreStats();
  const { data: searchResults, isLoading: searchLoading } = useListCards(
    submitted ? { search: submitted } : undefined,
    { query: { enabled: !!submitted, queryKey: ["cards-search", submitted] } }
  );
  const featuredQuery = useListCards(
    { featured: true },
    { query: { enabled: !submitted, queryKey: ["cards-featured"] } }
  );

  const featuredCards = featuredQuery.data;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(search.trim());
  }

  function handleClearSearch() {
    setSearch("");
    setSubmitted("");
  }

  // Build category cards: use backend sections if available, or fallback to CORE_SUBJECTS
  const categoryCards = sections && sections.length > 0
    ? sections.map(s => ({
        name: s.name,
        icon: getSubjectIcon(s.name),
        theme: getSubjectTheme(s.name),
        href: `/section/${s.id}`,
        cardCount: (s as any).cardCount,
      }))
    : CORE_SUBJECTS.map(subj => {
        const matchingSection = sections?.find(s => s.name.toLowerCase().includes(subj.name.toLowerCase()));
        return {
          name: subj.name,
          icon: subj.icon,
          theme: getSubjectTheme(subj.name),
          href: matchingSection ? `/section/${matchingSection.id}` : "#",
          cardCount: matchingSection ? (matchingSection as any).cardCount : undefined,
        };
      });

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section with soft ambient glow */}
      <section className="bg-gradient-to-b from-[#f2f7fd] via-[#f8fbff] to-white border-b border-[#e8eff7] py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebf3ff] border border-[#dce8fa] text-[#1856b8] text-xs font-semibold mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Karnataka State Board</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#112542] tracking-tight mb-3">
            2PUC Notes Store
          </h1>

          {/* Tagline */}
          <p className="text-[#5a6b82] text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6">
            Discover high-quality 2nd PUC Science notes and study materials, organized to help you prepare with confidence.
          </p>

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

          {/* Understated Stats Row */}
          {stats && (
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 pt-6 text-xs text-[#5a6b82]">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#112542] text-xs sm:text-sm">{stats.totalResources}</span>
                <span>Resources</span>
              </div>
              <span className="text-[#cbd5e1] hidden sm:inline">&bull;</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#112542] text-xs sm:text-sm">{stats.freeResources}</span>
                <span>Free</span>
              </div>
              <span className="text-[#cbd5e1] hidden sm:inline">&bull;</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#112542] text-xs sm:text-sm">{stats.totalOrders}</span>
                <span>Happy Students</span>
              </div>
            </div>
          )}
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

        {/* Browse by Category (Using Stitch subject cards color palette) */}
        {!submitted && (
          <section>
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#112542] tracking-tight">Browse by Category</h2>
              <p className="text-sm text-[#5a6b82] mt-0.5">Explore curriculum-aligned notes by subject and topic</p>
            </div>

            {sectionsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-10">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-10">
                {categoryCards.map(cat => {
                  const Icon = cat.icon;
                  const theme = cat.theme;
                  return (
                    <Link key={cat.name} href={cat.href}>
                      <div className={`group h-full ${theme.bg} border ${theme.border} ${theme.hoverBorder} rounded-xl p-4 transition-all cursor-pointer flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.iconBg} ${theme.iconColor} shadow-2xs`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className={`font-semibold text-sm ${theme.titleColor}`}>
                              {cat.name}
                            </h3>
                            <p className={`text-xs ${theme.countColor} mt-0.5`}>
                              {cat.cardCount !== undefined ? `${cat.cardCount} notes` : "View notes"}
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

            {/* Section notes previews */}
            {sections && sections.length > 0 && (
              <div className="flex flex-col gap-10">
                {sections.map(section => (
                  <SectionPreview key={section.id} sectionId={section.id} sectionName={section.name} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Featured */}
        {!submitted &&
          Array.isArray(featuredCards) &&
          featuredCards.length > 0 && (
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

        {/* Telegram Contact Card (Stitch soft sky blue banner) */}
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

function SectionPreview({ sectionId, sectionName }: { sectionId: number; sectionName: string }) {
  const { data: cards, isLoading } = useListCards(
    { sectionId },
    { query: { queryKey: ["section-preview", sectionId] } }
  );

  if (isLoading) return <Skeleton className="h-60 rounded-xl" />;
  if (!cards || cards.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#eef2f6] pb-2">
        <h3 className="font-bold text-base sm:text-lg text-[#112542]">{sectionName}</h3>
        <Link href={`/section/${sectionId}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-[#1856b8] hover:text-[#0b57d0] font-medium text-xs hover:bg-[#ebf3ff]">
            <span>View all ({cards.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.slice(0, 3).map(card => <CardItem key={card.id} card={card} />)}
      </div>
    </div>
  );
}


