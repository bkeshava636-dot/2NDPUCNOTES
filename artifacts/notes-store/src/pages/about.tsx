import { GraduationCap, BookOpen, Award, CheckCircle2, ShieldCheck, Users, HelpCircle, HeartHandshake } from "lucide-react";
import { LegalPage, PolicySection } from "@/components/legal-page";
import { useLanguage } from "@/lib/language-context";

export default function AboutUs() {
  const { language, t } = useLanguage();

  return (
    <LegalPage
      title={t("About 2PUC — Academic Mission & Guidelines", "2PUC ಬಗ್ಗೆ — ಶೈಕ್ಷಣಿಕ ಧ್ಯೇಯ & ಮಾರ್ಗಸೂಚಿಗಳು")}
      description={t(
        "Empowering Karnataka 2nd PUC Science students with syllabus-aligned notes, model question papers, blueprints, and practical guides.",
        "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ವಿಜ್ಞಾನ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಗುಣಮಟ್ಟದ ನೋಟ್ಸ್, ಬ್ಲೂಪ್ರಿಂಟ್ ಮತ್ತು ಪರೀಕ್ಷಾ ಸಾಮಗ್ರಿಗಳನ್ನು ಒದಗಿಸುವ ವೇದಿಕೆ."
      )}
      icon={GraduationCap}
    >
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-4">
          <BookOpen className="h-6 w-6 text-primary mb-2" />
          <h3 className="font-bold text-gray-900 dark:text-[#F1F5F9] text-sm">{t("100% NCERT & KSEAB Aligned", "ಪೂರ್ಣ ಪಠ್ಯಕ್ರಮ ಹೊಂದಾಣಿಕೆ")}</h3>
          <p className="text-xs text-gray-600 dark:text-[#A1AEC2] mt-1">
            {t("Strictly mapped to the Karnataka School Examination and Assessment Board revised syllabus.", "ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿಯ ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿದೆ.")}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-4">
          <Award className="h-6 w-6 text-emerald-600 mb-2" />
          <h3 className="font-bold text-gray-900 dark:text-[#F1F5F9] text-sm">{t("Curated by Educators & Toppers", "ಶಿಕ್ಷಕರು & ಟಾಪರ್ಸ್‌ಗಳಿಂದ ಪರಿಶೀಲನೆ")}</h3>
          <p className="text-xs text-gray-600 dark:text-[#A1AEC2] mt-1">
            {t("Formulated by experienced PUC lecturers and state rank holders with clear step-by-step derivations.", "ಅನುಭವಿ ಉಪನ್ಯಾಸಕರು ಮತ್ತು ಟಾಪರ್ಸ್‌ಗಳ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ರೂಪಿತವಾಗಿದೆ.")}
          </p>
        </div>
        <div className="rounded-xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/60 dark:bg-purple-950/20 p-4">
          <HeartHandshake className="h-6 w-6 text-purple-600 mb-2" />
          <h3 className="font-bold text-gray-900 dark:text-[#F1F5F9] text-sm">{t("Accessible to All Students", "ಎಲ್ಲ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸುಲಭ ಲಭ್ಯತೆ")}</h3>
          <p className="text-xs text-gray-600 dark:text-[#A1AEC2] mt-1">
            {t("Providing high-quality free and nominal study materials across Karnataka in both English and Kannada.", "ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಮಾಧ್ಯಮದ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಕೈಗೆಟಕುವ ದರದಲ್ಲಿ ಉತ್ತಮ ಸಂಪನ್ಮೂಲಗಳು.")}
          </p>
        </div>
      </div>

      <PolicySection title={t("Our Mission", "ನಮ್ಮ ಧ್ಯೇಯ")}>
        <p>
          <strong>2PUC (2nd PUC Notes)</strong> was founded with a singular, student-first objective: to eliminate the confusion and stress surrounding Karnataka 2nd Pre-University Board Examinations. Every academic year, thousands of PUC Science students struggle to find organized, reliable, and up-to-date study notes, model papers, and practical records that strictly reflect the latest board blueprint.
        </p>
        <p>
          We provide a comprehensive, clutter-free digital library of chapterwise handwritten notes, important question banks, previous year question papers (PYQs), blueprint model question papers (MQP), and practical viva questions for Physics, Chemistry, Mathematics, Biology, and Computer Science.
        </p>
      </PolicySection>

      <PolicySection title={t("Academic Quality & Editorial Standards", "ಶೈಕ್ಷಣಿಕ ಗುಣಮಟ್ಟ ಮತ್ತು ಪರಿಶೀಲನಾ ವಿಧಾನ")}>
        <p>
          Every piece of study material hosted on our platform undergoes a rigorous academic review process before publication:
        </p>
        <ul className="list-disc space-y-2 pl-5 mt-2">
          <li>
            <strong>Syllabus Fidelity:</strong> All resources are verified against the latest Karnataka Department of Pre-University Education (DPUE) and KSEAB revised textbooks and rationalized NCERT syllabi.
          </li>
          <li>
            <strong>Marking Scheme Compliance:</strong> Model papers and solutions are calibrated with official KSEAB scheme of valuation, ensuring students master the exact step-marking format rewarded in board evaluations.
          </li>
          <li>
            <strong>Clarity & Accuracy:</strong> Mathematical steps, chemical equations, circuit diagrams, and biological illustrations are checked for precision, legibility, and pedagogical soundness.
          </li>
          <li>
            <strong>Regular Revisions:</strong> Whenever the board updates question patterns, blueprint weightages, or practical evaluation guidelines, our materials are promptly refreshed.
          </li>
        </ul>
      </PolicySection>

      <PolicySection title={t("Core Academic Subjects Covered", "ಒಳಗೊಂಡಿರುವ ಪ್ರಮುಖ ವಿಷಯಗಳು")}>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong>Physics (PHY-33):</strong> Mechanics, Electrostatics, Magnetism, Optics, Modern Physics & Semiconductor Electronics with standard board derivations and numerical problems.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong>Chemistry (CHEM-34):</strong> Physical, Inorganic, and Organic Chemistry with reaction mechanisms, conversions, IUPAC naming, and reasoning questions.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong>Mathematics (MATH-35):</strong> Calculus, Linear Algebra, Vectors, 3D Geometry, Linear Programming, and Probability with step-by-step solutions.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong>Biology (BIO-36):</strong> Genetics, Biotechnology, Human Physiology, Ecology, and labelled diagrams compliant with board evaluation standards.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong>Computer Science (CS-41):</strong> C++, OOPs concepts, Data Structures, DBMS & SQL queries, Boolean algebra, and computer networking.
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <strong>Languages (Kannada, English, Hindi, Sanskrit):</strong> Grammar, textbook summaries, essay structures, and comprehension passages.
          </div>
        </div>
      </PolicySection>

      <PolicySection title={t("Community Contributions & Open Access", "ಸಮುದಾಯದ ಕೊಡುಗೆ ಮತ್ತು ಮುಕ್ತ ಪ್ರವೇಶ")}>
        <p>
          We encourage students and educators to collaborate. Through our <strong>Contribute Notes</strong> initiative, college lecturers and bright students can submit verified notes and model papers directly to our Google Drive repository, which are then reviewed and made accessible to students across rural and urban Karnataka.
        </p>
      </PolicySection>

      <PolicySection title={t("Educational Disclaimer", "ಶೈಕ್ಷಣಿಕ ಹಕ್ಕು ನಿರಾಕರಣೆ")}>
        <p className="text-xs text-gray-500 leading-relaxed">
          2PUC (2nd PUC Notes) is an independent educational platform created to assist students in their exam preparation. We are not officially affiliated with, endorsed by, or representing the Karnataka School Examination and Assessment Board (KSEAB) or the Department of Pre-University Education, Karnataka. All official examination notices, circulars, and authoritative syllabi should always be verified directly from the official state portal (kseab.karnataka.gov.in).
        </p>
      </PolicySection>
    </LegalPage>
  );
}
