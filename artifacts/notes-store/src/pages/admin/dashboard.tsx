import { useState } from "react";
import { Link } from "wouter";
import { useGetAdminStats } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatRupees } from "@/lib/utils";
import { 
  IndianRupee, 
  ShoppingCart, 
  Files, 
  FolderTree, 
  Users,
  Plus,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  ExternalLink
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: stats, isLoading, isFetching, refetch } = useGetAdminStats();
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        {/* Skeleton Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>

        {/* Skeleton Quick Actions */}
        <Skeleton className="h-20 rounded-xl" />

        {/* Skeleton Table */}
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Revenue",
      value: formatRupees(stats.totalRevenuePaise),
      icon: IndianRupee,
      iconWrap: "bg-[#eaf5ec] text-[#167035] border-[#d7ecdc]",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString("en-IN"),
      icon: ShoppingCart,
      iconWrap: "bg-[#ebf3ff] text-[#1856b8] border-[#dce8fa]",
    },
    {
      title: "Total Resources",
      value: stats.totalCards.toLocaleString("en-IN"),
      icon: Files,
      iconWrap: "bg-[#fdece9] text-[#b83226] border-[#f9dcd7]",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString("en-IN"),
      icon: Users,
      iconWrap: "bg-[#fdf5e2] text-[#9e5e00] border-[#f9ecc8]",
    },
    {
      title: "Active Sections",
      value: stats.totalSections.toLocaleString("en-IN"),
      icon: FolderTree,
      iconWrap: "bg-[#eaf2fd] text-[#0284c7] border-[#dce7f7]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">Dashboard Overview</h1>
          <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">Real-time summary of your store's sales and study materials</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium border-[#e2e8f0] text-[#5a6b82] hover:text-[#112542] hover:bg-white"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh metrics"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Link href="/admin/cards/new">
            <Button
              size="sm"
              className="h-9 gap-1.5 text-xs font-semibold bg-[#2f74de] hover:bg-[#1f63c8] text-white shadow-none transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Resource</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Compact Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="rounded-xl border-[#e2e8f0] shadow-none bg-white hover:border-[#cbd5e1] transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-[#64748b] truncate">{stat.title}</span>
                  <div className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 ${stat.iconWrap}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#112542] tracking-tight truncate">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Hub */}
      <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white">
        <CardHeader className="pb-3 pt-4 px-5 border-b border-[#eef2f6]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[#112542]">Quick Actions</CardTitle>
              <CardDescription className="text-xs text-[#64748b]">Jump straight into routine administrative tasks</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <Link href="/admin/cards/new" className="block">
              <div className="p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#ebf3ff] hover:border-[#dce8fa] hover:text-[#1856b8] transition-all text-left group cursor-pointer">
                <div className="flex items-center gap-2 mb-1 text-[#1856b8]">
                  <Plus className="h-4 w-4" />
                  <span className="text-xs font-bold text-[#112542] group-hover:text-[#1856b8]">New Resource</span>
                </div>
                <p className="text-[11px] text-[#64748b] leading-tight">Create & upload study note</p>
              </div>
            </Link>

            <Link href="/admin/cards" className="block">
              <div className="p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#ebf3ff] hover:border-[#dce8fa] hover:text-[#1856b8] transition-all text-left group cursor-pointer">
                <div className="flex items-center gap-2 mb-1 text-[#1856b8]">
                  <Files className="h-4 w-4" />
                  <span className="text-xs font-bold text-[#112542] group-hover:text-[#1856b8]">All Resources</span>
                </div>
                <p className="text-[11px] text-[#64748b] leading-tight">Edit, search & toggle visibility</p>
              </div>
            </Link>

            <Link href="/admin/sections" className="block">
              <div className="p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#ebf3ff] hover:border-[#dce8fa] hover:text-[#1856b8] transition-all text-left group cursor-pointer">
                <div className="flex items-center gap-2 mb-1 text-[#0284c7]">
                  <FolderTree className="h-4 w-4" />
                  <span className="text-xs font-bold text-[#112542] group-hover:text-[#0284c7]">Categories</span>
                </div>
                <p className="text-[11px] text-[#64748b] leading-tight">Reorder sections & branches</p>
              </div>
            </Link>

            <Link href="/admin/orders" className="block">
              <div className="p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#ebf3ff] hover:border-[#dce8fa] hover:text-[#1856b8] transition-all text-left group cursor-pointer">
                <div className="flex items-center gap-2 mb-1 text-[#167035]">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-xs font-bold text-[#112542] group-hover:text-[#167035]">Order History</span>
                </div>
                <p className="text-[11px] text-[#64748b] leading-tight">Inspect customer transactions</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders Card */}
      <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white overflow-hidden">
        <CardHeader className="pb-3 pt-4 px-5 border-b border-[#eef2f6]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm sm:text-base font-bold text-[#112542]">Recent Transactions</CardTitle>
              <CardDescription className="text-xs text-[#64748b]">Latest 10 orders recorded across the store</CardDescription>
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-[#1856b8] hover:text-[#0b57d0] hover:bg-[#ebf3ff]">
                <span>View All Orders</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#f8fafc]">
                  <TableRow className="border-[#eef2f6] hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-[#64748b] py-3 pl-5">Order ID</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] py-3">Customer</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] py-3">Resource</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] py-3">Amount</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] py-3">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-[#64748b] py-3 pr-5 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentOrders.map((order) => {
                    const isCopied = copiedId === order.id;
                    return (
                      <TableRow key={order.id} className="border-[#eef2f6] hover:bg-[#f8fafc]/60 transition-colors">
                        <TableCell className="pl-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-[#64748b]">{order.id.slice(0, 8)}…</span>
                            <button
                              type="button"
                              onClick={() => handleCopyId(order.id)}
                              className="p-1 text-[#94a3b8] hover:text-[#1856b8] rounded hover:bg-[#ebf3ff] transition-colors"
                              title="Copy full Order ID"
                              aria-label="Copy Order ID"
                            >
                              {isCopied ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <div className="font-semibold text-xs text-[#112542] leading-tight">{order.customerName}</div>
                          <div className="text-[11px] text-[#64748b] mt-0.5 flex items-center gap-2">
                            <span>{order.customerPhone}</span>
                            {order.customerEmail && (
                              <span className="truncate max-w-[120px] text-[#94a3b8]">{order.customerEmail}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 max-w-[240px]">
                          <div className="font-medium text-xs text-[#112542] truncate" title={order.cardTitle}>
                            {order.cardTitle || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5">
                          {order.amountPaise === 0 ? (
                            <span className="bg-[#eaf5ec] text-[#167035] border border-[#d7ecdc] text-[11px] font-semibold px-2 py-0.5 rounded">
                              Free
                            </span>
                          ) : (
                            <span className="font-bold text-xs text-[#112542]">
                              {formatRupees(order.amountPaise)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                              order.status === "paid"
                                ? "bg-[#eaf5ec] text-[#167035] border-[#d7ecdc]"
                                : order.status === "pending"
                                ? "bg-[#fdf5e2] text-[#9e5e00] border-[#f9ecc8]"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="pr-5 py-3.5 text-right text-xs text-[#64748b]">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-[#64748b] text-xs">
              <ShoppingCart className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
              No orders recorded yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
