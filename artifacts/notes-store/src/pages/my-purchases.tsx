import { MetaNoIndex } from "@/components/meta-noindex";
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
import { useLanguage } from "@/lib/language-context";

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";

export default function MyPurchases() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState("");
  const { t } = useLanguage();

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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] text-[#2563eb] border border-[#bfdbfe]/80 shadow-2xs shrink-0">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">{t("My Purchases", "ನನ್ನ ಖರೀದಿಗಳು")}</h1>
          <p className="text-[#64748b] text-xs sm:text-sm mt-0.5">{t("Enter your phone number to access and re-download your study materials", "ನಿಮ್ಮ ನೋಟ್ಸ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ")}</p>
        </div>
      </div>

      {/* Lookup Form Card */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4.5 sm:p-5 mb-6 shadow-xs">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:flex-1 space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[#94a3b8]" />
              <span>{t("Mobile Phone Number", "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ")}</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t("Enter your 10-digit mobile number", "10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ")}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              maxLength={10}
              className="h-10.5 text-sm bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a] rounded-lg focus-visible:ring-[#2563eb]"
            />
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto gap-2 h-10.5 px-5 font-semibold text-xs sm:text-sm rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-2xs transition-all"
          >
            <Search className="h-4 w-4" />
            <span>{t("Find Purchases", "ಖರೀದಿಗಳನ್ನು ಹುಡುಕಿ")}</span>
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
            <div className="text-center py-16 bg-white border border-[#e2e8f0] rounded-2xl p-8 shadow-2xs">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8fafc] text-[#94a3b8] mx-auto mb-4 border border-[#e2e8f0]">
                <ShoppingBag className="h-7 w-7 opacity-60" />
              </div>
              <p className="font-bold text-[#0f172a] text-base">{t("No purchases found for this number.", "ಈ ಸಂಖ್ಯೆಗೆ ಯಾವುದೇ ಖರೀದಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.")}</p>
              <p className="text-sm text-[#64748b] mt-1 max-w-sm mx-auto">
                {t("Make sure you're using the same number you entered at checkout.", "ಖರೀದಿಯ ಸಮಯದಲ್ಲಿ ನೀಡಿದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನೇ ನಮೂದಿಸಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-bold text-[#475569] uppercase tracking-wider">
                  {t("Purchased Resources", "ಖರೀದಿಸಿದ ಸಂಪನ್ಮೂಲಗಳು")} ({orders?.length})
                </p>
              </div>

              {/* Mobile Card List (Hidden on desktop) */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {orders?.map(order => (
                  <div
                    key={order.id}
                    className="bg-white border border-[#e2e8f0] rounded-xl p-4 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <FileText className="h-5 w-5 text-[#2563eb] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#0f172a] text-sm leading-snug">{order.cardTitle}</p>
                          <p className="text-[11px] font-mono text-[#94a3b8] mt-0.5">{t("Order:", "ಆರ್ಡರ್:")} {order.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                      {order.amountPaise === 0 ? (
                        <span className="bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] text-xs font-semibold px-2 py-0.5 rounded shrink-0">
                          {t("Free", "ಉಚಿತ")}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-[#0f172a] shrink-0">
                          {formatRupees(order.amountPaise)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs text-[#64748b]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <a href={`${API_URL}/api/purchases/${order.id}/download/${order.cardId}`} download>
                        <Button size="sm" className="gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-2xs transition-all">
                          <Download className="h-3.5 w-3.5" />
                          <span>{t("Download PDF", "PDF ಡೌನ್‌ಲೋಡ್")}</span>
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (Hidden on mobile) */}
              <div className="hidden md:block bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-2xs">
                <Table>
                  <TableHeader className="bg-[#f8fafc]">
                    <TableRow className="border-[#f1f5f9] hover:bg-transparent">
                      <TableHead className="font-bold text-xs text-[#475569] uppercase tracking-wider py-3.5">{t("Resource", "ಸಂಪನ್ಮೂಲ")}</TableHead>
                      <TableHead className="font-bold text-xs text-[#475569] uppercase tracking-wider py-3.5">{t("Amount", "ಮೊತ್ತ")}</TableHead>
                      <TableHead className="font-bold text-xs text-[#475569] uppercase tracking-wider py-3.5">{t("Date", "ದಿನಾಂಕ")}</TableHead>
                      <TableHead className="font-bold text-xs text-[#475569] uppercase tracking-wider py-3.5 text-right">{t("Action", "ಕ್ರಿಯೆ")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders?.map(order => (
                      <TableRow key={order.id} className="border-[#f1f5f9] hover:bg-[#f8fafc]/70 transition-colors">
                        <TableCell className="py-4">
                          <div className="font-semibold text-[#0f172a] leading-snug">{order.cardTitle}</div>
                          <div className="text-[11px] text-[#94a3b8] font-mono mt-0.5">{t("Order:", "ಆರ್ಡರ್:")} {order.id}</div>
                        </TableCell>
                        <TableCell className="py-4">
                          {order.amountPaise === 0 ? (
                            <span className="bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] text-xs font-semibold px-2 py-0.5 rounded">
                              {t("Free", "ಉಚಿತ")}
                            </span>
                          ) : (
                            <span className="text-[#0f172a] font-bold text-sm">{formatRupees(order.amountPaise)}</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 text-sm text-[#64748b]">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <a href={`${API_URL}/api/purchases/${order.id}/download/${order.cardId}`} download>
                            <Button variant="default" size="sm" className="gap-1.5 rounded-lg font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-2xs transition-all">
                              <Download className="h-3.5 w-3.5" />
                              <span>{t("Download PDF", "PDF ಡೌನ್‌ಲೋಡ್")}</span>
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

