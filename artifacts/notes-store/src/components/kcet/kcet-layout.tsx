import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ModeTogglePill } from "@/components/mode-toggle-pill";
import { ThemeToggle } from "@/components/theme-toggle";
import { TELEGRAM_LINK } from "@/lib/site-config";
import { useAppMode } from "@/lib/app-mode-context";
import {
  Rocket,
  Search,
  UploadCloud,
  Send,
  Home as HomeIcon,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function KcetLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { switchMode } = useAppMode();

  const handleSearchFocus = () => {
    if (location !== "/" && location !== "/kcet") {
      setLocation("/kcet");
      setTimeout(() => {
        const el = document.getElementById("kcet-search-input");
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    } else {
      const el = document.getElementById("kcet-search-input");
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#f8fafc] dark:bg-[#050814] text-[#0f172a] dark:text-slate-100 antialiased selection:bg-sky-500/20 selection:text-sky-900 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200 relative overflow-x-clip transition-colors">
      {/* Subtle Ambient Grid Background (Light & Dark aware) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(14,165,233,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e2e8f0] dark:border-cyan-500/20 bg-white/95 dark:bg-[#060a19]/95 backdrop-blur-md shadow-2xs dark:shadow-[0_4px_24px_rgba(6,182,212,0.08)] transition-colors">
        <div className="container max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-15 flex items-center justify-between gap-2">
          {/* Top-Left: Mode Toggle Switch + KCET Arena Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <ModeTogglePill />

            <Link
              href="/kcet"
              className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#e2e8f0] dark:border-slate-800 hover:opacity-90 transition-opacity shrink-0"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-violet-500/20 border border-sky-200 dark:border-cyan-400/40 text-sky-600 dark:text-cyan-300">
                <Rocket className="h-3.5 w-3.5" />
              </div>
              <div className="leading-none">
                <span className="font-black text-sm tracking-tight text-[#0f172a] dark:text-white">
                  KCET <span className="text-sky-600 dark:text-cyan-400">ARENA</span>
                </span>
                <span className="block text-[9px] font-mono uppercase tracking-widest text-indigo-600 dark:text-violet-300/80">
                  Competitive Prep
                </span>
              </div>
            </Link>
          </div>

          {/* Top-Right Navigation */}
          <nav className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearchFocus}
              className="hidden md:flex h-8.5 px-2.5 rounded-lg text-xs font-semibold text-[#475569] dark:text-slate-300 hover:text-[#0f172a] dark:hover:text-cyan-300 hover:bg-[#f1f5f9] dark:hover:bg-cyan-500/10 border border-transparent hover:border-[#cbd5e1] dark:hover:border-cyan-500/30 items-center gap-1.5"
            >
              <Search className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-400" />
              <span>Search KCET</span>
            </Button>

            <Link href="/kcet/contribute" className="hidden md:inline-flex">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  location === "/kcet/contribute"
                    ? "bg-sky-50 dark:bg-cyan-500/15 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-cyan-400/40"
                    : "text-[#334155] dark:text-slate-300 hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-white/5 border border-transparent"
                }`}
              >
                <UploadCloud className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-400" />
                <span>Share Material</span>
              </Button>
            </Link>

            <ThemeToggle />

            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-8.5 rounded-lg text-xs font-semibold bg-sky-50 dark:bg-cyan-500/10 hover:bg-sky-100 dark:hover:bg-cyan-500/20 text-[#0284c7] dark:text-cyan-300 border border-sky-200 dark:border-cyan-500/30 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Telegram</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 w-full pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
        {children}
      </main>

      {/* Dedicated KCET Footer (Light & Dark aware) */}
      <footer className="relative z-10 border-t border-[#e2e8f0] dark:border-cyan-500/20 bg-white dark:bg-[#040611] text-[#64748b] dark:text-slate-400 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-8 transition-colors">
        <div className="container max-w-6xl mx-auto px-4 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 dark:bg-cyan-500/15 border border-sky-200 dark:border-cyan-400/40 text-sky-600 dark:text-cyan-300">
                  <Rocket className="h-3.5 w-3.5" />
                </div>
                <span className="font-black text-sm text-[#0f172a] dark:text-white">
                  2PUC <span className="text-sky-600 dark:text-cyan-400">KCET ARENA</span>
                </span>
              </div>
              <p className="leading-relaxed">
                Dedicated competitive preparation library for Karnataka Common Entrance Test (KCET) aspirants across Physics, Chemistry, Mathematics &amp; Biology.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-[#0f172a] dark:text-white uppercase tracking-wider text-[11px]">Arena Navigation</h3>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/kcet" className="hover:text-sky-600 dark:hover:text-cyan-300 transition-colors">
                    KCET Dashboard &amp; Resources
                  </Link>
                </li>
                <li>
                  <Link href="/kcet/contribute" className="hover:text-sky-600 dark:hover:text-cyan-300 transition-colors">
                    Share / Contribute KCET Material
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => switchMode("puc", e, () => setLocation("/"))}
                    className="hover:text-sky-600 dark:hover:text-cyan-300 transition-colors text-left cursor-pointer"
                  >
                    Switch back to 2nd PUC Board Mode
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-[#0f172a] dark:text-white uppercase tracking-wider text-[11px]">Academic Attribution</h3>
              <p className="leading-relaxed text-[11px]">
                KCET syllabus outlines and past question papers are referenced strictly for non-commercial student exam preparation under fair-use. Not officially affiliated with KEA (Karnataka Examinations Authority).
              </p>
              <div className="pt-1 flex items-center gap-3 text-[11px]">
                <Link href="/admin/kcet" className="hover:text-sky-600 dark:hover:text-cyan-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>KCET Admin</span>
                </Link>
                <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="text-sky-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Student Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav
        aria-label="KCET Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[calc(3.25rem+env(safe-area-inset-bottom,0px))] bg-white/95 dark:bg-[#060a19]/95 backdrop-blur-md border-t border-[#e2e8f0] dark:border-cyan-500/25 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0px)] shadow-lg select-none"
      >
        <Link
          href="/kcet"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-colors ${
            location === "/" || location === "/kcet"
              ? "text-sky-600 dark:text-cyan-400"
              : "text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white"
          }`}
        >
          <HomeIcon className="h-4 w-4 mb-0.5" />
          <span>Arena</span>
        </Link>
        <button
          type="button"
          onClick={handleSearchFocus}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white transition-colors"
        >
          <Search className="h-4 w-4 mb-0.5" />
          <span>Search</span>
        </button>
        <Link
          href="/kcet/contribute"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold transition-colors ${
            location === "/kcet/contribute"
              ? "text-sky-600 dark:text-cyan-400"
              : "text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white"
          }`}
        >
          <UploadCloud className="h-4 w-4 mb-0.5" />
          <span>Share</span>
        </Link>
        <button
          type="button"
          onClick={(e) => switchMode("puc", e, () => setLocation("/"))}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-semibold text-indigo-600 dark:text-violet-300 hover:text-[#0f172a] dark:hover:text-white transition-colors"
        >
          <BookOpen className="h-4 w-4 mb-0.5" />
          <span>2nd PUC</span>
        </button>
      </nav>
    </div>
  );
}
