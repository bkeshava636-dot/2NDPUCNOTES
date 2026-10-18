import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { ShoppingBag, Eye, Send, Search, Languages, Clock, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { FloatingFeedback } from "@/components/floating-feedback";
import { usePageViewTracker } from "@/hooks/use-page-view-tracker";
import { TELEGRAM_LINK } from "@/lib/site-config";
import { useLanguage } from "@/lib/language-context";
import { useSitePass } from "@/lib/site-pass-context";
import { SiteAccessPassModal } from "@/components/site-access-pass-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PublicLayout({ children }: { children: ReactNode }) {
  usePageViewTracker();
  const [location, setLocation] = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const { isPassActive, isExemptPage, remainingTimeFormatted } = useSitePass();
  const isPurchasesActive = location === "/my-purchases";

  const { data: viewData } = useQuery<{ count: number }>({
    queryKey: ["public-view-count"],
    queryFn: async () => {
      const rawApiUrl = import.meta.env.VITE_API_URL;
      const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";
      const res = await fetch(`${API_URL}/api/page-views/count`);
      if (!res.ok) return { count: 0 };
      return res.json();
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });

  const handleSearchClick = () => {
    if (location !== "/") {
      setLocation("/?focusSearch=1");
    } else {
      const searchInput = document.getElementById("home-search-input");
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white text-[#0f172a] antialiased selection:bg-[#eff6ff] selection:text-[#1d4ed8]">
      {/* 
        Sticky header with 100% solid background (bg-white) and no semi-transparent backdrop blur, 
        eliminating any blurred ghost text artifacts from content scrolling beneath it.
      */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e2e8f0] bg-white shadow-2xs transition-all">
        <div className="container flex h-14 sm:h-15 items-center justify-between px-3 sm:px-4 max-w-5xl mx-auto">
          {/* Left Brand & View Count */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/40 rounded-lg p-0.5 transition-opacity hover:opacity-90 shrink-0"
              aria-label="2PUC Home"
            >
              <BrandLogo size="md" />
            </Link>

            {/* View Count Badge with Accessible Tooltip */}
            {viewData?.count !== undefined && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    tabIndex={0}
                    role="status"
                    aria-label={`${viewData.count} total site visits to 2PUC notes`}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-[#f8fafc] border border-[#cbd5e1] text-[11px] sm:text-xs font-semibold text-[#334155] shadow-2xs select-none cursor-default focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563eb]"
                  >
                    <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#2563eb] shrink-0" aria-hidden="true" />
                    <span className="font-mono tracking-tight font-bold">{viewData.count.toLocaleString()}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-[#0f172a] text-white py-1 px-2.5 rounded-lg border-0 shadow-md">
                  <span>{viewData.count.toLocaleString()} total visits across 2PUC study materials</span>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Right Navigation Actions (visible at all times) */}
          <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* 5-Hour Pass Status Badge (shown when pass is active) */}
            {isPassActive && !isExemptPage && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    tabIndex={0}
                    role="status"
                    aria-label={`5-Hour Pass active: ${remainingTimeFormatted} remaining`}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[11px] font-semibold text-[#15803d] shadow-2xs select-none cursor-default"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-mono font-bold">{remainingTimeFormatted}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs bg-[#0f172a] text-white py-1 px-2.5 rounded-lg border-0 shadow-md">
                  <span>{t("5-Hour Free Study Pass active. Unlimited site access.", "5 ಗಂಟೆಗಳ ಉಚಿತ ಅಧ್ಯಯನ ಪಾಸ್ ಸಕ್ರಿಯವಾಗಿದೆ.")}</span>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Quick Search Action */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearchClick}
              className="h-8.5 px-2 sm:px-2.5 rounded-lg text-xs font-semibold text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] flex items-center gap-1.5"
              aria-label="Search study materials"
              title="Search materials (/)"
            >
              <Search className="h-3.5 w-3.5 text-[#64748b]" />
              <span className="hidden md:inline text-[11px] text-[#64748b] font-mono border border-[#cbd5e1] rounded px-1 py-0.2 bg-white">
                /
              </span>
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="h-8.5 px-2 sm:px-2.5 rounded-lg text-xs font-semibold text-[#334155] hover:bg-[#f1f5f9] border border-transparent hover:border-[#cbd5e1] flex items-center gap-1"
              aria-label="Toggle language between English and Kannada"
              title="Toggle language (English / ಕನ್ನಡ)"
            >
              <Languages className="h-3.5 w-3.5 text-[#2563eb]" />
              <span className="text-[11px] font-bold">{language === "en" ? "ಕನ್ನಡ" : "EN"}</span>
            </Button>

            {/* Telegram Link (Visible on all devices) */}
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 h-8.5 rounded-lg text-xs font-semibold text-[#0088cc] hover:bg-[#0088cc]/10 transition-colors"
              aria-label="Join 2PUC Telegram Channel"
              title="Join Telegram Community"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Telegram</span>
            </a>

            {/* My Purchases */}
            <Link href="/my-purchases">
              <Button
                variant={isPurchasesActive ? "secondary" : "ghost"}
                size="sm"
                className={`h-8.5 px-2.5 sm:px-3 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  isPurchasesActive
                    ? "bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] shadow-2xs"
                    : "text-[#334155] hover:text-[#0f172a] hover:bg-[#f1f5f9] border border-transparent"
                }`}
                aria-label="My Purchases"
              >
                <ShoppingBag className="h-3.5 w-3.5 text-[#2563eb]" />
                <span className="hidden xs:inline">{t("My Purchases", "ನನ್ನ ಖರೀದಿಗಳು")}</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Page Content with safe scroll-padding so sticky header never clips section titles */}
      <main className="flex-1 flex flex-col">{children}</main>
      
      {/* Footer with built-in safe padding */}
      <Footer />

      {/* Floating Student Feedback */}
      <FloatingFeedback />

      {/* 5-Hour Site Access Pass Lock Modal */}
      <SiteAccessPassModal />
    </div>
  );
}
