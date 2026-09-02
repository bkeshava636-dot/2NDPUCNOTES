import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { BookOpen, ShoppingBag } from "lucide-react";

export function PublicLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isPurchasesActive = location === "/my-purchases";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="container flex h-16 items-center justify-between px-4 max-w-5xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-lg text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md p-1 -ml-1 transition-opacity hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-primary border border-blue-100">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="tracking-tight text-gray-900">2PUC Notes</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/my-purchases">
              <Button
                variant={isPurchasesActive ? "secondary" : "ghost"}
                size="sm"
                className={`hidden sm:flex items-center gap-2 font-medium text-sm rounded-lg px-3.5 h-9 transition-colors ${
                  isPurchasesActive
                    ? "bg-blue-50 text-primary hover:bg-blue-100/70 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
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
                    ? "bg-blue-50 text-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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


