import { useEffect } from "react";

/**
 * Component to ensure non-publisher and utility screens (checkout, payment-success, admin, 404)
 * are never indexed by crawlers or audited as publisher content by Google AdSense.
 */
export function MetaNoIndex() {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const originalContent = meta?.getAttribute("content") || "index, follow";

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");

    return () => {
      if (meta) {
        meta.setAttribute("content", originalContent);
      }
    };
  }, []);

  return null;
}
