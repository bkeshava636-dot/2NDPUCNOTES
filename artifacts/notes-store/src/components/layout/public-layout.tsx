import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { BookOpen, ShoppingBag, Eye } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { FloatingFeedback } from "@/components/floating-feedback";
import { usePageViewTracker } from "@/hooks/use-page-view-tracker";

export function PublicLayout({ children }: { children: ReactNode }) {
  usePageViewTracker();
  const [location] = useLocation();
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

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white text-[#112542] antialiased selection:bg-[#ebf3ff] selection:text-[#1856b8]">
      <header className="sticky top-0 z-50 w-full border-b border-[#e2e8f0]/80 bg-white/95 backdrop-blur-md transition-all">
        <div className="container flex h-15 items-center justify-between px-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/30 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90"
              aria-label="2PUC Home"
            >
              <BrandLogo size="md" />
            </Link>

            {/* View Count (ONLY COUNT) */}
            {viewData?.count !== undefined && (
              <div
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-50 border border-slate-200/90 text-[11px] sm:text-xs font-bold text-slate-700 shadow-2xs select-none"
                title="Total site views"
              >
                <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#2563eb]" />
                <span>{viewData.count.toLocaleString()}</span>
              </div>
            )}
          </div>

          <nav className="flex items-center gap-2">
            <Link href="/my-purchases">
              <Button
                variant={isPurchasesActive ? "secondary" : "ghost"}
                size="sm"
                className={`hidden sm:inline-flex items-center gap-2 font-medium text-xs sm:text-sm rounded-lg px-3.5 h-9 transition-all ${
                  isPurchasesActive
                    ? "bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] font-semibold shadow-2xs"
                    : "text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc] border border-transparent"
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>My Purchases</span>
              </Button>
            </Link>
            <Link href="/my-purchases">
              <Button
                variant={isPurchasesActive ? "secondary" : "ghost"}
                size="icon"
                className={`sm:hidden h-8.5 w-8.5 rounded-lg ${
                  isPurchasesActive
                    ? "bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]"
                    : "text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc]"
                }`}
                aria-label="My Purchases"
              >
                <ShoppingBag className="h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <FloatingFeedback />
    </div>
  );
}


