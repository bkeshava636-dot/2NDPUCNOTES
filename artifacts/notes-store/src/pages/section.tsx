import { useState } from "react";
import { useParams, Link } from "wouter";
import { useListSections, useListSectionCards, useListResourceTypes } from "@workspace/api-client-react";
import { CardItem } from "@/components/card-item";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, SlidersHorizontal, RotateCcw } from "lucide-react";
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

  const hasActiveFilters = priceFilter !== "all" || typeFilter !== "all";

  function handleResetFilters() {
    setPriceFilter("all");
    setTypeFilter("all");
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 sm:py-10">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900 -ml-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </Link>

        {/* Section Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-7 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-primary border border-blue-100">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  {section?.name ?? "Section"}
                </h1>
                {cards && (
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                    {cards.length} {cards.length === 1 ? "resource" : "resources"}
                  </span>
                )}
              </div>
              {section?.description && (
                <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mt-1">
                  {section.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 mb-8 bg-slate-50 border border-gray-200 rounded-xl p-3 sm:px-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Select value={priceFilter} onValueChange={v => setPriceFilter(v as "all" | "free" | "paid")}>
            <SelectTrigger className="w-full sm:w-36 bg-gray-50/50 border-gray-200 text-sm h-9">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44 bg-gray-50/50 border-gray-200 text-sm h-9">
              <SelectValue placeholder="Resource Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {resourceTypes?.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="gap-1.5 text-xs text-gray-500 hover:text-gray-900 h-9"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Resource Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200/80 rounded-2xl p-8">
          <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No resources match the current filters.</p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4 gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered?.map(card => <CardItem key={card.id} card={card} />)}
        </div>
      )}
    </div>
  );
}

