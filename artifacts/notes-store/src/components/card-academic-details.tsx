import { Link } from "wouter";
import { useLanguage } from "@/lib/language-context";
import {
  BookOpen,
  Award,
  CheckCircle2,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  Sparkles,
  Layers,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { getSubjectDisplayName, getResourceTypeDisplayName } from "@/lib/site-navigation";

interface CardAcademicDetailsProps {
  card: {
    id: number;
    title: string;
    subject?: string | null;
    resourceType: string;
    subtype?: string | null;
    chapter?: string | null;
    classLevel?: string | null;
    board?: string | null;
    pageCount?: number | null;
    description?: string | null;
    isFree?: boolean | null;
  };
}

export function CardAcademicDetails({ card }: CardAcademicDetailsProps) {
  const { language, t } = useLanguage();
  const isKn = language === "kn";
  const subjectName = card.subject || "General Science";
  const resourceType = card.resourceType || "Notes";

  // Slug conversion for subject
  const subjectSlug = card.subject
    ? card.subject.toLowerCase().replace(/\s+/g, "-")
    : "physics";

  // Category slug conversion
  const getCategorySlug = (rt: string) => {
    const lower = rt.toLowerCase();
    if (lower.includes("model") || lower.includes("mqp")) return "mqp";
    if (lower.includes("mcq")) return "mcq";
    if (lower.includes("question bank")) return "question-bank";
    if (lower.includes("practical")) return "practical";
    if (lower.includes("pyq") || lower.includes("previous")) return "pyq";
    if (lower.includes("passing")) return "passing-package";
    return "notes";
  };

  const categorySlug = getCategorySlug(resourceType);

  return (
    <div className="space-y-6 pt-4 border-t border-[#e2e8f0] dark:border-[#293548]">
      {/* 1. Academic & Syllabus Context Card */}
      <div className="bg-white dark:bg-[#151D2E] rounded-2xl border border-[#e2e8f0] dark:border-[#293548] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#f1f5f9] dark:border-[#293548]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1C2638] text-[#2563eb] dark:text-[#818CF8] border border-blue-100 dark:border-[#293548] shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Academic Syllabus & Examination Relevance", "ಶೈಕ್ಷಣಿಕ ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಪರೀಕ್ಷಾ ಮಹತ್ವ")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("Karnataka KSEAB / DPUE Pre-University Board Alignment", "ಕರ್ನಾಟಕ ಕೆಎಸ್‌ಇಎಬಿ / ಪದವಿ ಪೂರ್ವ ಶಿಕ್ಷಣ ಮಂಡಳಿ ನಿಯಮಾವಳಿ")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-1">
            <span className="font-semibold text-[#64748b] dark:text-[#94A3B8] block text-[11px] uppercase tracking-wider">
              {t("Target Examination", "ಗುರಿ ಪರೀಕ್ಷೆ")}
            </span>
            <p className="font-medium text-[#0f172a] dark:text-[#F1F5F9]">
              {card.classLevel || "2nd PUC"} • {card.board || "KSEAB Karnataka"} Annual & Preparatory
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-1">
            <span className="font-semibold text-[#64748b] dark:text-[#94A3B8] block text-[11px] uppercase tracking-wider">
              {t("Curriculum Standard", "ಪಠ್ಯಕ್ರಮ ಮಾನದಂಡ")}
            </span>
            <p className="font-medium text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Rationalized NCERT Syllabus & Board Blueprint", "ಪರಿಷ್ಕೃತ ಎನ್‌ಸಿಇಆರ್‌ಟಿ ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಬ್ಲೂಪ್ರಿಂಟ್")}
            </p>
          </div>
        </div>

        <div className="text-xs text-[#475569] dark:text-[#A1AEC2] leading-relaxed space-y-2.5">
          <p>
            {t(
              `This ${getResourceTypeDisplayName(resourceType, isKn)} resource is specifically structured for 2nd Pre-University students preparing for the Karnataka state board examinations in ${getSubjectDisplayName(subjectName, isKn)}. It follows the official question typology specified by KSEAB, ensuring that students practice according to the authentic marking scheme.`,
              `ಈ ${getResourceTypeDisplayName(resourceType, isKn)} ಸಂಪನ್ಮೂಲವು ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ${getSubjectDisplayName(subjectName, isKn)} ವಾರ್ಷಿಕ ಪರೀಕ್ಷೆಗೆ ಸಿದ್ಧತೆ ನಡೆಸುತ್ತಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿಶೇಷವಾಗಿ ರಚಿಸಲಾಗಿದೆ. ಕೆಎಸ್‌ಇಎಬಿ ನಿಗದಿಪಡಿಸಿದ ಪ್ರಶ್ನೆಗಳ ಮಾದರಿ ಹಾಗೂ ಮೌಲ್ಯಮಾಪನ ನಿಯಮಗಳಿಗೆ ಇದು ಅನುಗುಣವಾಗಿದೆ.`
            )}
          </p>
          {card.chapter && (
            <p className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-blue-900 dark:text-blue-200">
              <strong>{t("Chapter Focus:", "ಅಧ್ಯಾಯದ ವಿವರ:")}</strong>{" "}
              {card.chapter} — {t("Covers core definitions, fundamental concepts, board derivations, and high-yield examination questions.", "ಮೂಲ ವ್ಯಾಖ್ಯಾನಗಳು, ಡೆರಿವೇಶನ್‌ಗಳು ಹಾಗೂ ಪರೀಕ್ಷಾ ದೃಷ್ಟಿಯಿಂದ ಪ್ರಮುಖವಾದ ಪ್ರಶ್ನೆಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.")}
            </p>
          )}
        </div>
      </div>

      {/* 2. Pedagogical Methodology & Study Guidance */}
      <div className="bg-white dark:bg-[#151D2E] rounded-2xl border border-[#e2e8f0] dark:border-[#293548] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#f1f5f9] dark:border-[#293548]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 shrink-0">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Recommended Study Methodology", "ಉತ್ತಮ ಅಧ್ಯಯನ ವಿಧಾನ")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("How to maximize your marks using this study resource", "ಈ ಸಾಮಗ್ರಿಯಿಂದ ಗರಿಷ್ಠ ಅಂಕಗಳನ್ನು ಗಳಿಸುವ ತಂತ್ರ")}
            </p>
          </div>
        </div>

        <ul className="space-y-2.5 text-xs text-[#475569] dark:text-[#A1AEC2]">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>{t("Step 1 — Conceptual Review:", "ಹಂತ ೧ — ಪರಿಕಲ್ಪನೆ ಗ್ರಹಿಕೆ:")}</strong>{" "}
              {t("Go through the foundational theory and definitions carefully. Verify formulas, standard units, and sign conventions before attempting numerical problems.", "ಮೊದಲು ಸಿದ್ಧಾಂತ ಮತ್ತು ವ್ಯಾಖ್ಯಾನಗಳನ್ನು ಓದಿ ಅರ್ಥೈಸಿಕೊಳ್ಳಿ. ಸೂತ್ರಗಳು ಮತ್ತು ಘಟಕಗಳನ್ನು ಸರಿಯಾಗಿ ಗಮನಿಸಿ.")}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>{t("Step 2 — Hand-written Derivations:", "ಹಂತ ೨ — ಬರೆದು ಅಭ್ಯಾಸ ಮಾಡಿ:")}</strong>{" "}
              {t("Practice mathematical derivations and chemical reactions by writing them out in full without referring to the notes. Board evaluators award marks for each logical step and labelled diagram.", "ಡೆರಿವೇಶನ್‌ಗಳು ಮತ್ತು ರಾಸಾಯನಿಕ ಸಮೀಕರಣಗಳನ್ನು ನೋಡದೆ ಬರೆಯಿರಿ. ಬೋರ್ಡ್ ಮೌಲ್ಯಮಾಪನದಲ್ಲಿ ಪ್ರತಿ ಹಂತಕ್ಕೂ ಅಂಕಗಳಿರುತ್ತವೆ.")}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>{t("Step 3 — Timed Self-Evaluation:", "ಹಂತ ೩ — ಕಾಲಮಿತಿಯ ಸ್ವಯಂ ಪರೀಕ್ಷೆ:")}</strong>{" "}
              {t("Solve sample questions or model papers within standard board exam time constraints to build speed, accuracy, and confidence.", "ನಿಗದಿತ ಸಮಯದೊಳಗೆ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ ಅಭ್ಯಾಸ ಮಾಡುವುದರಿಂದ ಪರೀಕ್ಷಾ ಸಮಯ ನಿರ್ವಹಣೆ ಸುಲಭವಾಗುತ್ತದೆ.")}
            </span>
          </li>
        </ul>
      </div>

      {/* 3. Subject Hub & Related Exploration */}
      <div className="bg-white dark:bg-[#151D2E] rounded-2xl border border-[#e2e8f0] dark:border-[#293548] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#f1f5f9] dark:border-[#293548]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Related Study Materials & Resources", "ಸಂಬಂಧಿತ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("Explore more curriculum-aligned materials for comprehensive preparation", "ಸಂಪೂರ್ಣ ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆಗಾಗಿ ಹೆಚ್ಚಿನ ಸಂಪನ್ಮೂಲಗಳನ್ನು ವೀಕ್ಷಿಸಿ")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <Link href={`/subject/${subjectSlug}`}>
            <a className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] hover:bg-[#eff6ff] dark:hover:bg-[#253248] border border-[#e2e8f0] dark:border-[#293548] text-[#0f172a] dark:text-[#F1F5F9] font-medium transition-colors group">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#2563eb] dark:text-[#818CF8]" />
                <span>{getSubjectDisplayName(subjectName, isKn)} — {t("All Subject Resources", "ವಿಷಯದ ಎಲ್ಲಾ ನೋಟ್ಸ್")}</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-[#94a3b8] group-hover:text-[#2563eb] dark:group-hover:text-[#818CF8]" />
            </a>
          </Link>

          <Link href={`/category/${categorySlug}`}>
            <a className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] hover:bg-[#eff6ff] dark:hover:bg-[#253248] border border-[#e2e8f0] dark:border-[#293548] text-[#0f172a] dark:text-[#F1F5F9] font-medium transition-colors group">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#2563eb] dark:text-[#818CF8]" />
                <span>{getResourceTypeDisplayName(resourceType, isKn)} — {t("Category Hub", "ವರ್ಗದ ಸಂಪನ್ಮೂಲಗಳು")}</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-[#94a3b8] group-hover:text-[#2563eb] dark:group-hover:text-[#818CF8]" />
            </a>
          </Link>
        </div>
      </div>

      {/* 4. Educational Attribution & Fair-Use Disclaimer */}
      <div className="p-4 rounded-xl bg-gray-50/80 dark:bg-[#111827] border border-gray-200 dark:border-[#293548] text-[11px] text-[#64748b] dark:text-[#94a3b8] space-y-1.5 leading-relaxed">
        <div className="flex items-center gap-1.5 font-semibold text-[#475569] dark:text-[#CBD5E1]">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>{t("Educational Fair Use & Attribution Disclaimer", "ಶೈಕ್ಷಣಿಕ ಹಕ್ಕು ನಿರಾಕರಣೆ & ಕೃತಜ್ಞತೆ")}</span>
        </div>
        <p>
          {t(
            "This digital study resource is provided strictly for non-commercial student revision and educational guidance. Syllabi, blueprints, and public examination question papers remain the intellectual property of the Karnataka School Examination and Assessment Board (KSEAB) / Department of Pre-University Education (DPUE) and are referenced under educational fair-use doctrines. Original study notes and derivation summaries are independently created by contributing educators. Unaugmented official board papers are never sold. 2PUC is an independent learning platform and is not affiliated with or endorsed by state examination authorities.",
            "ಈ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಯು ದ್ವಿತೀಯ ಪಿಯುಸಿ ವಿದ್ಯಾರ್ಥಿಗಳ ಶೈಕ್ಷಣಿಕ ನೆರವಿಗಾಗಿ ಮಾತ್ರ ಲಭ್ಯವಿದೆ. ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಪರೀಕ್ಷಾ ಬ್ಲೂಪ್ರಿಂಟ್‌ಗಳು ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿಯ (KSEAB / DPUE) ಅಧಿಕೃತ ಹಕ್ಕುಗಳಾಗಿದ್ದು, ಶೈಕ್ಷಣಿಕ ಉಲ್ಲೇಖಕ್ಕಾಗಿ ಮಾತ್ರ ಬಳಸಲಾಗಿದೆ. 2PUC ಸ್ವತಂತ್ರ ಶೈಕ್ಷಣಿಕ ವೇದಿಕೆಯಾಗಿದ್ದು, ಸರ್ಕಾರಿ ಇಲಾಖೆಯೊಂದಿಗೆ ನೇರ ಸಂಬಂಧ ಹೊಂದಿಲ್ಲ."
          )}
        </p>
      </div>
    </div>
  );
}
