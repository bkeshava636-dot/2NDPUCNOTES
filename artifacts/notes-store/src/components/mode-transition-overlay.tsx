import { AnimatePresence, motion } from "framer-motion";
import { useAppMode } from "@/lib/app-mode-context";
import { Rocket, GraduationCap, Zap } from "lucide-react";

export function ModeTransitionOverlay() {
  const { transitionState } = useAppMode();
  const { isTransitioning, targetMode, origin } = transitionState;
  const toKcet = targetMode === "kcet";

  const originStr = `${Math.round(origin.x)}px ${Math.round(origin.y)}px`;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key={`portal-${targetMode}`}
          aria-live="assertive"
          aria-label={toKcet ? "Initializing KCET Competitive Mode" : "Returning to 2nd PUC Board Mode"}
          className="fixed inset-0 z-[9999] pointer-events-none select-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 1, 0] }}
          transition={{ duration: 0.8, times: [0, 0.55, 0.78, 1], ease: "easeInOut" }}
        >
          {/* 1. Expanding Circular Portal Clip-Path Background */}
          <motion.div
            className={`absolute inset-0 ${
              toKcet
                ? "bg-[#040714]"
                : "bg-[#0a1128]"
            }`}
            initial={{ clipPath: `circle(0px at ${originStr})` }}
            animate={{ clipPath: `circle(160vmax at ${originStr})` }}
            transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Cyber Perspective Grid */}
            <div
              className="absolute inset-0 opacity-35"
              style={{
                backgroundImage: toKcet
                  ? "linear-gradient(to right, rgba(6,182,212,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(139,92,246,0.22) 1px, transparent 1px)"
                  : "linear-gradient(to right, rgba(59,130,246,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.22) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Radial Ambient Glow */}
            <div
              className="absolute inset-0"
              style={{
                background: toKcet
                  ? "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.26) 0%, rgba(139,92,246,0.18) 38%, rgba(4,7,20,0.95) 80%)"
                  : "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.28) 0%, rgba(79,70,229,0.16) 40%, rgba(10,17,40,0.95) 80%)",
              }}
            />

            {/* Vertical Scanning Laser */}
            <motion.div
              className={`absolute left-0 right-0 h-1 ${
                toKcet
                  ? "bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_24px_#06b6d4]"
                  : "bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_24px_#3b82f6]"
              }`}
              initial={{ top: "-5%" }}
              animate={{ top: "105%" }}
              transition={{ duration: 0.65, ease: "linear" }}
            />
          </motion.div>

          {/* 2. Glowing Radial Shockwave Ring Expanding from Toggle Coordinates */}
          <motion.div
            className={`absolute rounded-full border-[3px] ${
              toKcet
                ? "border-cyan-400 shadow-[0_0_60px_12px_rgba(6,182,212,0.85),inset_0_0_40px_rgba(139,92,246,0.75)]"
                : "border-blue-400 shadow-[0_0_60px_12px_rgba(59,130,246,0.85),inset_0_0_40px_rgba(99,102,241,0.75)]"
            }`}
            style={{
              left: origin.x,
              top: origin.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ width: 16, height: 16, opacity: 1 }}
            animate={{ width: "260vmax", height: "260vmax", opacity: 0 }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* 3. Center Kinetic Glitch / Neon Typography Overlay */}
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.04, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 0.42, times: [0, 0.55, 1] }}
              className="flex flex-col items-center max-w-xl"
            >
              {/* Glowing Emblem */}
              <div
                className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border backdrop-blur-md ${
                  toKcet
                    ? "bg-cyan-500/15 border-cyan-400/60 text-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.65)]"
                    : "bg-blue-500/15 border-blue-400/60 text-blue-300 shadow-[0_0_35px_rgba(59,130,246,0.65)]"
                }`}
              >
                {toKcet ? (
                  <Rocket className="h-8 w-8 animate-bounce" />
                ) : (
                  <GraduationCap className="h-8 w-8" />
                )}
              </div>

              {/* Glitch Chromatic Typography */}
              <div className="relative">
                <motion.h2
                  animate={{
                    x: [0, -3, 3, -1, 0],
                    skewX: [0, -6, 6, -2, 0],
                  }}
                  transition={{ duration: 0.38, repeat: 1, repeatType: "reverse" }}
                  className={`text-xl sm:text-3xl font-black tracking-[0.14em] uppercase font-mono ${
                    toKcet
                      ? "text-white drop-shadow-[0_0_16px_rgba(6,182,212,0.95)]"
                      : "text-white drop-shadow-[0_0_16px_rgba(99,102,241,0.95)]"
                  }`}
                >
                  {toKcet
                    ? "INITIALIZING KCET COMPETITIVE MODE..."
                    : "RETURNING TO 2ND PUC BOARD MODE..."}
                </motion.h2>

                {/* Chromatic Ghost Layer */}
                <motion.span
                  aria-hidden="true"
                  animate={{ x: [2, -4, 2, 0], opacity: [0.7, 0.9, 0.5, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 text-xl sm:text-3xl font-black tracking-[0.14em] uppercase font-mono pointer-events-none ${
                    toKcet ? "text-fuchsia-400/70" : "text-cyan-400/70"
                  }`}
                >
                  {toKcet
                    ? "INITIALIZING KCET COMPETITIVE MODE..."
                    : "RETURNING TO 2ND PUC BOARD MODE..."}
                </motion.span>
              </div>

              {/* Sub-ticker */}
              <div className="mt-3 flex items-center gap-2 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-slate-300">
                <Zap className={`h-3.5 w-3.5 ${toKcet ? "text-cyan-400" : "text-blue-400"}`} />
                <span>
                  {toKcet
                    ? "PHYSICS • CHEMISTRY • MATHEMATICS • BIOLOGY"
                    : "KSEAB BOARD NOTES • MQP • BLUEPRINTS"}
                </span>
              </div>

              {/* High-Speed Energy Bar */}
              <div className="mt-5 w-56 sm:w-72 h-1.5 rounded-full bg-white/10 overflow-hidden border border-white/15">
                <motion.div
                  className={`h-full rounded-full ${
                    toKcet
                      ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_12px_#06b6d4]"
                      : "bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 shadow-[0_0_12px_#3b82f6]"
                  }`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.62, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
