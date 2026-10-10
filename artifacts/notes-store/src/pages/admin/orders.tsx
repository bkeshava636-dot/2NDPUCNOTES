import { useState, useMemo } from "react";
import { useAdminListOrders, getAdminListOrdersQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  ShoppingCart, 
  Calendar,
  ExternalLink,
  X,
  CreditCard
} from "lucide-react";
import { formatRupees } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading, isError, error, isFetching, refetch } = useAdminListOrders(
    { page }, 
    { 
      query: { 
        queryKey: getAdminListOrdersQueryKey({ page }),
        retry: 1,
      } 
    }
  );

  const totalPages = data ? Math.max(1, Math.ceil(data.total / 20)) : 1;

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredOrders = useMemo(() => {
    if (!data?.orders) return [];
    return data.orders.filter((order) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.toLowerCase().includes(q) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(q)) ||
        (order.cardTitle && order.cardTitle.toLowerCase().includes(q)) ||
        (order.razorpayOrderId && order.razorpayOrderId.toLowerCase().includes(q))
      );

      const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [data?.orders, searchQuery, selectedStatus]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">Customer Orders</h1>
            <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">
              Monitor incoming purchases, student transactions, and payment statuses
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[#112542]">Failed to load customer orders</h3>
          <p className="text-xs text-[#64748b] mt-1 mb-5">
            {(error as any)?.message || "A network or database error occurred while retrieving order history."}
          </p>
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 text-xs bg-[#2f74de] hover:bg-[#1f63c8] text-white"
          >
            <Check className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Retry Connection</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">Customer Orders</h1>
          <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">
            Monitor incoming purchases, student transactions, and payment statuses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-[#e2e8f0] text-[#112542] shadow-2xs">
            {data?.total ?? 0} Total Orders
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e2e8f0] space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone, email, order ID, or note title..."
              className="pl-9 h-9 text-xs sm:text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542] focus-visible:border-[#1856b8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#112542]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="w-full sm:w-44 shrink-0">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
                <SelectItem value="failed">Failed Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchQuery || selectedStatus !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSearchQuery(""); setSelectedStatus("all"); }}
              className="h-9 text-xs text-[#5a6b82] hover:text-[#112542] shrink-0"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Orders Table */}
      <div className="hidden md:block bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-none">
        <Table>
          <TableHeader className="bg-[#f8fafc]">
            <TableRow className="border-[#eef2f6] hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-[#64748b] py-3 pl-5">Order ID</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3">Customer</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3">Resource</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3">Status</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3 pr-5 text-right">Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-[#64748b] text-xs">
                  <ShoppingCart className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const isCopied = copiedId === order.id;
                return (
                  <TableRow key={order.id} className="border-[#eef2f6] hover:bg-[#f8fafc]/60 transition-colors">
                    {/* Order ID */}
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
                      {order.razorpayOrderId && (
                        <div className="text-[10px] text-[#94a3b8] font-mono truncate max-w-[120px] mt-0.5">
                          {order.razorpayOrderId}
                        </div>
                      )}
                    </TableCell>

                    {/* Customer */}
                    <TableCell className="py-3.5">
                      <div className="font-semibold text-xs text-[#112542] leading-tight">{order.customerName}</div>
                      <div className="text-[11px] text-[#64748b] mt-1 flex items-center gap-2.5">
                        <a 
                          href={`tel:${order.customerPhone}`}
                          className="hover:text-[#1856b8] flex items-center gap-1"
                          title="Call customer"
                        >
                          <Phone className="h-3 w-3 text-[#94a3b8]" />
                          <span>{order.customerPhone}</span>
                        </a>
                        {order.customerEmail && (
                          <a 
                            href={`mailto:${order.customerEmail}`}
                            className="hover:text-[#1856b8] flex items-center gap-1 truncate max-w-[140px]"
                            title="Email customer"
                          >
                            <Mail className="h-3 w-3 text-[#94a3b8]" />
                            <span className="truncate">{order.customerEmail}</span>
                          </a>
                        )}
                      </div>
                    </TableCell>

                    {/* Resource */}
                    <TableCell className="py-3.5 max-w-[240px]">
                      <div className="font-medium text-xs text-[#112542] truncate" title={order.cardTitle}>
                        {order.cardTitle || "—"}
                      </div>
                    </TableCell>

                    {/* Amount */}
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

                    {/* Status */}
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

                    {/* Date */}
                    <TableCell className="pr-5 py-3.5 text-right text-xs text-[#64748b]">
                      <div>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-[10px] text-[#94a3b8] mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List View (Visible on screens < 768px) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#e2e8f0] p-6 text-[#64748b] text-xs">
            <ShoppingCart className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
            No orders found.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isCopied = copiedId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white border border-[#e2e8f0] rounded-xl p-4 space-y-3 shadow-none"
              >
                {/* Header: ID and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-[#64748b]">{order.id.slice(0, 10)}…</span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(order.id)}
                      className="p-1 text-[#94a3b8] hover:text-[#1856b8]"
                      aria-label="Copy ID"
                    >
                      {isCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
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
                </div>

                {/* Resource Title */}
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#112542] line-clamp-1">
                    {order.cardTitle}
                  </h4>
                  <div className="text-xs font-bold text-[#112542] mt-1">
                    {order.amountPaise === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      formatRupees(order.amountPaise)
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="pt-2 border-t border-[#eef2f6] text-xs space-y-1">
                  <div className="font-semibold text-[#112542]">{order.customerName}</div>
                  <div className="flex items-center gap-3 text-[#64748b]">
                    <a href={`tel:${order.customerPhone}`} className="hover:text-[#1856b8] flex items-center gap-1">
                      <Phone className="h-3 w-3 text-[#94a3b8]" />
                      <span>{order.customerPhone}</span>
                    </a>
                    {order.customerEmail && (
                      <a href={`mailto:${order.customerEmail}`} className="hover:text-[#1856b8] flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 text-[#94a3b8]" />
                        <span className="truncate">{order.customerEmail}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="pt-2 border-t border-[#eef2f6] text-[11px] text-[#94a3b8] flex items-center justify-between">
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>
                    {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#64748b]">
            Page <strong className="text-[#112542]">{page}</strong> of <strong className="text-[#112542]">{totalPages}</strong>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 gap-1 text-xs border-[#e2e8f0] text-[#112542]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 gap-1 text-xs border-[#e2e8f0] text-[#112542]"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
