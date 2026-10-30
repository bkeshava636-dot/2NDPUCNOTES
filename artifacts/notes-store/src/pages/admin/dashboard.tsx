import { useState } from "react";
import { Link } from "wouter";
import { useGetAdminStats, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatRupees } from "@/lib/utils";
import { 
  IndianRupee, 
  ShoppingCart, 
  Files, 
  FolderTree, 
  Users, 
  DownloadCloud, 
  PlusCircle, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  ChevronRight, 
  Eye, 
  BarChart3,
  CheckCircle2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: stats, isLoading, isError, error, isFetching, refetch } = useGetAdminStats({
    query: {
      queryKey: getGetAdminStatsQueryKey(),
      retry: 1,
      staleTime: 60 * 1000,
    },
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: stats ? formatRupees(stats.totalRevenuePaise) : "₹0",
      description: "Successful Razorpay checkouts",
      icon: IndianRupee,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-800",
      accent: "border-l-emerald-500",
    },
    {
      title: "Paid Orders",
      value: stats ? stats.totalOrders.toLocaleString() : "0",
      description: "Delivered digital purchases",
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-800",
      accent: "border-l-blue-500",
    },
    {
      title: "Study Resources",
      value: stats ? stats.totalCards.toLocaleString() : "0",
      description: "Active notes, papers & blueprints",
      icon: Files,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-800",
      accent: "border-l-indigo-500",
    },
    {
      title: "Categories & Sections",
      value: stats ? stats.totalSections.toLocaleString() : "0",
      description: "Configured store taxonomies",
      icon: FolderTree,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-800",
      accent: "border-l-purple-500",
    },
    {
      title: "Student Customers",
      value: stats ? stats.totalCustomers.toLocaleString() : "0",
      description: "Unique registered buyers",
      icon: Users,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-800",
      accent: "border-l-amber-500",
    },
    {
      title: "Total Downloads",
      value: (stats as any)?.totalDownloads !== undefined ? (stats as any).totalDownloads.toLocaleString() : "0",
      description: "Audited material accesses",
      icon: DownloadCloud,
      color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-800",
      accent: "border-l-teal-500",
    },
    {
      title: "Site Views & Traffic",
      value: (stats as any)?.totalPageViews !== undefined ? (stats as any).totalPageViews.toLocaleString() : "0",
      description: "Live student impressions across sites",
      icon: Eye,
      color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-800",
      accent: "border-l-sky-500",
    },
  ];

  const quickActions = [
    {
      title: "Create Study Resource",
      description: "Upload PDF or link external Google Drive files with pricing and subject classification",
      href: "/admin/cards/new",
      icon: PlusCircle,
      btnLabel: "Add Resource",
      primary: true,
    },
    {
      title: "Manage Resources",
      description: "Filter notes, update official blueprints, edit prices, and manage answer key links",
      href: "/admin/cards",
      icon: Files,
      btnLabel: "View All",
    },
    {
      title: "Subjects & Categories",
      description: "Organize curricula, official source links, and reorder display priority",
      href: "/admin/sections",
      icon: FolderTree,
      btnLabel: "Manage",
    },
    {
      title: "Orders & Transactions",
      description: "View customer details, Razorpay transaction IDs, and order completion receipts",
      href: "/admin/orders",
      icon: ShoppingCart,
      btnLabel: "Orders",
    },
    {
      title: "Students Directory",
      description: "Search registered students by phone or name and review total spend",
      href: "/admin/customers",
      icon: Users,
      btnLabel: "Students",
    },
    {
      title: "Downloads Audit",
      description: "Monitor IP logs, timestamps, and device data for security and compliance",
      href: "/admin/downloads",
      icon: DownloadCloud,
      btnLabel: "Audit Log",
    },
    {
      title: "Traffic & Views",
      description: "Analyze how many students viewed sites, popular pages, and daily trends",
      href: "/admin/analytics",
      icon: BarChart3,
      btnLabel: "Analytics",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header (Unified with Workspace) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[#e2e8f0] dark:border-[#293548]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#112542] dark:text-[#F1F5F9] tracking-tight">
              Executive Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Store
            </span>
          </div>
          <p className="text-[#5a6b82] dark:text-[#A1AEC2] text-xs sm:text-sm mt-1">
            Real-time analytics, revenue performance, and inventory health for 2PUC Notes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8.5 gap-1.5 text-xs text-[#5a6b82] dark:text-[#A1AEC2] hover:text-[#112542] dark:hover:text-[#F1F5F9] border-[#e2e8f0] dark:border-[#293548] dark:hover:bg-[#1C2638]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-[#1856b8] dark:text-[#818CF8]" : ""}`} />
            <span>{isFetching ? "Refreshing..." : "Refresh Stats"}</span>
          </Button>

          <Link href="/admin/cards/new">
            <Button size="sm" className="h-8.5 gap-1.5 text-xs font-semibold bg-[#1856b8] hover:bg-[#124494] dark:bg-[#818CF8] dark:hover:bg-[#6366F1] text-white dark:text-[#0B0F19] dark:font-bold shadow-2xs">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Resource</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Non-blocking Error Banner if stats fail */}
      {isError && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold">Unable to refresh live statistics right now</p>
              <p className="text-amber-700 dark:text-amber-300 text-xs mt-0.5">
                {(error as any)?.message || "A network or database latency timeout occurred. All dashboard tools remain fully usable."}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-8 text-xs bg-white dark:bg-[#151D2E] border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950/60 shrink-0"
          >
            Retry Stats
          </Button>
        </div>
      )}

      {/* Metric KPI Cards (Responsive Grid without truncated labels) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-7 gap-3.5 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.title} 
              className={`rounded-xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] shadow-2xs hover:shadow-xs transition-shadow border-l-4 ${card.accent} flex flex-col justify-between`}
            >
              <CardContent className="p-4 sm:p-4.5 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-[#64748b] dark:text-[#A1AEC2] uppercase tracking-wider leading-tight whitespace-normal break-words">
                    {card.title}
                  </span>
                  <div className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 ${card.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                {isLoading ? (
                  <Skeleton className="h-8 w-24 my-1.5" />
                ) : (
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#112542] dark:text-[#F1F5F9] tracking-tight my-1">
                    {card.value}
                  </div>
                )}

                <p className="text-[11px] text-[#94a3b8] dark:text-[#8291A8] mt-1 leading-tight whitespace-normal break-words">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#112542] dark:text-[#F1F5F9] tracking-tight">
            Quick Actions & Management
          </h2>
          <span className="text-xs text-[#64748b] dark:text-[#8291A8]">Core Administrative Hub</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div 
                key={action.title}
                className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] hover:border-[#1856b8]/50 dark:hover:border-[#818CF8]/50 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="h-8.5 w-8.5 rounded-lg bg-[#ebf3ff] dark:bg-[#1C2638] text-[#1856b8] dark:text-[#818CF8] group-hover:bg-[#dce8fa] dark:group-hover:bg-[#253248] flex items-center justify-center transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <Link href={action.href}>
                      <span className="text-xs font-semibold text-[#1856b8] dark:text-[#818CF8] group-hover:underline flex items-center gap-1 cursor-pointer">
                        {action.btnLabel}
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </div>
                  <h3 className="font-bold text-sm text-[#112542] dark:text-[#F1F5F9] group-hover:text-[#1856b8] dark:group-hover:text-[#818CF8] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-[#64748b] dark:text-[#A1AEC2] mt-1 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders & Purchases Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#112542] dark:text-[#F1F5F9] tracking-tight">
              Recent Transactions & Orders
            </h2>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">Latest student purchases and download access fulfillments</p>
          </div>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-[#1856b8] dark:text-[#818CF8] hover:text-[#124494] dark:hover:text-[#a5b4fc] gap-1">
              <span>View All Orders</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <Card className="rounded-xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !stats || stats.recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingCart className="h-10 w-10 text-[#cbd5e1] dark:text-[#293548] mx-auto mb-3" />
              <p className="font-semibold text-sm text-[#112542] dark:text-[#F1F5F9]">No recent orders yet</p>
              <p className="text-xs text-[#64748b] dark:text-[#A1AEC2] mt-1">Paid customer checkouts will automatically appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[700px]">
                <TableHeader className="bg-[#f8fafc]/80 dark:bg-[#1C2638]/90 border-b border-[#e2e8f0] dark:border-[#293548]">
                  <TableRow>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3 pl-4">Order ID</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3">Student / Customer</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3">Purchased Resource</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3">Amount</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3 pr-4 text-right">Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentOrders.map((order) => {
                    const isPaid = order.status === "paid";
                    return (
                      <TableRow key={order.id} className="hover:bg-[#f8fafc]/60 dark:hover:bg-[#1C2638]/60 border-b border-[#eef2f6] dark:border-[#293548]">
                        <TableCell className="font-mono text-xs text-[#5a6b82] dark:text-[#A1AEC2] pl-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate max-w-[100px]">{order.id}</span>
                            <button
                              onClick={() => handleCopyId(order.id)}
                              className="text-[#94a3b8] dark:text-[#8291A8] hover:text-[#112542] dark:hover:text-[#F1F5F9] p-1 rounded-sm hover:bg-[#f1f5f9] dark:hover:bg-[#1C2638]"
                              title="Copy Order ID"
                            >
                              {copiedId === order.id ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="text-xs font-medium text-[#112542] dark:text-[#F1F5F9]">{order.customerName}</div>
                          <div className="text-[11px] text-[#64748b] dark:text-[#A1AEC2] font-mono">{order.customerPhone}</div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="text-xs font-medium text-[#112542] dark:text-[#F1F5F9] max-w-[240px] truncate" title={order.cardTitle}>
                            {order.cardTitle || "Resource #" + order.cardId}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-[#112542] dark:text-[#F1F5F9] py-3">
                          {formatRupees(order.amountPaise)}
                        </TableCell>
                        <TableCell className="py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isPaid
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                : order.status === "pending"
                                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-[#64748b] dark:text-[#A1AEC2] whitespace-nowrap pr-4 py-3 text-right">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
