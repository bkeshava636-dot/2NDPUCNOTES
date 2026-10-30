import { useState } from "react";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  HelpCircle,
  Award,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function HomeFaqAndGuide() {
  const { language, t } = useLanguage();
  const isKn = language === "kn";

  const faqs = [
    {
      q: t(
        "What is the examination pattern and marking scheme for Karnataka 2nd PUC Science?",
        "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ವಿಜ್ಞಾನ ಪರೀಕ್ಷೆಯ ಅಂಕ ಹಂಚಿಕೆ ಮತ್ತು ಮಾದರಿ ಹೇಗಿರುತ್ತದೆ?"
      ),
      a: t(
        "For Physics, Chemistry, Biology, and Computer Science, the Karnataka Pre-University examination consists of a 70-mark theory paper and a 30-mark practical examination. Mathematics consists of an 80-mark theory paper and a 20-mark internal assessment. The theory papers follow the revised KSEAB blueprint divided into Part A (Multiple Choice Questions & Fill in the Blanks, 20 marks), Part B (2-mark short answers, 10 marks), Part C (3-mark analytical questions, 15 marks), and Part D (5-mark long answers, derivations, and numericals, 25 marks).",
        "ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಜೀವಶಾಸ್ತ್ರ ಹಾಗೂ ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್ ವಿಷಯಗಳಲ್ಲಿ 70 ಅಂಕಗಳ ಥಿಯರಿ ಮತ್ತು 30 ಅಂಕಗಳ ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆ ಇರುತ್ತದೆ. ಗಣಿತ ವಿಷಯದಲ್ಲಿ 80 ಅಂಕಗಳ ಥಿಯರಿ ಮತ್ತು 20 ಅಂಕಗಳ ಆಂತರಿಕ ಮೌಲ್ಯಮಾಪನ ಇರುತ್ತದೆ. ಪರೀಕ್ಷಾ ಪತ್ರಿಕೆಯು ಭಾಗ ಎ (ಎಂಸಿಕ್ಯೂ ಮತ್ತು ಬಿಟ್ಟ ಸ್ಥಳ, 20 ಅಂಕ), ಭಾಗ ಬಿ (2 ಅಂಕಗಳ ಪ್ರಶ್ನೆಗಳು, 10 ಅಂಕ), ಭಾಗ ಸಿ (3 ಅಂಕಗಳ ಪ್ರಶ್ನೆಗಳು, 15 ಅಂಕ) ಮತ್ತು ಭಾಗ ಡಿ (5 ಅಂಕಗಳ ದೀರ್ಘ ಉತ್ತರ ಮತ್ತು ಲೆಕ್ಕಗಳು, 25 ಅಂಕ) ಒಳಗೊಂಡಿರುತ್ತದೆ."
      ),
    },
    {
      q: t(
        "Are the study notes and solutions on 2PUC aligned with the rationalized NCERT syllabus?",
        "2PUC ನಲ್ಲಿರುವ ನೋಟ್ಸ್ ಪರಿಷ್ಕೃತ ಎನ್‌ಸಿಇಆರ್‌ಟಿ (NCERT) ಪಠ್ಯಕ್ರಮಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುತ್ತವೆಯೇ?"
      ),
      a: t(
        "Yes, 100%. All chapter notes, question banks, and solutions on 2PUC strictly follow the rationalized NCERT syllabus and the Department of Pre-University Education (DPUE) Karnataka guidelines. Deleted syllabus topics have been pruned to ensure students focus exclusively on exam-relevant concepts and weightages.",
        "ಹೌದು, ನೂರಕ್ಕೆ ನೂರು. 2PUC ನಲ್ಲಿರುವ ಎಲ್ಲಾ ಅಧ್ಯಾಯಗಳ ನೋಟ್ಸ್, ಪ್ರಶ್ನೋತ್ತರಗಳು ಹಾಗೂ ಪರಿಹಾರಗಳು ಕರ್ನಾಟಕ ಪದವಿ ಪೂರ್ವ ಶಿಕ್ಷಣ ಇಲಾಖೆ ಹಾಗೂ ಪರಿಷ್ಕೃತ ಎನ್‌ಸಿಇಆರ್‌ಟಿ ಪಠ್ಯಕ್ರಮವನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಅನುಸರಿಸುತ್ತವೆ. ಪರೀಕ್ಷೆಗೆ ನಿಗದಿಪಡಿಸದ ಅಧ್ಯಾಯಗಳನ್ನು ಕೈಬಿಡಲಾಗಿದ್ದು, ವಿದ್ಯಾರ್ಥಿಗಳು ಪರೀಕ್ಷೆಗೆ ಅಗತ್ಯವಿರುವ ವಿಷಯಗಳ ಮೇಲೆ ಮಾತ್ರ ಗಮನ ಹರಿಸಬಹುದು."
      ),
    },
    {
      q: t(
        "What is a 'Passing Package' and how does it help 2nd PUC students?",
        "ದ್ವಿತೀಯ ಪಿಯುಸಿ 'ಪಾಸಿಂಗ್ ಪ್ಯಾಕೇಜ್' ಎಂದರೇನು? ಅದು ಹೇಗೆ ಸಹಾಯಕ?"
      ),
      a: t(
        "A Passing Package is a curated, high-yield compilation of guaranteed and repeatedly asked board exam questions designed specifically to help students secure passing marks (minimum 21/70 in theory) and build confidence. It includes standard derivations (such as Mirror Formula, Lens Maker's Formula, AC Generator in Physics), predictable chemical reactions and definitions in Chemistry, fixed 5-mark matrix equations and differential equations in Mathematics, and high-frequency genetics and human physiology diagrams in Biology.",
        "ಪಾಸಿಂಗ್ ಪ್ಯಾಕೇಜ್ ಎನ್ನುವುದು ವಾರ್ಷಿಕ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಪುನರಾವರ್ತನೆಯಾಗುವ ಮುಖ್ಯ ಪ್ರಶ್ನೆಗಳು, ಡೆರಿವೇಶನ್‌ಗಳು ಮತ್ತು ರೇಖಾಚಿತ್ರಗಳ ವಿಶೇಷ ಸಂಕಲನವಾಗಿದೆ. ಕನಿಷ್ಠ ಉತ್ತೀರ್ಣ ಅಂಕಗಳನ್ನು (70ಕ್ಕೆ 21) ಸುಲಭವಾಗಿ ಗಳಿಸಲು ಮತ್ತು ಕಡಿಮೆ ಅವಧಿಯಲ್ಲಿ ಉತ್ತಮ ಅಂಕ ಪಡೆಯಲು ಇದು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ನೆರವಾಗುತ್ತದೆ."
      ),
    },
    {
      q: t(
        "How are Model Question Papers (MQPs) and Blueprints useful for exam prep?",
        "ಮಾದರಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು (MQP) ಮತ್ತು ಬ್ಲೂಪ್ರಿಂಟ್ ಏಕೆ ಮುಖ್ಯ?"
      ),
      a: t(
        "Karnataka KSEAB publishes annual blueprints specifying the exact chapter-wise marks distribution, cognitive levels (Knowledge, Understanding, Application, Higher-Order Thinking), and optional choice format. Practicing model papers under timed conditions teaches time management, helps identify weak chapters, and trains students to write answers according to the official valuation scheme.",
        "ವಾರ್ಷಿಕ ಬ್ಲೂಪ್ರಿಂಟ್ ಪ್ರತಿ ಅಧ್ಯಾಯಕ್ಕೆ ನಿಗದಿಪಡಿಸಿದ ಅಂಕಗಳು, ಪ್ರಶ್ನೆಗಳ ವಿಧ ಮತ್ತು ಆಯ್ಕೆಗಳನ್ನು ಸ್ಪಷ್ಟಪಡಿಸುತ್ತದೆ. ಮಾದರಿ ಪತ್ರಿಕೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡುವುದರಿಂದ ಸಮಯ ನಿರ್ವಹಣೆ ಕಲಿಯಬಹುದು ಮತ್ತು ಮೌಲ್ಯಮಾಪನ ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ನಿಖರ ಉತ್ತರ ಬರೆಯಲು ತರಬೇತಿ ಸಿಗುತ್ತದೆ."
      ),
    },
    {
      q: t(
        "What are the requirements for Karnataka 2nd PUC Science Practical Examinations?",
        "ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆಯ (Practical Exam) ನಿಯಮಗಳು ಹಾಗೂ ಅಂಕ ವಿತರಣೆ ಹೇಗಿರುತ್ತದೆ?"
      ),
      a: t(
        "The 30-mark practical examination is conducted by external examiners in college laboratories. The standard marks breakup comprises: Major Experiment / Procedure & Execution (10 marks), Calculations & Result with Units (6 marks), Practical Record Book submission (4 marks), and Viva Voce oral questions (4 to 6 marks). On 2PUC, we provide comprehensive lab manuals, viva questions with answers, and step-by-step experiment schemes.",
        "30 ಅಂಕಗಳ ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಪ್ರಯೋಗ ನಿರ್ವಹಣೆ (10 ಅಂಕ), ಲೆಕ್ಕಾಚಾರ ಮತ್ತು ಫಲಿತಾಂಶ (6 ಅಂಕ), ಪ್ರಾಯೋಗಿಕ ದಾಖಲೆ ಪುಸ್ತಕ/ರೆಕಾರ್ಡ್ (4 ಅಂಕ) ಹಾಗೂ ಮೌಖಿಕ ಪ್ರಶ್ನೆಗಳು/ವೈವಾ (4-6 ಅಂಕ) ಒಳಗೊಂಡಿರುತ್ತದೆ. 2PUC ನಲ್ಲಿ ಪ್ರಾಯೋಗಿಕ ಕೈಪಿಡಿಗಳು ಮತ್ತು ವೈವಾ ಪ್ರಶ್ನೋತ್ತರಗಳು ಲಭ್ಯವಿದೆ."
      ),
    },
    {
      q: t(
        "Can students and teachers contribute their own handwritten notes or question papers?",
        "ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಶಿಕ್ಷಕರು ತಮ್ಮ ನೋಟ್ಸ್‌ಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಬಹುದೇ?"
      ),
      a: t(
        "Yes! Through our 'Contribute Notes' portal, lecturers and students can upload helpful handwritten notes, college preparatory question papers, and study summaries directly to our secure Google Drive repository. After editorial review for quality and accuracy, approved materials are shared freely to benefit learners across Karnataka.",
        "ಖಂಡಿತವಾಗಿ! ನಮ್ಮ 'ನೋಟ್ಸ್ ಹಂಚಿಕೊಳ್ಳಿ' ಪುಟದ ಮೂಲಕ ಉಪನ್ಯಾಸಕರು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳು ಉತ್ತಮ ಗುಣಮಟ್ಟದ ನೋಟ್ಸ್ ಹಾಗೂ ಮಾದರಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ನೇರವಾಗಿ ನಮ್ಮ ಗೂಗಲ್ ಡ್ರೈವ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು. ಶೈಕ್ಷಣಿಕ ಪರಿಶೀಲನೆಯ ನಂತರ ಅವುಗಳನ್ನು ರಾಜ್ಯದ ಎಲ್ಲ ವಿದ್ಯಾರ್ಥಿಗಳ ಹಿತದೃಷ್ಟಿಯಿಂದ ಪ್ರಕಟಿಸಲಾಗುತ್ತದೆ."
      ),
    },
  ];

  return (
    <div className="space-y-10">
      {/* ── Section A: Academic Blueprint & Preparation Guide ── */}
      <section className="bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1C2638] text-[#2563eb] dark:text-[#818CF8] border border-blue-100 dark:border-[#293548] shadow-2xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-[#F1F5F9] dark:text-[#F1F5F9] tracking-tight">
              {t(
                "Karnataka 2nd PUC Science Exam Blueprint & Scoring Guide",
                "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ವಿಜ್ಞಾನ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ"
              )}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#A1AEC2]">
              {t(
                "Master the board blueprint, chapter weightages, and step-by-step scoring strategies",
                "ಬ್ಲೂಪ್ರಿಂಟ್ ನಿಯಮಗಳು, ಅಂಕ ಹಂಚಿಕೆ ಮತ್ತು ಗರಿಷ್ಠ ಅಂಕ ಗಳಿಸುವ ಸೂತ್ರಗಳು"
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Card 1 */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#2563eb] dark:text-[#818CF8] uppercase tracking-wider mb-2">
                <FileText className="h-4 w-4" />
                <span>{t("Part A Mastery (20 Marks)", "ಭಾಗ ಎ ತಂತ್ರ (20 ಅಂಕ)")}</span>
              </div>
              <h3 className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9] mb-1.5">
                {t("15 MCQs + 5 Fill-in-the-Blanks", "15 ಬಹುಆಯ್ಕೆ + 5 ಬಿಟ್ಟ ಸ್ಥಳ")}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-[#A1AEC2] leading-relaxed">
                {t(
                  "Part A carries zero negative marking. Focus on fundamental definitions, SI units, formula dimensions, and NCERT exemplar questions across all chapters.",
                  "ಭಾಗ ಎ ನಲ್ಲಿ ಋಣಾತ್ಮಕ ಅಂಕಗಳಿಲ್ಲ. ಮೂಲಭೂತ ವ್ಯಾಖ್ಯಾನಗಳು, ಎಸ್‌ಐ ಮಾನಗಳು ಮತ್ತು ಸೂತ್ರಗಳನ್ನು ನಿಖರವಾಗಿ ಅಭ್ಯಾಸ ಮಾಡಿ."
                )}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-[#e2e8f0] dark:border-[#293548]">
              <Link href="/category/mcq" className="text-xs font-semibold text-[#2563eb] dark:text-[#818CF8] hover:underline flex items-center gap-1">
                <span>{t("Practice MCQ Banks", "ಎಂಸಿಕ್ಯೂ ಅಭ್ಯಾಸ")}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
                <BookOpen className="h-4 w-4" />
                <span>{t("Derivations & Numericals", "ಡೆರಿವೇಶನ್‌ಗಳು & ಲೆಕ್ಕಗಳು")}</span>
              </div>
              <h3 className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9] mb-1.5">
                {t("Part C & D Scoring (40 Marks)", "ಭಾಗ ಸಿ & ಡಿ (40 ಅಂಕಗಳು)")}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-[#A1AEC2] leading-relaxed">
                {t(
                  "Derivations in Physics and named reactions in Chemistry have fixed internal choices. Write every formula step clearly to capture full step-wise marks according to KSEAB valuation.",
                  "ಭೌತಶಾಸ್ತ್ರದ ಡೆರಿವೇಶನ್‌ಗಳು ಹಾಗೂ ರಸಾಯನಶಾಸ್ತ್ರದ ಕ್ರಿಯಾವಿಧಾನಗಳಿಗೆ ಹಂತ-ಹಂತವಾಗಿ ಅಂಕ ನೀಡಲಾಗುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ಸೂತ್ರವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಬರೆಯಿರಿ."
                )}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-[#e2e8f0] dark:border-[#293548]">
              <Link href="/category/notes" className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1">
                <span>{t("Browse Chapter Notes", "ಅಧ್ಯಾಯ ನೋಟ್ಸ್ ವೀಕ್ಷಿಸಿ")}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-2">
                <Award className="h-4 w-4" />
                <span>{t("Practical Records (30 Marks)", "ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆ (30 ಅಂಕ)")}</span>
              </div>
              <h3 className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9] mb-1.5">
                {t("Lab Manuals & Viva Voce", "ಲ್ಯಾಬ್ ರೆಕಾರ್ಡ್ & ವೈವಾ ಪ್ರಶ್ನೆಗಳು")}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-[#A1AEC2] leading-relaxed">
                {t(
                  "Practicals constitute over 42% of your final Physics, Chemistry, and Biology total score. Complete your record book early and review standard viva questions.",
                  "ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆಯು ಒಟ್ಟು ಅಂಕಗಳಲ್ಲಿ ಶೇ.42 ರಷ್ಟು ಪಾಲು ಹೊಂದಿರುತ್ತದೆ. ರೆಕಾರ್ಡ್ ಪುಸ್ತಕವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ ವೈವಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ."
                )}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-[#e2e8f0] dark:border-[#293548]">
              <Link href="/category/practical" className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1">
                <span>{t("Practical Guides", "ಪ್ರಾಯೋಗಿಕ ಮಾರ್ಗದರ್ಶಿ")}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section B: Frequently Asked Questions (Accordion) ── */}
      <section className="bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800/50 shadow-2xs">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight">
              {t("Frequently Asked Questions", "ಸಾಮಾನ್ಯವಾಗಿ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQ)")}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#A1AEC2]">
              {t(
                "Everything you need to know about Karnataka 2nd PUC Science syllabus, exams, and study notes",
                "ದ್ವಿತೀಯ ಪಿಯುಸಿ ಪರೀಕ್ಷೆ, ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಸಂಪನ್ಮೂಲಗಳ ಕುರಿತ ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೋತ್ತರಗಳು"
              )}
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-[#f1f5f9] dark:border-[#293548] py-1">
              <AccordionTrigger className="text-left font-semibold text-sm sm:text-base text-[#1e293b] dark:text-[#F1F5F9] hover:text-[#2563eb] dark:hover:text-[#818CF8] transition-colors py-4 min-h-[44px]">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-[#475569] dark:text-[#A1AEC2] leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── Section C: Academic Trust & Editorial Notice ── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#f8fafc] dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b] dark:text-[#A1AEC2]">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-[#2563eb] dark:text-[#818CF8] shrink-0" />
          <div>
            <span className="font-bold text-[#0f172a]">
              {t("Independent Educational Portal", "ಸ್ವತಂತ್ರ ಶೈಕ್ಷಣಿಕ ವೇದಿಕೆ")}
            </span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">
              {t(
                "Aligned with Karnataka Pre-University (DPUE/KSEAB) guidelines. Curated for student academic excellence.",
                "ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿಯ ಪಠ್ಯಕ್ರಮಕ್ಕೆ ಅನುಗುಣವಾಗಿ ರೂಪಿತವಾಗಿದೆ."
              )}
            </p>
          </div>
        </div>
        <Link href="/about" className="shrink-0 font-semibold text-[#2563eb] dark:text-[#818CF8] hover:underline flex items-center gap-1">
          <span>{t("Read Our Editorial Mission", "ನಮ್ಮ ಧ್ಯೇಯ ತಿಳಿಯಿರಿ")}</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
