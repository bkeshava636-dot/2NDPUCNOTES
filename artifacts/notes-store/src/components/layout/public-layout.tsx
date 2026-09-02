import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { BookOpen, ShoppingBag } from "lucide-react";

export function PublicLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isPurchasesActive = location === "/my-purchases";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50 text-gray-900 antialiased">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-md transition-all duration-200 shadow-2xs">
        <div className="container flex h-16 items-center justify-between px-4 max-w-5xl mx-auto">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-bold text-lg text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg p-1 -ml-1 transition-transform active:scale-98"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <BookOpen className="h-5 w-5 transition-transform group-hover:scale-105" />
            </div>
            <span className="tracking-tight text-gray-900 group-hover:text-primary transition-colors">
              2PUC Notes
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/my-purchases">
              <Button
                variant={isPurchasesActive ? "secondary" : "ghost"}
                size="sm"
                className={`hidden sm:flex items-center gap-2 font-medium transition-all ${
                  isPurchasesActive
                    ? "bg-primary/10 text-primary hover:bg-primary/15 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
                className={`sm:hidden h-9 w-9 ${
                  isPurchasesActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                aria-label="My Purchases"
              >
                <ShoppingBag className="h-5 w-5" />
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

