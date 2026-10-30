import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminCustomers, AdminCustomersResponse } from "@/lib/admin-api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  X,
  CreditCard,
  UserCheck,
  AlertCircle
} from "lucide-react";
import { formatRupees } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCustomers() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<AdminCustomersResponse>({
    queryKey: ["admin", "customers", page, searchQuery],
    queryFn: () => fetchAdminCustomers(page, searchQuery),
    staleTime: 60 * 1000,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / (data.limit || 20))) : 1;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] dark:text-[#F1F5F9] tracking-tight">
            Students & Customers
          </h1>
          <p className="text-[#5a6b82] dark:text-[#A1AEC2] text-xs sm:text-sm mt-0.5">
            Directory of registered students, checkout history, and total study material purchases
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
            placeholder="Search by student name, phone, or email..."
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
          Total Registered: <strong className="text-[#112542] dark:text-[#F1F5F9]">{data?.total ?? 0}</strong> students
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
          <h3 className="text-base font-bold text-[#112542] dark:text-[#F1F5F9]">Failed to load students</h3>
          <p className="text-xs text-[#64748b] dark:text-[#A1AEC2] mt-1 mb-5">
            {(error as any)?.message || "A network or server error occurred."}
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
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3 pl-5">Student</TableHead>
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3">Phone Number</TableHead>
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3">Email Address</TableHead>
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3">Joined Date</TableHead>
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3 text-center">Paid Orders</TableHead>
                  <TableHead className="text-xs font-semibold text-[#64748b] dark:text-[#A1AEC2] py-3 pr-5 text-right">Total Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data?.customers || data.customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-[#64748b] text-xs">
                      <Users className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
                      No registered students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.customers.map((c) => (
                    <TableRow key={c.id} className="border-[#eef2f6] hover:bg-[#f8fafc]/60 transition-colors">
                      <TableCell className="pl-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#ebf3ff] text-[#1856b8] font-bold text-xs flex items-center justify-center shrink-0 border border-[#dce8fa]">
                            {c.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-[#112542] dark:text-[#F1F5F9]">{c.fullName}</p>
                            <span className="text-[10px] text-[#94a3b8] dark:text-[#8291A8] font-mono">ID #{c.id}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-[#5a6b82]">
                          <span>{c.phone}</span>
                          <button
                            onClick={() => handleCopy(c.phone)}
                            className="p-1 text-[#94a3b8] hover:text-[#112542] rounded hover:bg-[#f1f5f9]"
                            title="Copy Phone"
                          >
                            {copiedText === c.phone ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5">
                        {c.email ? (
                          <div className="flex items-center gap-1.5 text-xs text-[#5a6b82]">
                            <Mail className="h-3.5 w-3.5 text-[#94a3b8]" />
                            <span>{c.email}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#94a3b8] italic">None provided</span>
                        )}
                      </TableCell>

                      <TableCell className="py-3.5 text-xs text-[#64748b] dark:text-[#A1AEC2]">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>

                      <TableCell className="py-3.5 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {c.paidOrdersCount} {c.paidOrdersCount === 1 ? "order" : "orders"}
                        </span>
                      </TableCell>

                      <TableCell className="py-3.5 pr-5 text-right font-bold text-xs text-[#112542] dark:text-[#F1F5F9]">
                        {formatRupees(c.totalSpentPaise)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {!data?.customers || data.customers.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 text-center text-xs text-[#64748b] dark:text-[#A1AEC2]">
                <Users className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
                No registered students found.
              </div>
            ) : (
              data.customers.map((c) => (
                <div key={c.id} className="bg-white border border-[#e2e8f0] rounded-xl p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#ebf3ff] text-[#1856b8] font-bold text-xs flex items-center justify-center border border-[#dce8fa]">
                        {c.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#112542] dark:text-[#F1F5F9]">{c.fullName}</p>
                        <span className="text-[10px] text-[#94a3b8] dark:text-[#8291A8]">Student ID #{c.id}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#112542]">
                      {formatRupees(c.totalSpentPaise)}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-[#5a6b82] pt-2 border-t border-[#f1f5f9]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#94a3b8]">Phone:</span>
                      <span className="font-mono font-medium">{c.phone}</span>
                    </div>
                    {c.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#94a3b8]">Email:</span>
                        <span>{c.email}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[#94a3b8]">Paid Orders:</span>
                      <span className="font-semibold text-blue-700">{c.paidOrdersCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#94a3b8]">Registered:</span>
                      <span>
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
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
