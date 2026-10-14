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
  Layers,
  Calendar
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/language-context";
import { getSubjectDisplayName, getResourceTypeDisplayName } from "@/lib/site-navigation";

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

function getSubtypeDisplayName(sub: string, isKn: boolean) {
  if (!isKn) return sub;
  const lower = sub.toLowerCase();
  if (lower === "scheme") return "ಅಂಕ ಯೋಜನೆ (Scheme)";
  if (lower === "resources") return "ಸಂಪನ್ಮೂಲಗಳು (Resources)";
  if (lower === "lab manual") return "ಲ್ಯಾಬ್ ಮ್ಯಾನ್ಯುಯಲ್";
  if (lower === "viva questions") return "ವೈವಾ ಪ್ರಶ್ನೆಗಳು (Viva)";
  if (lower === "midterm") return "ಮಧ್ಯವಾರ್ಷಿಕ (Midterm)";
  if (lower === "preparatory") return "ಸಿದ್ಧತಾ (Preparatory)";
  if (lower === "annual") return "ವಾರ್ಷಿಕ (Annual)";
  return sub;
}

const SLUG_TO_NAME: Record<string, string> = {
  physics: "Physics",
  chemistry: "Chemistry",
  "computer-science": "Computer Science",
  biology: "Biology",
  mathematics: "Mathematics",
  kannada: "Kannada",
  english: "English",
  hindi: "Hindi",
  sanskrit: "Sanskrit",
};

export default function SubjectPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug?.toLowerCase() || "";
  const { language, t } = useLanguage();
  const isKn = language === "kn";

  const [activeType, setActiveType] = useState<string>("all");
  const [activeSubtype, setActiveSubtype] = useState<string>("all");
  const [activeYear, setActiveYear] = useState<string>("all");
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

  const subjectName =
    section?.name ||
    SLUG_TO_NAME[slug] ||
    (slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "");

  const isCoreSubject = CORE_SUBJECT_NAMES.some(
    (c) => c.toLowerCase() === subjectName.toLowerCase()
  );

  const supportedTypes = isCoreSubject ? CORE_RESOURCE_TYPES : LANGUAGE_RESOURCE_TYPES;

  // Query cards for this subject immediately in parallel with zero waterfall!
  const { data: cards, isLoading: cardsLoading } = useListCards(
    { subject: subjectName || undefined },
    {
      query: {
        enabled: Boolean(subjectName),
        queryKey: ["subject-cards", subjectName],
        placeholderData: (prev) => prev,
      },
    }
  );

  const isPracticalActive = activeType.toLowerCase().includes("practical");
  const isPyqActive =
    activeType.toLowerCase().includes("previous") ||
    activeType.toLowerCase().includes("pyq");

  // Extract years from cards for PYQs
  const availableYears = useMemo(() => {
    if (!isPyqActive) return [];
    const yearSet = new Set<string>();
    if (cards) {
      cards.forEach((card) => {
        const text = `${card.title || ""} ${card.semester || ""} ${card.chapter || ""} ${card.subtype || ""}`;
        const matches = text.match(/\b(20[12]\d)\b/g);
        if (matches) {
          matches.forEach((y) => yearSet.add(y));
        }
      });
    }
    const defaultYears = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
    defaultYears.forEach((y) => yearSet.add(y));
    return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
  }, [cards, isPyqActive]);

  // Filter cards by active type, active subtype, active year, and price
  const filteredCards = useMemo(() => {
    if (!cards) return [];
    return cards.filter((card) => {
      // Type matching (flexible to match "Model Question Papers" with "(MQP)" or without, checking primary and additionalCategories)
      if (activeType !== "all") {
        const allTypes = [
          card.resourceType || "",
          ...(Array.isArray((card as any).additionalCategories) ? (card as any).additionalCategories : []),
        ].map((t) => String(t).toLowerCase());

        const targetType = activeType.toLowerCase();

        const typeMatches = allTypes.some((cardType) => {
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
          return matchMqp || matchPyq || matchDirect;
        });

        if (!typeMatches) {
          return false;
        }
      }

      // Subtype matching (for Practical and PYQ)
      if (activeSubtype !== "all") {
        if (!card.subtype || card.subtype.toLowerCase() !== activeSubtype.toLowerCase()) {
          return false;
        }
      }

      // Year matching (for PYQ)
      if (isPyqActive && activeYear !== "all") {
        const text = `${card.title || ""} ${card.semester || ""} ${card.chapter || ""} ${card.subtype || ""} ${card.description || ""}`.toLowerCase();
        if (!text.includes(activeYear.toLowerCase())) {
          return false;
        }
      }

      // Price filter
      if (priceFilter === "free" && !card.isFree) return false;
      if (priceFilter === "paid" && card.isFree) return false;

      return true;
    });
  }, [cards, activeType, activeSubtype, activeYear, isPyqActive, priceFilter]);

  const Icon = getSubjectIcon(subjectName);

  if (sectionsLoading && !section && !SLUG_TO_NAME[slug]) {
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

  if (!section && !SLUG_TO_NAME[slug] && !sectionsLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mx-auto mb-4">
          <BookOpen className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t("Subject not found", "ವಿಷಯ ಕಂಡುಬಂದಿಲ್ಲ")}</h2>
        <p className="text-sm text-gray-500 mb-6">
          {t("The requested subject does not exist or may have been renamed.", "ಕೋರಿದ ವಿಷಯ ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ಹೆಸರು ಬದಲಾಗಿರಬಹುದು.")}
        </p>
        <Link href="/">
          <Button variant="default">{t("Back to Home", "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ")}</Button>
        </Link>
      </div>
    );
  }

  const displayName = getSubjectDisplayName(section?.name || subjectName, isKn);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 sm:py-10">
      {/* Back button */}
      <Link href="/">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-[#475569] hover:text-[#0f172a] -ml-2 mb-4 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("Back to Home", "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ")}</span>
        </Button>
      </Link>

      {/* Header Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-7 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] text-[#2563eb] border border-[#bfdbfe]/80 shadow-2xs">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
                  {displayName}
                </h1>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    isCoreSubject
                      ? "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]"
                      : "bg-[#f5f3ff] text-[#6d28d9] border-[#ede9fe]"
                  }`}
                >
                  {isCoreSubject ? t("Core Subject", "ಪ್ರಮುಖ ವಿಜ್ಞಾನ ವಿಷಯ") : t("Language & Other Subject", "ಭಾಷಾ ವಿಷಯ")}
                </Badge>
                {cards && (
                  <span className="text-xs font-medium text-[#64748b] bg-[#f8fafc] px-2.5 py-0.5 rounded-full border border-[#e2e8f0]">
                    {cards.length} {cards.length === 1 ? t("resource", "ಸಂಪನ್ಮೂಲ") : t("resources", "ಸಂಪನ್ಮೂಲಗಳು")}
                  </span>
                )}
              </div>
              <p className="text-[#64748b] text-xs sm:text-sm leading-relaxed max-w-2xl mt-1.5 font-normal">
                {section?.description ||
                  t(
                    `Curriculum-aligned 2nd PUC ${section?.name || subjectName} notes, blueprint question papers, and study resources.`,
                    `ಪಠ್ಯಕ್ರಮ ಆಧಾರಿತ 2nd PUC ${displayName} ನೋಟ್ಸ್, ಬ್ಲೂಪ್ರಿಂಟ್ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು ಮತ್ತು ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು.`
                  )}
              </p>
            </div>
          </div>

          {section?.officialSourceUrl && (
            <div className="shrink-0">
              <a
                href={section.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284c7] bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#bae6fd] px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
              >
                <span>{t("Official Source", "ಅಧಿಕೃತ ಮೂಲ")}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Resource Type Tabs */}
      <div className="space-y-3.5 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#475569] uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5 text-[#2563eb]" />
          <span>{t("Resource Types", "ಸಂಪನ್ಮೂಲ ಪ್ರಕಾರಗಳು")}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setActiveType("all");
              setActiveSubtype("all");
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeType === "all"
                ? "bg-[#2563eb] text-white shadow-2xs"
                : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1]"
            }`}
          >
            {t("All Resources", "ಎಲ್ಲ ಸಂಪನ್ಮೂಲಗಳು")}
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
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#2563eb] text-white shadow-2xs"
                    : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1]"
                }`}
              >
                {getResourceTypeDisplayName(type, isKn)}
              </button>
            );
          })}
        </div>

        {/* Subtype Filter Pills (Only when Practical or PYQs is active) */}
        {(isPracticalActive || isPyqActive) && (
          <div className="bg-[#eff6ff]/70 border border-[#bfdbfe]/80 rounded-xl p-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#2563eb] mr-1">
              {isPracticalActive ? t("Practical Subtypes:", "ಪ್ರಾಯೋಗಿಕ ಉಪವಿಭಾಗಗಳು:") : t("Exam Category:", "ಪರೀಕ್ಷಾ ವರ್ಗ:")}
            </span>
            <button
              type="button"
              onClick={() => setActiveSubtype("all")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                activeSubtype === "all"
                  ? "bg-[#2563eb] text-white shadow-2xs"
                  : "bg-white text-[#2563eb] border border-[#bfdbfe] hover:bg-[#dbeafe]"
              }`}
            >
              {t("All", "ಎಲ್ಲ")}
            </button>
            {(isPracticalActive ? PRACTICAL_SUBTYPES : PYQ_SUBTYPES).map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setActiveSubtype(sub)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeSubtype.toLowerCase() === sub.toLowerCase()
                    ? "bg-[#2563eb] text-white shadow-2xs"
                    : "bg-white text-[#2563eb] border border-[#bfdbfe] hover:bg-[#dbeafe]"
                }`}
              >
                {getSubtypeDisplayName(sub, isKn)}
              </button>
            ))}
          </div>
        )}

        {/* Year-Wise Filter Pills (Only when PYQs is active) */}
        {isPyqActive && (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 mr-1 text-[#15803d]">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs font-bold">{t("Exam Year:", "ಪರೀಕ್ಷೆಯ ವರ್ಷ:")}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveYear("all")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                activeYear === "all"
                  ? "bg-[#16a34a] text-white shadow-2xs"
                  : "bg-white text-[#15803d] border border-[#86efac] hover:bg-[#dcfce7]"
              }`}
            >
              {t("All Years", "ಎಲ್ಲ ವರ್ಷಗಳು")}
            </button>
            {availableYears.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setActiveYear(yr)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeYear === yr
                    ? "bg-[#16a34a] text-white shadow-2xs"
                    : "bg-white text-[#15803d] border border-[#86efac] hover:bg-[#dcfce7]"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6 bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748b] font-medium">{t("Price:", "ಬೆಲೆ:")}</span>
          <button
            type="button"
            onClick={() => setPriceFilter("all")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              priceFilter === "all"
                ? "bg-[#0f172a] text-white shadow-2xs"
                : "text-[#64748b] hover:bg-[#e2e8f0]/60"
            }`}
          >
            {t("All", "ಎಲ್ಲ")}
          </button>
          <button
            type="button"
            onClick={() => setPriceFilter("free")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              priceFilter === "free"
                ? "bg-[#16a34a] text-white shadow-2xs"
                : "text-[#64748b] hover:bg-[#e2e8f0]/60"
            }`}
          >
            {t("Free", "ಉಚಿತ")}
          </button>
          <button
            type="button"
            onClick={() => setPriceFilter("paid")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              priceFilter === "paid"
                ? "bg-[#2563eb] text-white shadow-2xs"
                : "text-[#64748b] hover:bg-[#e2e8f0]/60"
            }`}
          >
            {t("Paid", "ಪಾವತಿಸಿದ")}
          </button>
        </div>

        <span className="text-xs text-[#64748b] font-medium">
          {t("Showing", "ತೋರಿಸಲಾಗುತ್ತಿದೆ")} {filteredCards.length} {filteredCards.length === 1 ? t("item", "ಐಟಂ") : t("items", "ಐಟಂಗಳು")}
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
          <h3 className="font-bold text-base text-[#112542] mb-1">{t("No resources found", "ಯಾವುದೇ ಸಂಪನ್ಮೂಲ ಕಂಡುಬಂದಿಲ್ಲ")}</h3>
          <p className="text-xs sm:text-sm text-[#5a6b82] max-w-sm mx-auto">
            {activeType !== "all" || activeSubtype !== "all" || priceFilter !== "all"
              ? t(
                  "No resources match the selected filters. Try choosing a different tab or resetting filters.",
                  "ಆಯ್ಕೆಮಾಡಿದ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಯಾವುದೇ ಸಂಪನ್ಮೂಲ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ. ಬೇರೆ ಟ್ಯಾಬ್ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಫಿಲ್ಟರ್ ಮರುಹೊಂದಿಸಿ."
                )
              : t(
                  `Notes for ${section?.name || subjectName} will be uploaded soon. Check back shortly!`,
                  `${displayName} ವಿಷಯದ ನೋಟ್ಸ್ ಶೀಘ್ರದಲ್ಲೇ ಅಪ್‌ಲೋಡ್ ಆಗಲಿದೆ. ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ!`
                )}
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
              {t("Reset Filters", "ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ")}
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
