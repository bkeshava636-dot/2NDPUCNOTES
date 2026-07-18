import { useSearch, Link } from "wouter";
import { useGetCard } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ShoppingBag, Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
const API_URL = import.meta.env.VITE_API_URL;

export default function PaymentSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = params.get("orderId") || "";
  const cardId = parseInt(params.get("cardId") || "0");
  const isFree = params.get("free") === "true";

  const { data: card, isLoading } = useGetCard(cardId, { query: { enabled: !!cardId, queryKey: ["card", cardId] } });

  const downloadUrl = `${API_URL}/api/purchases/${orderId}/download/${cardId}`;

  return (
    <div className="max-w-md mx-auto w-full px-4 py-16 text-center">
      <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {isFree ? "Ready to Download!" : "Payment Successful!"}
      </h1>
      <p className="text-gray-500 mb-6">
        {isFree ? "Your free resource is ready." : "Your purchase is confirmed and your resource is ready to download."}
      </p>

      {isLoading ? <Skeleton className="h-6 w-48 mx-auto mb-4" /> : (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-gray-400 mb-1">Resource</p>
          <p className="font-bold text-gray-900">{card?.title}</p>
          {orderId && (
            <>
              <p className="text-xs text-gray-400 mt-3 mb-1">Order ID</p>
              <p className="font-mono text-sm text-gray-600 break-all">{orderId}</p>
            </>
          )}
        </div>
      )}

      <a href={downloadUrl} download>
        <Button size="lg" className="w-full gap-2 mb-3">
          <Download className="h-5 w-5" /> Download PDF
        </Button>
      </a>

      <div className="flex gap-3 mt-4">
        <Link href="/my-purchases" className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <ShoppingBag className="h-4 w-4" /> My Purchases
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="ghost" className="w-full gap-2">
            <Home className="h-4 w-4" /> Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
