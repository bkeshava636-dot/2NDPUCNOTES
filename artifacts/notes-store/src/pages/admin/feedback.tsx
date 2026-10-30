import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquarePlus,
  Flag,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  ExternalLink,
  Filter,
  RefreshCw,
  Check,
  PlusCircle,
  FolderPlus,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface FeedbackItem {
  id: number;
  type: string;
  rating?: string | null;
  message: string;
  contact?: string | null;
  pageUrl?: string | null;
  userAgent?: string | null;
  status: "new" | "reviewed" | "resolved";
  createdAt: string;
}

export default function AdminFeedback() {
  const [, setLocation] = useLocation();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Helper to extract contribution fields for one-click catalog approval
  const parseContribution = (msg: string) => {
    const lines = msg.split("\n");
    const getVal = (prefix: string) => {
      const line = lines.find((l) => l.toLowerCase().startsWith(prefix.toLowerCase()));
      return line ? line.substring(prefix.length).trim() : "";
    };

    const subject = getVal("Subject:");
    const resourceType = getVal("Resource Type:");
    const title = getVal("Material Title:");
    const driveUrl = getVal("Google Drive Link:");
    const notes = getVal("Notes / Description:");

    return { subject, resourceType, title, driveUrl, notes };
  };

  const rawApiUrl = import.meta.env.VITE_API_URL;
  const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";

  const { data, isLoading, isFetching, refetch } = useQuery<{
    feedback: FeedbackItem[];
    stats: { total: number; newCount: number; reportsCount: number };
  }>({
    queryKey: ["admin-feedback"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch(`${API_URL}/api/admin/feedback`, {
        headers: { "x-admin-token": token },
      });
      if (!res.ok) throw new Error("Failed to load feedback");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch(`${API_URL}/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedback"] });
      toast({ title: "Status Updated", description: "Feedback status was updated successfully." });
    },
  });

  const feedbackList = data?.feedback || [];
  const stats = data?.stats || { total: 0, newCount: 0, reportsCount: 0 };

  const filtered = feedbackList.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-[#F1F5F9] tracking-tight flex items-center gap-2">
            <MessageSquarePlus className="h-6 w-6 text-[#2563eb]" />
            <span>Student Feedback & Bug Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#A1AEC2] mt-0.5">
            Monitor real-time feedback, issue reports, and how well study materials are working for students.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-1.5 rounded-lg text-xs font-semibold h-9 border-[#e2e8f0] dark:border-[#293548] text-[#5a6b82] dark:text-[#A1AEC2] hover:text-[#112542] dark:hover:text-[#F1F5F9] dark:hover:bg-[#1C2638]"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] shadow-2xs">
          <CardHeader className="pb-2 pt-4 px-4.5">
            <CardDescription className="text-xs font-bold text-[#64748b] dark:text-[#A1AEC2] uppercase tracking-wider">
              Total Submissions
            </CardDescription>
            <CardTitle className="text-2xl font-black text-[#0f172a] dark:text-[#F1F5F9]">
              {isLoading ? "..." : stats.total}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4.5 pb-4 text-xs text-[#64748b] dark:text-[#A1AEC2]">
            All-time student suggestions and reports
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] shadow-2xs">
          <CardHeader className="pb-2 pt-4 px-4.5">
            <CardDescription className="text-xs font-bold text-[#d97706] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Pending Review</span>
            </CardDescription>
            <CardTitle className="text-2xl font-black text-[#d97706]">
              {isLoading ? "..." : stats.newCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4.5 pb-4 text-xs text-[#64748b] dark:text-[#A1AEC2]">
            New submissions requiring administrative attention
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] shadow-2xs">
          <CardHeader className="pb-2 pt-4 px-4.5">
            <CardDescription className="text-xs font-bold text-[#e11d48] uppercase tracking-wider flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5" />
              <span>Reported Issues</span>
            </CardDescription>
            <CardTitle className="text-2xl font-black text-[#e11d48]">
              {isLoading ? "..." : stats.reportsCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4.5 pb-4 text-xs text-[#64748b] dark:text-[#A1AEC2]">
            Bug reports and broken link reports
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#151D2E] p-3 rounded-xl border border-[#e2e8f0] dark:border-[#293548] shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-[#64748b] dark:text-[#A1AEC2] mr-1">Type:</span>
          {["all", "contribution", "feedback", "bug_report", "broken_link", "content_error"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                filterType === t
                  ? "bg-[#2563eb] dark:bg-[#818CF8] text-white dark:text-[#0B0F19] dark:font-bold shadow-2xs"
                  : "text-[#64748b] dark:text-[#A1AEC2] hover:bg-[#f1f5f9] dark:hover:bg-[#1C2638]"
              }`}
            >
              {t === "all" ? "All Types" : t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#64748b] dark:text-[#A1AEC2] mr-1">Status:</span>
          {["all", "new", "reviewed", "resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                filterStatus === s
                  ? "bg-[#0f172a] dark:bg-[#818CF8] text-white dark:text-[#0B0F19] dark:font-bold shadow-2xs"
                  : "text-[#64748b] dark:text-[#A1AEC2] hover:bg-[#f1f5f9] dark:hover:bg-[#1C2638]"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <Card className="rounded-xl border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <MessageSquarePlus className="h-10 w-10 text-[#94a3b8] dark:text-[#8291A8] mx-auto mb-3" />
            <h3 className="font-bold text-sm text-[#0f172a] dark:text-[#F1F5F9]">No feedback submissions match filters</h3>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2] mt-1">Student submissions will appear here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#f8fafc] dark:bg-[#1C2638]">
                <TableRow className="border-[#f1f5f9]">
                  <TableHead className="text-xs font-bold text-[#475569] dark:text-[#A1AEC2] uppercase tracking-wider py-3.5">Type & Health</TableHead>
                  <TableHead className="text-xs font-bold text-[#475569] dark:text-[#A1AEC2] uppercase tracking-wider py-3.5">Message / Details</TableHead>
                  <TableHead className="text-xs font-bold text-[#475569] dark:text-[#A1AEC2] uppercase tracking-wider py-3.5">Contact</TableHead>
                  <TableHead className="text-xs font-bold text-[#475569] dark:text-[#A1AEC2] uppercase tracking-wider py-3.5">Date & Page</TableHead>
                  <TableHead className="text-xs font-bold text-[#475569] dark:text-[#A1AEC2] uppercase tracking-wider py-3.5 text-right">Status Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id} className="border-[#f1f5f9] dark:border-[#293548] hover:bg-[#f8fafc]/60 dark:hover:bg-[#1C2638]/60">
                    <TableCell className="py-3.5 align-top">
                      <div className="space-y-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold uppercase ${
                            item.type === "contribution"
                              ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]"
                              : item.type === "feedback"
                              ? "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]"
                              : "bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]"
                          }`}
                        >
                          {item.type.replace(/_/g, " ")}
                        </Badge>
                        {item.rating && (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-[#475569]">
                            {item.rating === "working_great" && (
                              <span className="text-[#16a34a] flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="h-3 w-3" /> Working Well
                              </span>
                            )}
                            {item.rating === "minor_issue" && (
                              <span className="text-[#d97706] flex items-center gap-1 font-semibold">
                                <HelpCircle className="h-3 w-3" /> Minor Issue
                              </span>
                            )}
                            {item.rating === "broken" && (
                              <span className="text-[#e11d48] flex items-center gap-1 font-semibold">
                                <AlertTriangle className="h-3 w-3" /> Broken
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 align-top max-w-md">
                      {item.type === "contribution" ? (
                        <div className="space-y-2 text-xs">
                          {(() => {
                            const parsed = parseContribution(item.message);
                            return (
                              <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[#0f172a] dark:text-[#F1F5F9] text-sm">{parsed.title || "Untitled Contribution"}</span>
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                                    {parsed.subject || "General"}
                                  </span>
                                </div>
                                <div className="text-[#475569] text-[11px] flex items-center gap-1.5 font-medium">
                                  <span className="text-[#64748b]">Type:</span>
                                  <span className="bg-white dark:bg-[#1C2638] px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-semibold">
                                    {parsed.resourceType || "Notes"}
                                  </span>
                                </div>
                                {parsed.driveUrl && (
                                  <div className="pt-1">
                                    <a
                                      href={parsed.driveUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-semibold transition-colors shadow-2xs"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      <span>Open & Test Google Drive Link</span>
                                    </a>
                                  </div>
                                )}
                                {parsed.notes && (
                                  <p className="text-[11px] text-[#64748b] italic pt-1 border-t border-emerald-200/60">
                                    "{parsed.notes}"
                                  </p>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-[#0f172a] dark:text-[#F1F5F9] whitespace-pre-wrap leading-relaxed font-normal">
                          {item.message}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5 align-top text-xs font-medium text-[#475569]">
                      {item.contact ? (
                        <span className="font-mono bg-[#f1f5f9] dark:bg-[#1C2638] text-[#475569] dark:text-[#F1F5F9] px-2 py-0.5 rounded text-[11px]">
                          {item.contact}
                        </span>
                      ) : (
                        <span className="text-[#94a3b8] italic">Anonymous</span>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5 align-top text-xs text-[#64748b] dark:text-[#A1AEC2]">
                      <div>
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {item.pageUrl && (
                        <a
                          href={item.pageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#2563eb] hover:underline mt-1 truncate max-w-[150px]"
                        >
                          <span>View Page</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5 align-top text-right">
                      <div className="inline-flex flex-col items-end gap-1.5">
                        {/* If Contribution, provide one-click 'Approve & Put in Subject' button */}
                        {item.type === "contribution" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const parsed = parseContribution(item.message);
                              const q = new URLSearchParams();
                              if (parsed.title) q.set("title", parsed.title);
                              if (parsed.subject) q.set("subject", parsed.subject);
                              if (parsed.resourceType) q.set("resourceType", parsed.resourceType);
                              if (parsed.driveUrl) q.set("driveUrl", parsed.driveUrl);
                              if (parsed.notes) q.set("notes", parsed.notes);

                              // Mark as reviewed in background
                              if (item.status === "new") {
                                updateStatusMutation.mutate({ id: item.id, status: "reviewed" });
                              }

                              // Navigate to card creation form with all prefilled parameters
                              setLocation(`/admin/cards/new?${q.toString()}`);
                            }}
                            className="h-7 text-[11px] px-2.5 font-bold bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-2xs gap-1"
                          >
                            <FolderPlus className="h-3 w-3" />
                            <span>Approve & Publish</span>
                          </Button>
                        )}

                        <div className="inline-flex items-center gap-1">
                          {item.status === "new" && item.type !== "contribution" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatusMutation.mutate({ id: item.id, status: "reviewed" })}
                              className="h-7 text-[11px] px-2 font-medium"
                            >
                              Mark Reviewed
                            </Button>
                          )}
                          {item.status !== "resolved" ? (
                            <Button
                              size="sm"
                              onClick={() => updateStatusMutation.mutate({ id: item.id, status: "resolved" })}
                              className="h-7 text-[11px] px-2.5 font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          ) : (
                            <Badge className="bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0] text-[10px] font-bold">
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
