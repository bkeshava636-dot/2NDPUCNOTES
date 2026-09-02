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
        href: `/section/${s.id}`,
        cardCount: (s as any).cardCount,
      }))
    : CORE_SUBJECTS.map(subj => {
        const matchingSection = sections?.find(s => s.name.toLowerCase().includes(subj.name.toLowerCase()));
        return {
          name: subj.name,
          icon: subj.icon,
          href: matchingSection ? `/section/${matchingSection.id}` : "#",
          cardCount: matchingSection ? (matchingSection as any).cardCount : undefined,
        };
      });

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="bg-slate-50/70 border-b border-gray-200/80 py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-primary text-xs font-semibold mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Karnataka State Board</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            2PUC Notes Store
          </h1>

          {/* Tagline */}
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6">
            Discover high-quality 2nd PUC Science notes and study materials, organized to help you prepare with confidence.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="relative max-w-lg mx-auto flex items-center bg-white rounded-lg border border-gray-300 p-1 shadow-2xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all"
          >
            <div className="pl-3 text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <Input
              className="bg-transparent text-gray-900 placeholder:text-gray-400 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 text-sm shadow-none"
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
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors mr-1"
                aria-label="Clear search text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button type="submit" size="sm" className="shrink-0 rounded-md px-4 h-8 text-xs font-medium">
              Search
            </Button>
          </form>

          {/* Understated Stats Row */}
          {stats && (
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 pt-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-900 text-xs sm:text-sm">{stats.totalResources}</span>
                <span>Resources</span>
              </div>
              <span className="text-gray-300 hidden sm:inline">&bull;</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-900 text-xs sm:text-sm">{stats.freeResources}</span>
                <span>Free</span>
              </div>
              <span className="text-gray-300 hidden sm:inline">&bull;</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-900 text-xs sm:text-sm">{stats.totalOrders}</span>
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
            <div className="flex items-center justify-between mb-5 border-b border-gray-200 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Results for "{submitted}"</h2>
              <Button variant="ghost" size="sm" onClick={handleClearSearch} className="text-primary hover:text-primary text-xs">
                Clear
              </Button>
            </div>
            {searchLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
              </div>
            ) : searchResults?.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/60 border border-gray-200 rounded-xl p-8">
                <BookOpen className="h-9 w-9 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 font-medium text-sm">No results found. Try different keywords.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults?.map(card => <CardItem key={card.id} card={card} />)}
              </div>
            )}
          </section>
        )}

        {/* Browse by Category */}
        {!submitted && (
          <section>
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Browse by Category</h2>
              <p className="text-sm text-gray-500 mt-0.5">Explore curriculum-aligned notes by subject and topic</p>
            </div>

            {sectionsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-10">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-10">
                {categoryCards.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <Link key={cat.name} href={cat.href}>
                      <div className="group h-full bg-white border border-gray-200 rounded-xl p-4 hover:border-primary/50 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary border border-blue-100 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">
                              {cat.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {cat.cardCount !== undefined ? `${cat.cardCount} notes` : "View notes"}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
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
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Featured Resources
                </h2>
                <Badge className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold shadow-none">
                  Popular
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredCards.slice(0, 6).map((card) => (
                  <CardItem key={card.id} card={card} />
                ))}
              </div>
            </section>
        )}

        {/* Telegram Contact Card */}
        <section className="bg-slate-50 border border-gray-200 rounded-xl p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary border border-blue-100">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Need help or have questions?</h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Reach out on Telegram for quick support</p>
              </div>
            </div>
            <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="shrink-0 w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto gap-2 px-4 h-9 font-medium text-xs rounded-lg">
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
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="font-bold text-base sm:text-lg text-gray-900">{sectionName}</h3>
        <Link href={`/section/${sectionId}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary font-medium text-xs hover:bg-blue-50/50">
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


