import { useState } from "react";
import { Link } from "wouter";
import { useListSections, useGetStoreStats, useListCards } from "@workspace/api-client-react";
import { CardItem } from "@/components/card-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, MessageCircle, ArrowRight, Sparkles, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TELEGRAM_LINK } from "@/lib/site-config";

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

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary via-primary to-blue-700 text-white py-14 sm:py-20 px-4">
        {/* Subtle decorative background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-medium mb-5 shadow-xs">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Karnataka State Board</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            2PUC Notes Store
          </h1>

          <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Discover high-quality 2nd PUC Science notes and study materials, organized to help you prepare with confidence.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto flex items-center bg-white rounded-xl shadow-lg p-1.5 border border-white/20 focus-within:ring-2 focus-within:ring-white/40">
            <div className="pl-3 text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <Input
              className="bg-transparent text-gray-900 placeholder:text-gray-400 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-sm shadow-none"
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
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button type="submit" variant="default" size="sm" className="shrink-0 rounded-lg px-4 h-9 shadow-xs">
              Search
            </Button>
          </form>

          {/* Stats Badges */}
          {stats && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-md mx-auto mt-10 text-center">
              <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-extrabold text-white">{stats.totalResources}</div>
                <div className="text-xs sm:text-sm text-blue-200 mt-0.5 font-medium">Resources</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-extrabold text-white">{stats.freeResources}</div>
                <div className="text-xs sm:text-sm text-blue-200 mt-0.5 font-medium">Free</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-extrabold text-white">{stats.totalOrders}</div>
                <div className="text-xs sm:text-sm text-blue-200 mt-0.5 font-medium">Happy Students</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto w-full px-4 py-10 sm:py-12 flex flex-col gap-12 sm:gap-14">
        {/* Search Results */}
        {submitted && (
          <section className="scroll-mt-20">
            <div className="flex items-center justify-between mb-5 border-b border-gray-200/80 pb-3">
              <h2 className="text-xl font-bold text-gray-900">Results for "{submitted}"</h2>
              <Button variant="ghost" size="sm" onClick={handleClearSearch} className="text-primary hover:text-primary">
                Clear
              </Button>
            </div>
            {searchLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
              </div>
            ) : searchResults?.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200/80 rounded-2xl p-8">
                <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No results found. Try different keywords.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults?.map(card => <CardItem key={card.id} card={card} />)}
              </div>
            )}
          </section>
        )}

        {/* Featured */}
        {!submitted &&
          Array.isArray(featuredCards) &&
          featuredCards.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Featured Resources
                  </h2>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-semibold">
                    Popular
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredCards.slice(0, 6).map((card) => (
                  <CardItem key={card.id} card={card} />
                ))}
              </div>
            </section>
        )}

        {/* Sections / Categories */}
        {!submitted && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Browse by Category</h2>
                <p className="text-sm text-gray-500 mt-1">Explore curriculum-aligned notes by subject and topic</p>
              </div>
            </div>

            {sectionsLoading ? (
              <div className="grid grid-cols-1 gap-10">
                {[1, 2].map(i => <Skeleton key={i} className="h-72 rounded-2xl" />)}
              </div>
            ) : sections?.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200/80 rounded-2xl p-8">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-600">No sections yet. Check back soon!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-12">
                {sections?.map(section => (
                  <SectionPreview key={section.id} sectionId={section.id} sectionName={section.name} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Telegram Contact CTA */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/40 to-blue-50 border border-blue-100/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Need help or have questions?</h3>
                <p className="text-gray-500 text-sm mt-0.5">Reach out on Telegram for quick support</p>
              </div>
            </div>
            <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="shrink-0 w-full sm:w-auto">
              <Button className="w-full sm:w-auto gap-2 px-6 shadow-xs font-medium">
                <MessageCircle className="h-4 w-4" />
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

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;
  if (!cards || cards.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="font-bold text-lg sm:text-xl text-gray-900">{sectionName}</h3>
        <Link href={`/section/${sectionId}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary font-medium hover:bg-primary/5">
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

