import { Link } from "wouter";
import { TELEGRAM_LINK } from "@/lib/site-config";

const footerLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-white py-8">
      <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-center text-sm text-gray-500 md:flex-row md:text-left">
        <p>&copy; 2026 Notes Vault. All rights reserved.</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
          <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">
            Telegram
          </a>
        </nav>
      </div>
    </footer>
  );
}
