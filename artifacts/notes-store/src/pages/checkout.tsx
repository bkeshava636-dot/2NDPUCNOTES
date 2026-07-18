import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useGetCard } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Lock, IndianRupee } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupees } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
const API_URL = import.meta.env.VITE_API_URL;

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
        prefill: { name: orderData.customerName, email: orderData.customerEmail, contact: orderData.customerPhone },
        theme: { color: "#2563eb" },
        handler: async (response: any) => {
          const verifyRes = await fetch("${API_URL}/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const order = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(order.error || "Verification failed");
          setLocation(`/payment-success?orderId=${order.id}&cardId=${cardId}`);
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
      setLoading(false);
    }
  }

  if (isLoading) return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-48" />
    </div>
  );

  if (!card) return (
    <div className="max-w-md mx-auto px-4 py-16 text-center text-gray-500">
      Resource not found. <Link href="/"><Button variant="link">Go Home</Button></Link>
    </div>
  );

  return (
    <div className="max-w-md mx-auto w-full px-4 py-8">
      <Link href={`/card/${cardId}`}>
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </Link>

      {/* Order summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Order Summary</p>
        <p className="font-bold text-gray-900 leading-snug">{card.title}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-500">{card.resourceType}</span>
          <span className="font-bold text-primary text-lg flex items-center gap-1">
            {card.isFree ? "Free" : formatRupees(card.pricePaise)}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isFree || card.isFree ? "Get Free Download" : "Complete Purchase"}</CardTitle>
          <CardDescription>We need a few details to send you your resource</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" placeholder="10-digit mobile number" value={phone} onChange={e => setPhone(e.target.value)} required maxLength={10} />
              <p className="text-xs text-gray-400">Used to retrieve your purchases later</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? "Processing..." : (
                <>
                  <Lock className="h-4 w-4" />
                  {isFree || card.isFree ? "Get Free Download" : `Pay ${formatRupees(card.pricePaise)} Securely`}
                </>
              )}
            </Button>
            {!card.isFree && (
              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" /> Secured by Razorpay
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
