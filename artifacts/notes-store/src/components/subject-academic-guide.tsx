import { useLanguage } from "@/lib/language-context";
import { BookOpen, GraduationCap, Award, CheckCircle2, FileText, Sparkles, Layers, Cpu } from "lucide-react";

interface SubjectGuideProps {
  slug: string;
  subjectName: string;
}

export function SubjectAcademicGuide({ slug, subjectName }: SubjectGuideProps) {
  const { language, t } = useLanguage();
  const lowerSlug = slug.toLowerCase();

  // 1. Physics Guide
  if (lowerSlug === "physics") {
    return (
      <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs text-[#1e293b] dark:text-[#F1F5F9]">
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] dark:border-[#293548] pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1C2638] text-[#2563eb] dark:text-[#818CF8] border border-blue-100 dark:border-[#293548]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Karnataka 2nd PUC Physics (PHY-33) Study & Blueprint Guide", "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ಭೌತಶಾಸ್ತ್ರ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("Theory: 70 Marks (3 Hours 15 Mins) | Practical: 30 Marks", "ಥಿಯರಿ: 70 ಅಂಕಗಳು | ಪ್ರಾಯೋಗಿಕ: 30 ಅಂಕಗಳು")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-[#2563eb] dark:text-[#818CF8] flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{t("Must-Master 5-Mark Derivations", "ಖಚಿತ 5 ಅಂಕಗಳ ಡೆರಿವೇಶನ್‌ಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>Electric field due to an electric dipole on axial and equatorial lines</li>
              <li>Capacitance of a parallel plate capacitor with dielectric medium</li>
              <li>Relation between electric current and drift velocity (I = n·e·A·v)</li>
              <li>Magnetic field on the axis of a circular current-carrying loop (Biot-Savart Law)</li>
              <li>Torque on a magnetic dipole in a uniform magnetic field</li>
              <li>Lens Maker&apos;s formula for a thin convex lens</li>
              <li>Young&apos;s double slit experiment for fringe width expression</li>
              <li>Bohr&apos;s postulates and expression for radius of nth orbit in hydrogen atom</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("High-Yield Numerical Units", "ಲೆಕ್ಕಾಚಾರದ ಪ್ರಮುಖ ಅಧ್ಯಾಯಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li><strong>Current Electricity:</strong> Kirchhoff&apos;s laws in bridge networks and potentiometer / meter bridge balancing</li>
              <li><strong>Moving Charges & Magnetism:</strong> Force between parallel conductors and galvanometer conversion</li>
              <li><strong>Ray Optics:</strong> Prism formula [n = sin((A+D)/2) / sin(A/2)] and combination of thin lenses</li>
              <li><strong>Wave Optics:</strong> Resolving limit and angular spread calculations</li>
              <li><strong>Dual Nature:</strong> Einstein&apos;s photoelectric equation and de Broglie wavelength</li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-[#334155] dark:text-[#F1F5F9] leading-relaxed">
          <strong>{t("Exam Scoring Advice:", "ಪರೀಕ್ಷಾ ಸಲಹೆ:")}</strong> {t(
            "Under the KSEAB blueprint, Part A (20 marks) contains 15 MCQs and 5 FIBs. Review SI units, dimensions, and definitions thoroughly. For numerical problems in Part D, always state the standard formula, show intermediate algebraic substitution with units, and double-underline the final answer with proper units for maximum step marks.",
            "ಭಾಗ ಎ ನಲ್ಲಿ 15 ಎಂಸಿಕ್ಯೂ ಮತ್ತು 5 ಬಿಟ್ಟ ಸ್ಥಳ ಇರುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ಲೆಕ್ಕದಲ್ಲಿಯೂ ಸೂತ್ರ, ಹಂತಗಳು ಹಾಗೂ ಕೊನೆಯಲ್ಲಿ ಸರಿಯಾದ ಯೂನಿಟ್ ಬರೆಯುವುದರಿಂದ ಪೂರ್ಣ ಅಂಕಗಳನ್ನು ಗಳಿಸಬಹುದು."
          )}
        </div>
      </div>
    );
  }

  // 2. Chemistry Guide
  if (lowerSlug === "chemistry") {
    return (
      <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs text-[#1e293b] dark:text-[#F1F5F9]">
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] dark:border-[#293548] pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-[#1C2638] text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-[#293548]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Karnataka 2nd PUC Chemistry (CHEM-34) Exam Guide", "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ರಸಾಯನಶಾಸ್ತ್ರ ಮಾರ್ಗದರ್ಶಿ")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("Theory: 70 Marks | Practical: 30 Marks (Salt Analysis & Volumetric)", "ಥಿಯರಿ: 70 ಅಂಕಗಳು | ಪ್ರಾಯೋಗಿಕ: 30 ಅಂಕಗಳು")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{t("Named Reactions & Organic Mechanisms", "ಪ್ರಮುಖ ಸಾವಯವ ರಾಸಾಯನಿಕ ಕ್ರಿಯೆಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>SN1 and SN2 reaction mechanisms of haloalkanes with stereochemistry</li>
              <li>Reimer-Tiemann and Kolbe&apos;s reactions of phenol</li>
              <li>Aldol condensation and Cross-aldol condensation mechanisms</li>
              <li>Cannizzaro reaction and Clemmensen / Wolff-Kishner reduction</li>
              <li>Sandmeyer&apos;s reaction and Gattermann synthesis of diazonium salts</li>
              <li>Hoffmann bromamide degradation for primary amines</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("Physical Chemistry Numerical Focus", "ಭೌತ ರಸಾಯನಶಾಸ್ತ್ರದ ಲೆಕ್ಕಾಚಾರಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li><strong>Solutions:</strong> Elevation of boiling point, depression of freezing point, and osmotic pressure equations</li>
              <li><strong>Electrochemistry:</strong> Nernst equation for galvanic cells [E_cell = E° - (0.059/n) log Q]</li>
              <li><strong>Chemical Kinetics:</strong> Integrated rate equation for first-order reaction and Arrhenius activation energy calculation</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 3. Mathematics Guide
  if (lowerSlug === "mathematics") {
    return (
      <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs text-[#1e293b] dark:text-[#F1F5F9]">
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] dark:border-[#293548] pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-[#1C2638] text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-[#293548]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Karnataka 2nd PUC Mathematics (MATH-35) Blueprint Guide", "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ಗಣಿತಶಾಸ್ತ್ರ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("Theory: 80 Marks | Internal Assessment: 20 Marks", "ಥಿಯರಿ: 80 ಅಂಕಗಳು | ಆಂತರಿಕ ಮೌಲ್ಯಮಾಪನ: 20 ಅಂಕಗಳು")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{t("Guaranteed 5-Mark Problem Types", "ಖಚಿತ 5 ಅಂಕಗಳ ಪ್ರಮುಖ ಲೆಕ್ಕಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>Solving system of 3 linear equations using Matrix Inversion method (X = A⁻¹B)</li>
              <li>Linear Programming: Graphical solution to maximize/minimize objective function with feasible region</li>
              <li>Shortest distance between two skew lines in Three Dimensional Geometry</li>
              <li>Continuity &amp; Differentiability second-order derivatives [d²y / dx²]</li>
              <li>Properties of definite integrals and standard symmetry proofs</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-[#2563eb] dark:text-[#818CF8] flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("Calculus Scoring Strategy", "ಕ್ಯಾಲ್ಕುಲಸ್ ಅಂಕಗಳ ಗಳಿಕೆ ತಂತ್ರ")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>Calculus accounts for over 44% of the total mathematics paper marks.</li>
              <li>Practice standard substitutions for rational and trigonometric integrands.</li>
              <li>Differential Equations: Master homogeneous and linear differential equations.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 4. Biology Guide
  if (lowerSlug === "biology") {
    return (
      <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs text-[#1e293b] dark:text-[#F1F5F9]">
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] dark:border-[#293548] pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-[#1C2638] text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-[#293548]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Karnataka 2nd PUC Biology (BIO-36) Examination Guide", "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ಜೀವಶಾಸ್ತ್ರ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("Theory: 70 Marks | Practical: 30 Marks (Slide Preparation & Spotting)", "ಥಿಯರಿ: 70 ಅಂಕಗಳು | ಪ್ರಾಯೋಗಿಕ: 30 ಅಂಕಗಳು")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{t("High-Frequency Board Diagrams", "ಪ್ರಮುಖ ರೇಖಾಚಿತ್ರಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>Diagrammatic representation of transverse section of young anther and mature pollen grain</li>
              <li>Anatropous ovule with labeled embryo sac and female gametophyte</li>
              <li>Human male reproductive system and section of seminiferous tubule</li>
              <li>Structure of human sperm and Graafian follicle</li>
              <li>Structure of an antibody molecule (Light and Heavy chains with disulfide bonds)</li>
              <li>Recombinant DNA plasmid vector pBR322 with restriction enzyme sites</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("Genetics & Biotechnology Concepts", "ತಳಿಶಾಸ್ತ್ರ & ಬಯೋಟೆಕ್ನಾಲಜಿ")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>Mendel&apos;s laws of inheritance: Incomplete dominance and co-dominance ratios</li>
              <li>Meselson and Stahl experiment for semi-conservative DNA replication</li>
              <li>Lac Operon model mechanism in E. coli with inducible regulation</li>
              <li>Polymerase Chain Reaction (PCR) steps: Denaturation, Annealing, Extension</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 5. Computer Science Guide (Specific, complete dark mode and rich syllabus details)
  if (lowerSlug.includes("comp") || lowerSlug.includes("cs")) {
    return (
      <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs text-[#1e293b] dark:text-[#F1F5F9]">
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] dark:border-[#293548] pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 dark:bg-[#1C2638] text-[#0284c7] dark:text-[#818CF8] border border-cyan-100 dark:border-[#293548]">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Karnataka 2nd PUC Computer Science (CS-41) Blueprint & Guide", "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ಗಣಕವಿಜ್ಞಾನ (Computer Science) ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("Theory: 70 Marks (3 Hours 15 Mins) | Practical: 30 Marks (C++ & SQL)", "ಥಿಯರಿ: 70 ಅಂಕಗಳು | ಪ್ರಾಯೋಗಿಕ: 30 ಅಂಕಗಳು (C++ & SQL)")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-[#0284c7] dark:text-[#818CF8] flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{t("High-Weightage Theory Units", "ಹೆಚ್ಚು ಅಂಕಗಳ ಮುಖ್ಯ ಅಧ್ಯಾಯಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li><strong>Data Structures (14 Marks):</strong> Stack operations (PUSH and POP algorithms with overflow/underflow checks), Queue operations, and Linked Lists.</li>
              <li><strong>Database Concepts & SQL (13 Marks):</strong> SQL commands (DDL, DML), group functions, constraints, and relational algebra.</li>
              <li><strong>Boolean Algebra (9 Marks):</strong> Karnaugh Map (K-Map 5-mark reduction: 4-variable SOP/POS), logic gates, and Boolean theorems.</li>
              <li><strong>Networking & Open Source (10 Marks):</strong> OSI vs TCP/IP reference layers, network topologies, transmission media, and cyber law essentials.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("C++ OOP & Practical Scoring Strategy", "C++ & ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷಾ ತಂತ್ರ")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li><strong>Classes & Inheritance:</strong> Characteristics of OOPs, Function Overloading, Constructors, Destructors, and Single/Multilevel Inheritance syntax.</li>
              <li><strong>Practical Exam (30 Marks):</strong> Writing and executing one C++ program (15 marks), SQL query execution (5 marks), Viva voce (5 marks), and Lab record journal (5 marks).</li>
              <li><strong>Pointers:</strong> Memory allocation (new and delete operators) and pointer arithmetic.</li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40 text-xs text-[#334155] dark:text-[#F1F5F9] leading-relaxed">
          <strong>{t("Exam Scoring Advice:", "ಪರೀಕ್ಷಾ ಸಲಹೆ:")}</strong> {t(
            "Under the revised KSEAB blueprint, Part A (20 marks) includes 15 MCQs and 5 Fill-in-the-blanks. Always write correct algorithmic steps for Stack and Queue operations with proper pointer updates (top = top + 1). In K-Maps, cleanly group 1s into octets, quads, and pairs, stating the reduced minterm expression clearly.",
            "ಭಾಗ ಎ ನಲ್ಲಿ 20 ಅಂಕಗಳಿದ್ದು (15 ಎಂಸಿಕ್ಯೂ ಮತ್ತು 5 ಬಿಟ್ಟ ಸ್ಥಳ), ಮೂಲಭೂತ ವ್ಯಾಖ್ಯಾನಗಳನ್ನು ಸರಿಯಾಗಿ ಅಭ್ಯಾಸ ಮಾಡಿ. ಸ್ಟಾಕ್ ಮತ್ತು ಕ್ಯೂ ಅಲ್ಗಾರಿದಂಗಳನ್ನು ಹಂತ-ಹಂತವಾಗಿ ಬರೆಯಿರಿ ಮತ್ತು ಕೆ-ಮ್ಯಾಪ್ (K-Map) ಲೆಕ್ಕಗಳಲ್ಲಿ ಗುಂಪುಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಗುರುತಿಸಿ."
          )}
        </div>
      </div>
    );
  }

  // 6. General Subject Guide fallback (Languages and other subjects) with full Dark Mode support
  return (
    <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-5 sm:p-8 space-y-4 shadow-xs text-[#1e293b] dark:text-[#F1F5F9]">
      <div className="flex items-center gap-3 border-b border-[#f1f5f9] dark:border-[#293548] pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1C2638] text-[#2563eb] dark:text-[#818CF8] border border-blue-100 dark:border-[#293548]">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9]">
            {subjectName} — {t("Curriculum & Examination Scheme", "ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಪರೀಕ್ಷಾ ವಿಧಾನ")}
          </h2>
          <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
            {t("Aligned with Karnataka Pre-University Education (KSEAB) prescribed syllabus.", "ಕರ್ನಾಟಕ ಪದವಿ ಪೂರ್ವ ಶಿಕ್ಷಣ ಇಲಾಖೆಯ ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿದೆ.")}
          </p>
        </div>
      </div>
      <p className="text-xs text-[#475569] dark:text-[#A1AEC2] leading-relaxed">
        {t(
          `Study materials, blueprints, passing packages, and model question papers for ${subjectName} are verified by educators according to the official Karnataka Pre-University Board guidelines. Review prescribed textbooks and chapterwise weightages to score high in the annual examinations.`,
          `${subjectName} ವಿಷಯದ ನೋಟ್ಸ್, ಬ್ಲೂಪ್ರಿಂಟ್ ಮತ್ತು ಮಾದರಿ ಪತ್ರಿಕೆಗಳು ಶಿಕ್ಷಣ ಮಂಡಳಿಯ ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ರೂಪಿತವಾಗಿವೆ. ಪರೀಕ್ಷೆಯಲ್ಲಿ ಗರಿಷ್ಠ ಅಂಕಗಳನ್ನು ಗಳಿಸಲು ಪಠ್ಯಪುಸ್ತಕಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ಅಧ್ಯಯನ ಮಾಡಿ.`
        )}
      </p>
    </div>
  );
}
