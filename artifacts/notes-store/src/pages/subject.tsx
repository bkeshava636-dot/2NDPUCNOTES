import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { useListSections, useListCards } from "@workspace/api-client-react";
import { CardItem } from "@/components/card-item";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  BookA,
  Scroll,
  GraduationCap,
  Languages,
  Laptop,
  CheckCircle2,
  ExternalLink,
  SlidersHorizontal,
  FileQuestion,
  Layers
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Core subjects supporting Practical
const CORE_SUBJECT_NAMES = ["Physics", "Chemistry", "Computer Science", "Biology"];

// Core resource types
const CORE_RESOURCE_TYPES = [
  "Notes",
  "Model Question Papers (MQP)",
  "MCQ",
  "Question Bank",
  "Practical",
  "Previous Year Question Papers (PYQs)",
  "Passing Package",
  "Publication Books",
];

// Language & other subjects resource types (strictly NO Practical)
const LANGUAGE_RESOURCE_TYPES = [
  "Notes",
  "Model Question Papers (MQP)",
  "Question Bank",
  "Previous Year Question Papers (PYQs)",
  "Passing Package",
  "Publication Books",
  "MCQ",
];

const PRACTICAL_SUBTYPES = ["Scheme", "Resources", "Lab Manual", "Viva Questions"];
const PYQ_SUBTYPES = ["Midterm", "Preparatory", "Annual"];

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

export default function SubjectPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug?.toLowerCase() || "";

  const [activeType, setActiveType] = useState<string>("all");
  const [activeSubtype, setActiveSubtype] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  const { data: sections, isLoading: sectionsLoading } = useListSections();

  const section = useMemo(() => {
    if (!sections) return undefined;
    return (
      sections.find((s) => s.slug.toLowerCase() === slug) ||
      sections.find((s) => String(s.id) === slug) ||
      sections.find((s) => s.name.toLowerCase().replace(/\s+/g, "-") === slug)
    );
  }, [sections, slug]);

  const subjectName = section?.name || "";
  const isCoreSubject = CORE_SUBJECT_NAMES.some(
    (c) => c.toLowerCase() === subjectName.toLowerCase()
  );

  const supportedTypes = isCoreSubject ? CORE_RESOURCE_TYPES : LANGUAGE_RESOURCE_TYPES;

  // Query cards for this subject / section
  const { data: cards, isLoading: cardsLoading } = useListCards(
    section ? { sectionId: section.id } : { subject: subjectName || undefined },
    {
      query: {
        enabled: Boolean(section?.id || subjectName),
        queryKey: ["subject-cards", section?.id || subjectName],
      },
    }
  );

  // Filter cards by active type, active subtype, and price
  const filteredCards = useMemo(() => {
    if (!cards) return [];
    return cards.filter((card) => {
      // Type matching (flexible to match "Model Question Papers" with "(MQP)" or without)
      if (activeType !== "all") {
        const cardType = card.resourceType?.toLowerCase() || "";
        const targetType = activeType.toLowerCase();

        const matchMqp =
          targetType.includes("model question") &&
          (cardType.includes("model") || cardType.includes("mqp"));
        const matchPyq =
          targetType.includes("previous year") &&
          (cardType.includes("previous") || cardType.includes("pyq"));
        const matchDirect =
          cardType === targetType ||
          cardType.includes(targetType) ||
          targetType.includes(cardType);

        if (!matchMqp && !matchPyq && !matchDirect) {
          return false;
        }
      }

      // Subtype matching (for Practical and PYQ)
      if (activeSubtype !== "all") {
        if (!card.subtype || card.subtype.toLowerCase() !== activeSubtype.toLowerCase()) {
          return false;
        }
      }

      // Price filter
      if (priceFilter === "free" && !card.isFree) return false;
      if (priceFilter === "paid" && card.isFree) return false;

      return true;
    });
  }, [cards, activeType, activeSubtype, priceFilter]);

  const Icon = getSubjectIcon(subjectName);

  if (sectionsLoading) {
    return (
      <div className="max-w-6xl mx-auto w-full px-4 py-8 sm:py-10 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mx-auto mb-4">
          <BookOpen className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Subject not found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The requested subject does not exist or may have been renamed.
        </p>
        <Link href="/">
          <Button variant="default">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const isPracticalActive = activeType.toLowerCase().includes("practical");
  const isPyqActive =
    activeType.toLowerCase().includes("previous") ||
    activeType.toLowerCase().includes("pyq");

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 sm:py-10">
      {/* Back button */}
      <Link href="/">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-[#5a6b82] hover:text-[#112542] -ml-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </Link>

      {/* Header Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 mb-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa]">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">
                  {section.name}
                </h1>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold px-2 py-0.5 ${
                    isCoreSubject
                      ? "bg-[#ebf3ff] text-[#1856b8] border-[#dce8fa]"
                      : "bg-[#f5f3ff] text-[#6d28d9] border-[#ede9fe]"
                  }`}
                >
                  {isCoreSubject ? "Core Subject" : "Language & Other Subject"}
                </Badge>
                {cards && (
                  <span className="text-xs font-medium text-[#64748b] bg-[#f0f4f9] px-2 py-0.5 rounded-md border border-[#e2e8f0]">
                    {cards.length} {cards.length === 1 ? "resource" : "resources"}
                  </span>
                )}
              </div>
              <p className="text-[#5a6b82] text-sm leading-relaxed max-w-2xl mt-1.5">
                {section.description ||
                  `Explore curriculum-aligned 2nd PUC ${section.name} study materials, notes, and question papers.`}
              </p>
            </div>
          </div>

          {section.officialSourceUrl && (
            <div className="shrink-0">
              <a
                href={section.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284c7] bg-[#e0f2fe] hover:bg-[#bae6fd] border border-[#bae6fd] px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Official Source</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Resource Type Tabs */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5" />
          <span>Resource Types</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setActiveType("all");
              setActiveSubtype("all");
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              activeType === "all"
                ? "bg-[#1856b8] text-white shadow-2xs"
                : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#f8fafc]"
            }`}
          >
            All Resources
          </button>
          {supportedTypes.map((type) => {
            const isSelected = activeType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setActiveType(type);
                  setActiveSubtype("all");
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                  isSelected
                    ? "bg-[#1856b8] text-white shadow-2xs"
                    : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#f8fafc]"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Subtype Filter Pills (Only when Practical or PYQs is active) */}
        {(isPracticalActive || isPyqActive) && (
          <div className="bg-[#f0f7ff] border border-[#dce8fa] rounded-xl p-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#1856b8] mr-1">
              {isPracticalActive ? "Practical Subtypes:" : "Exam Category:"}
            </span>
            <button
              type="button"
              onClick={() => setActiveSubtype("all")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeSubtype === "all"
                  ? "bg-[#1856b8] text-white"
                  : "bg-white text-[#1856b8] border border-[#bae6fd] hover:bg-[#e0f2fe]"
              }`}
            >
              All
            </button>
            {(isPracticalActive ? PRACTICAL_SUBTYPES : PYQ_SUBTYPES).map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setActiveSubtype(sub)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeSubtype.toLowerCase() === sub.toLowerCase()
                    ? "bg-[#1856b8] text-white"
                    : "bg-white text-[#1856b8] border border-[#bae6fd] hover:bg-[#e0f2fe]"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#5a6b82] font-medium">Price:</span>
          <button
            type="button"
            onClick={() => setPriceFilter("all")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              priceFilter === "all"
                ? "bg-[#112542] text-white"
                : "text-[#64748b] hover:bg-[#f1f5f9]"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setPriceFilter("free")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              priceFilter === "free"
                ? "bg-[#16a34a] text-white"
                : "text-[#64748b] hover:bg-[#f1f5f9]"
            }`}
          >
            Free
          </button>
          <button
            type="button"
            onClick={() => setPriceFilter("paid")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              priceFilter === "paid"
                ? "bg-[#2f74de] text-white"
                : "text-[#64748b] hover:bg-[#f1f5f9]"
            }`}
          >
            Paid
          </button>
        </div>

        <span className="text-xs text-[#64748b]">
          Showing {filteredCards.length} {filteredCards.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Cards Grid */}
      {cardsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center">
          <FileQuestion className="h-10 w-10 text-[#94a3b8] mx-auto mb-3" />
          <h3 className="font-bold text-base text-[#112542] mb-1">No resources found</h3>
          <p className="text-xs sm:text-sm text-[#5a6b82] max-w-sm mx-auto">
            {activeType !== "all" || activeSubtype !== "all" || priceFilter !== "all"
              ? "No resources match the selected filters. Try choosing a different tab or resetting filters."
              : `Notes for ${section.name} will be uploaded soon. Check back shortly!`}
          </p>
          {(activeType !== "all" || activeSubtype !== "all" || priceFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveType("all");
                setActiveSubtype("all");
                setPriceFilter("all");
              }}
              className="mt-4 text-xs h-8"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
