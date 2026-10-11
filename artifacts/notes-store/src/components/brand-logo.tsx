import { BookOpen } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Standardized 2PUC wordmark & brand logo component.
 * Features a modern, balanced sans-serif wordmark:
 * numeral '2' with brand-blue styling paired seamlessly with 'PUC'.
 * Strictly shows ONLY '2PUC' with no subtitle, tagline, or extra supporting text.
 */
export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const iconSizes = {
    sm: "h-7 w-7 text-xs",
    md: "h-8.5 w-8.5 text-sm",
    lg: "h-10 w-10 text-base",
  };

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg tracking-tight",
    lg: "text-2xl sm:text-3xl tracking-tight",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`flex ${iconSizes[size]} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] text-[#2563eb] border border-[#bfdbfe]/80 shadow-2xs`}
      >
        <BookOpen className="h-[48%] w-[48%]" />
      </div>
      <span className={`font-black ${textSizes[size]} text-[#0f172a] font-sans inline-flex items-baseline`}>
        <span className="text-[#2563eb]">2</span>
        <span>PUC</span>
      </span>
    </div>
  );
}
