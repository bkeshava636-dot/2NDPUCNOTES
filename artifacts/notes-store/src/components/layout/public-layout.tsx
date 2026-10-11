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
      <header className="sticky top-0 z-50 w-full border-b border-[#e2e8f0] bg-white">
        <div className="container flex h-16 items-center justify-between px-4 max-w-5xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-lg text-[#112542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1856b8]/40 rounded-md p-1 -ml-1 transition-colors hover:text-[#1856b8]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa]">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="tracking-tight">2PUC Notes</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/my-purchases">
              <Button
                variant={isPurchasesActive ? "secondary" : "ghost"}
                size="sm"
                className={`hidden sm:flex items-center gap-2 font-medium text-sm rounded-lg px-3.5 h-9 transition-colors ${
                  isPurchasesActive
                    ? "bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa] font-semibold"
                    : "text-[#5a6b82] hover:text-[#112542] hover:bg-[#f1f5f9]"
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>My Purchases</span>
              </Button>
            </Link>
            <Link href="/my-purchases">
              <Button
                variant={isPurchasesActive ? "secondary" : "ghost"}
                size="icon"
                className={`sm:hidden h-9 w-9 rounded-lg ${
                  isPurchasesActive
                    ? "bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa]"
                    : "text-[#5a6b82] hover:text-[#112542] hover:bg-[#f1f5f9]"
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


