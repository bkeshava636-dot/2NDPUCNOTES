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
      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
        {isFree ? "Ready to Download!" : "Payment Successful!"}
      </h1>

      <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
        {isFree ? "Your free resource is ready." : "Your purchase is confirmed and your resource is ready to download."}
      </p>

      {/* Order Info Card */}
      {isLoading ? (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 mb-6 shadow-xs text-left space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 mb-6 shadow-xs text-left">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Resource</p>
              <p className="font-bold text-gray-900 text-sm sm:text-base leading-snug">{card?.title}</p>
            </div>
          </div>

          {orderId && (
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Order ID</p>
                <p className="font-mono text-xs text-gray-600 break-all">{orderId}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors ml-2 shrink-0 flex items-center gap-1"
                aria-label="Copy Order ID"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
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
      <a href={downloadUrl} download className="block mb-4">
        <Button size="lg" className="w-full gap-2 py-6 rounded-xl text-base font-semibold shadow-md">
          <Download className="h-5 w-5" />
          <span>Download PDF</span>
        </Button>
      </a>

      <p className="text-xs text-gray-400 mb-8">
        You can re-download this resource anytime using your phone number in My Purchases.
      </p>

      {/* Secondary Actions */}
      <div className="flex gap-3">
        <Link href="/my-purchases" className="flex-1">
          <Button variant="outline" className="w-full gap-2 rounded-xl text-sm border-gray-200">
            <ShoppingBag className="h-4 w-4" />
            <span>My Purchases</span>
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="ghost" className="w-full gap-2 rounded-xl text-sm text-gray-600 hover:text-gray-900">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

