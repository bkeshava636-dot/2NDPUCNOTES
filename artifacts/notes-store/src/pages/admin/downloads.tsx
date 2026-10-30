import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminDownloads, AdminDownloadsResponse } from "@/lib/admin-api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DownloadCloud, 
  Search, 
  Copy, 
  Check, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  X,
  Laptop,
  Globe,
  FileText,
  AlertCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDownloads() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<AdminDownloadsResponse>({
    queryKey: ["admin", "downloads", page, searchQuery],
    queryFn: () => fetchAdminDownloads(page, searchQuery),
    staleTime: 60 * 1000,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / (data.limit || 20))) : 1;

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] dark:text-[#F1F5F9] tracking-tight">
            Downloads Audit Log
          </h1>
          <p className="text-[#5a6b82] dark:text-[#A1AEC2] text-xs sm:text-sm mt-0.5">
            Real-time audit log of student PDF accesses, IP addresses, and fulfilled download links
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-9 gap-1.5 text-xs text-[#5a6b82] dark:text-[#A1AEC2] hover:text-[#112542] dark:hover:text-[#F1F5F9] border-[#e2e8f0] dark:border-[#293548] dark:hover:bg-[#1C2638] self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-[#1856b8]" : ""}`} />
          <span>{isFetching ? "Refreshing..." : "Refresh"}</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-[#151D2E] p-3.5 sm:p-4 rounded-xl border border-[#e2e8f0] dark:border-[#293548] flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by resource, order ID, or customer name..."
            className="pl-9 h-9 text-xs sm:text-sm bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#112542] dark:text-[#F1F5F9] placeholder:text-[#94a3b8] dark:placeholder:text-[#8291A8] focus-visible:border-[#1856b8] dark:focus-visible:border-[#818CF8]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#112542]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs text-[#64748b] dark:text-[#A1AEC2] dark:text-[#A1AEC2]">
          Total Events: <strong className="text-[#112542] dark:text-[#F1F5F9]">{data?.total ?? 0}</strong> accesses
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white dark:bg-[#151D2E] rounded-xl border border-red-200 dark:border-red-900/40 p-8 text-center max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[#112542] dark:text-[#F1F5F9]">Failed to load download logs</h3>
          <p className="text-xs text-[#64748b] dark:text-[#A1AEC2] mt-1 mb-5">
            {(error as any)?.message || "A network or database latency timeout occurred."}
          </p>
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 text-xs bg-[#1856b8] hover:bg-[#124494] text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Retry Connection</span>
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-2xs">
            <Table>
              <TableHeader className="bg-[#f8fafc]/80 border-b border-[#e2e8f0]">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3 pl-5">Date & Time</TableHead>
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3">Study Material</TableHead>
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3">Student / Buyer</TableHead>
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3">Order ID</TableHead>
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3">IP Address</TableHead>
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3 pr-5">Client Device</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data?.downloads || data.downloads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-[#64748b] text-xs">
                      <DownloadCloud className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
                      No download activity records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.downloads.map((d) => (
                    <TableRow key={d.id} className="border-[#eef2f6] hover:bg-[#f8fafc]/60 transition-colors">
                      <TableCell className="pl-5 py-3.5 text-xs text-[#64748b] dark:text-[#A1AEC2] whitespace-nowrap">
                        {new Date(d.downloadedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </TableCell>

                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2 max-w-[240px]">
                          <FileText className="h-4 w-4 text-[#1856b8] shrink-0" />
                          <div className="truncate">
                            <p className="font-bold text-xs text-[#112542] truncate" title={d.cardTitle}>
                              {d.cardTitle}
                            </p>
                            <span className="text-[10px] text-[#94a3b8] dark:text-[#8291A8]">Resource #{d.cardId}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5">
                        <p className="font-medium text-xs text-[#112542] dark:text-[#F1F5F9]">{d.customerName}</p>
                        <p className="font-mono text-[10px] text-[#64748b]">{d.customerPhone}</p>
                      </TableCell>

                      <TableCell className="py-3.5 font-mono text-xs text-[#5a6b82]">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate max-w-[100px]">{d.orderId}</span>
                          <button
                            onClick={() => handleCopy(d.orderId)}
                            className="p-1 text-[#94a3b8] hover:text-[#112542] rounded hover:bg-[#f1f5f9]"
                            title="Copy Order ID"
                          >
                            {copiedId === d.orderId ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5 font-mono text-xs text-[#64748b] dark:text-[#A1AEC2]">
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-[#94a3b8]" />
                          <span>{d.ipAddress || "Unknown"}</span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5 pr-5 text-xs text-[#64748b] dark:text-[#A1AEC2] max-w-[200px] truncate" title={d.deviceInfo || "Standard browser"}>
                        <div className="flex items-center gap-1.5 truncate">
                          <Laptop className="h-3.5 w-3.5 text-[#94a3b8] shrink-0" />
                          <span className="truncate">{d.deviceInfo ? d.deviceInfo.split(" ")[0] : "Browser"}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {!data?.downloads || data.downloads.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 text-center text-xs text-[#64748b] dark:text-[#A1AEC2]">
                <DownloadCloud className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
                No download records found.
              </div>
            ) : (
              data.downloads.map((d) => (
                <div key={d.id} className="bg-white border border-[#e2e8f0] rounded-xl p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#112542] truncate">{d.cardTitle}</p>
                      <p className="text-[10px] text-[#64748b]">
                        {new Date(d.downloadedAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-[#f1f5f9] px-2 py-0.5 rounded text-[#5a6b82]">
                      #{d.cardId}
                    </span>
                  </div>

                  <div className="text-xs text-[#5a6b82] pt-2 border-t border-[#f1f5f9] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">Student:</span>
                      <span className="font-medium text-[#112542]">{d.customerName} ({d.customerPhone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">IP Address:</span>
                      <span className="font-mono">{d.ipAddress || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">Order ID:</span>
                      <span className="font-mono truncate max-w-[140px]">{d.orderId}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="h-8 gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-8 gap-1 text-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
