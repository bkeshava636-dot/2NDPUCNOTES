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
        <div className="container mx-auto max-w-5xl px-4 py-12 sm:py-16">
          {/* ── "Found Site Helpful? Buy Me Some Paneer" Hero Card ── */}
          <div className="mb-12 rounded-2xl bg-gradient-to-br from-white via-white to-amber-50/40 p-6 sm:p-8 border border-amber-200/80 shadow-xs relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-9xl select-none">
              🧀
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="max-w-xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-[11px] font-bold">
                  <span>🧀 Student Creator Support</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
                  Found 2PUC Helpful? Buy Me Some Paneer!
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  If our curated notes, question banks, and blueprints helped your PUC exam prep, help fuel the creator with a small paneer treat. Keeps server costs covered and materials 100% free!
                </p>
              </div>

              {/* Tipping quick buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenPaneer(20)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white hover:bg-amber-50 text-[#1e293b] border border-[#cbd5e1] hover:border-amber-300 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95"
                  >
                    ₹20 🧀
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenPaneer(50)}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95 ring-1 ring-amber-300/50"
                  >
                    ₹50 🍲 <span className="text-[10px] text-amber-700 font-semibold">(Popular)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenPaneer(100)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white hover:bg-amber-50 text-[#1e293b] border border-[#cbd5e1] hover:border-amber-300 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95"
                  >
                    ₹100 🍛
                  </button>
                </div>

                <Button
                  type="button"
                  onClick={() => handleOpenPaneer(50)}
                  className="rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold h-9.5 px-4 shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <Heart className="h-3.5 w-3.5 fill-white" />
                  <span>Buy Paneer via Razorpay</span>
                </Button>
              </div>
            </div>

            {/* Micro badges below card */}
            <div className="mt-4 pt-4 border-t border-amber-100/80 flex flex-wrap items-center gap-4 text-[11px] text-[#64748b]">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#16a34a]" />
                <span>100% Secure Razorpay Gateway</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>Supports UPI, GPay, PhonePe, Paytm, Cards & NetBanking</span>
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
