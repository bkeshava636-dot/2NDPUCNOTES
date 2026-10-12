import { useState } from "react";
import { Link } from "wouter";
import { Send, ShieldCheck, Zap, BookOpen, Heart, MessageSquarePlus, ChevronRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { TELEGRAM_LINK } from "@/lib/site-config";
import { BuyPaneerModal } from "@/components/buy-paneer-modal";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [paneerModalOpen, setPaneerModalOpen] = useState(false);
  const [selectedPaneerAmount, setSelectedPaneerAmount] = useState<number>(50);

  const handleOpenPaneer = (amount: number) => {
    setSelectedPaneerAmount(amount);
    setPaneerModalOpen(true);
  };

  return (
    <>
      <footer className="mt-auto border-t border-[#e2e8f0] bg-[#f8fafc] text-[#5a6b82]">
        <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-10">
          {/* ── Compact "Buy Me Some Paneer" Strip ── */}
          <div className="mb-8 p-3 sm:px-4 sm:py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#334155]">
              <span className="text-base select-none">🧀</span>
              <span className="font-medium">
                Found 2PUC helpful? <span className="text-[#64748b]">Buy the creator some paneer</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenPaneer(20)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100/60 text-[#334155] border border-amber-200 text-xs font-semibold transition-all active:scale-95 shadow-2xs"
              >
                ₹20
              </button>
              <button
                type="button"
                onClick={() => handleOpenPaneer(50)}
                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold transition-all active:scale-95 shadow-2xs"
              >
                ₹50
              </button>
              <button
                type="button"
                onClick={() => handleOpenPaneer(100)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100/60 text-[#334155] border border-amber-200 text-xs font-semibold transition-all active:scale-95 shadow-2xs"
              >
                ₹100
              </button>
              <Button
                type="button"
                size="sm"
                onClick={() => handleOpenPaneer(50)}
                className="h-7 px-3 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold gap-1.5 shadow-2xs ml-0.5"
              >
                <Heart className="h-3 w-3 fill-white" />
                <span>Buy Paneer</span>
              </Button>
            </div>
          </div>

          {/* ── Main Footer Navigation Grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#e2e8f0]">
            {/* Brand Column */}
            <div className="col-span-2 space-y-3">
              <Link
                href="/"
                className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/30 rounded-lg transition-opacity hover:opacity-90"
                aria-label="2PUC Home"
              >
                <BrandLogo size="md" />
              </Link>
              <p className="text-xs sm:text-sm text-[#5a6b82] leading-relaxed max-w-sm">
                High-quality Karnataka 2nd PUC Science notes, chapterwise solutions, blueprint model papers, and practical materials organized for confident exam preparation.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] text-xs font-semibold transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Join Telegram</span>
                </a>
              </div>
            </div>

            {/* Core Subjects */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Subjects
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/subject/physics" className="hover:text-[#2563eb] transition-colors">
                    Physics
                  </Link>
                </li>
                <li>
                  <Link href="/subject/chemistry" className="hover:text-[#2563eb] transition-colors">
                    Chemistry
                  </Link>
                </li>
                <li>
                  <Link href="/subject/mathematics" className="hover:text-[#2563eb] transition-colors">
                    Mathematics
                  </Link>
                </li>
                <li>
                  <Link href="/subject/biology" className="hover:text-[#2563eb] transition-colors">
                    Biology
                  </Link>
                </li>
                <li>
                  <Link href="/subject/computer-science" className="hover:text-[#2563eb] transition-colors">
                    Computer Science
                  </Link>
                </li>
                <li>
                  <Link href="/subject/kannada" className="hover:text-[#2563eb] transition-colors">
                    Kannada & English
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Categories
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/category/mqp" className="hover:text-[#2563eb] transition-colors">
                    Model Papers (MQP)
                  </Link>
                </li>
                <li>
                  <Link href="/category/pyq" className="hover:text-[#2563eb] transition-colors">
                    Previous Year Papers
                  </Link>
                </li>
                <li>
                  <Link href="/category/question-bank" className="hover:text-[#2563eb] transition-colors">
                    Question Bank
                  </Link>
                </li>
                <li>
                  <Link href="/category/passing-package" className="hover:text-[#2563eb] transition-colors">
                    Passing Package
                  </Link>
                </li>
                <li>
                  <Link href="/category/practical" className="hover:text-[#2563eb] transition-colors">
                    Practicals & Viva
                  </Link>
                </li>
                <li>
                  <Link href="/category/mcq" className="hover:text-[#2563eb] transition-colors">
                    Chapterwise MCQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links & Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Company & Legal
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/my-purchases" className="hover:text-[#2563eb] transition-colors">
                    My Purchases
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#2563eb] transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#2563eb] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#2563eb] transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-[#2563eb] transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Bottom Bar & Copyright ── */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
            <p>
              &copy; {new Date().getFullYear()} <span className="font-semibold text-[#0f172a]">2PUC</span>. All rights reserved.
            </p>
            <p className="text-center sm:text-right text-[11px] text-[#94a3b8]">
              Designed for Karnataka Pre-University Board Students
            </p>
          </div>
        </div>
      </footer>

      {/* Buy Paneer Modal */}
      <BuyPaneerModal
        open={paneerModalOpen}
        onOpenChange={setPaneerModalOpen}
        defaultAmount={selectedPaneerAmount}
      />
    </>
  );
}
