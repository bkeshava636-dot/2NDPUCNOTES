import { useState } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { useGetCard } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2, Phone, User, Mail, FileText, Download, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupees } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-context";
import { getResourceTypeDisplayName } from "@/lib/site-navigation";

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";

declare global {
  interface Window { Razorpay: any; }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const cardId = parseInt(params.get("cardId") || "0");
  const isFree = params.get("free") === "true";
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const isKn = language === "kn";

  const { data: card, isLoading } = useGetCard(cardId, { query: { enabled: !!cardId, queryKey: ["card", cardId] } });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFreeDownloadDirect() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/checkout/free-download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = data.filename || `${card?.title || "notes"}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoading(false);
      setLocation(`/payment-success?orderId=${data.orderId}&cardId=${cardId}&free=true`);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to download", variant: "destructive" });
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isFree || card?.isFree) {
      return handleFreeDownloadDirect();
    }
    if (!name.trim() || !phone.trim()) return;
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast({ title: "Invalid phone", description: "Enter a valid 10-digit Indian mobile number.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      if (isFree || card?.isFree) {
        const res = await fetch(`${API_URL}/api/checkout/free-download`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId, customerName: name, customerPhone: phone }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLoading(false);

        setLocation(`/payment-success?orderId=${data.orderId}&cardId=${cardId}&free=true`);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        toast({ title: "Error", description: "Could not load payment gateway. Check your connection.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/checkout/create-razorpay-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, customerName: name, customerPhone: phone, customerEmail: email || undefined }),
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Failed to create order");

      const options = {
        key: orderData.keyId,
        amount: orderData.amountPaise,
        currency: "INR",
        name: "2PUC",
        description: orderData.cardTitle,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone,
        },
        theme: {
          color: "#2563eb",
        },

        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${API_URL}/api/checkout/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const order = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(order.error || "Verification failed");
            }

            setLoading(false);
            window.location.href = `/payment-success?orderId=${order.id}&cardId=${cardId}`;
          } catch (err: any) {
            setLoading(false);
            toast({
              title: "Payment Verification Failed",
              description: err.message,
              variant: "destructive",
            });
          }
        },

        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
      setLoading(false);
    }
  }

  if (isLoading) return (
    <div className="max-w-lg mx-auto px-4 py-12 space-y-4">
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );

  if (!card) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <p className="text-gray-500 mb-4">{t("Resource not found.", "ಸಂಪನ್ಮೂಲ ಕಂಡುಬಂದಿಲ್ಲ.")}</p>
      <Link href="/"><Button variant="default">{t("Go Home", "ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ")}</Button></Link>
    </div>
  );

  const effectivePrice = card.discountPricePaise ?? card.pricePaise;
  const isCardFree = isFree || card.isFree;

  return (
    <div className="max-w-lg mx-auto w-full px-4 py-8 sm:py-10">
      <Link href={`/card/${cardId}`}>
        <Button variant="ghost" size="sm" className="gap-2 text-[#475569] hover:text-[#0f172a] -ml-2 mb-5 font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>{t("Back to Notes", "ನೋಟ್ಸ್‌ಗೆ ಹಿಂತಿರುಗಿ")}</span>
        </Button>
      </Link>

      {/* Order Summary Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4.5 sm:p-5 mb-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3 mb-3.5">
          <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">{t("Order Summary", "ಆರ್ಡರ್ ವಿವರ")}</span>
          <span className="text-xs font-semibold text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe] px-2.5 py-0.5 rounded-full">
            {getResourceTypeDisplayName(card.resourceType, isKn)}
          </span>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="h-13 w-13 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] overflow-hidden shrink-0 flex items-center justify-center">
            {card.thumbnailUrl ? (
              <img src={card.thumbnailUrl} alt={card.title} className="w-full h-full object-cover" />
            ) : (
              <FileText className="h-5.5 w-5.5 text-[#94a3b8]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-[#0f172a] text-sm sm:text-base leading-snug line-clamp-2">
              {card.title}
            </h2>
            {card.chapter && (
              <p className="text-xs text-[#64748b] mt-1 truncate">{card.chapter}</p>
            )}
          </div>
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-3.5 mt-3.5">
          <span className="text-sm font-medium text-[#64748b]">{t("Total Payable", "ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ")}</span>
          <div className="text-right">
            {isCardFree ? (
              <span className="text-xl font-extrabold text-[#16a34a]">{t("Free", "ಉಚಿತ")}</span>
            ) : card.discountPricePaise && card.discountPricePaise < card.pricePaise ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-[#94a3b8] line-through">{formatRupees(card.pricePaise)}</span>
                <span className="text-xl font-extrabold text-[#0f172a]">{formatRupees(effectivePrice)}</span>
              </div>
            ) : (
              <span className="text-xl font-extrabold text-[#0f172a]">{formatRupees(effectivePrice)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Customer Form Card */}
      <Card className="rounded-2xl border-[#e2e8f0] shadow-xs">
        <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-bold text-[#0f172a]">
            {isCardFree ? t("Free Study Resource", "ಉಚಿತ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ") : t("Complete Purchase", "ಖರೀದಿ ಪೂರ್ಣಗೊಳಿಸಿ")}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-[#64748b]">
            {isCardFree
              ? t("This resource is completely free. Click below to download the PDF immediately.", "ಈ ಸಂಪನ್ಮೂಲ ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿದೆ. ತಕ್ಷಣವೇ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಕೆಳಗೆ ಕ್ಲಿಕ್ ಮಾಡಿ.")
              : t("Enter your contact details to receive and access your purchased study material", "ನಿಮ್ಮ ನೋಟ್ಸ್ ಪಡೆಯಲು ಮತ್ತು ಪ್ರವೇಶಿಸಲು ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ")}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 sm:px-6 pb-6 pt-1">
          {isCardFree ? (
            <div className="space-y-4 pt-1">
              <Button
                type="button"
                onClick={handleFreeDownloadDirect}
                disabled={loading}
                className="w-full gap-2 h-11 font-semibold text-sm rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white shadow-2xs transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("Preparing PDF Download...", "PDF ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...")}</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>{t("Download Free PDF Now", "ಈಗಲೇ ಉಚಿತ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ")}</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#94a3b8]" />
                  <span>{t("Student Full Name *", "ವಿದ್ಯಾರ್ಥಿಯ ಪೂರ್ಣ ಹೆಸರು *")}</span>
                </Label>
                <Input
                  id="name"
                  placeholder={t("Your full name", "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು")}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="h-10.5 rounded-lg text-sm bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a] focus-visible:ring-[#2563eb]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#94a3b8]" />
                  <span>{t("Mobile Number *", "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *")}</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t("10-digit mobile number", "10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ")}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  maxLength={10}
                  className="h-10.5 rounded-lg text-sm bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a] focus-visible:ring-[#2563eb]"
                />
                <p className="text-[11px] text-[#64748b]">{t("Used to instantly retrieve and re-download your purchases anytime", "ನಿಮ್ಮ ಖರೀದಿಗಳನ್ನು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಸುಲಭವಾಗಿ ಮರು-ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಬಳಸಲಾಗುತ್ತದೆ")}</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#94a3b8]" />
                  <span>{t("Email Address (Optional)", "ಇಮೇಲ್ ವಿಳಾಸ (ಐಚ್ಛಿಕ)")}</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("Optional: for backup receipt", "ಐಚ್ಛಿಕ: ರಸೀದಿಗಾಗಿ")}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-10.5 rounded-lg text-sm bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a] focus-visible:ring-[#2563eb]"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full gap-2 h-11 font-semibold text-sm rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-2xs transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t("Processing with Razorpay...", "Razorpay ಮೂಲಕ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...")}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      {`${t("Pay", "ಪಾವತಿಸಿ")} ${formatRupees(effectivePrice)} & ${t("Download", "ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ")}`}
                    </>
                  )}
                </Button>
              </div>

              {/* Trust and security badges */}
              <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-center gap-5 text-[11px] text-[#64748b]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#16a34a]" />
                  <span>{t("256-bit Encrypted", "256-ಬಿಟ್ ಸುರಕ್ಷಿತ ಎನ್‌ಕ್ರಿಪ್ಶನ್")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#2563eb]" />
                  <span>{t("Secured by Razorpay", "Razorpay ಸುರಕ್ಷಿತ ಪಾವತಿ")}</span>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

