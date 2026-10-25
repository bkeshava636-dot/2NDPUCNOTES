import { useState } from "react";
import { Link } from "wouter";
import { Send, Heart } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { TELEGRAM_LINK } from "@/lib/site-config";
import { BuyPaneerModal } from "@/components/buy-paneer-modal";
import { Button } from "@/components/ui/button";
import { SCIENCE_SUBJECTS, LANGUAGE_SUBJECTS, RESOURCE_CATEGORIES } from "@/lib/site-navigation";
import { useLanguage } from "@/lib/language-context";

export function Footer() {
  const [paneerModalOpen, setPaneerModalOpen] = useState(false);
  const [selectedPaneerAmount, setSelectedPaneerAmount] = useState<number>(50);
  const { language, t } = useLanguage();

  const handleOpenPaneer = (amount: number) => {
    setSelectedPaneerAmount(amount);
    setPaneerModalOpen(true);
  };

  return (
    <>
      {/* Footer container with bottom padding so floating feedback pill never obstructs content */}
      <footer className="mt-auto border-t border-[#e2e8f0] bg-[#f8fafc] text-[#5a6b82] pb-16 sm:pb-8">
        <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-10">
          {/* ── Compact "Buy Me Some Paneer" Strip ── */}
          <div className="mb-8 p-3 sm:px-4 sm:py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#334155]">
              <span className="text-base select-none">🧀</span>
              <span className="font-medium">
                {t("Found 2PUC helpful?", "2PUC ಉಪಯುಕ್ತವೆನಿಸಿತೇ?")}{" "}
                <span className="text-[#64748b]">
                  {t("(Optional) Support with some paneer", "(ಐಚ್ಛಿಕ) ಪನ್ನೀರ್ ಕಳುಹಿಸಿ ಪ್ರೋತ್ಸಾಹಿಸಿ")}
                </span>
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
                <span>{t("Buy Paneer", "ಪನ್ನೀರ್")}</span>
              </Button>
            </div>
          </div>

          {/* ── Main Footer Navigation Grid (Unified with site-navigation data) ── */}
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
                {t(
                  "High-quality Karnataka 2nd PUC Science notes, chapterwise solutions, blueprint model papers, and practical materials organized for confident exam preparation.",
                  "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ವಿಜ್ಞಾನ ನೋಟ್ಸ್, ಮಾದರಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು ಹಾಗೂ ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷಾ ಸಾಮಗ್ರಿಗಳು."
                )}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#006299] text-xs font-semibold transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{t("Join Telegram", "ಟೆಲಿಗ್ರಾಂ ಸೇರಿ")}</span>
                </a>
              </div>
            </div>

            {/* Science & Language Subjects Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                {t("Science Subjects", "ವಿಜ್ಞಾನ ವಿಷಯಗಳು")}
              </h4>
              <ul className="space-y-2 text-xs">
                {SCIENCE_SUBJECTS.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/subject/${s.slug}`} className="hover:text-[#2563eb] transition-colors">
                      {language === "kn" ? s.kannadaName : s.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider pt-2">
                {t("Languages", "ಭಾಷೆಗಳು")}
              </h4>
              <ul className="space-y-2 text-xs">
                {LANGUAGE_SUBJECTS.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/subject/${s.slug}`} className="hover:text-[#2563eb] transition-colors">
                      {language === "kn" ? s.kannadaName : s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                {t("Resource Types", "ಸಂಪನ್ಮೂಲಗಳು")}
              </h4>
              <ul className="space-y-2 text-xs">
                {RESOURCE_CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/category/${c.slug}`} className="hover:text-[#2563eb] transition-colors">
                      {language === "kn" ? c.kannadaTitle : c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links & Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                {t("Quick Links & Legal", "ಕಾನೂನು & ಸಹಾಯ")}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/my-purchases" className="hover:text-[#2563eb] transition-colors">
                    {t("My Purchases", "ನನ್ನ ಖರೀದಿಗಳು")}
                  </Link>
                </li>
                <li>
                  <Link href="/contribute" className="text-[#2563eb] font-semibold hover:underline flex items-center gap-1 transition-colors">
                    <span>{t("Contribute Notes", "ನೋಟ್ಸ್ ಹಂಚಿಕೊಳ್ಳಿ")}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">Drive</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#2563eb] transition-colors">
                    {t("About Us", "ನಮ್ಮ ಬಗ್ಗೆ")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#2563eb] transition-colors">
                    {t("Contact Us", "ಸಂಪರ್ಕಿಸಿ")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#2563eb] transition-colors">
                    {t("Privacy Policy", "ಗೌಪ್ಯತಾ ನೀತಿ")}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#2563eb] transition-colors">
                    {t("Terms & Conditions", "ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು")}
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-[#2563eb] transition-colors">
                    {t("Refund Policy", "ಮರುಪಾವತಿ ನೀತಿ")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Bottom Bar & Copyright ── */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
            <p>
              &copy; {new Date().getFullYear()} <span className="font-semibold text-[#0f172a]">2PUC</span>. {t("All rights reserved.", "ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.")}
            </p>
            <p className="text-center sm:text-right text-[11px] text-[#64748b]">
              {t("Aligned with Karnataka KSEAB Pre-University Curriculum", "ಕರ್ನಾಟಕ ಪದವಿ ಪೂರ್ವ ಶಿಕ್ಷಣ ಮಂಡಳಿ ಪಠ್ಯಕ್ರಮ")}
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
