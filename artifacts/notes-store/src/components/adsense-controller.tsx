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
  "/kcet/contribute",
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
    normalized === "/kcet" ||
    normalized === "/kcet/counselling" ||
    normalized === "/about" ||
    normalized === "/privacy-policy" ||
    normalized === "/terms" ||
    normalized === "/refund-policy"
  ) {
    return true;
  }

  if (/^\/subject\/[a-z0-9-]+$/.test(normalized)) return true;
  if (/^\/category\/[a-z0-9-]+$/.test(normalized)) return true;
  if (/^\/kcet\/subject\/[a-z0-9-]+$/.test(normalized)) return true;
  if (/^\/kcet\/category\/[a-z0-9-]+$/.test(normalized)) return true;
  if (/^\/section\/[0-9]+$/.test(normalized)) return true;
  if (/^\/card\/[0-9]+$/.test(normalized)) return true;

  // 3. Fallback: Any unknown, error, or 404 route is strictly prohibited from requesting ads
  return false;
}

export function AdSenseController() {
  const [location] = useLocation();

  useEffect(() => {
    const normalized = (location || "").toLowerCase();
    const isAdmin = normalized.startsWith("/admin") || normalized.startsWith("/checkout");

    if (isAdmin) {
      // 1. Clean up any auto-injected ad iframes, overlays, or banners
      const adElements = document.querySelectorAll(
        'iframe[src*="quge5"], iframe[src*="3nbf4"], iframe[src*="6opo"], iframe[src*="vaimucuvikuwu"], div[class*="zfg"], div[id*="zfg"], ins.adsbygoogle, .google-auto-placed'
      );
      adElements.forEach((el) => {
        try {
          el.remove();
        } catch {
          // ignore
        }
      });

      // 2. Clear out any global popunder arrays
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
