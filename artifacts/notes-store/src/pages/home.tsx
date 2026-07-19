import { useState } from "react";
import { Link } from "wouter";
import { useListSections, useGetStoreStats, useListCards } from "@workspace/api-client-react";
import { CardItem } from "@/components/card-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Download, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TELEGRAM_LINK } from "@/lib/site-config";

const FAQ_ITEMS = [
  { q: "Are these notes suitable for Karnataka 2nd PUC Science?", a: "Yes, all notes are specifically designed for the Karnataka Board 2nd PUC Science curriculum, following the latest syllabus." },
  { q: "How do I download after purchasing?", a: "After a successful payment, you will be shown a download button immediately. You can also access your downloads anytime from 'My Purchases' using your phone number." },
  { q: "What subjects are available?", a: "We cover Physics, Chemistry, Mathematics, Biology, and Computer Science — all core 2nd PUC Science subjects." },
  { q: "Are there any free resources?", a: "Yes! We offer several free resources including formula sheets and sample papers. Look for the 'Free' badge on any card." },
  { q: "What formats are the notes in?", a: "All resources are provided as high-quality PDF files, optimized for both mobile and desktop viewing." },
  { q: "How do I contact support?", a: "You can reach us on Telegram for any questions, refunds, or issues. Click the 'Contact on Telegram' button." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left font-medium text-gray-900 hover:text-primary transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        {open ? <ChevronUp className="h-4 w-4 flex-shrink-0 ml-2" /> : <ChevronDown className="h-4 w-4 flex-shrink-0 ml-2" />}
      </button>
      {open && <p className="pb-4 text-gray-600 text-sm leading-relaxed">{a}</p>}
    </div>
  );
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

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="bg-primary text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-3xl font-bold">2PUC Notes Store</h1>
          </div>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Discover high-quality 2nd PUC Science notes and study materials, organized to help you prepare with confidence.
          </p>
          <form onSubmit={handleSearch} className="flex max-w-md mx-auto gap-2">
            <Input
              className="bg-white text-gray-900 placeholder:text-gray-400 border-0 h-11"
              placeholder="Search by subject, chapter, title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value.trim()) setSubmitted("");
              }}
            />
            <Button type="submit" variant="secondary" size="lg" className="shrink-0">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          {stats && (
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalResources}</div>
                <div className="text-primary-foreground/70">Resources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.freeResources}</div>
                <div className="text-primary-foreground/70">Free</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <div className="text-primary-foreground/70">Happy Students</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 py-8 flex flex-col gap-12">
        {/* Search Results */}
        {submitted && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Results for "{submitted}"</h2>
              <Button variant="ghost" size="sm" onClick={() => { setSubmitted(""); setSearch(""); }}>Clear</Button>
            </div>
            {searchLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
              </div>
            ) : searchResults?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No results found. Try different keywords.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          Featured Resources
        </h2>
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Popular
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredCards.slice(0, 6).map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </section>
)}

        {/* Sections */}
        {!submitted && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            {sectionsLoading ? (
              <div className="grid grid-cols-1 gap-8">
                {[1, 2].map(i => <Skeleton key={i} className="h-64" />)}
              </div>
            ) : sections?.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No sections yet. Check back soon!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {sections?.map(section => (
                  <SectionPreview key={section.id} sectionId={section.id} sectionName={section.name} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Contact */}
        <section className="flex flex-col items-center gap-4 py-6 border rounded-xl bg-blue-50/50 border-blue-100">
          <MessageCircle className="h-8 w-8 text-primary" />
          <div className="text-center">
            <h3 className="font-bold text-gray-900 text-lg">Need help or have questions?</h3>
            <p className="text-gray-500 text-sm mt-1">Reach out on Telegram for quick support</p>
          </div>
          <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer">
            <Button className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact on Telegram
            </Button>
          </a>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="bg-white rounded-xl border border-gray-200 px-4">
            {FAQ_ITEMS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
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
  if (isLoading) return <Skeleton className="h-48" />;
  if (!cards || cards.length === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-gray-900">{sectionName}</h3>
        <Link href={`/section/${sectionId}`}>
          <Button variant="ghost" size="sm" className="text-primary">View all ({cards.length})</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.slice(0, 3).map(card => <CardItem key={card.id} card={card} />)}
      </div>
    </div>
  );
}
