import { useState } from "react";
import { useGetPurchases } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, ShoppingBag, Search, Phone, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupees } from "@/lib/utils";

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";

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
    <div className="max-w-3xl mx-auto w-full px-4 py-8 sm:py-10">
      {/* Page Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-primary border border-blue-100 shrink-0">
          <ShoppingBag className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">My Purchases</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Enter your phone number to access your purchases</p>
        </div>
      </div>

      {/* Lookup Form Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:flex-1 space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              <span>Phone Number</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your 10-digit mobile number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              maxLength={10}
              className="h-10 text-sm bg-gray-50/50"
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto gap-2 h-10 px-5 font-medium text-sm rounded-lg">
            <Search className="h-4 w-4" />
            <span>Find</span>
          </Button>
        </form>
      </div>

      {/* Results Section */}
      {submitted && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : orders?.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200/80 rounded-2xl p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mx-auto mb-4">
                <ShoppingBag className="h-7 w-7 opacity-40" />
              </div>
              <p className="font-bold text-gray-900 text-base">No purchases found for this number.</p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Make sure you're using the same number you used at checkout.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Purchased Resources ({orders?.length})
                </p>
              </div>

              {/* Mobile Card List (Hidden on desktop) */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {orders?.map(order => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm leading-snug">{order.cardTitle}</p>
                          <p className="text-[11px] font-mono text-gray-400 mt-0.5">ID: {order.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                      {order.amountPaise === 0 ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs font-semibold shrink-0">
                          Free
                        </Badge>
                      ) : (
                        <span className="text-sm font-bold text-gray-900 shrink-0">
                          {formatRupees(order.amountPaise)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <a href={`${API_URL}/api/purchases/${order.id}/download/${order.cardId}`} download>
                        <Button size="sm" className="gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg shadow-xs">
                          <Download className="h-3.5 w-3.5" />
                          <span>Download PDF</span>
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (Hidden on mobile) */}
              <div className="hidden md:block bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs">
                <Table>
                  <TableHeader className="bg-gray-50/80">
                    <TableRow className="border-gray-100 hover:bg-transparent">
                      <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider py-3.5">Resource</TableHead>
                      <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider py-3.5">Amount</TableHead>
                      <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider py-3.5">Date</TableHead>
                      <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider py-3.5 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders?.map(order => (
                      <TableRow key={order.id} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <TableCell className="py-4">
                          <div className="font-semibold text-gray-900 leading-snug">{order.cardTitle}</div>
                          <div className="text-[11px] text-gray-400 font-mono mt-0.5">Order: {order.id}</div>
                        </TableCell>
                        <TableCell className="py-4">
                          {order.amountPaise === 0 ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs font-semibold">Free</Badge>
                          ) : (
                            <span className="text-gray-900 font-bold text-sm">{formatRupees(order.amountPaise)}</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <a href={`${API_URL}/api/purchases/${order.id}/download/${order.cardId}`} download>
                            <Button variant="default" size="sm" className="gap-1.5 rounded-lg shadow-xs font-medium">
                              <Download className="h-3.5 w-3.5" />
                              <span>Download PDF</span>
                            </Button>
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

