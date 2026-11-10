import { createContext, useContext, useEffect, useState, useRef, ReactNode, MouseEvent } from "react";

export type AppMode = "puc" | "kcet";

interface OriginPoint {
  x: number;
  y: number;
}

interface TransitionState {
  isTransitioning: boolean;
  targetMode: AppMode;
  origin: OriginPoint;
}

interface AppModeContextType {
  mode: AppMode;
  isKcet: boolean;
  transitionState: TransitionState;
  switchMode: (target: AppMode, eventOrEl?: MouseEvent<HTMLElement> | HTMLElement | null, onMidpoint?: () => void) => void;
  setModeInstant: (target: AppMode) => void;
}

const STORAGE_KEY = "2puc_app_mode";

const AppModeContext = createContext<AppModeContextType>({
  mode: "puc",
  isKcet: false,
  transitionState: { isTransitioning: false, targetMode: "puc", origin: { x: 80, y: 28 } },
  switchMode: () => {},
  setModeInstant: () => {},
});

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(() => {
    if (typeof window === "undefined") return "puc";
    try {
      // Honor explicit /kcet URL path if loaded directly
      if (window.location.pathname.toLowerCase().startsWith("/kcet")) {
        localStorage.setItem(STORAGE_KEY, "kcet");
        return "kcet";
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "kcet" || stored === "puc") return stored;
    } catch {}
    return "puc";
  });

  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    targetMode: mode,
    origin: { x: 80, y: 28 },
  });

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const setModeInstant = (target: AppMode) => {
    setModeState(target);
    try {
      localStorage.setItem(STORAGE_KEY, target);
    } catch {}
  };

  const switchMode = (
    target: AppMode,
    eventOrEl?: MouseEvent<HTMLElement> | HTMLElement | null,
    onMidpoint?: () => void
  ) => {
    if (target === mode || transitionState.isTransitioning) return;

    let origin: OriginPoint = { x: 80, y: 28 };
    if (eventOrEl) {
      if ("currentTarget" in eventOrEl && eventOrEl.currentTarget) {
        const rect = eventOrEl.currentTarget.getBoundingClientRect();
        origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else if ("getBoundingClientRect" in eventOrEl) {
        const rect = eventOrEl.getBoundingClientRect();
        origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
    }

    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];

    setTransitionState({
      isTransitioning: true,
      targetMode: target,
      origin,
    });

    // At peak coverage (~500ms), flip active mode & persist smoothly
    const t1 = window.setTimeout(() => {
      setModeState(target);
      try {
        localStorage.setItem(STORAGE_KEY, target);
      } catch {}
      onMidpoint?.();
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, 500);

    // Reveal completed smoothly (~1100ms)
    const t2 = window.setTimeout(() => {
      setTransitionState((prev) => ({ ...prev, isTransitioning: false }));
    }, 1100);

    timersRef.current.push(t1, t2);
  };

  return (
    <AppModeContext.Provider
      value={{
        mode,
        isKcet: mode === "kcet",
        transitionState,
        switchMode,
        setModeInstant,
      }}
    >
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  return useContext(AppModeContext);
}
