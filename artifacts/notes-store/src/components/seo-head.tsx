import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
}

/**
 * Dynamically updates document title, meta descriptions, keywords, and canonical tags
 * for maximum Google Search SEO indexing across all 2nd PUC subjects, categories, and notes.
 */
export function SeoHead({ title, description, keywords, canonicalPath }: SeoProps) {
  useEffect(() => {
    // 1. Update document title
    const fullTitle = title.includes("2PUC") ? title : `${title} | 2PUC Notes`;
    document.title = fullTitle;

    // 2. Update meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // 3. Update meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // 4. Update Open Graph tags for social & search previews
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (ogDesc) ogDesc.setAttribute("content", description);

    // 5. Canonical URL
    if (canonicalPath) {
      const fullUrl = `https://2ndpucnotes.vercel.app${canonicalPath.startsWith("/") ? canonicalPath : "/" + canonicalPath}`;
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", fullUrl);
    }
  }, [title, description, keywords, canonicalPath]);

  return null;
}
