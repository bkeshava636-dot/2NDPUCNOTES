import { useLanguage } from "@/lib/language-context";
import { BookOpen, GraduationCap, Award, CheckCircle2, FileText, Sparkles, Layers, Cpu, Compass, BookA, Scroll, HelpCircle } from "lucide-react";

interface SubjectGuideProps {
  slug: string;
  subjectName: string;
}

export function SubjectAcademicGuide({ slug, subjectName }: SubjectGuideProps) {
  const { language, t } = useLanguage();
  const lowerSlug = slug.toLowerCase();

  // 1. Physics Guide (PHY-33)
  if (lowerSlug === "physics") {
    return (
      <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs text-[#1e293b] dark:text-[#F1F5F9]">
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] dark:border-[#293548] pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1C2638] text-[#2563eb] dark:text-[#818CF8] border border-blue-100 dark:border-[#293548]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Karnataka 2nd PUC Physics (PHY-33) Academic Curriculum & Blueprint Guide", "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ಭೌತಶಾಸ್ತ್ರ ಪರೀಕ್ಷಾ ಮತ್ತು ಪಠ್ಯಕ್ರಮ ಮಾರ್ಗದರ್ಶಿ")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("Theory: 70 Marks (3 Hours 15 Mins) | Practical Assessment: 30 Marks | Total: 100 Marks", "ಥಿಯರಿ: 70 ಅಂಕಗಳು (3 ಗಂಟೆ 15 ನಿಮಿಷ) | ಪ್ರಾಯೋಗಿಕ: 30 ಅಂಕಗಳು | ಒಟ್ಟು: 100 ಅಂಕಗಳು")}
            </p>
          </div>
        </div>

        {/* Blueprint Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Part A (Objective)</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">20 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">15 MCQs + 5 Fill in the Blanks</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Part B (Short Answer)</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">10 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">5 out of 10 questions (2 marks each)</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Part C (Analytical)</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">15 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">5 out of 9 questions (3 marks each)</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Part D (Derivations & Numericals)</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">25 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">3 Derivations + 2 Numericals (5m each)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-[#2563eb] dark:text-[#818CF8] flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{t("Must-Master 5-Mark Derivations", "ಖಚಿತ 5 ಅಂಕಗಳ ಡೆರಿವೇಶನ್‌ಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>Electric field due to an electric dipole on axial and equatorial lines (Gauss&apos;s Law application)</li>
              <li>Capacitance of a parallel plate capacitor with dielectric medium slab</li>
              <li>Relation between electric current and drift velocity (I = n·e·A·v_d) and Ohm&apos;s law derivation</li>
              <li>Magnetic field on the axis of a circular current loop via Biot-Savart Law</li>
              <li>Torque on a magnetic dipole in uniform magnetic field and galvanometer conversion</li>
              <li>Lens Maker&apos;s formula for thin convex lens and combination of thin lenses in contact</li>
              <li>Young&apos;s double slit experiment expression for dark and bright fringe width (β = λD/d)</li>
              <li>Bohr&apos;s postulates and expression for radius of nth stationary orbit in hydrogen atom</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("High-Yield Numerical Units (Part D)", "ಲೆಕ್ಕಾಚಾರದ ಪ್ರಮುಖ ಅಧ್ಯಾಯಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li><strong>Current Electricity:</strong> Kirchhoff&apos;s rules for Wheatstone bridge networks and cell combination emf</li>
              <li><strong>Moving Charges & Magnetism:</strong> Force between parallel current-carrying conductors and cyclotron resonance</li>
              <li><strong>Alternating Current:</strong> Series LCR resonant frequency, impedance, power factor, and quality factor (Q)</li>
              <li><strong>Ray Optics & Instruments:</strong> Refraction at spherical surfaces, critical angle, and compound microscope magnification</li>
              <li><strong>Dual Nature & Atoms:</strong> Photoelectric stopping potential, work function, and Rydberg spectral series calculations</li>
            </ul>
          </div>
        </div>

        {/* Practical Exam Information */}
        <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2 text-xs">
          <h3 className="font-bold text-sm text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>{t("Practical Examination Scheme (30 Marks)", "ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷಾ ವಿಧಾನ (30 ಅಂಕಗಳು)")}</span>
          </h3>
          <p className="text-[#475569] dark:text-[#A1AEC2] leading-relaxed">
            The annual 2nd PUC Physics practical examination is conducted for 2 hours with external and internal examiners.
            Marks breakdown: <strong>Formula & Principle:</strong> 4 Marks | <strong>Circuit / Ray diagram:</strong> 4 Marks | <strong>Performance & Readings:</strong> 8 Marks | <strong>Calculation with Unit & Graph:</strong> 4 Marks | <strong>Viva-Voce:</strong> 5 Marks | <strong>Practical Record Book:</strong> 5 Marks.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-[#334155] dark:text-[#F1F5F9] leading-relaxed">
          <strong>{t("Exam Scoring Advice:", "ಪರೀಕ್ಷಾ ಸಲಹೆ:")}</strong> {t(
            "Under the KSEAB blueprint, Part A (20 marks) contains 15 MCQs and 5 FIBs with zero negative marking. Review SI units, dimensions, and standard definitions thoroughly. For numerical problems in Part D, always state the standard formula, show intermediate algebraic substitution with units, and double-underline the final answer with proper units for maximum step marks.",
            "ಭಾಗ ಎ ನಲ್ಲಿ 15 ಎಂಸಿಕ್ಯೂ ಮತ್ತು 5 ಬಿಟ್ಟ ಸ್ಥಳ ಇರುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ಲೆಕ್ಕದಲ್ಲಿಯೂ ಸೂತ್ರ, ಹಂತಗಳು ಹಾಗೂ ಕೊನೆಯಲ್ಲಿ ಸರಿಯಾದ ಯೂನಿಟ್ ಬರೆಯುವುದರಿಂದ ಪೂರ್ಣ ಅಂಕಗಳನ್ನು ಗಳಿಸಬಹುದು."
          )}
        </div>
      </div>
    );
  }

  // 2. Chemistry Guide (CHEM-34)
  if (lowerSlug === "chemistry") {
    return (
      <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs text-[#1e293b] dark:text-[#F1F5F9]">
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] dark:border-[#293548] pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-[#1C2638] text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-[#293548]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Karnataka 2nd PUC Chemistry (CHEM-34) Academic & Exam Guide", "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ರಸಾಯನಶಾಸ್ತ್ರ ಮಾರ್ಗದರ್ಶಿ")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("Theory: 70 Marks | Practical: 30 Marks (Salt Analysis & Volumetric Titration) | Total: 100 Marks", "ಥಿಯರಿ: 70 ಅಂಕಗಳು | ಪ್ರಾಯೋಗಿಕ: 30 ಅಂಕಗಳು | ಒಟ್ಟು: 100 ಅಂಕಗಳು")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Physical Chemistry</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">23 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">Solutions, Electrochemistry, Kinetics</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Inorganic Chemistry</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">18 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">d & f Block, Coordination Compounds</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Organic Chemistry</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">29 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">Haloalkanes, Alcohols, Aldehydes, Amines</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Biomolecules</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">6 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">Proteins, Nucleic Acids, Carbohydrates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{t("Named Reactions & Organic Mechanisms", "ಪ್ರಮುಖ ಸಾವಯವ ರಾಸಾಯನಿಕ ಕ್ರಿಯೆಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>SN1 and SN2 reaction mechanisms of alkyl halides with inversion vs racemization stereochemistry</li>
              <li>Reimer-Tiemann reaction (salicylaldehyde) and Kolbe&apos;s synthesis (salicylic acid) of phenol</li>
              <li>Aldol and Cross-Aldol condensation mechanisms with dilute alkali</li>
              <li>Cannizzaro reaction for aldehydes without alpha-hydrogens (self-redox)</li>
              <li>Clemmensen reduction (Zn-Hg / conc. HCl) and Wolff-Kishner reduction (hydrazine / KOH)</li>
              <li>Sandmeyer&apos;s and Gattermann reactions for aryl halide synthesis from diazonium salts</li>
              <li>Hoffmann bromamide degradation reaction for primary aliphatic and aromatic amines</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("Physical Chemistry Numerical Focus", "ಭೌತ ರಸಾಯನಶಾಸ್ತ್ರದ ಲೆಕ್ಕಾಚಾರಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li><strong>Solutions:</strong> Elevation of boiling point (ΔTb = Kb·m), depression of freezing point (ΔTf = Kf·m), and osmotic pressure (π = CRT) calculations</li>
              <li><strong>Electrochemistry:</strong> Nernst equation for galvanic cell potentials [E_cell = E° - (0.059/n) log Q] and Kohlrausch&apos;s law of independent ion migration</li>
              <li><strong>Chemical Kinetics:</strong> Integrated rate equations for zero and first order reactions, half-life (t_1/2 = 0.693/k), and Arrhenius activation energy</li>
              <li><strong>Coordination Chemistry:</strong> Werner&apos;s theory, Crystal Field Theory (CFT) octahedral/tetrahedral splitting, and IUPAC nomenclature</li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2 text-xs">
          <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>{t("Chemistry Practical Exam Scheme (30 Marks)", "ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷಾ ವಿವರ (30 ಅಂಕಗಳು)")}</span>
          </h3>
          <p className="text-[#475569] dark:text-[#A1AEC2] leading-relaxed">
            The 30-mark practical examination includes: <strong>Volumetric Titration (Acid-Base or Redox):</strong> 10 Marks | <strong>Qualitative Inorganic Salt Analysis (Cation + Anion detection):</strong> 10 Marks | <strong>Viva-Voce:</strong> 5 Marks | <strong>Practical Journal/Record:</strong> 5 Marks.
          </p>
        </div>
      </div>
    );
  }

  // 3. Mathematics Guide (MATH-35)
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
              {t("Theory: 80 Marks (3 Hours 15 Mins) | Continuous Internal Assessment: 20 Marks | Total: 100 Marks", "ಥಿಯರಿ: 80 ಅಂಕಗಳು | ಆಂತರಿಕ ಮೌಲ್ಯಮಾಪನ: 20 ಅಂಕಗಳು | ಒಟ್ಟು: 100 ಅಂಕಗಳು")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Part A (MCQ & FIB)</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">20 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">15 MCQs + 5 FIBs</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Part B (2 Marks)</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">12 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">Answer 6 of 11 questions</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Part C (3 Marks)</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">18 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">Answer 6 of 11 questions</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Part D (5 Marks)</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">20 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">Answer 4 of 8 questions</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548]">
            <span className="text-[#64748b] dark:text-[#A1AEC2] font-medium block">Part E (6+4 Marks)</span>
            <span className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">10 Marks</span>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-0.5">Answer 1 of 2 questions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{t("Guaranteed High-Yield Problem Types", "ಖಚಿತ ಅಂಕಗಳ ಪ್ರಮುಖ ಲೆಕ್ಕಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>Solving system of 3 linear equations using Matrix Inversion method (X = A⁻¹B) (5 Marks)</li>
              <li>Linear Programming Problem: Graphical optimization method to maximize/minimize Z subject to constraints (Part E 6 Marks)</li>
              <li>Definite Integral standard symmetry proof: ∫[0 to a] f(x)dx = ∫[0 to a] f(a-x)dx and evaluation (Part E 6 Marks)</li>
              <li>Shortest distance between two skew lines in Three Dimensional Geometry (Vector & Cartesian forms) (5 Marks)</li>
              <li>Second-order derivatives [d²y / dx²] algebraic proofs involving logarithmic and parametric functions (5 Marks)</li>
              <li>Relations & Functions: Proof of equivalence relation, one-one, and onto functions (5 Marks)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-[#2563eb] dark:text-[#818CF8] flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("Calculus Scoring Strategy", "ಕ್ಯಾಲ್ಕುಲಸ್ ಅಂಕಗಳ ಗಳಿಕೆ ತಂತ್ರ")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>Calculus (Continuity, Differentiation, Integrals, Applications & Differential Equations) carries over 44 marks in total paper choices.</li>
              <li>Master integration by partial fractions, substitution of quadratic denominators, and integration by parts [∫u·v dx].</li>
              <li>Application of Integrals: Finding area under simple curves, parabolas, ellipses, and circles.</li>
              <li>Probability: Bayes&apos; Theorem, conditional probability, and independent events distribution.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 4. Biology Guide (BIO-36)
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
              {t("Theory: 70 Marks | Practical: 30 Marks (Spotting & Experiments) | Total: 100 Marks", "ಥಿಯರಿ: 70 ಅಂಕಗಳು | ಪ್ರಾಯೋಗಿಕ: 30 ಅಂಕಗಳು | ಒಟ್ಟು: 100 ಅಂಕಗಳು")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{t("High-Frequency Board Diagrams (5 Marks)", "ಪ್ರಮುಖ ರೇಖಾಚಿತ್ರಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>T.S. of young anther and mature pollen grain with labeled wall layers</li>
              <li>Anatropous ovule showing chalaza, micropyle, and 7-celled 8-nucleate female gametophyte</li>
              <li>Human male reproductive system and transverse section of testis seminiferous tubule</li>
              <li>Human female reproductive system and mature Graafian follicle structure</li>
              <li>Structure of an antibody molecule with antigen-binding sites and disulfide bonds</li>
              <li>Recombinant DNA cloning vector pBR322 with ori, rop, and selectable antibiotic markers</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("Genetics, Molecular Biology & Biotechnology", "ತಳಿಶಾಸ್ತ್ರ & ಬಯೋಟೆಕ್ನಾಲಜಿ")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li>Mendelian inheritance: Monohybrid (3:1 / 1:2:1), Dihybrid (9:3:3:1), and Incomplete Dominance</li>
              <li>Hershey-Chase bacteriophage experiment and Meselson-Stahl semi-conservative replication proof</li>
              <li>Genetic code features (universal, degenerate, non-overlapping) and Lac Operon induction</li>
              <li>Recombinant DNA technology steps: Restriction enzyme digestion, gel electrophoresis, PCR, and bioreactors</li>
              <li>Ecological pyramids of energy, biomass, and numbers with food web energy flow rules</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 5. Computer Science Guide (CS-41)
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
              {t("Theory: 70 Marks (3 Hours 15 Mins) | Practical: 30 Marks (C++ & SQL) | Total: 100 Marks", "ಥಿಯರಿ: 70 ಅಂಕಗಳು | ಪ್ರಾಯೋಗಿಕ: 30 ಅಂಕಗಳು (C++ & SQL) | ಒಟ್ಟು: 100 ಅಂಕಗಳು")}
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
              <li><strong>Database Concepts & SQL (13 Marks):</strong> SQL commands (DDL: CREATE/ALTER, DML: INSERT/UPDATE/SELECT), GROUP BY, HAVING, and primary/foreign keys.</li>
              <li><strong>Boolean Algebra (9 Marks):</strong> Karnaugh Map (K-Map 5-mark reduction: 4-variable SOP/POS), logic gates, and De Morgan&apos;s theorems.</li>
              <li><strong>Networking & Open Source (10 Marks):</strong> OSI vs TCP/IP reference layers, network topologies (Star, Ring, Bus), and transmission media.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("C++ OOP & Practical Scoring Strategy", "C++ & ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷಾ ತಂತ್ರ")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li><strong>Classes & Objects:</strong> OOP characteristics, Access specifiers (private, public, protected), Constructors & Destructors.</li>
              <li><strong>Inheritance:</strong> Single, Multilevel, Hierarchical, and Multiple inheritance with syntax and access controls.</li>
              <li><strong>Pointers:</strong> Memory management with new and delete operators, pointer arithmetic, and array pointers.</li>
              <li><strong>Practical Exam (30 Marks):</strong> Executing one C++ program (15m), SQL query execution (5m), Viva voce (5m), and Lab journal (5m).</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 6. English Guide (ENG-02)
  if (lowerSlug === "english") {
    return (
      <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs text-[#1e293b] dark:text-[#F1F5F9]">
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] dark:border-[#293548] pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-[#1C2638] text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-[#293548]">
            <BookA className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Karnataka 2nd PUC English (ENG-02) Springs & Streams Examination Guide", "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ಇಂಗ್ಲಿಷ್ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("Total: 100 Marks (3 Hours 15 Mins) | Textbook: Springs | Workbook: Streams", "ಒಟ್ಟು: 100 ಅಂಕಗಳು | ಪಠ್ಯಪುಸ್ತಕ: ಸ್ಪ್ರಿಂಗ್ಸ್ | ವರ್ಕ್‌ಬುಕ್: ಸ್ಟ್ರೀಮ್ಸ್")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{t("Coursebook Modules (Springs - 50 Marks)", "ಕೋರ್ಸ್‌ಬುಕ್ ಪ್ರಮುಖ ಪಾಠಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li><strong>Poetry:</strong> Romeo and Juliet (Shakespeare), On Children (Kahlil Gibran), When You Are Old (W.B. Yeats), Water (Challapalli Swaroopa Rani).</li>
              <li><strong>Prose:</strong> Too Dear! (Leo Tolstoy), Everything I Need to Know I Learned in the Forest (Vandana Shiva), A Sunny Morning (Serafin &amp; Joaquin Alvarez Quintero).</li>
              <li><strong>Essays & Fiction:</strong> The Gardener (P. Lankesh), To the Foot from its Child (Pablo Neruda), I Believe that the Books Will Never Disappear (Borges), Japan and Brazil Through a Traveler&apos;s Eye (George Mikes), The Voter (Chinua Achebe).</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("Grammar & Composition (Streams - 50 Marks)", "ವ್ಯಾಕರಣ ಮತ್ತು ಪ್ರಬಂಧ ರಚನೆ")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li><strong>Unseen Reading Comprehension:</strong> Passage analysis with 10 questions (10 Marks).</li>
              <li><strong>Pronoun & Referencing:</strong> Identifying antecedent references in given text (4 Marks).</li>
              <li><strong>Job Application Letter & Curriculum Vitae (CV):</strong> Formal application letter drafting with educational qualifications and references (5 Marks).</li>
              <li><strong>Report Writing / Speech Writing:</strong> Summarizing tabular/pie-chart data or preparing a 100-word formal address (5 Marks).</li>
              <li><strong>Grammar & Syntax:</strong> Passive voice conversion (3 Marks), Reported speech dialogue transformation (5 Marks), Subject-verb agreement (3 Marks).</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 7. Kannada Guide (KAN-01)
  if (lowerSlug === "kannada") {
    return (
      <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-5 sm:p-8 space-y-6 shadow-xs text-[#1e293b] dark:text-[#F1F5F9]">
        <div className="flex items-center gap-3 border-b border-[#f1f5f9] dark:border-[#293548] pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 dark:bg-[#1C2638] text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-[#293548]">
            <Scroll className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-[#F1F5F9]">
              {t("Karnataka 2nd PUC Kannada (KAN-01) Sahitya Sampada Examination Guide", "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ಕನ್ನಡ ಸಾಹಿತ್ಯ ಸಂಪದ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ")}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              {t("Total: 100 Marks (3 Hours 15 Mins) | Textbook: Sahitya Sampada | Drama: Krishnegowdana Aane", "ಒಟ್ಟು: 100 ಅಂಕಗಳು | ಪಠ್ಯಪುಸ್ತಕ: ಸಾಹಿತ್ಯ ಸಂಪದ | ನಾಟಕ: ಕೃಷ್ಣೇಗೌಡನ ಆನೆ")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-orange-700 dark:text-orange-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{t("Prescribed Modules & Weightages", "ಪ್ರಮುಖ ಪಠ್ಯ ಭಾಗಗಳು")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li><strong>ಪದ್ಯ ಭಾಗ (Poetry):</strong> ಕದಡಿದ ಸಲಿಲಂ ತಿಳಿವಂದದದೆ, ಮುಟ್ಟಿಸಿಕೊಂಡವನು, ಜಾಲಿಯ ಮರದಂತೆ, ಹಬ್ಬಲಿ ಅವರ ರಸಬಳ್ಳಿ.</li>
              <li><strong>ಗದ್ಯ ಭಾಗ (Prose):</strong> ದುರ್ಯೋಧನ ವಿಲಾಪ, ಕೃಷ್ಣೇಗೌಡನ ಆನೆ (ಪೂರ್ಣ ಚಂದ್ರ ತೇಜಸ್ವಿ), ಕರ್ಣನ ಕವಚ ಕುಂಡಲ ದಾನ, ಬದುಕನ್ನು ಪ್ರೀತಿಸಿದ ಸಂತ.</li>
              <li><strong>ನಾಟಕ (Drama):</strong> ಕೃಷ್ಣೇಗೌಡನ ಆನೆ ಕಥಾ ಹಂದರ, ಸಮಾಜಿಕ ವಿಡಂಬನೆ, ಮತ್ತು ಪಾತ್ರ ವಿಶ್ಲೇಷಣೆ.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] space-y-2">
            <h3 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{t("Grammar & Composition (ವ್ಯಾಕರಣ & ಪ್ರಬಂಧ)", "ವ್ಯಾಕರಣ ಮತ್ತು ಅಂಕ ಗಳಿಕೆ")}</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[#475569] dark:text-[#A1AEC2]">
              <li><strong>ವ್ಯಾಕರಣ (Grammar):</strong> ಸಂಧಿ (ಲೋಪ, ಆಗಮ, ಆದೇಶ), ಸಮಾಸ (ತತ್ಪುರುಷ, ಕರ್ಮಧಾರಯ, ದ್ವಂದ್ವ), ನಾಣ್ಣುಡಿ ವಿವರಣೆ, ಗಾದೆ ಮಾತು ವಿಸ್ತರಣೆ.</li>
              <li><strong>ಪತ್ರ ಲೇಖನ (Letter Writing):</strong> ಅಧಿಕೃತ ಮತ್ತು ವ್ಯವಹಾರಿಕ ಪತ್ರ ಲೇಖನ ಮಾದರಿ (5 Marks).</li>
              <li><strong>ಪ್ರಬಂಧ ರಚನೆ (Essay Writing):</strong> ಪ್ರಚಲಿತ ವಿಷಯಗಳ ಮೇಲೆ ಸಮಗ್ರ ಪ್ರಬಂಧ ರಚನೆ (5 Marks).</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 8. General Subject Guide fallback
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
            {t("Aligned with Karnataka School Examination and Assessment Board (KSEAB) prescribed standards.", "ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿ (KSEAB) ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿದೆ.")}
          </p>
        </div>
      </div>
      <p className="text-xs text-[#475569] dark:text-[#A1AEC2] leading-relaxed">
        {t(
          `Study materials, blueprints, passing packages, and model question papers for ${subjectName} are verified by experienced educators according to official Karnataka Pre-University Board guidelines. All notes adhere strictly to the rationalized NCERT curriculum with non-evaluative syllabus sections omitted.`,
          `${subjectName} ವಿಷಯದ ನೋಟ್ಸ್, ಬ್ಲೂಪ್ರಿಂಟ್ ಮತ್ತು ಮಾದರಿ ಪತ್ರಿಕೆಗಳು ಶಿಕ್ಷಣ ಮಂಡಳಿಯ ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ರೂಪಿತವಾಗಿವೆ. ಪರೀಕ್ಷೆಯಲ್ಲಿ ಗರಿಷ್ಠ ಅಂಕಗಳನ್ನು ಗಳಿಸಲು ಅಧಿಕೃತ ಪಠ್ಯಪುಸ್ತಕಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ಅಧ್ಯಯನ ಮಾಡಿ.`
        )}
      </p>
    </div>
  );
}
