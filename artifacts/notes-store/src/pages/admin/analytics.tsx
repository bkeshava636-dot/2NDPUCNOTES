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
  Sparkles
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
  topPages: TopPage[];
  dailyTrend: DailyTrendItem[];
  recentViews: RecentViewItem[];
}

export default function AdminAnalytics() {
  const [range, setRange] = useState<"24h" | "7d" | "30d" | "all">("30d");

  const { data, isLoading, isError, isFetching, refetch } = useQuery<AnalyticsResponse>({
    queryKey: ["admin-analytics", range],
    queryFn: async () => {
      const res = await apiFetch(`/admin/analytics?range=${range}`);
      if (!res.ok) throw new Error("Failed to load analytics");
      return res.json();
    },
    refetchInterval: 30000, // Live poll every 30s
  });

  const rangeLabels: Record<string, string> = {
    "24h": "Last 24 Hours",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "all": "All Time",
  };

  const maxViews = Math.max(...(data?.dailyTrend?.map((d) => d.views) || [1]), 1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">
              Site Traffic & Views Analysis
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
              Live Analytics
            </span>
          </div>
          <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">
            Monitor real-time visitors, page impressions, and popular resource pages created for Noexora / 2nd PUC
          </p>
        </div>

        {/* Range Selector & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0]">
            {(["24h", "7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                  range === r
                    ? "bg-white text-[#1856b8] shadow-2xs"
                    : "text-[#64748b] hover:text-[#112542]"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 gap-1.5 text-xs text-[#5a6b82] border-[#e2e8f0]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-[#1856b8]" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white border-l-4 border-l-[#1856b8]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                Total Views ({range.toUpperCase()})
              </span>
              <div className="p-2 rounded-lg bg-blue-50 text-[#1856b8]">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#112542] tracking-tight">
                {isLoading ? <Skeleton className="h-8 w-20 inline-block" /> : (data?.rangeTotal ?? 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-[#64748b]">impressions</span>
            </div>
            <p className="text-[11px] text-[#64748b] mt-1">
              All time: <span className="font-semibold text-[#112542]">{(data?.allTimeTotal ?? 0).toLocaleString()}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white border-l-4 border-l-[#0284c7]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                Unique Visitors
              </span>
              <div className="p-2 rounded-lg bg-sky-50 text-[#0284c7]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#112542] tracking-tight">
                {isLoading ? <Skeleton className="h-8 w-20 inline-block" /> : (data?.uniqueVisitors ?? 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-[#64748b]">students</span>
            </div>
            <p className="text-[11px] text-[#64748b] mt-1">
              Distinct devices / IPs
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white border-l-4 border-l-[#16a34a]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                Today's Views
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 text-[#16a34a]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#112542] tracking-tight">
                {isLoading ? <Skeleton className="h-8 w-20 inline-block" /> : (data?.todayViews ?? 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-[#64748b]">today</span>
            </div>
            <p className="text-[11px] text-[#16a34a] font-medium mt-1">
              Since 12:00 AM midnight
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white border-l-4 border-l-[#9333ea]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                Active Sites & Pages
              </span>
              <div className="p-2 rounded-lg bg-purple-50 text-[#9333ea]">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#112542] tracking-tight">
                {isLoading ? <Skeleton className="h-8 w-20 inline-block" /> : (data?.topPages?.length ?? 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-[#64748b]">visited routes</span>
            </div>
            <p className="text-[11px] text-[#64748b] mt-1">
              In {rangeLabels[range]}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Visits Timeline / Bar Chart Visual */}
      <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white">
        <CardHeader className="p-5 border-b border-[#eef2f6]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#112542] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1856b8]" />
                Daily Traffic Activity ({rangeLabels[range]})
              </CardTitle>
              <CardDescription className="text-xs text-[#64748b]">
                Visual progression of visits over time
              </CardDescription>
            </div>
            <span className="text-xs text-[#64748b] bg-[#f8fafc] px-2.5 py-1 rounded border border-[#e2e8f0]">
              Peak: <span className="font-semibold text-[#112542]">{maxViews} views/day</span>
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="h-40 flex items-end gap-2 pt-6">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="flex-1 h-24" />
              ))}
            </div>
          ) : !data?.dailyTrend || data.dailyTrend.length === 0 ? (
            <div className="text-center py-12 text-[#64748b] text-sm">
              <Activity className="w-8 h-8 mx-auto text-[#cbd5e1] mb-2" />
              <p className="font-semibold">No traffic recorded yet for this date range.</p>
              <p className="text-xs text-[#94a3b8] mt-1">
                Views are logged automatically as students browse the website.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-44 flex items-end gap-2 pt-4 pb-2 border-b border-[#f1f5f9]">
                {data.dailyTrend.map((d) => {
                  const heightPercent = Math.max(Math.round((d.views / maxViews) * 100), 8);
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#112542] text-white text-[10px] py-1 px-2 rounded shadow-md pointer-events-none whitespace-nowrap z-10">
                        {d.date}: {d.views} views ({d.visitors} visitors)
                      </div>
                      <div className="w-full flex items-end justify-center h-32">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[36px] bg-[#1856b8] hover:bg-[#0284c7] transition-all rounded-t-sm"
                        />
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

      {/* Pages & Live Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sites & Pages breakdown */}
        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white">
          <CardHeader className="p-5 border-b border-[#eef2f6]">
            <CardTitle className="text-base font-bold text-[#112542] flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-[#0284c7]" />
              Most Visited Pages & Routes
            </CardTitle>
            <CardDescription className="text-xs text-[#64748b]">
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
                  <TableRow className="border-b border-[#eef2f6] bg-[#f8fafc]">
                    <TableHead className="text-xs font-semibold text-[#64748b]">Page / URL</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] text-right">Views</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] text-right">Visitors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topPages.map((p, idx) => (
                    <TableRow key={idx} className="border-b border-[#eef2f6] hover:bg-[#f8fafc]/60">
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono font-semibold text-[#1856b8] bg-[#ebf3ff] px-1.5 py-0.5 rounded border border-[#dce8fa]">
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
                      <TableCell className="text-right text-xs font-bold text-[#112542] py-2.5">
                        {p.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs text-[#64748b] py-2.5">
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
        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white">
          <CardHeader className="p-5 border-b border-[#eef2f6]">
            <CardTitle className="text-base font-bold text-[#112542] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#16a34a]" />
              Real-Time Activity Log
            </CardTitle>
            <CardDescription className="text-xs text-[#64748b]">
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
              <div className="divide-y divide-[#eef2f6] max-h-[380px] overflow-y-auto">
                {data.recentViews.map((rv) => (
                  <div key={rv.id} className="p-3 hover:bg-[#f8fafc] flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#112542] truncate">
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
                      <p className="text-[10px] text-[#94a3b8] truncate mt-0.5">
                        {rv.userAgent ? rv.userAgent.split(" ")[0] : "Browser"} • {rv.ipAddress || "Visitor"}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#64748b] shrink-0 font-medium">
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
