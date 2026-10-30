import { MetaNoIndex } from "@/components/meta-noindex";
import { useSearch, Link } from "wouter";
import { useGetCard } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, ShoppingBag, Home, FileText, Check, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";

export default function PaymentSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = params.get("orderId") || "";
  const cardId = parseInt(params.get("cardId") || "0");
  const isFree = params.get("free") === "true";
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const { data: card, isLoading } = useGetCard(cardId, { query: { enabled: !!cardId, queryKey: ["card", cardId] } });

  const downloadUrl = `${API_URL}/api/purchases/${orderId}/download/${cardId}`;

  function handleCopyOrderId() {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const isDriveLink = Boolean(card?.pdfFileKey?.startsWith("http"));

  return (
    <div className="max-w-md mx-auto w-full px-4 py-12 sm:py-16 text-center">
      {/* Success Badge Icon */}
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf5ec] dark:bg-emerald-950/40 text-[#167035] dark:text-emerald-400 border border-[#d7ecdc] dark:border-emerald-800/50">
        <CheckCircle2 className="h-8 w-8 text-[#167035]" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] dark:text-[#F1F5F9] tracking-tight mb-2">
        {isFree ? t("Ready to Download!", "ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಸಿದ್ಧವಾಗಿದೆ!") : t("Payment Successful!", "ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!")}
      </h1>

      <p className="text-sm text-[#5a6b82] dark:text-[#94A3B8] mb-7 max-w-sm mx-auto leading-relaxed">
        {isFree
          ? t("Your free resource is ready.", "ನಿಮ್ಮ ಉಚಿತ ಸಂಪನ್ಮೂಲ ಸಿದ್ಧವಾಗಿದೆ.")
          : t("Your purchase is confirmed and your resource is ready to download.", "ನಿಮ್ಮ ಖರೀದಿ ಖಚಿತವಾಗಿದೆ ಮತ್ತು ಸಂಪನ್ಮೂಲ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಸಿದ್ಧವಾಗಿದೆ.")}
      </p>

      {/* Order Info Card */}
      {isLoading ? (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 mb-5 text-left space-y-3 shadow-xs">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] rounded-2xl p-4.5 sm:p-5 mb-5 text-left shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] dark:from-[#1C2638] dark:to-[#151D2E] text-[#2563eb] dark:text-[#818CF8] border border-[#bfdbfe]/80 dark:border-[#293548] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-0.5">{t("Study Resource", "ಅಧ್ಯಯನ ಸಂಪನ್ಮೂಲ")}</p>
              <p className="font-bold text-[#0f172a] dark:text-[#F1F5F9] text-sm leading-snug">{card?.title}</p>
            </div>
          </div>

          {orderId && (
            <div className="mt-3.5 pt-3 border-t border-[#f1f5f9] dark:border-[#293548] flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-0.5">{t("Order Reference", "ಆರ್ಡರ್ ಸಂಖ್ಯೆ")}</p>
                <p className="font-mono text-xs text-[#64748b] dark:text-[#94A3B8] break-all">{orderId}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="text-xs font-semibold text-[#2563eb] dark:text-[#818CF8] hover:text-[#1d4ed8] dark:hover:text-[#a5b4fc] transition-colors ml-2 shrink-0 flex items-center gap-1.5 px-2 py-1 rounded bg-[#eff6ff] dark:bg-[#1C2638] border border-[#bfdbfe] dark:border-[#293548]"
                aria-label="Copy Order ID"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#16a34a]" />
                    <span className="text-[#16a34a]">{t("Copied", "ಕಾಪಿ ಮಾಡಲಾಗಿದೆ")}</span>
                  </>
                ) : (
                  <span>{t("Copy", "ಕಾಪಿ")}</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Primary Download CTA */}
      <a 
        href={downloadUrl} 
        target={isDriveLink ? "_blank" : undefined}
        rel={isDriveLink ? "noopener noreferrer" : undefined}
        download={!isDriveLink} 
        className="block mb-3.5"
      >
        <Button size="lg" className="w-full gap-2 h-11.5 rounded-xl text-sm font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#818CF8] dark:hover:bg-[#6366F1] text-white shadow-2xs transition-all">
          {isDriveLink ? (
            <>
              <ExternalLink className="h-4 w-4" />
              <span>{t("Open on Google Drive", "ಗೂಗಲ್ ಡ್ರೈವ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ")}</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>{t("Download PDF", "PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ")}</span>
            </>
          )}
        </Button>
      </a>

      <p className="text-xs text-[#64748b] dark:text-[#94A3B8] mb-7">
        {t(
          "You can re-download this resource anytime using your phone number in My Purchases.",
          "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಬಳಸಿಕೊಂಡು 'ನನ್ನ ಖರೀದಿಗಳು' ಪುಟದಲ್ಲಿ ಯಾವಾಗ ಬೇಕಾದರೂ ಇದನ್ನು ಮರು-ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಬಹುದು."
        )}
      </p>

      {/* Secondary Actions */}
      <div className="flex gap-3">
        <Link href="/my-purchases" className="flex-1">
          <Button variant="outline" className="w-full gap-2 rounded-xl text-xs font-semibold h-10 border-[#cbd5e1] dark:border-[#293548] dark:bg-[#1C2638] text-[#475569] dark:text-[#F1F5F9] hover:text-[#0f172a] hover:bg-[#f8fafc] dark:hover:bg-[#253248] shadow-2xs">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{t("My Purchases", "ನನ್ನ ಖರೀದಿಗಳು")}</span>
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="ghost" className="w-full gap-2 rounded-xl text-xs font-semibold h-10 text-[#475569] dark:text-[#94A3B8] hover:text-[#0f172a] dark:hover:text-[#F1F5F9] hover:bg-[#f8fafc] dark:hover:bg-[#1C2638]">
            <Home className="h-3.5 w-3.5" />
            <span>{t("Home", "ಮುಖಪುಟ")}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

