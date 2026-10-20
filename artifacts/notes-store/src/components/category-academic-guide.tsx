import { useLanguage } from "@/lib/language-context";
import { BookOpen, Award, CheckCircle2, FileText, HelpCircle, History, FlaskConical } from "lucide-react";

interface CategoryGuideProps {
  slug: string;
  categoryTitle: string;
}

export function CategoryAcademicGuide({ slug, categoryTitle }: CategoryGuideProps) {
  const { language, t } = useLanguage();
  const lowerSlug = slug.toLowerCase();

  return (
    <div className="mt-12 bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs text-[#1e293b]">
      <div className="flex items-center gap-3 border-b border-[#f1f5f9] pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb] border border-blue-100">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">
            {categoryTitle} — {t("Study Method & Board Strategy", "ಅಧ್ಯಯನ ವಿಧಾನ & ಪರೀಕ್ಷಾ ತಂತ್ರ")}
          </h2>
          <p className="text-xs text-[#64748b]">
            {t("How to effectively prepare using these materials for Karnataka 2nd PUC", "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಉತ್ತಮ ಅಂಕ ಪಡೆಯಲು ಇವುಗಳ ಸದ್ಬಳಕೆ")}
          </p>
        </div>
      </div>

      <div className="text-xs text-[#475569] leading-relaxed space-y-3">
        <p>
          {lowerSlug === "notes" &&
            t(
              "Chapterwise revision notes are formulated to condense voluminous textbook chapters into concise, concept-focused summaries. Always practice writing key definitions, standard SI units, and board derivations by hand rather than passive reading.",
              "ಅಧ್ಯಾಯವಾರು ನೋಟ್ಸ್‌ಗಳು ಮುಖ್ಯ ವ್ಯಾಖ್ಯಾನಗಳು ಮತ್ತು ಸೂತ್ರಗಳನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಲು ಸಹಕಾರಿ. ಕೇವಲ ಓದುವ ಬದಲು ಮುಖ್ಯ ಡೆರಿವೇಶನ್‌ಗಳನ್ನು ಕೈಯಾರೆ ಬರೆದು ಅಭ್ಯಾಸ ಮಾಡಿ."
            )}
          {lowerSlug === "mqp" &&
            t(
              "Model Question Papers (MQP) reflect the official KSEAB blueprint weightage. Solve each model paper under a strict 3-hour examination timer to develop speed, answer neatness, and familiarization with choice questions in Part B, C, and D.",
              "ಮಾದರಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು (MQP) ನಿಗದಿತ 3 ಗಂಟೆಗಳ ಕಾಲಮಿತಿಯಲ್ಲಿ ಉತ್ತರಿಸಿ ಅಭ್ಯಾಸ ಮಾಡುವುದರಿಂದ ಪರೀಕ್ಷಾ ಭಯ ಕಡಿಮೆಯಾಗುತ್ತದೆ ಮತ್ತು ಸಮಯ ನಿರ್ವಹಣೆ ಸಾಧ್ಯವಾಗುತ್ತದೆ."
            )}
          {lowerSlug === "passing-package" &&
            t(
              "Passing Packages focus on high-frequency derivations, predictable 5-mark matrix problems, fixed chemical reactions, and guaranteed diagrams. Perfect for students seeking a solid foundation to ensure minimum passing marks and build momentum toward first-class results.",
              "ಪಾಸಿಂಗ್ ಪ್ಯಾಕೇಜ್‌ಗಳು ಪುನರಾವರ್ತಿತ 5 ಅಂಕಗಳ ಪ್ರಶ್ನೆಗಳು, ಡೆರಿವೇಶನ್‌ಗಳು ಹಾಗೂ ರೇಖಾಚಿತ್ರಗಳನ್ನು ಒಳಗೊಂಡಿದ್ದು, ಕನಿಷ್ಠ ಉತ್ತೀರ್ಣ ಅಂಕಗಳನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಅತ್ಯಂತ ಸಹಕಾರಿ."
            )}
          {lowerSlug === "practical" &&
            t(
              "Practical examinations carry 30 marks (over 42% of the total Science score). Ensure laboratory experiment calculations, graphical plotting, unit conversions, and standard viva questions are thoroughly mastered before the board practical dates.",
              "ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆಯು 30 ಅಂಕಗಳನ್ನು ಹೊಂದಿದ್ದು, ಪ್ರಯೋಗದ ಹಂತಗಳು, ಲೆಕ್ಕಾಚಾರ, ಗ್ರಾಫ್ ಹಾಗೂ ವೈವಾ ಪ್ರಶ್ನೋತ್ತರಗಳನ್ನು ಮುಂಚಿತವಾಗಿ ಸಿದ್ಧಪಡಿಸಿಕೊಳ್ಳಿ."
            )}
          {lowerSlug === "mcq" &&
            t(
              "Part A consists of 15 MCQs and 5 Fill-in-the-Blanks testing rapid factual recall and fundamental concepts. Zero negative marks are penalized, so thorough practice across all textbook line items is essential.",
              "ಭಾಗ ಎ ನಲ್ಲಿ 15 ಎಂಸಿಕ್ಯೂ ಮತ್ತು 5 ಬಿಟ್ಟ ಸ್ಥಳಗಳಿದ್ದು, ಋಣಾತ್ಮಕ ಅಂಕಗಳಿರುವುದಿಲ್ಲ. ಎನ್‌ಸಿಇಆರ್‌ಟಿ ಪಠ್ಯಪುಸ್ತಕದ ಮುಖ್ಯ ಸಾಲುಗಳನ್ನು ಗಮನವಿಟ್ಟು ಅಭ್ಯಾಸ ಮಾಡಿ."
            )}
          {lowerSlug === "pyq" &&
            t(
              "Analyzing previous year questions highlights repeated board trends and standard question phrasing. Cross-reference your solutions with the official Karnataka board valuation scheme to learn the exact step-marking criteria.",
              "ಹಿಂದಿನ ವರ್ಷಗಳ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸುವುದರಿಂದ ಪುನರಾವರ್ತನೆಯಾಗುವ ಪ್ರಶ್ನೆಗಳ ಪರಿಚಯವಾಗುತ್ತದೆ ಮತ್ತು ಮೌಲ್ಯಮಾಪನ ನಿಯಮಗಳು ತಿಳಿಯುತ್ತವೆ."
            )}
          {!["notes", "mqp", "passing-package", "practical", "mcq", "pyq"].includes(lowerSlug) &&
            t(
              "Utilize these verified Karnataka 2nd PUC resources in tandem with your prescribed college textbooks to achieve academic excellence.",
              "ನಿಮ್ಮ ಕಾಲೇಜಿನ ಪಠ್ಯಪುಸ್ತಕಗಳೊಂದಿಗೆ ಈ ಸಂಪನ್ಮೂಲಗಳನ್ನು ಬಳಸಿಕೊಂಡು ಪರೀಕ್ಷೆಯಲ್ಲಿ ಗರಿಷ್ಠ ಅಂಕಗಳನ್ನು ಗಳಿಸಿ."
            )}
        </p>

        <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
          <span className="font-semibold text-[#0f172a]">{t("Curriculum Note:", "ಪಠ್ಯಕ್ರಮ ಸೂಚನೆ:")}</span>{" "}
          {t(
            "All resources are regularly cross-checked with the latest Department of Pre-University Education circulars and rationalized NCERT syllabi.",
            "ಎಲ್ಲ ಸಂಪನ್ಮೂಲಗಳು ಕರ್ನಾಟಕ ಪದವಿ ಪೂರ್ವ ಶಿಕ್ಷಣ ಇಲಾಖೆಯ ಇತ್ತೀಚಿನ ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿವೆ."
          )}
        </div>
      </div>
    </div>
  );
}
