import { Link } from "wouter";
import { BookOpen, Send } from "lucide-react";
import { TELEGRAM_LINK } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200/80 bg-white text-gray-600">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          {/* Brand & Mission */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-primary">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="tracking-tight text-gray-900">2PUC Notes</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              High-quality 2nd PUC Science notes and study materials, organized to help you prepare with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/my-purchases" className="text-gray-500 hover:text-primary transition-colors">
                  My Purchases
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-gray-500 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-500 hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Telegram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-10 border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; 2026 2nd PUC Notes. All rights reserved.</p>
          <p className="text-gray-400 text-center sm:text-right">
            Karnataka 2nd PUC Science Study Resources
          </p>
        </div>
      </div>
    </footer>
  );
}

