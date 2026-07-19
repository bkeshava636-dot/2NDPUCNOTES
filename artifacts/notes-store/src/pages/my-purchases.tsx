import { useState } from "react";
import { useGetPurchases } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, ShoppingBag, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupees } from "@/lib/utils";
const API_URL = import.meta.env.VITE_API_URL;

export default function MyPurchases() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data: orders, isLoading } = useGetPurchases(
    { phone: submitted },
    { query: { enabled: !!submitted, queryKey: ["purchases", submitted] } }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phone.trim()) setSubmitted(phone.trim());
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Purchases</h1>
          <p className="text-gray-500 text-sm">Enter your phone number to access your purchases</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your 10-digit mobile number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              maxLength={10}
            />
          </div>
          <Button type="submit" className="gap-2">
            <Search className="h-4 w-4" /> Find
          </Button>
        </form>
      </div>

      {submitted && (
        <>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : orders?.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No purchases found for this number.</p>
              <p className="text-sm mt-1">Make sure you're using the same number you used at checkout.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium text-gray-900 max-w-[200px] truncate">{order.cardTitle}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{order.id.slice(0, 8)}...</div>
                      </TableCell>
                      <TableCell>
                        {order.amountPaise === 0 ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Free</Badge>
                        ) : (
                          <span className="text-gray-700 font-medium">{formatRupees(order.amountPaise)}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </TableCell>
                      <TableCell className="text-right">
                        <a href={`${API_URL}/api/purchases/${order.id}/download/${order.cardId}`} download>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Download className="h-3.5 w-3.5" /> PDF
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
