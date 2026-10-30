import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Eye, 
  Users, 
  TrendingUp, 
  Clock, 
  Globe, 
  RefreshCw, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  ArrowUpRight,
  Activity,
  BarChart3,
  MousePointerClick,
  Sparkles,
  AlertTriangle,
  Send,
  UserCheck,
  CalendarDays,
  Layers
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TopPage {
  path: string;
  pageTitle: string;
  views: number;
  uniqueVisitors: number;
}

interface DailyTrendItem {
  date: string;
  views: number;
  visitors: number;
}

interface RecentViewItem {
  id: number;
  path: string;
  pageTitle: string | null;
  visitorId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  referrer: string | null;
  createdAt: string;
}

interface AnalyticsResponse {
  range: string;
  rangeTotal: number;
  allTimeTotal: number;
  uniqueVisitors: number;
  todayViews: number;
  todayVisitors?: number;
  topPages: TopPage[];
  dailyTrend: DailyTrendItem[];
  recentViews: RecentViewItem[];
}

export default function AdminAnalytics() {
  const [range, setRange] = useState<"24h" | "7d" | "30d" | "all">("30d");
  const [metricMode, setMetricMode] = useState<"both" | "visitors" | "views">("both");
  const [isSendingPing, setIsSendingPing] = useState(false);

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<AnalyticsResponse>({
    queryKey: ["admin-analytics", range],
    queryFn: async () => {
      const res = await apiFetch(`/api/admin/analytics?range=${range}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `HTTP ${res.status}`);
      }
      return res.json();
    },
    refetchInterval: 30000, // Live poll every 30s
  });

  const handleSendTestPing = async () => {
    try {
      setIsSendingPing(true);
      const res = await fetch("/api/analytics/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "/admin/analytics",
          pageTitle: "Admin Analytics Ping Test",
          visitorId: "admin_test_" + Date.now().toString(36),
          referrer: "admin_panel",
        }),
      });
      if (res.ok) {
        await refetch();
      }
    } catch {
      // ignore
    } finally {
      setIsSendingPing(false);
    }
  };

  const rangeLabels: Record<string, string> = {
    "24h": "Last 24 Hours",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "all": "All Time",
  };

  // Calculations for daily metrics
  const dailyTrend = data?.dailyTrend || [];
  const maxViews = Math.max(...dailyTrend.map((d) => d.views), 1);
  const maxVisitors = Math.max(...dailyTrend.map((d) => d.visitors), 1);
  const activeDaysCount = dailyTrend.filter((d) => d.views > 0 || d.visitors > 0).length || 1;
  const avgVisitorsPerDay = dailyTrend.length > 0
    ? Math.round(dailyTrend.reduce((acc, d) => acc + d.visitors, 0) / activeDaysCount)
    : 0;

  // Format date nicely (e.g. "Today", "Yesterday", or "Oct 21, 2026")
  const formatDailyDate = (dateStr: string) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (dateStr === today) return "Today (" + dateStr + ")";
      if (dateStr === yesterday) return "Yesterday (" + dateStr + ")";
      const [y, m, d] = dateStr.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] dark:text-[#F1F5F9] tracking-tight">
              Site Traffic & Views Analysis
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e0f2fe] dark:bg-sky-950/40 text-[#0369a1] dark:text-sky-300 border border-[#bae6fd] dark:border-sky-800">
              Live Analytics
            </span>
          </div>
          <p className="text-[#5a6b82] dark:text-[#A1AEC2] text-xs sm:text-sm mt-0.5">
            Monitor real-time visitors, per-day unique students, and popular Karnataka 2nd PUC study resources
          </p>
        </div>

        {/* Range Selector & Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center bg-[#f1f5f9] dark:bg-[#1C2638] p-1 rounded-lg border border-[#e2e8f0] dark:border-[#293548]">
            {(["24h", "7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                  range === r
                    ? "bg-white dark:bg-[#151D2E] text-[#1856b8] dark:text-[#818CF8] shadow-2xs"
                    : "text-[#64748b] dark:text-[#A1AEC2] hover:text-[#112542] dark:hover:text-[#F1F5F9]"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSendTestPing}
            disabled={isSendingPing || isFetching}
            className="h-8 gap-1.5 text-xs text-[#0369a1] dark:text-sky-300 bg-[#f0f9ff] dark:bg-sky-950/40 border-[#bae6fd] dark:border-sky-800 hover:bg-[#e0f2fe] dark:hover:bg-sky-950/60"
            title="Simulate a real-time visit to verify logging"
          >
            <Send className={`h-3 w-3 ${isSendingPing ? "animate-spin" : ""}`} />
            <span>Test Visit</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 gap-1.5 text-xs text-[#5a6b82] dark:text-[#A1AEC2] border-[#e2e8f0] dark:border-[#293548] dark:hover:bg-[#1C2638]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-[#1856b8]" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Error state alert if API query failed */}
      {isError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
            <span>
              Unable to load traffic analysis: {error instanceof Error ? error.message : "Network error"}. Please verify your connection or try again.
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="border-red-300 text-red-700 hover:bg-red-100 h-7 text-xs font-semibold shrink-0"
          >
            Retry Analysis
          </Button>
        </div>
      )}

      {/* KPI Cards: 5 Responsive Metric Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Unique Visitors (Range) */}
        <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] shadow-none bg-white dark:bg-[#151D2E] border-l-4 border-l-[#0284c7]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748b] dark:text-[#A1AEC2] uppercase tracking-wider">
                Unique Visitors
              </span>
              <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-[#0284c7] dark:text-sky-300">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#112542] dark:text-[#F1F5F9] tracking-tight">
                {isLoading ? <Skeleton className="h-8 w-16 inline-block" /> : (data?.uniqueVisitors ?? 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-[#64748b] dark:text-[#A1AEC2]">students</span>
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-1 truncate">
              Avg. <span className="font-semibold text-[#0284c7]">~{avgVisitorsPerDay}</span> / day
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Today's Unique Visitors (NEW) */}
        <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] shadow-none bg-white dark:bg-[#151D2E] border-l-4 border-l-[#16a34a]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748b] dark:text-[#A1AEC2] uppercase tracking-wider">
                Today's Visitors
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#16a34a] dark:text-emerald-400">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
                {isLoading ? (
                  <Skeleton className="h-8 w-16 inline-block" />
                ) : (
                  (data?.todayVisitors ?? (dailyTrend[dailyTrend.length - 1]?.visitors || 0)).toLocaleString()
                )}
              </span>
              <span className="text-[11px] text-[#16a34a] font-medium">unique</span>
            </div>
            <p className="text-[11px] text-[#16a34a] font-medium mt-1">
              Active distinct users today
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Today's Total Views */}
        <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] shadow-none bg-white dark:bg-[#151D2E] border-l-4 border-l-[#1856b8]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748b] dark:text-[#A1AEC2] uppercase tracking-wider">
                Today's Views
              </span>
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#1856b8] dark:text-[#818CF8]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#112542] dark:text-[#F1F5F9] tracking-tight">
                {isLoading ? <Skeleton className="h-8 w-16 inline-block" /> : (data?.todayViews ?? 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-[#64748b] dark:text-[#A1AEC2]">views</span>
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-1">
              Since 12:00 AM midnight
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Total Views (Range) */}
        <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] shadow-none bg-white dark:bg-[#151D2E] border-l-4 border-l-[#4f46e5]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748b] dark:text-[#A1AEC2] uppercase tracking-wider">
                Total Views ({range.toUpperCase()})
              </span>
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-[#4f46e5] dark:text-indigo-400">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#112542] dark:text-[#F1F5F9] tracking-tight">
                {isLoading ? <Skeleton className="h-8 w-16 inline-block" /> : (data?.rangeTotal ?? 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-[#64748b] dark:text-[#A1AEC2]">impressions</span>
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-1 truncate">
              All time: <span className="font-semibold text-[#112542] dark:text-[#F1F5F9]">{(data?.allTimeTotal ?? 0).toLocaleString()}</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 5: Active Sites & Pages */}
        <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] shadow-none bg-white dark:bg-[#151D2E] border-l-4 border-l-[#9333ea] col-span-2 sm:col-span-1">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748b] dark:text-[#A1AEC2] uppercase tracking-wider">
                Active Pages
              </span>
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-[#9333ea] dark:text-purple-400">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#112542] dark:text-[#F1F5F9] tracking-tight">
                {isLoading ? <Skeleton className="h-8 w-16 inline-block" /> : (data?.topPages?.length ?? 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-[#64748b] dark:text-[#A1AEC2]">routes</span>
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] mt-1 truncate">
              In {rangeLabels[range]}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Traffic Activity Chart with Dual Views & Unique Visitors */}
      <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] shadow-none bg-white dark:bg-[#151D2E]">
        <CardHeader className="p-5 border-b border-[#eef2f6] dark:border-[#293548]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-[#112542] dark:text-[#F1F5F9] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1856b8]" />
                Daily Traffic & Unique Visitors ({rangeLabels[range]})
              </CardTitle>
              <CardDescription className="text-xs text-[#64748b] dark:text-[#A1AEC2] mt-0.5">
                Comparison of daily total page views versus distinct unique visitors
              </CardDescription>
            </div>

            {/* Metric Mode Switcher & Legend */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#1856b8]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#1856b8]" />
                  Views ({maxViews} peak)
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#16a34a]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#16a34a]" />
                  Unique Visitors ({maxVisitors} peak)
                </span>
              </div>

              <div className="hidden sm:flex items-center bg-[#f1f5f9] dark:bg-[#1C2638] p-0.5 rounded-md border border-[#e2e8f0] dark:border-[#293548]">
                {(["both", "visitors", "views"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMetricMode(m)}
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-all capitalize ${
                      metricMode === m
                        ? "bg-white dark:bg-[#151D2E] text-[#112542] dark:text-[#F1F5F9] shadow-2xs"
                        : "text-[#64748b] dark:text-[#A1AEC2] hover:text-[#112542] dark:hover:text-[#F1F5F9]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="h-44 flex items-end gap-2 pt-6">
              {[...Array(14)].map((_, i) => (
                <Skeleton key={i} className="flex-1 h-28" />
              ))}
            </div>
          ) : !dailyTrend || dailyTrend.length === 0 ? (
            <div className="text-center py-12 text-[#64748b] text-sm">
              <Activity className="w-8 h-8 mx-auto text-[#cbd5e1] mb-2" />
              <p className="font-semibold">No daily traffic recorded yet for this date range.</p>
              <p className="text-xs text-[#94a3b8] mt-1">
                Views and unique student IDs are logged automatically when pages are opened.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-48 flex items-end gap-2 pt-4 pb-2 border-b border-[#f1f5f9] dark:border-[#293548]">
                {dailyTrend.map((d) => {
                  const viewHeight = Math.max(Math.round((d.views / maxViews) * 100), 6);
                  const visitorHeight = Math.max(Math.round((d.visitors / (metricMode === "visitors" ? maxVisitors : maxViews)) * 100), 6);
                  const pagesPerVisitor = (d.views / (d.visitors || 1)).toFixed(1);

                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Detailed Hover Tooltip */}
                      <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-[#112542] text-white text-[10px] py-1.5 px-2.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20 space-y-0.5">
                        <div className="font-bold text-slate-200">{d.date}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-semibold">{d.visitors} Unique Visitors</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-blue-300 font-semibold">{d.views} Page Views</span>
                        </div>
                        <div className="text-[9px] text-slate-300">
                          Avg: {pagesPerVisitor} pages per visitor
                        </div>
                      </div>

                      {/* Dual Bar Display Container */}
                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        {(metricMode === "both" || metricMode === "views") && (
                          <div
                            style={{ height: `${viewHeight}%` }}
                            className="w-full max-w-[16px] sm:max-w-[20px] bg-[#1856b8] hover:bg-[#0284c7] transition-all rounded-t-sm"
                            title={`${d.views} views`}
                          />
                        )}
                        {(metricMode === "both" || metricMode === "visitors") && (
                          <div
                            style={{ height: `${visitorHeight}%` }}
                            className="w-full max-w-[16px] sm:max-w-[20px] bg-[#16a34a] hover:bg-[#22c55e] transition-all rounded-t-sm"
                            title={`${d.visitors} unique visitors`}
                          />
                        )}
                      </div>

                      <span className="text-[10px] text-[#64748b] font-medium rotate-45 sm:rotate-0 origin-left truncate max-w-full">
                        {d.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-Day Breakdown Table (Explicit Per-Day Unique Visitors List) */}
      <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] shadow-none bg-white dark:bg-[#151D2E]">
        <CardHeader className="p-5 border-b border-[#eef2f6] dark:border-[#293548]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#112542] dark:text-[#F1F5F9] flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#16a34a]" />
                Per-Day Unique Visitors Breakdown
              </CardTitle>
              <CardDescription className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
                Daily history of distinct student devices, total views, and engagement depth
              </CardDescription>
            </div>
            <span className="text-xs text-[#64748b] dark:text-[#A1AEC2] bg-[#f8fafc] dark:bg-[#1C2638] px-2.5 py-1 rounded border border-[#e2e8f0] dark:border-[#293548]">
              {dailyTrend.length} Active {dailyTrend.length === 1 ? "Day" : "Days"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : dailyTrend.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748b]">
              No daily breakdown recorded for this range yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#eef2f6] dark:border-[#293548] bg-[#f8fafc] dark:bg-[#1C2638]">
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2]">Date</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] text-right">Unique Visitors</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] text-right">Total Views</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] text-right">Views / Visitor</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] text-right">Daily Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Show in reverse chronological order (newest date first) */}
                  {[...dailyTrend].reverse().map((d) => {
                    const visitorPercent = Math.round((d.visitors / maxVisitors) * 100);
                    const shareOfRange = data?.uniqueVisitors 
                      ? Math.round((d.visitors / data.uniqueVisitors) * 100) 
                      : 0;
                    const viewsPerStudent = (d.views / (d.visitors || 1)).toFixed(1);

                    return (
                      <TableRow key={d.date} className="border-b border-[#eef2f6] dark:border-[#293548] hover:bg-[#f8fafc]/60 dark:hover:bg-[#1C2638]/60">
                        <TableCell className="py-2.5 font-medium text-xs text-[#112542] dark:text-[#F1F5F9]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold">{d.date}</span>
                            <span className="text-[11px] text-[#64748b] dark:text-[#A1AEC2]">({formatDailyDate(d.date)})</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2.5">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {d.visitors.toLocaleString()} visitors
                            </span>
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                              <div
                                style={{ width: `${visitorPercent}%` }}
                                className="h-full bg-emerald-500 rounded-full"
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2.5 font-mono text-xs font-semibold text-[#1856b8] dark:text-[#818CF8]">
                          {d.views.toLocaleString()} views
                        </TableCell>
                        <TableCell className="text-right py-2.5 text-xs text-[#64748b] dark:text-[#A1AEC2] font-mono">
                          {viewsPerStudent}x
                        </TableCell>
                        <TableCell className="text-right py-2.5 text-xs font-medium text-[#64748b] dark:text-[#A1AEC2]">
                          {shareOfRange}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pages & Live Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sites & Pages breakdown */}
        <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] shadow-none bg-white dark:bg-[#151D2E]">
          <CardHeader className="p-5 border-b border-[#eef2f6] dark:border-[#293548]">
            <CardTitle className="text-base font-bold text-[#112542] dark:text-[#F1F5F9] flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-[#0284c7]" />
              Most Visited Pages & Routes
            </CardTitle>
            <CardDescription className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              Top URLs visited by students and viewers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !data?.topPages || data.topPages.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748b]">
                No page visit details recorded in this window.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#eef2f6] dark:border-[#293548] bg-[#f8fafc] dark:bg-[#1C2638]">
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2]">Page / URL</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] text-right">Views</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] text-right">Visitors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topPages.map((p, idx) => (
                    <TableRow key={idx} className="border-b border-[#eef2f6] dark:border-[#293548] hover:bg-[#f8fafc]/60 dark:hover:bg-[#1C2638]/60">
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono font-semibold text-[#1856b8] dark:text-[#818CF8] bg-[#ebf3ff] dark:bg-[#1C2638] px-1.5 py-0.5 rounded border border-[#dce8fa] dark:border-[#293548]">
                            {p.path}
                          </code>
                          <a
                            href={p.path}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#94a3b8] hover:text-[#1856b8]"
                            title="View live page"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        {p.pageTitle && p.pageTitle !== p.path && (
                          <p className="text-[11px] text-[#64748b] mt-0.5 truncate max-w-xs">
                            {p.pageTitle}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold text-[#112542] dark:text-[#F1F5F9] py-2.5">
                        {p.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs text-[#64748b] dark:text-[#A1AEC2] py-2.5">
                        {p.uniqueVisitors.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Live Visitor Log */}
        <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] shadow-none bg-white dark:bg-[#151D2E]">
          <CardHeader className="p-5 border-b border-[#eef2f6] dark:border-[#293548]">
            <CardTitle className="text-base font-bold text-[#112542] dark:text-[#F1F5F9] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#16a34a]" />
              Real-Time Activity Log
            </CardTitle>
            <CardDescription className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
              Most recent student page visits recorded
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !data?.recentViews || data.recentViews.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748b]">
                No recent pageviews recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-[#eef2f6] dark:divide-[#293548] max-h-[380px] overflow-y-auto">
                {data.recentViews.map((rv) => (
                  <div key={rv.id} className="p-3 hover:bg-[#f8fafc] dark:hover:bg-[#1C2638] flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#112542] dark:text-[#F1F5F9] truncate">
                          {rv.path}
                        </span>
                        {rv.referrer && rv.referrer.includes("t.me") && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-100 text-[#0284c7] font-semibold">
                            Telegram
                          </span>
                        )}
                        {rv.referrer && rv.referrer.includes("google") && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-semibold">
                            Google
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#94a3b8] dark:text-[#8291A8] truncate mt-0.5">
                        {rv.userAgent ? rv.userAgent.split(" ")[0] : "Browser"} • {rv.ipAddress || "Visitor"}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] shrink-0 font-medium">
                      {new Date(rv.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
