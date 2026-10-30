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
      bg: "bg-[#eff6ff] dark:bg-[#151D2E]",
      border: "border-[#dbeafe] dark:border-[#293548]",
      hoverBorder: "hover:border-[#93c5fd] dark:hover:border-[#818CF8]/50",
      iconBg: "bg-white dark:bg-[#1C2638]",
      iconColor: "text-[#2563eb] dark:text-[#60a5fa]",
      titleColor: "text-[#1d4ed8] dark:text-[#F1F5F9]",
      countColor: "text-[#1d4ed8] dark:text-[#94A3B8]",
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
      bg: "bg-[#fff1f2] dark:bg-[#151D2E]",
      border: "border-[#ffe4e6] dark:border-[#293548]",
      hoverBorder: "hover:border-[#fda4af] dark:hover:border-[#818CF8]/50",
      iconBg: "bg-white dark:bg-[#1C2638]",
      iconColor: "text-[#e11d48] dark:text-[#fb7185]",
      titleColor: "text-[#be123c] dark:text-[#F1F5F9]",
      countColor: "text-[#be123c] dark:text-[#94A3B8]",
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
      bg: "bg-[#f0fdf4] dark:bg-[#151D2E]",
      border: "border-[#dcfce7] dark:border-[#293548]",
      hoverBorder: "hover:border-[#86efac] dark:hover:border-[#818CF8]/50",
      iconBg: "bg-white dark:bg-[#1C2638]",
      iconColor: "text-[#16a34a] dark:text-[#4ade80]",
      titleColor: "text-[#15803d] dark:text-[#F1F5F9]",
      countColor: "text-[#15803d] dark:text-[#94A3B8]",
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
      bg: "bg-[#fefce8] dark:bg-[#151D2E]",
      border: "border-[#fef9c3] dark:border-[#293548]",
      hoverBorder: "hover:border-[#fde047] dark:hover:border-[#818CF8]/50",
      iconBg: "bg-white dark:bg-[#1C2638]",
      iconColor: "text-[#ca8a04] dark:text-[#facc15]",
      titleColor: "text-[#a16207] dark:text-[#F1F5F9]",
      countColor: "text-[#854d0e] dark:text-[#94A3B8]",
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
      bg: "bg-[#ecfeff] dark:bg-[#151D2E]",
      border: "border-[#cffafe] dark:border-[#293548]",
      hoverBorder: "hover:border-[#67e8f9] dark:hover:border-[#818CF8]/50",
      iconBg: "bg-white dark:bg-[#1C2638]",
      iconColor: "text-[#0891b2] dark:text-[#38bdf8]",
      titleColor: "text-[#0e7490] dark:text-[#F1F5F9]",
      countColor: "text-[#0e7490] dark:text-[#94A3B8]",
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
      bg: "bg-[#fef2f2] dark:bg-[#151D2E]",
      border: "border-[#fee2e2] dark:border-[#293548]",
      hoverBorder: "hover:border-[#fca5a5] dark:hover:border-[#818CF8]/50",
      iconBg: "bg-white dark:bg-[#1C2638]",
      iconColor: "text-[#dc2626] dark:text-[#f87171]",
      titleColor: "text-[#b91c1c] dark:text-[#F1F5F9]",
      countColor: "text-[#b91c1c] dark:text-[#94A3B8]",
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
      bg: "bg-[#faf5ff] dark:bg-[#151D2E]",
      border: "border-[#f3e8ff] dark:border-[#293548]",
      hoverBorder: "hover:border-[#d8b4fe] dark:hover:border-[#818CF8]/50",
      iconBg: "bg-white dark:bg-[#1C2638]",
      iconColor: "text-[#9333ea] dark:text-[#c084fc]",
      titleColor: "text-[#7e22ce] dark:text-[#F1F5F9]",
      countColor: "text-[#7e22ce] dark:text-[#94A3B8]",
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
      bg: "bg-[#fff7ed] dark:bg-[#151D2E]",
      border: "border-[#ffedd5] dark:border-[#293548]",
      hoverBorder: "hover:border-[#fdba74] dark:hover:border-[#818CF8]/50",
      iconBg: "bg-white dark:bg-[#1C2638]",
      iconColor: "text-[#ea580c] dark:text-[#fb923c]",
      titleColor: "text-[#c2410c] dark:text-[#F1F5F9]",
      countColor: "text-[#c2410c] dark:text-[#94A3B8]",
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
      bg: "bg-[#fdf4ff] dark:bg-[#151D2E]",
      border: "border-[#fae8ff] dark:border-[#293548]",
      hoverBorder: "hover:border-[#f0abfc] dark:hover:border-[#818CF8]/50",
      iconBg: "bg-white dark:bg-[#1C2638]",
      iconColor: "text-[#c026d3] dark:text-[#e879f9]",
      titleColor: "text-[#a21caf] dark:text-[#F1F5F9]",
      countColor: "text-[#a21caf] dark:text-[#94A3B8]",
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
      badgeBg: "bg-[#f0fdf4] dark:bg-[#1C2638]",
      badgeBorder: "border-[#bbf7d0] dark:border-[#293548]",
      badgeText: "text-[#15803d] dark:text-[#818CF8]",
      iconBg: "bg-[#f0fdf4] dark:bg-[#1C2638]",
      iconText: "text-[#16a34a] dark:text-[#818CF8]",
      hoverBorder: "hover:border-[#86efac] dark:hover:border-[#818CF8]/50",
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
      badgeBg: "bg-[#eff6ff] dark:bg-[#1C2638]",
      badgeBorder: "border-[#bfdbfe] dark:border-[#293548]",
      badgeText: "text-[#1d4ed8] dark:text-[#818CF8]",
      iconBg: "bg-[#eff6ff] dark:bg-[#1C2638]",
      iconText: "text-[#2563eb] dark:text-[#818CF8]",
      hoverBorder: "hover:border-[#93c5fd] dark:hover:border-[#818CF8]/50",
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
      badgeBg: "bg-[#f0fdf4] dark:bg-[#1C2638]",
      badgeBorder: "border-[#bbf7d0] dark:border-[#293548]",
      badgeText: "text-[#15803d] dark:text-[#818CF8]",
      iconBg: "bg-[#f0fdf4] dark:bg-[#1C2638]",
      iconText: "text-[#16a34a] dark:text-[#818CF8]",
      hoverBorder: "hover:border-[#86efac] dark:hover:border-[#818CF8]/50",
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
      badgeBg: "bg-[#fff1f2] dark:bg-[#1C2638]",
      badgeBorder: "border-[#fecdd3] dark:border-[#293548]",
      badgeText: "text-[#be123c] dark:text-[#818CF8]",
      iconBg: "bg-[#fff1f2] dark:bg-[#1C2638]",
      iconText: "text-[#e11d48] dark:text-[#818CF8]",
      hoverBorder: "hover:border-[#fda4af] dark:hover:border-[#818CF8]/50",
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
      badgeBg: "bg-[#faf5ff] dark:bg-[#1C2638]",
      badgeBorder: "border-[#e9d5ff] dark:border-[#293548]",
      badgeText: "text-[#7e22ce] dark:text-[#818CF8]",
      iconBg: "bg-[#faf5ff] dark:bg-[#1C2638]",
      iconText: "text-[#9333ea] dark:text-[#818CF8]",
      hoverBorder: "hover:border-[#d8b4fe] dark:hover:border-[#818CF8]/50",
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
      badgeBg: "bg-[#fefce8] dark:bg-[#1C2638]",
      badgeBorder: "border-[#fef08a] dark:border-[#293548]",
      badgeText: "text-[#a16207] dark:text-[#818CF8]",
      iconBg: "bg-[#fefce8] dark:bg-[#1C2638]",
      iconText: "text-[#ca8a04] dark:text-[#818CF8]",
      hoverBorder: "hover:border-[#fde047] dark:hover:border-[#818CF8]/50",
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
      badgeBg: "bg-[#ecfeff] dark:bg-[#1C2638]",
      badgeBorder: "border-[#a5f3fc] dark:border-[#293548]",
      badgeText: "text-[#0e7490] dark:text-[#818CF8]",
      iconBg: "bg-[#ecfeff] dark:bg-[#1C2638]",
      iconText: "text-[#0891b2] dark:text-[#818CF8]",
      hoverBorder: "hover:border-[#67e8f9] dark:hover:border-[#818CF8]/50",
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
      badgeBg: "bg-[#fff7ed] dark:bg-[#1C2638]",
      badgeBorder: "border-[#fed7aa] dark:border-[#293548]",
      badgeText: "text-[#c2410c] dark:text-[#818CF8]",
      iconBg: "bg-[#fff7ed] dark:bg-[#1C2638]",
      iconText: "text-[#ea580c] dark:text-[#818CF8]",
      hoverBorder: "hover:border-[#fdba74] dark:hover:border-[#818CF8]/50",
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
