import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
}

/**
 * Dynamically updates document title, robots, meta descriptions, keywords, og:url,
 * and self-referencing canonical tags for Google Search SEO indexing.
 */
export function SeoHead({ title, description, keywords, canonicalPath }: SeoProps) {
  useEffect(() => {
    // 1. Update document title
    const fullTitle = title.includes("2PUC") ? title : `${title} | 2PUC Notes`;
    document.title = fullTitle;

    // 2. Ensure indexable robots meta tag
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.name = "robots";
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute("content", "index, follow");

    // 3. Update meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // 4. Update meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // 5. Compute normalized canonical URL
    const rawPath = canonicalPath || (typeof window !== "undefined" ? window.location.pathname : "/");
    const cleanPath = rawPath === "/" ? "/" : `/${rawPath.replace(/^\/+|\/+$/g, "")}`;
    const fullUrl = `https://2ndpucnotes.vercel.app${cleanPath}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", fullUrl);

    // 6. Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (ogDesc) ogDesc.setAttribute("content", description);

    let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (ogUrl) ogUrl.setAttribute("content", fullUrl);
  }, [title, description, keywords, canonicalPath]);

  return null;
}
