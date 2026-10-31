import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Routes strictly EXCLUDED from showing Google-served ads under
 * Google Publisher Policies (Inventory Value: Screens without publisher content):
 * - https://support.google.com/publisherpolicies/answer/11112688
 * - https://support.google.com/adsense/answer/10015918
 *
 * Prohibited screens:
 * 1. Admin login & management dashboard (/admin/*)
 * 2. Checkout & payment gateways (/checkout)
 * 3. Payment receipts & thank-you confirmation (/payment-success)
 * 4. Purchase lookup utility (/my-purchases)
 * 5. Error & 404 screens
 */
export const EXCLUDED_AD_ROUTES = [
  "/admin",
  "/checkout",
  "/payment-success",
  "/my-purchases",
  "/contribute",
  "/contact",
  "/contact-us",
  "/login",
  "/register",
  "/404",
];

const ADSENSE_CLIENT_ID = "ca-pub-2516613029504029";
const SCRIPT_ID = "google-adsense-script";

export function isRouteEligibleForAds(path: string): boolean {
  const normalized = path.split("?")[0].toLowerCase().replace(/\/+$/, "") || "/";

  // 1. Explicit exclusion check
  for (const excluded of EXCLUDED_AD_ROUTES) {
    if (normalized === excluded || normalized.startsWith(`${excluded}/`)) {
      return false;
    }
  }

  // 2. Allowlist verification: only bona fide publisher content routes may display ads
  if (
    normalized === "/" ||
    normalized === "/about" ||
    normalized === "/privacy-policy" ||
    normalized === "/terms" ||
    normalized === "/refund-policy"
  ) {
    return true;
  }

  if (/^\/subject\/[a-z0-9-]+$/.test(normalized)) return true;
  if (/^\/category\/[a-z0-9-]+$/.test(normalized)) return true;
  if (/^\/section\/[0-9]+$/.test(normalized)) return true;
  if (/^\/card\/[0-9]+$/.test(normalized)) return true;

  // 3. Fallback: Any unknown, error, or 404 route is strictly prohibited from requesting ads
  return false;
}

export function AdSenseController() {
  const [location] = useLocation();

  useEffect(() => {
    const isEligible = isRouteEligibleForAds(location);

    if (isEligible) {
      // 1. Resume / enable ad requests for content routes
      if (typeof window !== "undefined") {
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.pauseAdRequests = 0;
        } catch {
          // Ignore
        }
      }

      // 2. Ensure AdSense script is loaded once
      let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    } else {
      // 3. Excluded route: Pause all ad requests immediately
      if (typeof window !== "undefined") {
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.pauseAdRequests = 1;
        } catch {
          // Ignore
        }
      }

      // 4. Clean up any auto-injected ad wrappers on prohibited screens
      const autoPlacedAds = document.querySelectorAll(".google-auto-placed, ins.adsbygoogle");
      autoPlacedAds.forEach((ad) => {
        try {
          ad.remove();
        } catch {
          // Ignore
        }
      });
    }
  }, [location]);

  return null;
}
