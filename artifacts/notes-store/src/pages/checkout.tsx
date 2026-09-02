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
        <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900 -ml-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </Link>

      {/* Order Summary Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 mb-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Summary</span>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {card.resourceType}
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="h-14 w-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
            {card.thumbnailUrl ? (
              <img src={card.thumbnailUrl} alt={card.title} className="w-full h-full object-cover" />
            ) : (
              <FileText className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2">
              {card.title}
            </h2>
            {card.chapter && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">{card.chapter}</p>
            )}
          </div>
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4">
          <span className="text-sm font-medium text-gray-600">Total</span>
          <div className="text-right">
            {isCardFree ? (
              <span className="text-xl font-extrabold text-emerald-600">Free</span>
            ) : card.discountPricePaise && card.discountPricePaise < card.pricePaise ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-gray-400 line-through">{formatRupees(card.pricePaise)}</span>
                <span className="text-xl font-extrabold text-gray-900">{formatRupees(effectivePrice)}</span>
              </div>
            ) : (
              <span className="text-xl font-extrabold text-gray-900">{formatRupees(effectivePrice)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Customer Form Card */}
      <Card className="rounded-2xl border-gray-200/80 shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl font-extrabold text-gray-900">
            {isCardFree ? "Get Free Download" : "Complete Purchase"}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500">
            We need a few details to send you your resource
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-400" />
                <span>Full Name *</span>
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="h-10 text-sm bg-gray-50/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
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
                className="h-10 text-sm bg-gray-50/50"
              />
              <p className="text-[11px] text-gray-500">Used to retrieve your purchases later</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span>Email (optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10 text-sm bg-gray-50/50"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full gap-2 py-5 font-semibold text-sm rounded-xl shadow-sm" disabled={loading}>
                {loading ? "Processing..." : (
                  <>
                    <Lock className="h-4 w-4" />
                    {isCardFree ? "Get Free Download" : `Pay ${formatRupees(effectivePrice)} Securely`}
                  </>
                )}
              </Button>
            </div>

            {/* Trust and security badges */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1 text-gray-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>256-bit Encryption</span>
              </div>
              {!isCardFree && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Lock className="h-3.5 w-3.5 text-primary" />
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

