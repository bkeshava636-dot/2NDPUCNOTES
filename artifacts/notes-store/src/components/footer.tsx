import { Link } from "wouter";
import { BookOpen, Send } from "lucide-react";
import { TELEGRAM_LINK } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#eef2f6] bg-white text-[#5a6b82]">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-10">
          {/* Brand & Mission */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-base text-[#112542] hover:text-[#1856b8] transition-colors">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa]">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <span className="tracking-tight">2PUC Notes</span>
            </Link>
            <p className="text-xs sm:text-sm text-[#5a6b82] leading-relaxed max-w-xs">
              High-quality 2nd PUC Science notes and study materials, organized to help you prepare with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-[#112542] uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-[#5a6b82] hover:text-[#1856b8] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/my-purchases" className="text-[#5a6b82] hover:text-[#1856b8] transition-colors">
                  My Purchases
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-xs font-semibold text-[#112542] uppercase tracking-wider mb-3">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-[#5a6b82] hover:text-[#1856b8] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#5a6b82] hover:text-[#1856b8] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-[#5a6b82] hover:text-[#1856b8] transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-[#112542] uppercase tracking-wider mb-3">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-[#5a6b82] hover:text-[#1856b8] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#5a6b82] hover:text-[#1856b8] transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Telegram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-10 border-t border-[#eef2f6] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8a99ad]">
          <p>&copy; 2026 2nd PUC Notes. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Karnataka 2nd PUC Science Study Resources
          </p>
        </div>
      </div>
    </footer>
  );
}

