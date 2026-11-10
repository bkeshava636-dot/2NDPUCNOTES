import { MouseEvent } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppMode } from "@/lib/app-mode-context";

export function ModeTogglePill({ className = "" }: { className?: string }) {
  const { mode, isKcet, transitionState, switchMode } = useAppMode();
  const [location, setLocation] = useLocation();

  const handleToggle = (target: "puc" | "kcet", e: MouseEvent<HTMLButtonElement>) => {
    if (target === mode || transitionState.isTransitioning) return;

    switchMode(target, e, () => {
      if (target === "kcet") {
        if (location !== "/" && !location.startsWith("/kcet")) {
          setLocation("/kcet");
        }
      } else {
        if (location.startsWith("/kcet")) {
          setLocation("/");
        }
      }
    });
  };

  return (
    <div
      role="group"
      aria-label="Exam Arena Mode Switcher"
      className={`relative inline-flex items-center p-0.5 rounded-full border transition-all duration-300 select-none shrink-0 ${
        isKcet
          ? "bg-sky-50/90 dark:bg-[#090f24] border-sky-200 dark:border-cyan-500/40 shadow-2xs dark:shadow-[0_0_14px_rgba(6,182,212,0.22)]"
          : "bg-[#f1f5f9] dark:bg-[#151D2E] border-[#cbd5e1] dark:border-[#293548] shadow-2xs"
      } ${className}`}
    >
      {/* 2nd PUC Option */}
      <button
        type="button"
        onClick={(e) => handleToggle("puc", e)}
        aria-pressed={!isKcet}
        className={`relative z-10 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-tight transition-colors duration-200 cursor-pointer flex items-center gap-1 whitespace-nowrap ${
          !isKcet
            ? "text-white"
            : "text-[#475569] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white"
        }`}
      >
        {!isKcet && (
          <motion.span
            layoutId="mode-toggle-active-bg"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2563eb] to-[#4f46e5] shadow-sm -z-10"
          />
        )}
        <span className="sm:hidden">PUC</span>
        <span className="hidden sm:inline">2nd PUC</span>
      </button>

      {/* Divider */}
      <span
        aria-hidden="true"
        className="text-[10px] font-light mx-0.5 select-none text-slate-300 dark:text-slate-600"
      >
        |
      </span>

      {/* KCET Option */}
      <button
        type="button"
        onClick={(e) => handleToggle("kcet", e)}
        aria-pressed={isKcet}
        className={`relative z-10 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-tight transition-colors duration-200 cursor-pointer flex items-center gap-1 whitespace-nowrap ${
          isKcet
            ? "text-white"
            : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0f172a] dark:hover:text-white"
        }`}
      >
        {isKcet && (
          <motion.span
            layoutId="mode-toggle-active-bg"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 dark:from-cyan-500 dark:via-blue-600 dark:to-violet-600 shadow-sm dark:shadow-[0_0_16px_rgba(6,182,212,0.45)] -z-10"
          />
        )}
        <span>KCET</span>
        <span aria-hidden="true" className="text-[11px] leading-none">🚀</span>
      </button>
    </div>
  );
}
