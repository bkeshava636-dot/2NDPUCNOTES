import { useSearch, Link } from "wouter";
import { useGetCard } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, ShoppingBag, Home, FileText, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";

export default function PaymentSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = params.get("orderId") || "";
  const cardId = parseInt(params.get("cardId") || "0");
  const isFree = params.get("free") === "true";
  const [copied, setCopied] = useState(false);

  const { data: card, isLoading } = useGetCard(cardId, { query: { enabled: !!cardId, queryKey: ["card", cardId] } });

  const downloadUrl = `${API_URL}/api/purchases/${orderId}/download/${cardId}`;

  function handleCopyOrderId() {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 py-12 sm:py-16 text-center">
      {/* Success Badge Icon */}
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf5ec] text-[#167035] border border-[#d7ecdc]">
        <CheckCircle2 className="h-8 w-8 text-[#167035]" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight mb-2">
        {isFree ? "Ready to Download!" : "Payment Successful!"}
      </h1>

      <p className="text-sm text-[#5a6b82] mb-7 max-w-sm mx-auto leading-relaxed">
        {isFree ? "Your free resource is ready." : "Your purchase is confirmed and your resource is ready to download."}
      </p>

      {/* Order Info Card */}
      {isLoading ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 mb-5 text-left space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 mb-5 text-left">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa] flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-0.5">Resource</p>
              <p className="font-bold text-[#112542] text-sm leading-snug">{card?.title}</p>
            </div>
          </div>

          {orderId && (
            <div className="mt-3.5 pt-3 border-t border-[#eef2f6] flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-0.5">Order ID</p>
                <p className="font-mono text-xs text-[#5a6b82] break-all">{orderId}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="text-xs font-medium text-[#1856b8] hover:text-[#0b57d0] transition-colors ml-2 shrink-0 flex items-center gap-1"
                aria-label="Copy Order ID"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#16a34a]" />
                    <span className="text-[#16a34a]">Copied</span>
                  </>
                ) : (
                  <span>Copy</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Primary Download CTA */}
      <a href={downloadUrl} download className="block mb-3">
        <Button size="lg" className="w-full gap-2 h-11 rounded-lg text-sm font-semibold bg-[#2f74de] hover:bg-[#1f63c8] text-white shadow-none transition-colors">
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </Button>
      </a>

      <p className="text-xs text-[#94a3b8] mb-7">
        You can re-download this resource anytime using your phone number in My Purchases.
      </p>

      {/* Secondary Actions */}
      <div className="flex gap-2.5">
        <Link href="/my-purchases" className="flex-1">
          <Button variant="outline" className="w-full gap-2 rounded-lg text-xs font-medium h-9 border-[#e2e8f0] text-[#5a6b82] hover:text-[#112542] hover:bg-[#f8fafc]">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>My Purchases</span>
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="ghost" className="w-full gap-2 rounded-lg text-xs font-medium h-9 text-[#5a6b82] hover:text-[#112542] hover:bg-[#f8fafc]">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

