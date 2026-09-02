import { useState } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { useGetCard } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2, Phone, User, Mail, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupees } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

  const { data: card, isLoading } = useGetCard(cardId, { query: { enabled: !!cardId, queryKey: ["card", cardId] } });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        name: "2PUC Notes Store",
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
      <p className="text-gray-500 mb-4">Resource not found.</p>
      <Link href="/"><Button variant="default">Go Home</Button></Link>
    </div>
  );

  const effectivePrice = card.discountPricePaise ?? card.pricePaise;
  const isCardFree = isFree || card.isFree;

  return (
    <div className="max-w-lg mx-auto w-full px-4 py-8 sm:py-10">
      <Link href={`/card/${cardId}`}>
        <Button variant="ghost" size="sm" className="gap-2 text-[#5a6b82] hover:text-[#112542] -ml-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </Link>

      {/* Order Summary Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 sm:p-5 mb-5">
        <div className="flex items-center justify-between border-b border-[#eef2f6] pb-2.5 mb-3">
          <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">Order Summary</span>
          <span className="text-xs font-medium text-[#1856b8] bg-[#ebf3ff] border border-[#dce8fa] px-2 py-0.5 rounded">
            {card.resourceType}
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-lg bg-[#f8fafc] border border-[#eef2f6] overflow-hidden shrink-0 flex items-center justify-center">
            {card.thumbnailUrl ? (
              <img src={card.thumbnailUrl} alt={card.title} className="w-full h-full object-cover" />
            ) : (
              <FileText className="h-5 w-5 text-[#94a3b8]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-[#112542] text-sm leading-snug line-clamp-2">
              {card.title}
            </h2>
            {card.chapter && (
              <p className="text-xs text-[#5a6b82] mt-0.5 truncate">{card.chapter}</p>
            )}
          </div>
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-between border-t border-[#eef2f6] pt-3 mt-3.5">
          <span className="text-sm font-medium text-[#5a6b82]">Total</span>
          <div className="text-right">
            {isCardFree ? (
              <span className="text-lg font-bold text-[#16a34a]">Free</span>
            ) : card.discountPricePaise && card.discountPricePaise < card.pricePaise ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-[#94a3b8] line-through">{formatRupees(card.pricePaise)}</span>
                <span className="text-lg font-bold text-[#112542]">{formatRupees(effectivePrice)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-[#112542]">{formatRupees(effectivePrice)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Customer Form Card */}
      <Card className="rounded-xl border-[#e2e8f0] shadow-none">
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="text-base sm:text-lg font-bold text-[#112542]">
            {isCardFree ? "Get Free Download" : "Complete Purchase"}
          </CardTitle>
          <CardDescription className="text-xs text-[#5a6b82]">
            We need a few details to send you your resource
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-[#334155] flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#94a3b8]" />
                <span>Full Name *</span>
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="h-10 text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542] focus-visible:border-[#1856b8]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold text-[#334155] flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#94a3b8]" />
                <span>Phone Number *</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                maxLength={10}
                className="h-10 text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542] focus-visible:border-[#1856b8]"
              />
              <p className="text-[11px] text-[#94a3b8]">Used to retrieve your purchases later</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-[#334155] flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#94a3b8]" />
                <span>Email (optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10 text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542] focus-visible:border-[#1856b8]"
              />
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                className="w-full gap-2 h-11 font-semibold text-sm rounded-lg bg-[#2f74de] hover:bg-[#1f63c8] text-white shadow-none transition-colors"
                disabled={loading}
              >
                {loading ? "Processing..." : (
                  <>
                    <Lock className="h-4 w-4" />
                    {isCardFree ? "Get Free Download" : `Pay ${formatRupees(effectivePrice)} Securely`}
                  </>
                )}
              </Button>
            </div>

            {/* Trust and security badges */}
            <div className="pt-3 border-t border-[#eef2f6] flex items-center justify-center gap-4 text-xs text-[#5a6b82]">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#16a34a]" />
                <span>256-bit Encryption</span>
              </div>
              {!isCardFree && (
                <div className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-[#1856b8]" />
                  <span>Secured by Razorpay</span>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

