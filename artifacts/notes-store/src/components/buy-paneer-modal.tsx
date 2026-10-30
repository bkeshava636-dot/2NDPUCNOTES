import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, CheckCircle2, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BuyPaneerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAmount?: number;
}

const PANEER_TIERS = [
  { amount: 20, label: "Mini Paneer", emoji: "🧀", description: "Quick study fuel" },
  { amount: 50, label: "Paneer Tikka", emoji: "🍲", popular: true, description: "Student favorite" },
  { amount: 100, label: "Paneer Butter Masala", emoji: "🍛", description: "Generous support" },
  { amount: 200, label: "Paneer Feast", emoji: "👑", description: "Hero contributor" },
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function BuyPaneerModal({ open, onOpenChange, defaultAmount = 50 }: BuyPaneerModalProps) {
  const [selectedTier, setSelectedTier] = useState<number | "custom">(defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paidDetails, setPaidDetails] = useState<{ amount: number; name: string } | null>(null);
  const { toast } = useToast();

  const finalAmount = selectedTier === "custom" ? parseInt(customAmount || "0", 10) : selectedTier;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || finalAmount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum support amount is ₹10.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Could not load Razorpay gateway. Please check your internet connection.");
      }

      const rawApiUrl = import.meta.env.VITE_API_URL;
      const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";

      const res = await fetch(`${API_URL}/api/support/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountPaise: finalAmount * 100,
          name: name.trim() || "Karnataka Student",
          phone: phone.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Could not initiate payment");

      const options = {
        key: orderData.keyId,
        amount: orderData.amountPaise,
        currency: "INR",
        name: "2PUC",
        description: "Found site helpful? Buy me some paneer 🧀",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: orderData.name,
          contact: orderData.phone || "",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${API_URL}/api/support/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");

            setPaidDetails({ amount: finalAmount, name: orderData.name });
            setSuccess(true);
            toast({
              title: "Thank You So Much! 🧀",
              description: "Your paneer treat has been received. Thank you for supporting Karnataka students!",
            });
          } catch (err: any) {
            toast({
              title: "Verification issue",
              description: err.message || "Please check your network connection.",
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setLoading(false);
        toast({
          title: "Payment Cancelled or Failed",
          description: resp.error?.description || "Payment was not completed.",
          variant: "destructive",
        });
      });
      rzp.open();
    } catch (err: any) {
      setLoading(false);
      toast({
        title: "Could not open Razorpay",
        description: err.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSuccess(false);
      setPaidDetails(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] shadow-xl sm:rounded-2xl">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-lg font-bold text-[#0f172a] dark:text-[#F1F5F9] flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
              <span className="text-base">🧀</span>
            </div>
            <span>Buy Me Some Paneer!</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-[#64748b] dark:text-[#94A3B8]">
            Found 2PUC study materials helpful? Fuel the creator with a paneer treat to keep server costs covered & notes 100% free!
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-[#F1F5F9]">
              Paneer Feast Received! 🧀
            </h3>
            <p className="text-xs text-[#64748b] dark:text-[#94A3B8] max-w-xs mx-auto leading-relaxed">
              Thank you {paidDetails?.name || "generous student"} for your ₹{paidDetails?.amount} contribution! You are directly helping thousands of Karnataka 2nd PUC students get free, high-yield notes and question papers.
            </p>
            <div className="pt-2">
              <Button
                onClick={handleClose}
                className="rounded-xl text-xs h-9 px-6 font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#818CF8] dark:hover:bg-[#6366F1] text-white"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="space-y-4 pt-2">
            {/* Amount Tiers */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#334155] dark:text-[#F1F5F9]">Select a Paneer Treat</Label>
              <div className="grid grid-cols-2 gap-2">
                {PANEER_TIERS.map((tier) => {
                  const isSelected = selectedTier === tier.amount;
                  return (
                    <button
                      key={tier.amount}
                      type="button"
                      onClick={() => setSelectedTier(tier.amount)}
                      className={`relative flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-[#eff6ff] dark:bg-[#1C2638] border-[#2563eb] dark:border-[#818CF8] text-[#2563eb] dark:text-[#818CF8] shadow-2xs ring-1 ring-[#2563eb]"
                          : "bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#334155] dark:text-[#F1F5F9] hover:bg-[#f1f5f9]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{tier.emoji}</span>
                        <div>
                          <div className="text-xs font-bold flex items-center gap-1">
                            <span>₹{tier.amount}</span>
                            {tier.popular && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#64748b] dark:text-[#94A3B8]">{tier.label}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom amount chip */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedTier("custom")}
                  className={`w-full py-1.5 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                    selectedTier === "custom"
                      ? "bg-[#eff6ff] dark:bg-[#1C2638] border-[#2563eb] dark:border-[#818CF8] text-[#2563eb] dark:text-[#818CF8] ring-1 ring-[#2563eb]"
                      : "bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#64748b] dark:text-[#94A3B8] hover:bg-[#f1f5f9]"
                  }`}
                >
                  Custom Amount
                </button>
              </div>

              {selectedTier === "custom" && (
                <div className="pt-1">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-[#64748b] dark:text-[#94A3B8] font-bold">₹</span>
                    <Input
                      type="number"
                      min={10}
                      step={10}
                      placeholder="Enter amount (min ₹10)"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pl-7 h-9 text-xs rounded-lg"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Optional Donor Information */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[11px] font-semibold text-[#475569]">Your Name</Label>
                  <Input
                    placeholder="e.g. Rahul K"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-8.5 text-xs rounded-lg mt-0.5"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-[#475569]">Phone (for UPI)</Label>
                  <Input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-8.5 text-xs rounded-lg mt-0.5"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-semibold text-[#475569]">Leave a Note (optional)</Label>
                <Input
                  placeholder="e.g. Loved the Physics & Math papers! 🚀"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-8.5 text-xs rounded-lg mt-0.5"
                />
              </div>
            </div>

            {/* Submit Button with Razorpay Security Badge */}
            <div className="space-y-2 pt-2">
              <Button
                type="submit"
                disabled={loading || !finalAmount || finalAmount < 10}
                className="w-full h-10 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting Razorpay Gateway...</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-3.5 w-3.5 fill-white text-white" />
                    <span>Buy Paneer • ₹{finalAmount || 50} via Razorpay</span>
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#64748b] dark:text-[#94A3B8]">
                <ShieldCheck className="h-3 w-3 text-[#16a34a]" />
                <span>100% Secure via Razorpay (UPI, GPay, Paytm, Cards, NetBanking)</span>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
