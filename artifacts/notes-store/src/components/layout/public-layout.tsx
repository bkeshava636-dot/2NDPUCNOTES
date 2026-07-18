import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { BookOpen, ShoppingBag } from "lucide-react";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <BookOpen className="h-5 w-5" />
            <span>2PUC Notes</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/my-purchases">
              <Button variant="ghost" size="sm" className="hidden sm:flex">My Purchases</Button>
            </Link>
            <Link href="/my-purchases">
              <Button variant="ghost" size="icon" className="sm:hidden">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">My Purchases</span>
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
