import { AnimatePresence, motion } from "framer-motion";
import { useAppMode } from "@/lib/app-mode-context";
import { useTheme } from "@/lib/theme-context";
import { Rocket, GraduationCap } from "lucide-react";

export function ModeTransitionOverlay() {
  const { transitionState } = useAppMode();
  const { isDark } = useTheme();
  const { isTransitioning, targetMode, origin } = transitionState;
  const toKcet = targetMode === "kcet";

  const originStr = `${Math.round(origin.x)}px ${Math.round(origin.y)}px`;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key={`portal-${targetMode}`}
          aria-live="polite"
          aria-label={toKcet ? "Switching to KCET Competitive Mode" : "Returning to 2nd PUC Board Mode"}
          className="fixed inset-0 z-[9999] pointer-events-none select-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 1, 0] }}
          transition={{ duration: 1.1, times: [0, 0.52, 0.72, 1], ease: "easeInOut" }}
        >
          {/* Smooth Expanding Circular Iris Backdrop (Theme-Aware & Eye-Friendly) */}
          <motion.div
            className={`absolute inset-0 backdrop-blur-xl ${
              isDark
                ? toKcet
                  ? "bg-[#070c1e]/95"
                  : "bg-[#0b1121]/95"
                : toKcet
                ? "bg-[#f0f9ff]/95"
                : "bg-[#f8fafc]/95"
            }`}
            initial={{ clipPath: `circle(0px at ${originStr})` }}
            animate={{ clipPath: `circle(160vmax at ${originStr})` }}
            transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Soft Ambient Gradient Glow */}
            <div
              className="absolute inset-0"
              style={{
                background: isDark
                  ? toKcet
                    ? "radial-gradient(circle at 50% 45%, rgba(6,182,212,0.16) 0%, rgba(99,102,241,0.10) 45%, transparent 75%)"
                    : "radial-gradient(circle at 50% 45%, rgba(37,99,235,0.16) 0%, rgba(99,102,241,0.08) 45%, transparent 75%)"
                  : toKcet
                  ? "radial-gradient(circle at 50% 45%, rgba(14,165,233,0.14) 0%, rgba(99,102,241,0.08) 45%, transparent 75%)"
                  : "radial-gradient(circle at 50% 45%, rgba(37,99,235,0.12) 0%, rgba(99,102,241,0.06) 45%, transparent 75%)",
              }}
            />
          </motion.div>

          {/* Gentle Soft Ripple Ring Expanding from Toggle */}
          <motion.div
            className={`absolute rounded-full border ${
              toKcet
                ? "border-sky-400/45 dark:border-cyan-400/40"
                : "border-blue-500/45 dark:border-indigo-400/40"
            }`}
            style={{
              left: origin.x,
              top: origin.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ width: 24, height: 24, opacity: 0.65 }}
            animate={{ width: "220vmax", height: "220vmax", opacity: 0 }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Calm Center Typography Stage */}
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ y: 10, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.42, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center max-w-md"
            >
              {/* Soft Icon Badge */}
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm ${
                  toKcet
                    ? "bg-sky-100/90 dark:bg-cyan-500/15 border-sky-200 dark:border-cyan-400/30 text-sky-600 dark:text-cyan-300"
                    : "bg-blue-100/90 dark:bg-indigo-500/15 border-blue-200 dark:border-indigo-400/30 text-blue-600 dark:text-indigo-300"
                }`}
              >
                {toKcet ? (
                  <Rocket className="h-6 w-6" />
                ) : (
                  <GraduationCap className="h-6 w-6" />
                )}
              </div>

              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {toKcet
                  ? "Entering KCET Competitive Mode"
                  : "Returning to 2nd PUC Board Mode"}
              </h2>

              <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                {toKcet
                  ? "Physics • Chemistry • Mathematics • Biology"
                  : "KSEAB Syllabus Notes • MQPs • Blueprints"}
              </p>

              {/* Smooth Fluid Progress Line */}
              <div className="mt-5 w-44 sm:w-56 h-1 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    toKcet
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600"
                  }`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.68, delay: 0.08, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
