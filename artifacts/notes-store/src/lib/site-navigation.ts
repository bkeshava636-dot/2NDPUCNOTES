import {
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  Laptop,
  BookA,
  Scroll,
  GraduationCap,
  Languages,
  BookOpen,
  FileText,
  HelpCircle,
  BookMarked,
  History,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export interface SubjectItem {
  name: string;
  kannadaName: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  theme: {
    bg: string;
    border: string;
    hoverBorder: string;
    iconBg: string;
    iconColor: string;
    titleColor: string;
    countColor: string;
    accentHex: string;
  };
}

export const SCIENCE_SUBJECTS: SubjectItem[] = [
  {
    name: "Physics",
    kannadaName: "ಭೌತಶಾಸ್ತ್ರ",
    slug: "physics",
    description: "Derivations, formulas, numerical problems, and blueprint model questions",
    icon: Atom,
    badge: "Core Science",
    theme: {
      bg: "bg-[#eff6ff]",
      border: "border-[#dbeafe]",
      hoverBorder: "hover:border-[#93c5fd]",
      iconBg: "bg-white",
      iconColor: "text-[#2563eb]",
      titleColor: "text-[#1d4ed8]",
      countColor: "text-[#1d4ed8]",
      accentHex: "#2563eb",
    },
  },
  {
    name: "Chemistry",
    kannadaName: "ರಸಾಯನಶಾಸ್ತ್ರ",
    slug: "chemistry",
    description: "Organic mechanisms, equations, physical chemistry numericals, and inorganic tables",
    icon: FlaskConical,
    badge: "Core Science",
    theme: {
      bg: "bg-[#fff1f2]",
      border: "border-[#ffe4e6]",
      hoverBorder: "hover:border-[#fda4af]",
      iconBg: "bg-white",
      iconColor: "text-[#e11d48]",
      titleColor: "text-[#be123c]",
      countColor: "text-[#be123c]",
      accentHex: "#e11d48",
    },
  },
  {
    name: "Mathematics",
    kannadaName: "ಗಣಿತಶಾಸ್ತ್ರ",
    slug: "mathematics",
    description: "Calculus, vectors, 3D geometry, probability, matrices, and solved solutions",
    icon: Calculator,
    badge: "Core Science",
    theme: {
      bg: "bg-[#f0fdf4]",
      border: "border-[#dcfce7]",
      hoverBorder: "hover:border-[#86efac]",
      iconBg: "bg-white",
      iconColor: "text-[#16a34a]",
      titleColor: "text-[#15803d]",
      countColor: "text-[#15803d]",
      accentHex: "#16a34a",
    },
  },
  {
    name: "Biology",
    kannadaName: "ಜೀವಶಾಸ್ತ್ರ",
    slug: "biology",
    description: "Labeled botany & zoology diagrams, high-yield definitions, and chapter summaries",
    icon: Dna,
    badge: "Core Science",
    theme: {
      bg: "bg-[#fefce8]",
      border: "border-[#fef9c3]",
      hoverBorder: "hover:border-[#fde047]",
      iconBg: "bg-white",
      iconColor: "text-[#ca8a04]",
      titleColor: "text-[#a16207]",
      countColor: "text-[#854d0e]",
      accentHex: "#ca8a04",
    },
  },
  {
    name: "Computer Science",
    kannadaName: "ಗಣಕ ವಿಜ್ಞಾನ",
    slug: "computer-science",
    description: "C++, OOPs concepts, Boolean algebra, SQL queries, and networking schemes",
    icon: Laptop,
    badge: "Core Science",
    theme: {
      bg: "bg-[#ecfeff]",
      border: "border-[#cffafe]",
      hoverBorder: "hover:border-[#67e8f9]",
      iconBg: "bg-white",
      iconColor: "text-[#0891b2]",
      titleColor: "text-[#0e7490]",
      countColor: "text-[#0e7490]",
      accentHex: "#0891b2",
    },
  },
];

export const LANGUAGE_SUBJECTS: SubjectItem[] = [
  {
    name: "Kannada",
    kannadaName: "ಕನ್ನಡ",
    slug: "kannada",
    description: "Gadya, padya, vyakarana, context-based answers, and annual model papers",
    icon: GraduationCap,
    badge: "Language",
    theme: {
      bg: "bg-[#fef2f2]",
      border: "border-[#fee2e2]",
      hoverBorder: "hover:border-[#fca5a5]",
      iconBg: "bg-white",
      iconColor: "text-[#dc2626]",
      titleColor: "text-[#b91c1c]",
      countColor: "text-[#b91c1c]",
      accentHex: "#dc2626",
    },
  },
  {
    name: "English",
    kannadaName: "ಇಂಗ್ಲಿಷ್",
    slug: "english",
    description: "Literature notes, poetry analysis, grammar, comprehension, and format guides",
    icon: BookA,
    badge: "Language",
    theme: {
      bg: "bg-[#faf5ff]",
      border: "border-[#f3e8ff]",
      hoverBorder: "hover:border-[#d8b4fe]",
      iconBg: "bg-white",
      iconColor: "text-[#9333ea]",
      titleColor: "text-[#7e22ce]",
      countColor: "text-[#7e22ce]",
      accentHex: "#9333ea",
    },
  },
  {
    name: "Hindi",
    kannadaName: "ಹಿಂದಿ",
    slug: "hindi",
    description: "Sahitya, kavita, vyakarana, essay writing, and previous question sets",
    icon: Scroll,
    badge: "Language",
    theme: {
      bg: "bg-[#fff7ed]",
      border: "border-[#ffedd5]",
      hoverBorder: "hover:border-[#fdba74]",
      iconBg: "bg-white",
      iconColor: "text-[#ea580c]",
      titleColor: "text-[#c2410c]",
      countColor: "text-[#c2410c]",
      accentHex: "#ea580c",
    },
  },
  {
    name: "Sanskrit",
    kannadaName: "ಸಂಸ್ಕೃತ",
    slug: "sanskrit",
    description: "Slokas, vyakarana, sandhi, vigraha vakya, translations, and chapter notes",
    icon: Languages,
    badge: "Language",
    theme: {
      bg: "bg-[#fdf4ff]",
      border: "border-[#fae8ff]",
      hoverBorder: "hover:border-[#f0abfc]",
      iconBg: "bg-white",
      iconColor: "text-[#c026d3]",
      titleColor: "text-[#a21caf]",
      countColor: "text-[#a21caf]",
      accentHex: "#c026d3",
    },
  },
];

export const ALL_SUBJECTS = [...SCIENCE_SUBJECTS, ...LANGUAGE_SUBJECTS];

export interface ResourceCategoryItem {
  title: string;
  kannadaTitle: string;
  slug: string;
  dbType: string;
  desc: string;
  icon: LucideIcon;
  badge: string;
  theme: {
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    iconBg: string;
    iconText: string;
    hoverBorder: string;
    accentHex: string;
  };
}

export const RESOURCE_CATEGORIES: ResourceCategoryItem[] = [
  {
    title: "Notes & Study Material",
    kannadaTitle: "ನೋಟ್ಸ್ ಮತ್ತು ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ",
    slug: "notes",
    dbType: "Notes",
    desc: "Comprehensive chapterwise handwritten and typed notes, formulas, and derivations",
    icon: BookOpen,
    badge: "Core Notes",
    theme: {
      badgeBg: "bg-[#f0fdf4]",
      badgeBorder: "border-[#bbf7d0]",
      badgeText: "text-[#15803d]",
      iconBg: "bg-[#f0fdf4]",
      iconText: "text-[#16a34a]",
      hoverBorder: "hover:border-[#86efac]",
      accentHex: "#16a34a",
    },
  },
  {
    title: "Model Question Papers (MQP)",
    kannadaTitle: "ಮಾದರಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು",
    slug: "mqp",
    dbType: "Model Question Papers (MQP)",
    desc: "Official Karnataka Board sample papers with blueprint schemes and answer keys",
    icon: FileText,
    badge: "Official KSEAB",
    theme: {
      badgeBg: "bg-[#eff6ff]",
      badgeBorder: "border-[#bfdbfe]",
      badgeText: "text-[#1d4ed8]",
      iconBg: "bg-[#eff6ff]",
      iconText: "text-[#2563eb]",
      hoverBorder: "hover:border-[#93c5fd]",
      accentHex: "#2563eb",
    },
  },
  {
    title: "Question Bank",
    kannadaTitle: "ಪ್ರಶ್ನೆ ಕೋಶ",
    slug: "question-bank",
    dbType: "Question Bank",
    desc: "Board repeated questions, chapterwise 2M, 3M, 5M problems, and model answers",
    icon: BookMarked,
    badge: "High Yield",
    theme: {
      badgeBg: "bg-[#f0fdf4]",
      badgeBorder: "border-[#bbf7d0]",
      badgeText: "text-[#15803d]",
      iconBg: "bg-[#f0fdf4]",
      iconText: "text-[#16a34a]",
      hoverBorder: "hover:border-[#86efac]",
      accentHex: "#16a34a",
    },
  },
  {
    title: "Previous Year Papers (PYQs)",
    kannadaTitle: "ಹಿಂದಿನ ವರ್ಷದ ಪತ್ರಿಕೆಗಳು",
    slug: "pyq",
    dbType: "Previous Year Question Papers (PYQs)",
    desc: "Midterm, Preparatory, and Annual board examination question papers with solutions",
    icon: History,
    badge: "Past Papers",
    theme: {
      badgeBg: "bg-[#fff1f2]",
      badgeBorder: "border-[#fecdd3]",
      badgeText: "text-[#be123c]",
      iconBg: "bg-[#fff1f2]",
      iconText: "text-[#e11d48]",
      hoverBorder: "hover:border-[#fda4af]",
      accentHex: "#e11d48",
    },
  },
  {
    title: "Multiple Choice Questions (MCQ)",
    kannadaTitle: "ಬಹು ಆಯ್ಕೆಯ ಪ್ರಶ್ನೆಗಳು",
    slug: "mcq",
    dbType: "MCQ",
    desc: "Chapterwise 1-mark objective questions, assertions, and fill-in-the-blanks sets",
    icon: HelpCircle,
    badge: "Objective Practice",
    theme: {
      badgeBg: "bg-[#faf5ff]",
      badgeBorder: "border-[#e9d5ff]",
      badgeText: "text-[#7e22ce]",
      iconBg: "bg-[#faf5ff]",
      iconText: "text-[#9333ea]",
      hoverBorder: "hover:border-[#d8b4fe]",
      accentHex: "#9333ea",
    },
  },
  {
    title: "Passing Package",
    kannadaTitle: "ಪಾಸಿಂಗ್ ಪ್ಯಾಕೇಜ್",
    slug: "passing-package",
    dbType: "Passing Package",
    desc: "High-yield guaranteed scoring derivations & concepts for passing & first-class marks",
    icon: CheckCircle2,
    badge: "Essential",
    theme: {
      badgeBg: "bg-[#fefce8]",
      badgeBorder: "border-[#fef08a]",
      badgeText: "text-[#a16207]",
      iconBg: "bg-[#fefce8]",
      iconText: "text-[#ca8a04]",
      hoverBorder: "hover:border-[#fde047]",
      accentHex: "#ca8a04",
    },
  },
  {
    title: "Practical (Lab Manuals & Viva)",
    kannadaTitle: "ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆ",
    slug: "practical",
    dbType: "Practical",
    desc: "Marking schemes, apparatus guides, circuit diagrams, and viva-voce questions",
    icon: FlaskConical,
    badge: "Core Science",
    theme: {
      badgeBg: "bg-[#ecfeff]",
      badgeBorder: "border-[#a5f3fc]",
      badgeText: "text-[#0e7490]",
      iconBg: "bg-[#ecfeff]",
      iconText: "text-[#0891b2]",
      hoverBorder: "hover:border-[#67e8f9]",
      accentHex: "#0891b2",
    },
  },
  {
    title: "Publication Books",
    kannadaTitle: "ಪ್ರಕಟಣಾ ಪುಸ್ತಕಗಳು",
    slug: "publication-books",
    dbType: "Publication Books",
    desc: "Renowned reference guidebooks, solved workbooks, and publisher question packages",
    icon: BookOpen,
    badge: "Reference",
    theme: {
      badgeBg: "bg-[#fff7ed]",
      badgeBorder: "border-[#fed7aa]",
      badgeText: "text-[#c2410c]",
      iconBg: "bg-[#fff7ed]",
      iconText: "text-[#ea580c]",
      hoverBorder: "hover:border-[#fdba74]",
      accentHex: "#ea580c",
    },
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const STUDENT_FAQS: FaqItem[] = [
  {
    question: "Are these study materials aligned with the latest Karnataka Board (KSEAB) syllabus?",
    answer: "Yes, all notes, blueprint model papers, and practical questions follow the 2024–2026 Karnataka Pre-University Education Department & KSEAB reduced syllabus and blueprint pattern.",
  },
  {
    question: "How do I access free vs paid PDF downloads?",
    answer: "Free study resources can be downloaded instantly by clicking 'Get PDF' with zero waiting time or ads. Paid resources (if any) provide a verified Razorpay checkout and instant permanent access under My Purchases.",
  },
  {
    question: "Can I download and print these files on Android phones?",
    answer: "Yes. All resources are standard, high-resolution printable PDFs optimized for low mobile data consumption and clear offline reading on any Android phone, iPhone, or laptop.",
  },
  {
    question: "What if a payment succeeds but the download does not start?",
    answer: "Your order is securely tied to your phone number and Razorpay order ID. You can instantly recover and re-download your material at any time under the 'My Purchases' tab, or reach out to us directly on Telegram for immediate assistance.",
  },
];

// Helper functions for bilingual translations
export function getSubjectDisplayName(subjectOrSlug: string, isKannada: boolean): string {
  if (!subjectOrSlug) return "";
  const lower = subjectOrSlug.toLowerCase().trim();
  const found = ALL_SUBJECTS.find(
    (s) => s.slug.toLowerCase() === lower || s.name.toLowerCase() === lower
  );
  if (found) {
    return isKannada ? found.kannadaName : found.name;
  }
  return subjectOrSlug;
}

export function getCategoryDisplayTitle(categoryOrSlug: string, isKannada: boolean): string {
  if (!categoryOrSlug) return "";
  const lower = categoryOrSlug.toLowerCase().trim();
  const found = RESOURCE_CATEGORIES.find(
    (c) =>
      c.slug.toLowerCase() === lower ||
      c.dbType.toLowerCase() === lower ||
      c.title.toLowerCase() === lower
  );
  if (found) {
    return isKannada ? found.kannadaTitle : found.title;
  }
  return categoryOrSlug;
}

export function getCategoryDisplayDescription(categoryOrSlug: string, isKannada: boolean): string {
  if (!categoryOrSlug) return "";
  const lower = categoryOrSlug.toLowerCase().trim();
  const found = RESOURCE_CATEGORIES.find(
    (c) =>
      c.slug.toLowerCase() === lower ||
      c.dbType.toLowerCase() === lower ||
      c.title.toLowerCase() === lower
  );
  if (found) {
    return found.desc;
  }
  return "";
}

export function getResourceTypeDisplayName(resourceType: string, isKannada: boolean): string {
  if (!resourceType) return "";
  if (!isKannada) return resourceType;
  const lower = resourceType.toLowerCase().trim();
  if (lower.includes("note")) return "ನೋಟ್ಸ್";
  if (lower.includes("model") || lower.includes("mqp")) return "ಮಾದರಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ (MQP)";
  if (lower.includes("multiple") || lower.includes("mcq")) return "ಬಹು ಆಯ್ಕೆಯ ಪ್ರಶ್ನೆಗಳು (MCQ)";
  if (lower.includes("bank")) return "ಪ್ರಶ್ನೆ ಕೋಶ";
  if (lower.includes("practical")) return "ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆ";
  if (lower.includes("previous") || lower.includes("pyq")) return "ಹಿಂದಿನ ವರ್ಷದ ಪತ್ರಿಕೆಗಳು";
  if (lower.includes("passing")) return "ಪಾಸಿಂಗ್ ಪ್ಯಾಕೇಜ್";
  if (lower.includes("book") || lower.includes("publication")) return "ಪ್ರಕಟಣಾ ಪುಸ್ತಕಗಳು";
  return resourceType;
}
