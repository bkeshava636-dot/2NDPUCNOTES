import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";

// Master switch: Set to true once Google AdSense approval is Ready.
// Currently FALSE while site is getting ready, so students have full access without interruptions.
export const IS_PASS_FEATURE_ENABLED = false;

// 5 hours in milliseconds = 5 * 60 * 60 * 1000 = 18,000,000 ms
export const PASS_DURATION_MS = 5 * 60 * 60 * 1000;
const PASS_STORAGE_KEY = "2puc_site_pass_expires_at";

// Routes that are never locked (admin, auth, legal & policy requirements for Google & payments)
export const EXEMPT_PATH_PREFIXES = [
  "/admin",
  "/privacy-policy",
  "/terms",
  "/terms-and-conditions",
  "/refund-policy",
  "/contact",
  "/contribute",
  "/payment-success",
];

interface SitePassContextType {
  isFeatureEnabled: boolean;
  isPassActive: boolean;
  isExemptPage: boolean;
  remainingMs: number;
  remainingTimeFormatted: string;
  grantPass: (durationMs?: number) => void;
  revokePass: () => void;
}

const SitePassContext = createContext<SitePassContextType | undefined>(undefined);

export function formatRemainingTime(ms: number, isKn: boolean = false): string {
  if (ms <= 0) return isKn ? "ಅವಧಿ ಮುಗಿದಿದೆ" : "Expired";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return isKn ? `${hours} ಗಂಟೆ ${minutes} ನಿಮಿಷ` : `${hours}h ${minutes}m`;
  }
  const seconds = totalSeconds % 60;
  return isKn ? `${minutes} ನಿಮಿಷ ${seconds} ಸೆ` : `${minutes}m ${seconds}s`;
}

export function SitePassProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [expiresAt, setExpiresAt] = useState<number | null>(() => {
    try {
      const stored = localStorage.getItem(PASS_STORAGE_KEY);
      if (!stored) return null;
      const num = parseInt(stored, 10);
      return isNaN(num) ? null : num;
    } catch {
      return null;
    }
  });

  const [now, setNow] = useState<number>(() => Date.now());

  // Update clock every 10 seconds for timer accuracy
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const remainingMs = expiresAt ? Math.max(0, expiresAt - now) : 0;
  const isPassActive = remainingMs > 0;

  // Check if current route is exempt
  const isExemptPage = EXEMPT_PATH_PREFIXES.some((prefix) =>
    location.toLowerCase().startsWith(prefix)
  );

  const grantPass = (durationMs: number = PASS_DURATION_MS) => {
    const newExpiresAt = Date.now() + durationMs;
    try {
      localStorage.setItem(PASS_STORAGE_KEY, String(newExpiresAt));
    } catch (e) {
      console.warn("Could not save site pass to localStorage", e);
    }
    setExpiresAt(newExpiresAt);
    setNow(Date.now());
  };

  const revokePass = () => {
    try {
      localStorage.removeItem(PASS_STORAGE_KEY);
    } catch {}
    setExpiresAt(null);
    setNow(Date.now());
  };

  return (
    <SitePassContext.Provider
      value={{
        isFeatureEnabled: IS_PASS_FEATURE_ENABLED,
        isPassActive,
        isExemptPage,
        remainingMs,
        remainingTimeFormatted: formatRemainingTime(remainingMs),
        grantPass,
        revokePass,
      }}
    >
      {children}
    </SitePassContext.Provider>
  );
}

export function useSitePass() {
  const context = useContext(SitePassContext);
  if (!context) {
    throw new Error("useSitePass must be used within a SitePassProvider");
  }
  return context;
}
