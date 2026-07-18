import { useState } from "react";
import { useParams, Link } from "wouter";
import { useListSections, useListSectionCards, useListResourceTypes } from "@workspace/api-client-react";
import { CardItem } from "@/components/card-item";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SectionPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: sections } = useListSections();
  const { data: cards, isLoading } = useListSectionCards(id, { query: { enabled: !!id, queryKey: ["section-cards", id] } });
  const { data: resourceTypes } = useListResourceTypes();

  const section = sections?.find(s => s.id === id);

  const filtered = cards?.filter(card => {
    if (priceFilter === "free" && !card.isFree) return false;
    if (priceFilter === "paid" && card.isFree) return false;
    if (typeFilter !== "all" && card.resourceType !== typeFilter) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{section?.name ?? "Section"}</h1>
        {section?.description && <p className="text-gray-500 mt-1">{section.description}</p>}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={priceFilter} onValueChange={v => setPriceFilter(v as "all" | "free" | "paid")}>
          <SelectTrigger className="w-36 bg-white">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Resource Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {resourceTypes?.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        {(priceFilter !== "all" || typeFilter !== "all") && (
          <Button variant="ghost" size="sm" onClick={() => { setPriceFilter("all"); setTypeFilter("all"); }}>
            Clear Filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No resources match the current filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map(card => <CardItem key={card.id} card={card} />)}
        </div>
      )}
    </div>
  );
}
