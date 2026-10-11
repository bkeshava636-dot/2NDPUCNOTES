import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { BookOpen, ShoppingBag } from "lucide-react";
import { usePageViewTracker } from "@/hooks/use-page-view-tracker";

export function PublicLayout({ children }: { children: ReactNode }) {
  usePageViewTracker();
  const [location] = useLocation();
  const isPurchasesActive = location === "/my-purchases";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white text-[#112542] antialiased selection:bg-[#ebf3ff] selection:text-[#1856b8]">
      <header className="sticky top-0 z-50 w-full border-b border-[#e2e8f0]/80 bg-white/95 backdrop-blur-md transition-all">
        <div className="container flex h-15 items-center justify-between px-4 max-w-5xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-lg text-[#0f172a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/30 rounded-lg p-1 -ml-1 transition-colors hover:text-[#2563eb]"
          >
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] text-[#2563eb] border border-[#bfdbfe]/60 shadow-2xs">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="tracking-tight text-lg font-bold text-[#0f172a]">2puc</span>
              <span className="hidden sm:inline-flex text-[11px] font-semibold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-full border border-[#e2e8f0]">
                Karnataka State Board
              </span>
            </div>
          </Link>

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
    </div>
  );
}


