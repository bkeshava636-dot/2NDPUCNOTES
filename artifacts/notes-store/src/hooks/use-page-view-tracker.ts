import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { buildApiUrl } from "@/lib/api";

function getOrCreateVisitorId(): string {
  try {
    let id = localStorage.getItem("noexora_vid");
    if (!id) {
      id = "v_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now().toString(36);
      localStorage.setItem("noexora_vid", id);
    }
    return id;
  } catch {
    return "guest_" + Math.random().toString(36).substring(2, 10);
  }
}

export function usePageViewTracker() {
  const [location] = useLocation();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Only track if pathname changed
    if (lastPathRef.current === location) return;
    lastPathRef.current = location;

    // Do not track admin back-office panel pageviews as student visits
    if (location.startsWith("/admin")) return;

    const timer = setTimeout(() => {
      const visitorId = getOrCreateVisitorId();
      const payload = {
        path: location,
        pageTitle: typeof document !== "undefined" ? document.title : "",
        visitorId,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      };

      const url = buildApiUrl("/api/analytics/view");
      try {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {
          // If fetch fails, attempt sendBeacon as backup
          if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
            const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
            navigator.sendBeacon(url, blob);
          }
        });
      } catch {
        // Ignore background analytics logging errors
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [location]);
}
