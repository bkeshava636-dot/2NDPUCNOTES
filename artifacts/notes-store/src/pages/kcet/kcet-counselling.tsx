import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SeoHead } from "@/components/seo-head";
import { fetchKcetCounsellingGuide } from "@/lib/kcet-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Printer,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
  QrCode,
  CreditCard,
  ListOrdered,
  FileCheck2,
  Building2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function KcetCounsellingPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: guide, isLoading } = useQuery({
    queryKey: ["kcet-counselling-guide"],
    queryFn: fetchKcetCounsellingGuide,
    staleTime: 60_000,
  });

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: guide?.title || "KCET 2026 KEA Counselling Guide",
        text: "Official 2026 KEA KCET counselling process, option entry rules, and shopping strategy breakdown.",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      toast({
        title: "Link Copied!",
        description: "KCET Counselling Guide link copied to clipboard.",
      });
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-8 sm:space-y-10">
      <SeoHead
        title="KCET 2026 KEA Counselling Process & Option Entry Guide | 2PUC"
        description="Complete step-by-step 2026 KEA KCET counselling guide. Learn option entry rules, mock allotment, the 4 choices, seat allocation tracks, and college reporting."
        keywords="kcet counselling 2026, kea option entry, kcet mock allotment, kcet choice 1 2 3 4, kcet verification slip, kea seat matrix"
        canonicalPath="/kcet/counselling"
      />

      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/kcet">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs font-semibold text-[#475569] dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300 hover:bg-sky-50 dark:hover:bg-cyan-500/10 px-2.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to KCET Arena</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 gap-1.5 text-xs font-medium border-[#cbd5e1] dark:border-slate-800 bg-white dark:bg-[#090f24] text-[#334155] dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share Guide</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-8 gap-1.5 text-xs font-medium border-[#cbd5e1] dark:border-slate-800 bg-white dark:bg-[#090f24] text-[#334155] dark:text-slate-300 hover:text-sky-600 dark:hover:text-cyan-300"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </Button>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative rounded-3xl border border-sky-200 dark:border-cyan-500/30 bg-gradient-to-br from-[#eff8ff] via-white to-[#eef2ff] dark:from-[#0a1128] dark:via-[#070b1d] dark:to-[#110a28] p-6 sm:p-10 overflow-hidden shadow-xs dark:shadow-[0_0_50px_rgba(6,182,212,0.12)]">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-400/15 dark:bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-400/15 dark:bg-violet-600/15 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/90 dark:bg-cyan-500/15 border border-sky-200 dark:border-cyan-400/40 text-sky-700 dark:text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Compass className="h-3.5 w-3.5" />
            <span>Official KEA {guide?.academicYear || "2026"} Master Guide</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0f172a] dark:text-white leading-[1.2]">
            {guide?.title || "Official KCET 2026 KEA Counselling Guide"}
          </h1>

          <p className="text-sm sm:text-base text-[#475569] dark:text-slate-300 leading-relaxed">
            {guide?.subtitle ||
              "Step-by-step breakdown of seats, verification slip, option entry, mock round, and college admission."}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-mono text-[#334155] dark:text-slate-300">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-cyan-400" />
              <span>100% Automated Roster System</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-white/5 border border-[#e2e8f0] dark:border-white/10 shadow-2xs">
              <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-violet-400" />
              <span>Session: {guide?.academicYear || "2026"} Admissions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Admin Notice Banner (Dynamic from Admin Editor) */}
      {guide?.notice && (
        <section className="rounded-2xl border border-amber-300 dark:border-amber-500/40 bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-white dark:from-amber-950/30 dark:via-[#090f24] dark:to-amber-950/20 p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
              Official KEA Advisory &amp; Status Update
            </h3>
            <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-medium">
              {guide.notice}
            </p>
          </div>
        </section>
      )}

      {/* Visual Infographic 1: The 3 Entrance Tracks */}
      <section className="space-y-4">
        <div className="border-b border-[#e2e8f0] dark:border-slate-800 pb-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 dark:text-cyan-300 uppercase tracking-wider mb-1">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Part 1: The 3 Entrance Tracks</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-white">
            How are Seats Decided? (Automated Matchmaking)
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-slate-400 mt-1">
            KEA runs a 100% transparent algorithmic system based on merit, seat availability, and constitutional reservation roster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-rose-200 dark:border-rose-500/30 bg-white dark:bg-[#090f24] p-5 space-y-3 shadow-2xs hover:border-rose-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                Track 01
              </span>
              <span className="text-lg">🩺</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">NEET Rank</h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
              Medical (MBBS), Dental (BDS), and AYUSH courses (Ayurveda, Yoga, Unani, Siddha, Homeopathy).
            </p>
          </div>

          <div className="rounded-2xl border border-sky-300 dark:border-cyan-500/40 bg-white dark:bg-[#090f24] p-5 space-y-3 shadow-2xs hover:border-sky-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 dark:bg-cyan-500/15 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-cyan-500/30">
                Track 02 • Core
              </span>
              <span className="text-lg">⚙️</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">KCET Rank</h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
              Engineering (B.Tech/BE), B.Sc Nursing, Veterinary Science (BVSc), Agriculture, Horticulture &amp; B-Pharma.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-white dark:bg-[#090f24] p-5 space-y-3 shadow-2xs hover:border-emerald-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                Track 03
              </span>
              <span className="text-lg">📊</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">Class 12 Marks</h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
              BPT (Physiotherapy), BPO (Prosthetics &amp; Orthotics), Allied Health Sciences, and D-Pharma.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Infographic 2: The Step-by-Step 6-Stage Journey */}
      <section className="space-y-4">
        <div className="border-b border-[#e2e8f0] dark:border-slate-800 pb-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-700 dark:text-violet-300 uppercase tracking-wider mb-1">
            <ListOrdered className="h-3.5 w-3.5" />
            <span>Part 2: The Step-by-Step Roadmap</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-white">
            The 6 Key Online Counselling Stages
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24] p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 font-bold text-xs font-mono">
              <QrCode className="h-4 w-4" />
              <span>STAGE 1</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">Download Verification Slip</h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
              Your official passport to counselling. Contains verified categories (2A, 3B, HK, Rural, Kannada Medium) and a unique printed QR code.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24] p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-violet-400 font-bold text-xs font-mono">
              <CreditCard className="h-4 w-4" />
              <span>STAGE 2</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">Pay ₹750 Fee &amp; Face Login</h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
              Pay ₹750 non-refundable entry fee online. Portal login requires scanning your verification QR code, live face recognition, and mobile OTP.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24] p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono">
              <Layers className="h-4 w-4" />
              <span>STAGE 3</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">Wishlist Option Entry</h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
              Add college + branch combinations with priority numbers (1, 2, 3...). Enter as many choices as you want (100, 200, or more!).
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24] p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs font-mono">
              <FileCheck2 className="h-4 w-4" />
              <span>STAGE 4</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">Mock Allotment Practice</h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
              Computer simulation showing trial seat result based on current rank. You get 2–3 days to add, delete, or rearrange priorities!
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24] p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs font-mono">
              <Clock className="h-4 w-4" />
              <span>STAGE 5</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">The Pre-Round (Status)</h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
              Special early round designed for non-medical courses when NEET is delayed. If satisfied, take admission; if not, enter Round 1 automatically.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24] p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs font-mono">
              <Building2 className="h-4 w-4" />
              <span>STAGE 6</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">Real Rounds &amp; Reporting</h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
              Official binding rounds (Round 1, Round 2, and Extended/Mop-up round). Complete fee payment, face recognition at college, and get admission order.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Infographic 3: Golden Rules of Option Entry */}
      <section className="rounded-3xl border border-sky-200 dark:border-cyan-500/30 bg-white dark:bg-[#090f24]/90 p-6 sm:p-8 space-y-5 shadow-2xs">
        <div className="border-b border-[#e2e8f0] dark:border-slate-800 pb-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Part 3: Critical Instructions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-white">
            KEA&apos;s Golden Rules of Option Entry
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>The &quot;Round 1 Only&quot; Permanent Rule</span>
            </div>
            <p className="text-[#475569] dark:text-slate-400 leading-relaxed">
              The wishlist you enter in Round 1 is your <strong className="text-[#0f172a] dark:text-white">permanent list</strong>. You are <strong>NOT allowed to add new colleges</strong> in Round 2 or 3! You can only delete or reorder higher choices.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-violet-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Farmer&apos;s Quota Separate Codes</span>
            </div>
            <p className="text-[#475569] dark:text-slate-400 leading-relaxed">
              If eligible for Veterinary or Agri practical ranks, enter options for <strong className="text-[#0f172a] dark:text-white">Regular and Practical seats separately</strong>. Their college codes are completely distinct!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Save Every 2 Minutes</span>
            </div>
            <p className="text-[#475569] dark:text-slate-400 leading-relaxed">
              The KEA secure session can time out automatically. Always click <strong className="text-[#0f172a] dark:text-white">&quot;Save &amp; Submit&quot; every 2 minutes</strong> while editing your preference orders.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>How to Delete Choices</span>
            </div>
            <p className="text-[#475569] dark:text-slate-400 leading-relaxed">
              To delete a college option from your list, set its priority number to <strong className="text-[#0f172a] dark:text-white">0 (zero)</strong> and click <strong className="text-[#0f172a] dark:text-white">&quot;Update Options&quot;</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Infographic 4: The Shopping Strategy (Buckets) */}
      <section className="space-y-4">
        <div className="border-b border-[#e2e8f0] dark:border-slate-800 pb-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 dark:text-cyan-300 uppercase tracking-wider mb-1">
            <Award className="h-3.5 w-3.5" />
            <span>Part 4: Wishlist Strategy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-white">
            The 3-Bucket Shopping Strategy
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-slate-400 mt-1">
            Structure your options smartly to maximize chances of landing top colleges while keeping guaranteed safety backups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border-2 border-indigo-300 dark:border-violet-500/50 bg-indigo-50/50 dark:bg-[#0c132c] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-violet-500/20 text-indigo-700 dark:text-violet-300">
                Top 20%
              </span>
              <span className="text-xl">🌟</span>
            </div>
            <h3 className="font-bold text-lg text-indigo-950 dark:text-white">1. The &quot;Dream&quot; Bucket</h3>
            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              Top-tier colleges where last year&apos;s cutoff was slightly higher than your rank. If seats open up or people drop out, you might get lucky!
            </p>
          </div>

          <div className="rounded-2xl border-2 border-sky-300 dark:border-cyan-500/50 bg-sky-50/50 dark:bg-[#091830] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-cyan-500/20 text-sky-700 dark:text-cyan-300">
                Middle 30%
              </span>
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="font-bold text-lg text-sky-950 dark:text-white">2. The &quot;Real&quot; Bucket</h3>
            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              Target colleges where your rank closely matches last year&apos;s official cutoff matrix. This is your primary realistic admission zone.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-emerald-300 dark:border-emerald-500/50 bg-emerald-50/50 dark:bg-[#08201a] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                Bottom 30%
              </span>
              <span className="text-xl">🛡️</span>
            </div>
            <h3 className="font-bold text-lg text-emerald-950 dark:text-white">3. The &quot;Safety&quot; Bucket</h3>
            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              Safe, reputed colleges where your rank is significantly higher than previous cutoffs. Your insurance policy to guarantee a seat without gap years.
            </p>
          </div>
        </div>

        {/* CS Seat Cap Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Computer Science 900-Seat Cap Impact:</strong> KEA rules limit total CS branch seats (Core, AI/ML, Data Science, Cyber) to 900 seats per college. As elite colleges reduce seats, cutoffs in engineering will be tougher this year. <em>(Government order confirmation pending).</em>
          </div>
        </div>
      </section>

      {/* Visual Infographic 5: The 4 Choices Explained */}
      <section className="space-y-4">
        <div className="border-b border-[#e2e8f0] dark:border-slate-800 pb-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Part 5: Round 1 Result Decision</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-white">
            You Got a Seat! The 4 Official Choices
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-slate-400 mt-1">
            After seat allocation in Round 1, you must select one of the 4 binding options:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-emerald-400 dark:border-emerald-500/50 bg-white dark:bg-[#090f24] p-5 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                Choice 1 • Freeze &amp; Take
              </span>
              <span className="text-xs font-bold text-emerald-600">Final Admission</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">&quot;I&apos;m Buying It!&quot;</h3>
            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              Accept the allotted seat, pay college tuition fees online/challan, download admission order, and report to college. You exit the counselling process happily.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-sky-400 dark:border-cyan-500/50 bg-sky-50/30 dark:bg-[#09152b] p-5 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-cyan-500/20 text-sky-800 dark:text-cyan-300">
                Choice 2 • Hold &amp; Upgrade
              </span>
              <span className="text-xs font-bold text-sky-600 dark:text-cyan-300">Most Popular / Safest</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">&quot;Hold in Cart &amp; Explore Higher Options&quot;</h3>
            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              Pay the fee to secure this seat safely. Enter Round 2. The algorithm only checks choices ranked higher than this. If upgraded, you move up; if not, your original Choice 2 seat is 100% reserved!
            </p>
          </div>

          <div className="rounded-2xl border-2 border-amber-400 dark:border-amber-500/50 bg-white dark:bg-[#090f24] p-5 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300">
                Choice 3 • Reject &amp; Upgrade
              </span>
              <span className="text-xs font-bold text-amber-600">High Risk</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">&quot;Throw Away &amp; Try for Higher&quot;</h3>
            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              Reject the allotted seat completely and enter Round 2 empty-handed. If higher options don&apos;t open up, you get no seat from Round 1.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090f24] p-5 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Choice 4 • Complete Exit
              </span>
              <span className="text-xs font-bold text-slate-500">Leaving System</span>
            </div>
            <h3 className="font-bold text-base text-[#0f172a] dark:text-white">&quot;Exit KEA Counselling&quot;</h3>
            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              Reject the seat and quit KEA system completely (typically when joining IIT, NIT, BITS, COMED-K, or deemed medical colleges).
            </p>
          </div>
        </div>

        {/* UGNEET Penalty Waiver Rule Callout */}
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-violet-950/20 border border-indigo-200 dark:border-violet-900/40 text-xs text-indigo-950 dark:text-violet-200 space-y-1">
          <div className="font-bold text-indigo-900 dark:text-violet-300">
            Special Medical (UGNEET) Penalty Waiver Rule:
          </div>
          <p className="leading-relaxed">
            Medical aspirants participating in both MCC (All India) and KEA (State Quota) can surrender their KEA seat in Round 1 &amp; Round 2 without penalty if they accept an All India seat. Penalty-free surrender is <strong>NOT</strong> valid in later mop-up rounds!
          </p>
        </div>
      </section>

      {/* Visual Infographic 6: Fee Payment & College Reporting */}
      <section className="space-y-4">
        <div className="border-b border-[#e2e8f0] dark:border-slate-800 pb-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 dark:text-cyan-300 uppercase tracking-wider mb-1">
            <Building2 className="h-3.5 w-3.5" />
            <span>Part 6: Admission Completion</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-white">
            Reporting to College (Choice 1 Process)
          </h2>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24] space-y-4 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1">
              <span className="font-mono font-bold text-sky-600 dark:text-cyan-400">Step 1</span>
              <h4 className="font-bold text-[#0f172a] dark:text-white">Fee Challan &amp; Payment</h4>
              <p className="text-[#64748b] dark:text-slate-400">Pay via customized KEA bank challan or direct portal netbanking/UPI. Save UTR number.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1">
              <span className="font-mono font-bold text-indigo-600 dark:text-violet-400">Step 2</span>
              <h4 className="font-bold text-[#0f172a] dark:text-white">Download Confirmation Slip</h4>
              <p className="text-[#64748b] dark:text-slate-400">Once payment verifies, download the official KEA Confirmation Slip from the website.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1">
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">Step 3</span>
              <h4 className="font-bold text-[#0f172a] dark:text-white">Originals &amp; Mobile Phone</h4>
              <p className="text-[#64748b] dark:text-slate-400">Visit college before cutoff date with all original certificates, 2 photocopy sets, and registered phone.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1">
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Step 4</span>
              <h4 className="font-bold text-[#0f172a] dark:text-white">Biometric Face Scan &amp; OTP</h4>
              <p className="text-[#64748b] dark:text-slate-400">College conducts face recognition &amp; OTP verification, then hands you your dual-signed Admission Order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Infographic 7: Anti-Fraud Warning */}
      <section className="rounded-3xl border border-rose-300 dark:border-rose-500/40 bg-gradient-to-r from-rose-50/80 via-white to-rose-50/40 dark:from-rose-950/30 dark:via-[#090f24] dark:to-rose-950/20 p-6 sm:p-8 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
          <ShieldAlert className="h-5 w-5" />
          <span>Part 7: Watch out for Fraudsters!</span>
        </div>
        <h3 className="text-lg font-bold text-rose-950 dark:text-white">
          KEA Seat Allotment is 100% Software-Automated &amp; Merit-Based
        </h3>
        <p className="text-xs sm:text-sm text-rose-900/90 dark:text-rose-200/90 leading-relaxed max-w-3xl">
          <strong>No politician, broker, or agent can secure a seat through &quot;backdoors&quot; or bribes.</strong> Every allocation follows strict roster logic. If anyone claims backdoor access to KEA seats, report them immediately in writing or via email to KEA officials!
        </p>
      </section>

      {/* Action Plan Checklist */}
      <section className="rounded-3xl border border-sky-200 dark:border-cyan-500/30 bg-gradient-to-br from-white to-sky-50/50 dark:from-[#090f24] dark:to-[#0a1835] p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="border-b border-[#e2e8f0] dark:border-slate-800 pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
            <Flame className="h-4.5 w-4.5 text-amber-500" />
            <span>Your Action Plan for Today</span>
          </h2>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
            Do not wait for the final rank list to be published! Start preparing right now:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1.5 shadow-2xs">
            <span className="font-mono font-bold text-sky-600 dark:text-cyan-400">Step 1</span>
            <h4 className="font-bold text-sm text-[#0f172a] dark:text-white">Find Target Rank Bracket</h4>
            <p className="text-[#64748b] dark:text-slate-400">
              Use online rank predictor tools based on your estimated KCET marks to estimate your probable cutoff zone.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1.5 shadow-2xs">
            <span className="font-mono font-bold text-indigo-600 dark:text-violet-400">Step 2</span>
            <h4 className="font-bold text-sm text-[#0f172a] dark:text-white">Shortlist Favorite Branches</h4>
            <p className="text-[#64748b] dark:text-slate-400">
              Don&apos;t blindly chase CS if coding isn&apos;t your passion. Compare ISE, Electronics (ECE), Mechanical, and Biotech.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 space-y-1.5 shadow-2xs">
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Step 3</span>
            <h4 className="font-bold text-sm text-[#0f172a] dark:text-white">Explore Colleges &amp; Status</h4>
            <p className="text-[#64748b] dark:text-slate-400">
              Check placement stats, distance from home, hostel fees, and whether the institution is Autonomous or VTU-affiliated.
            </p>
          </div>
        </div>
      </section>

      {/* Community Telegram CTA */}
      <section className="rounded-3xl border border-sky-200 dark:border-cyan-500/30 bg-gradient-to-r from-[#eff8ff] via-white to-[#eef2ff] dark:from-cyan-950/40 dark:via-[#090f24] dark:to-violet-950/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-2xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 dark:text-cyan-300 uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Have Questions About Option Entry?</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] dark:text-white">
            Join the KCET Community Discussion
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 max-w-xl">
            Get instant peer discussions on cutoff predictions, college reviews, and option entry verification.
          </p>
        </div>

        <Link href="/kcet" className="shrink-0">
          <Button className="gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-violet-600 hover:opacity-95 text-white font-bold shadow-sm">
            <span>Explore KCET Arena</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
