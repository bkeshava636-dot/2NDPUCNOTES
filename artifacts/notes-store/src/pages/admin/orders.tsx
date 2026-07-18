import { useState } from "react";
import { useAdminListOrders, getAdminListOrdersQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatRupees } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminListOrders({ page }, { query: { queryKey: getAdminListOrdersQueryKey({ page }) } });

  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500">{data?.total ?? 0} total orders</p>
      </div>

      <div className="bg-white rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.orders?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No orders yet.</TableCell></TableRow>
              ) : data?.orders?.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs text-gray-500">{order.id.slice(0, 8)}…</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-gray-400">{order.customerPhone}</div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">{order.cardTitle}</TableCell>
                  <TableCell className="font-medium">
                    {order.amountPaise === 0 ? <span className="text-green-600">Free</span> : formatRupees(order.amountPaise)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.status === "paid" ? "default" : order.status === "pending" ? "secondary" : "destructive"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
