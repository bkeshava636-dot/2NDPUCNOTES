import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminStats, AdminStatsResponse } from "@/lib/admin-api";
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
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: stats, isLoading, isError, error, isFetching, refetch } = useQuery<AdminStatsResponse>({
    queryKey: ["admin", "stats"],
    queryFn: fetchAdminStats,
    staleTime: 60 * 1000, // 1 minute
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
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      accent: "border-l-emerald-500",
    },
    {
      title: "Paid Orders",
      value: stats ? stats.totalOrders.toLocaleString() : "0",
      description: "Delivered digital purchases",
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      accent: "border-l-blue-500",
    },
    {
      title: "Study Resources",
      value: stats ? stats.totalCards.toLocaleString() : "0",
      description: "Active notes, papers & blueprints",
      icon: Files,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      accent: "border-l-indigo-500",
    },
    {
      title: "Categories & Subjects",
      value: stats ? stats.totalSections.toLocaleString() : "0",
      description: "Configured store taxonomies",
      icon: FolderTree,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      accent: "border-l-purple-500",
    },
    {
      title: "Student Customers",
      value: stats ? stats.totalCustomers.toLocaleString() : "0",
      description: "Unique registered buyers",
      icon: Users,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      accent: "border-l-amber-500",
    },
    {
      title: "Total Downloads",
      value: stats?.totalDownloads !== undefined ? stats.totalDownloads.toLocaleString() : "0",
      description: "Audited material accesses",
      icon: DownloadCloud,
      color: "text-teal-600 bg-teal-50 border-teal-100",
      accent: "border-l-teal-500",
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
  ];

  return (
    <div className="space-y-7 pb-10">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#e2e8f0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">
              Executive Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live Store
            </span>
          </div>
          <p className="text-[#5a6b82] text-xs sm:text-sm mt-1">
            Real-time analytics, revenue metrics, and inventory performance for 2nd PUC Notes
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5 text-xs text-[#5a6b82] hover:text-[#112542] border-[#e2e8f0]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-[#1856b8]" : ""}`} />
            <span>{isFetching ? "Refreshing..." : "Refresh"}</span>
          </Button>

          <Link href="/admin/cards/new">
            <Button size="sm" className="h-9 gap-1.5 text-xs bg-[#1856b8] hover:bg-[#124494] text-white shadow-2xs">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Resource</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Non-blocking Error Banner if stats fail */}
      {isError && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-semibold">Unable to refresh live statistics right now</p>
              <p className="text-amber-700 text-xs mt-0.5">
                {(error as any)?.message || "A network or database latency timeout occurred. All dashboard tools remain fully usable."}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-8 text-xs bg-white border-amber-300 text-amber-900 hover:bg-amber-100 shrink-0"
          >
            Retry Stats
          </Button>
        </div>
      )}

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.title} 
              className={`rounded-xl border border-[#e2e8f0] bg-white shadow-2xs hover:shadow-xs transition-shadow border-l-4 ${card.accent}`}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#64748b] truncate uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 ${card.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                {isLoading ? (
                  <Skeleton className="h-7 w-20 my-1" />
                ) : (
                  <div className="text-xl sm:text-2xl font-bold text-[#112542] tracking-tight">
                    {card.value}
                  </div>
                )}

                <p className="text-[10px] sm:text-[11px] text-[#94a3b8] mt-1 truncate">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#112542] tracking-tight">
            Quick Actions & Management
          </h2>
          <span className="text-xs text-[#64748b]">Core Administrative Hub</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div 
                key={action.title}
                className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg bg-[#f1f5f9] text-[#1856b8] group-hover:bg-[#ebf3ff] flex items-center justify-center transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <Link href={action.href}>
                      <span className="text-xs font-semibold text-[#1856b8] group-hover:underline flex items-center gap-1 cursor-pointer">
                        {action.btnLabel}
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </div>
                  <h3 className="font-bold text-sm text-[#112542] group-hover:text-[#1856b8] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders & Purchases Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#112542] tracking-tight">
              Recent Transactions & Orders
            </h2>
            <p className="text-xs text-[#64748b]">Latest student purchases and download access fulfillments</p>
          </div>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-[#1856b8] hover:text-[#124494] gap-1">
              <span>View All Orders</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <Card className="rounded-xl border border-[#e2e8f0] bg-white shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !stats || stats.recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingCart className="h-10 w-10 text-[#cbd5e1] mx-auto mb-3" />
              <p className="font-semibold text-sm text-[#112542]">No recent orders yet</p>
              <p className="text-xs text-[#64748b] mt-1">Paid customer checkouts will automatically appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#f8fafc]/80 border-b border-[#e2e8f0]">
                  <TableRow>
                    <TableHead className="text-xs font-semibold text-[#64748b]">Order ID</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b]">Student / Customer</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b]">Purchased Resource</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b]">Amount</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b]">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b]">Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentOrders.map((order) => {
                    const isPaid = order.status === "paid";
                    return (
                      <TableRow key={order.id} className="hover:bg-[#f8fafc]/60">
                        <TableCell className="font-mono text-xs text-[#5a6b82]">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate max-w-[100px]">{order.id}</span>
                            <button
                              onClick={() => handleCopyId(order.id)}
                              className="text-[#94a3b8] hover:text-[#112542] p-1 rounded-sm hover:bg-[#f1f5f9]"
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
                        <TableCell>
                          <div className="text-xs font-medium text-[#112542]">{order.customerName}</div>
                          <div className="text-[11px] text-[#64748b] font-mono">{order.customerPhone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium text-[#112542] max-w-[220px] truncate" title={order.cardTitle}>
                            {order.cardTitle || "Resource #" + order.cardId}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-[#112542]">
                          {formatRupees(order.amountPaise)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isPaid
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : order.status === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-[#64748b] whitespace-nowrap">
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
