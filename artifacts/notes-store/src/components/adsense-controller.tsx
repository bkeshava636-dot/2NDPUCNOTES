import { useEffect } from "react";
import { useLocation } from "wouter";

export function AdSenseController() {
  const [location] = useLocation();

  useEffect(() => {
    const normalized = (location || "").toLowerCase();
    const isAdmin = normalized.startsWith("/admin") || normalized.startsWith("/checkout");

    if (isAdmin) {
      // Clean up any auto-injected ad iframes, overlays, or floating popups
      const adElements = document.querySelectorAll(
        'iframe[src*="quge5"], iframe[src*="5gvci"], iframe[src*="3nbf4"], iframe[src*="6opo"], iframe[src*="vaimucuvikuwu"], div[class*="zfg"], div[id*="zfg"]'
      );
      adElements.forEach((el) => {
        try {
          el.remove();
        } catch {
          // ignore
        }
      });

      // Clear any global popunder queues
      try {
        if (typeof window !== "undefined") {
          const w = window as any;
          if (w.zfgformats) {
            w.zfgformats = [];
          }
        }
      } catch {
        // ignore
      }
    }
  }, [location]);

  return null;
}
