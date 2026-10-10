import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  HardDrive, 
  CreditCard, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  Globe,
  FileText,
  Server
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAdminToken } from "@/lib/utils";

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFlushing, setIsFlushing] = useState(false);

  const token = getAdminToken();
  const isHmacToken = token?.startsWith("adm_");

  const handleClearCache = () => {
    setIsFlushing(true);
    queryClient.clear();
    setTimeout(() => {
      setIsFlushing(false);
      toast({
        title: "Client Cache Flushed",
        description: "All client-side cached queries have been re-initialized.",
      });
    }, 400);
  };

  const integrations = [
    {
      name: "Supabase PostgreSQL Database",
      description: "Stores study resources, categories, student checkouts, and download access records",
      icon: Database,
      status: "Operational",
      badge: "Connected",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      name: "Supabase Storage Buckets",
      description: "Encrypted storage for PDF notes ('2puc-notes-storage') and cover images ('note-covers')",
      icon: HardDrive,
      status: "Configured & Active",
      badge: "Signed URLs",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      name: "Razorpay Payment Gateway",
      description: "Powers instant UPI, card, and net-banking checkout verification with webhooks",
      icon: CreditCard,
      status: "Webhook Active",
      badge: "Razorpay Standard",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      name: "HMAC Session Security",
      description: "Stateless 7-day HMAC-SHA256 tokens resistant to server restarts or cloud cold starts",
      icon: Lock,
      status: isHmacToken ? "Durable HMAC Active" : "Session Active",
      badge: isHmacToken ? "HMAC Signed" : "Active",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ];

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">
            System Status & Configuration
          </h1>
          <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">
            Architecture health, database integration status, and security configuration
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCache}
          disabled={isFlushing}
          className="h-9 gap-1.5 text-xs text-[#5a6b82] hover:text-[#112542] border-[#e2e8f0]"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFlushing ? "animate-spin text-[#1856b8]" : ""}`} />
          <span>{isFlushing ? "Flushing..." : "Flush App Cache"}</span>
        </Button>
      </div>

      {/* Architecture Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.name} className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="h-9 w-9 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#1856b8]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#112542] mt-1">{item.name}</h3>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">{item.description}</p>
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#f1f5f9] text-[11px] text-emerald-600 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{item.status}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Admin Security & Best Practices */}
      <Card className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base text-[#112542] flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#1856b8]" />
            Security & Maintenance Guidelines
          </CardTitle>
          <CardDescription className="text-xs text-[#64748b]">
            Key architectural notes for managing 2nd PUC Notes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-[#5a6b82] leading-relaxed">
          <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] space-y-1.5">
            <p className="font-bold text-[#112542]">1. Official Blueprints & Source Verification</p>
            <p>
              When uploading Model Question Papers or Department Blueprints, always attach the official URL (e.g. kseab.karnataka.gov.in) using the quick edit button so students can verify authenticity.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] space-y-1.5">
            <p className="font-bold text-[#112542]">2. PDF Storage vs. Google Drive Links</p>
            <p>
              Uploaded PDFs are stored in Supabase private storage and served via time-limited signed URLs (3600 seconds) after payment confirmation. Alternatively, direct Google Drive viewer links can be provided for instant cloud streaming.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] space-y-1.5">
            <p className="font-bold text-[#112542]">3. Zero Data Loss Deletion (Soft Delete)</p>
            <p>
              Deleting study resources uses safe soft-deletion, preserving historic order records, Razorpay receipts, and student download audit logs intact.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
