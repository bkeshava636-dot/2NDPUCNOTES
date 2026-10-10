import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { useListCards, useListSections } from "@workspace/api-client-react";
import { CardItem } from "@/components/card-item";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  SlidersHorizontal,
  FileQuestion,
  HelpCircle,
  FlaskConical,
  History,
  CheckCircle2,
  BookMarked
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryMeta {
  title: string;
  dbType: string;
  description: string;
  icon: typeof FileText;
  officialSourceUrl?: string;
  isPracticalOnly?: boolean;
}

const CATEGORIES_CONFIG: Record<string, CategoryMeta> = {
  mqp: {
    title: "Model Question Papers (MQP)",
    dbType: "Model Question Papers (MQP)",
    description: "Official Karnataka Board model question papers and blueprint-based sample tests with answer keys.",
    icon: FileText,
    officialSourceUrl: "https://kseab.karnataka.gov.in/",
  },
  mcq: {
    title: "Multiple Choice Questions (MCQ)",
    dbType: "MCQ",
    description: "Chapterwise multiple choice questions, assertion-reasoning, and objective practice sets.",
    icon: HelpCircle,
  },
  "question-bank": {
    title: "Question Bank",
    dbType: "Question Bank",
    description: "Curated question banks, important derivations, repeated board questions, and model answers.",
    icon: BookMarked,
    officialSourceUrl: "https://kseab.karnataka.gov.in/",
  },
  practical: {
    title: "Practical (Lab Manuals & Schemes)",
    dbType: "Practical",
    description: "Practical marking schemes, lab manuals, viva questions, and procedural guides for Core Science subjects.",
    icon: FlaskConical,
    isPracticalOnly: true,
  },
  pyq: {
    title: "Previous Year Question Papers (PYQs)",
    dbType: "Previous Year Question Papers (PYQs)",
    description: "Past Karnataka 2nd PUC examination question papers categorized by Midterm, Preparatory, and Annual exams.",
    icon: History,
  },
  "passing-package": {
    title: "Passing Package",
    dbType: "Passing Package",
    description: "High-yield guaranteed scoring questions and simplified notes tailored for scoring passing and first-class marks.",
    icon: CheckCircle2,
  },
  "publication-books": {
    title: "Publication Books",
    dbType: "Publication Books",
    description: "Reference material, workbook guides, and renowned publisher study packages.",
    icon: BookMarked,
  },
};

const ALL_SUBJECTS = [
  "Physics",
  "Chemistry",
  "Computer Science",
  "Biology",
  "Mathematics",
  "English",
  "Hindi",
  "Kannada",
  "Sanskrit",
];

const PRACTICAL_CORE_SUBJECTS = [
  "Physics",
  "Chemistry",
  "Computer Science",
  "Biology",
];

const PRACTICAL_SUBTYPES = ["Scheme", "Resources", "Lab Manual", "Viva Questions"];
const PYQ_SUBTYPES = ["Midterm", "Preparatory", "Annual"];

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = (params.slug || "").toLowerCase();

  const meta = CATEGORIES_CONFIG[slug];

  const [activeSubject, setActiveSubject] = useState<string>("all");
  const [activeSubtype, setActiveSubtype] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  const { data: sections } = useListSections();

  // If category has officialSourceUrl in metadata or from sections matching
  const officialSourceUrl = meta?.officialSourceUrl;

  // Subjects to show for this category
  const subjectList = meta?.isPracticalOnly ? PRACTICAL_CORE_SUBJECTS : ALL_SUBJECTS;

  // Fetch all cards
  const { data: allCards, isLoading } = useListCards(
    activeSubject !== "all" ? { subject: activeSubject } : {},
    {
      query: {
        queryKey: ["category-cards", activeSubject],
      },
    }
  );

  const filteredCards = useMemo(() => {
    if (!allCards || !meta) return [];

    return allCards.filter((card) => {
      // 1. Check if card matches this category
      const cardType = (card.resourceType || "").toLowerCase();
      const targetType = meta.dbType.toLowerCase();

      let typeMatches = false;
      if (slug === "mqp") {
        typeMatches = cardType.includes("model") || cardType.includes("mqp");
      } else if (slug === "mcq") {
        typeMatches = cardType.includes("mcq") || cardType.includes("multiple choice");
      } else if (slug === "question-bank") {
        typeMatches = cardType.includes("question bank");
      } else if (slug === "practical") {
        typeMatches = cardType.includes("practical");
      } else if (slug === "pyq") {
        typeMatches =
          cardType.includes("previous") ||
          cardType.includes("pyq") ||
          cardType.includes("year");
      } else if (slug === "passing-package") {
        typeMatches = cardType.includes("passing");
      } else if (slug === "publication-books") {
        typeMatches = cardType.includes("publication") || cardType.includes("book");
      } else {
        typeMatches =
          cardType === targetType ||
          cardType.includes(targetType) ||
          targetType.includes(cardType);
      }

      if (!typeMatches) return false;

      // 2. Practical category strictly allows only practical subjects
      if (meta.isPracticalOnly && card.subject) {
        const isCore = PRACTICAL_CORE_SUBJECTS.some(
          (s) => s.toLowerCase() === card.subject!.toLowerCase()
        );
        if (!isCore) return false;
      }

      // 3. Subject filter
      if (activeSubject !== "all") {
        if (!card.subject || card.subject.toLowerCase() !== activeSubject.toLowerCase()) {
          return false;
        }
      }

      // 4. Subtype filter
      if (activeSubtype !== "all") {
        if (!card.subtype || card.subtype.toLowerCase() !== activeSubtype.toLowerCase()) {
          return false;
        }
      }

      // 5. Price filter
      if (priceFilter === "free" && !card.isFree) return false;
      if (priceFilter === "paid" && card.isFree) return false;

      return true;
    });
  }, [allCards, meta, slug, activeSubject, activeSubtype, priceFilter]);

  if (!meta) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mx-auto mb-4">
          <FileText className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Category not found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The requested resource category does not exist.
        </p>
        <Link href="/">
          <Button variant="default">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const Icon = meta.icon;
  const isPractical = slug === "practical";
  const isPyq = slug === "pyq";

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

      {/* Category Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 mb-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa]">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">
                  {meta.title}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-[#ebf3ff] text-[#1856b8] border-[#dce8fa] text-xs font-semibold px-2 py-0.5"
                >
                  Resource Category
                </Badge>
                <span className="text-xs font-medium text-[#64748b] bg-[#f0f4f9] px-2 py-0.5 rounded-md border border-[#e2e8f0]">
                  {filteredCards.length} {filteredCards.length === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="text-[#5a6b82] text-sm leading-relaxed max-w-2xl mt-1.5">
                {meta.description}
              </p>
            </div>
          </div>

          {officialSourceUrl && (
            <div className="shrink-0">
              <a
                href={officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284c7] bg-[#e0f2fe] hover:bg-[#bae6fd] border border-[#bae6fd] px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Official Government Source (KSEAB)</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Filter by Subject Toolbar */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filter by Subject</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSubject("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              activeSubject === "all"
                ? "bg-[#1856b8] text-white shadow-2xs"
                : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#f8fafc]"
            }`}
          >
            All Subjects
          </button>
          {subjectList.map((subj) => {
            const isSelected = activeSubject.toLowerCase() === subj.toLowerCase();
            return (
              <button
                key={subj}
                type="button"
                onClick={() => setActiveSubject(subj)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                  isSelected
                    ? "bg-[#1856b8] text-white shadow-2xs"
                    : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#f8fafc]"
                }`}
              >
                {subj}
              </button>
            );
          })}
        </div>

        {/* Subtype Filter Pills (Only for Practical or PYQ categories) */}
        {(isPractical || isPyq) && (
          <div className="bg-[#f0f7ff] border border-[#dce8fa] rounded-xl p-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#1856b8] mr-1">
              {isPractical ? "Practical Subtype:" : "Exam Category:"}
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
            {(isPractical ? PRACTICAL_SUBTYPES : PYQ_SUBTYPES).map((sub) => (
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
      {isLoading ? (
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
            No resources match the selected filters under {meta.title}. Try selecting a different
            subject or resetting filters.
          </p>
          {(activeSubject !== "all" || activeSubtype !== "all" || priceFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveSubject("all");
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
