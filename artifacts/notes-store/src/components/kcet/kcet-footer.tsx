import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Send, Heart, Rocket } from "lucide-react";
import { TELEGRAM_LINK } from "@/lib/site-config";
import { BuyPaneerModal } from "@/components/buy-paneer-modal";
import { Button } from "@/components/ui/button";
import { fetchKcetSubjects, fetchKcetCategories } from "@/lib/kcet-api";
import { useAppMode } from "@/lib/app-mode-context";

export function KcetFooter() {
  const [paneerModalOpen, setPaneerModalOpen] = useState(false);
  const [selectedPaneerAmount, setSelectedPaneerAmount] = useState<number>(50);
  const [, setLocation] = useLocation();
  const { switchMode } = useAppMode();

  const { data: subjects } = useQuery({
    queryKey: ["kcet-subjects"],
    queryFn: fetchKcetSubjects,
    staleTime: 60_000,
  });

  const { data: categories } = useQuery({
    queryKey: ["kcet-categories"],
    queryFn: fetchKcetCategories,
    staleTime: 60_000,
  });

  const handleOpenPaneer = (amount: number) => {
    setSelectedPaneerAmount(amount);
    setPaneerModalOpen(true);
  };

  const navigateFilter = (key: "subject" | "category", value: string) => {
    setLocation(`/kcet?${key}=${encodeURIComponent(value)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const subjectList = subjects?.length
    ? subjects
    : [
        { id: 1, name: "Physics", slug: "physics" },
        { id: 2, name: "Chemistry", slug: "chemistry" },
        { id: 3, name: "Mathematics", slug: "mathematics" },
        { id: 4, name: "Biology", slug: "biology" },
      ];

  const categoryList = categories?.length
    ? categories
    : [
        { id: 1, name: "Notes", slug: "notes" },
        { id: 2, name: "PYQs", slug: "pyqs" },
        { id: 3, name: "Mock Papers", slug: "mock-papers" },
        { id: 4, name: "Syllabus", slug: "syllabus" },
        { id: 5, name: "Objective Books", slug: "objective-books" },
        { id: 6, name: "Formulas", slug: "formulas" },
      ];

  return (
    <>
      <footer className="relative z-10 mt-auto border-t border-[#e2e8f0] dark:border-cyan-500/20 bg-[#f8fafc] dark:bg-[#0B0F19] text-[#475569] dark:text-[#A1AEC2] pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-10 transition-colors">
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-10">
          {/* ── Compact "Buy Me Some Paneer" Strip (Matches 2nd PUC Footer) ── */}
          <div className="mb-8 p-3 sm:px-4 sm:py-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#334155] dark:text-amber-200">
              <span className="text-base select-none">🧀</span>
              <span className="font-medium">
                Found KCET Arena helpful?{" "}
                <span className="text-[#64748b] dark:text-amber-300/70">
                  (Optional) Support with some paneer
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenPaneer(20)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1C2638] hover:bg-amber-100/60 dark:hover:bg-amber-900/30 text-[#334155] dark:text-amber-200 border border-amber-200 dark:border-amber-900/40 text-xs font-semibold transition-all active:scale-95 shadow-2xs"
              >
                ₹20
              </button>
              <button
                type="button"
                onClick={() => handleOpenPaneer(50)}
                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900/70 text-amber-950 dark:text-amber-100 border border-amber-300 dark:border-amber-700 text-xs font-bold transition-all active:scale-95 shadow-2xs"
              >
                ₹50
              </button>
              <button
                type="button"
                onClick={() => handleOpenPaneer(100)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1C2638] hover:bg-amber-100/60 dark:hover:bg-amber-900/30 text-[#334155] dark:text-amber-200 border border-amber-200 dark:border-amber-900/40 text-xs font-semibold transition-all active:scale-95 shadow-2xs"
              >
                ₹100
              </button>
              <Button
                type="button"
                size="sm"
                onClick={() => handleOpenPaneer(50)}
                className="h-7 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-semibold gap-1.5 shadow-2xs ml-0.5"
              >
                <Heart className="h-3 w-3 fill-current" />
                <span>Buy Paneer</span>
              </Button>
            </div>
          </div>

          {/* ── Main 5-Column Footer Navigation Grid (Matches 2nd PUC Footer) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#e2e8f0] dark:border-[#293548]">
            {/* Brand Column */}
            <div className="col-span-1 sm:col-span-2 md:col-span-2 space-y-3.5">
              <Link
                href="/kcet"
                className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/30 rounded-lg transition-opacity hover:opacity-90"
                aria-label="KCET Arena Home"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 dark:bg-cyan-500/15 border border-sky-200 dark:border-cyan-400/40 text-sky-600 dark:text-cyan-300 shadow-2xs">
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="leading-none">
                  <span className="font-black text-lg tracking-tight text-[#0f172a] dark:text-white">
                    2PUC <span className="text-sky-600 dark:text-cyan-400">KCET</span>
                  </span>
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:text-violet-300/80 mt-0.5">
                    Competitive Exam Arena
                  </span>
                </div>
              </Link>
              <p className="text-sm text-[#475569] dark:text-[#A1AEC2] leading-relaxed max-w-sm">
                Dedicated Karnataka KCET study hub offering chapterwise shortcuts, previous year question papers, mock tests, syllabus weightage, objective guides, and formula cheat sheets.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0088cc]/10 dark:bg-[#38bdf8]/10 hover:bg-[#0088cc]/20 dark:hover:bg-[#38bdf8]/20 text-[#006299] dark:text-[#38bdf8] text-xs font-semibold transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Join Telegram</span>
                </a>
              </div>
            </div>

            {/* KCET Subjects Column */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] dark:text-[#F1F5F9] uppercase tracking-wider mb-2.5">
                KCET Subjects
              </h4>
              <ul className="space-y-2 text-sm sm:text-xs">
                {subjectList.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => navigateFilter("subject", s.name)}
                      className="hover:text-sky-600 dark:hover:text-cyan-400 transition-colors text-left cursor-pointer"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Material Categories Column */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] dark:text-[#F1F5F9] uppercase tracking-wider mb-2.5">
                Material Categories
              </h4>
              <ul className="space-y-2 text-sm sm:text-xs">
                {categoryList.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => navigateFilter("category", c.name)}
                      className="hover:text-sky-600 dark:hover:text-cyan-400 transition-colors text-left cursor-pointer"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links & Legal Column */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] dark:text-[#F1F5F9] uppercase tracking-wider mb-2.5">
                Quick Links &amp; Legal
              </h4>
              <ul className="space-y-2 text-sm sm:text-xs">
                <li>
                  <button
                    type="button"
                    onClick={(e) => switchMode("puc", e, () => setLocation("/"))}
                    className="hover:text-sky-600 dark:hover:text-cyan-400 transition-colors text-left cursor-pointer font-medium"
                  >
                    Switch to 2nd PUC Mode
                  </button>
                </li>
                <li>
                  <Link href="/kcet/contribute" className="text-sky-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1 transition-colors">
                    <span>Share KCET Material</span>
                    <span className="text-[10px] bg-sky-100 dark:bg-cyan-500/20 text-sky-800 dark:text-cyan-300 px-1.5 py-0.2 rounded-full font-bold">
                      Upload
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-sky-600 dark:hover:text-cyan-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-sky-600 dark:hover:text-cyan-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-sky-600 dark:hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-sky-600 dark:hover:text-cyan-400 transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/admin/kcet" className="hover:text-sky-600 dark:hover:text-cyan-400 transition-colors">
                    KCET Admin Board
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Bottom Bar & Copyright ── */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#64748b] dark:text-[#A1AEC2]">
            <p>
              &copy; {new Date().getFullYear()} <span className="font-semibold text-[#0f172a] dark:text-[#F1F5F9]">2PUC KCET Arena</span>. All rights reserved.
            </p>
            <p className="text-center sm:text-right text-[11px] text-[#64748b] dark:text-[#A1AEC2]">
              Aligned with Karnataka KEA / NCERT Competitive Syllabus (Independent Fair-Use Study Platform)
            </p>
          </div>
        </div>
      </footer>

      {/* Shared Buy Paneer Modal */}
      <BuyPaneerModal
        open={paneerModalOpen}
        onOpenChange={setPaneerModalOpen}
        defaultAmount={selectedPaneerAmount}
      />
    </>
  );
}
