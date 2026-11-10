import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminKcetContributions,
  moderateKcetContribution,
  deleteKcetContribution,
} from "@/lib/kcet-api";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Trash2, ExternalLink, UploadCloud } from "lucide-react";

export default function KcetAdminContributions() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-kcet-contributions"],
    queryFn: fetchAdminKcetContributions,
  });

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      await moderateKcetContribution(id, action);
      toast({
        title: action === "approve" ? "Approved & Published!" : "Submission Rejected",
        description:
          action === "approve"
            ? "Added directly to the live KCET Materials catalog."
            : "Marked as rejected.",
      });
      qc.invalidateQueries({ queryKey: ["admin-kcet-contributions"] });
      qc.invalidateQueries({ queryKey: ["admin-kcet-materials"] });
      qc.invalidateQueries({ queryKey: ["admin-kcet-stats"] });
      qc.invalidateQueries({ queryKey: ["kcet-materials"] });
      qc.invalidateQueries({ queryKey: ["kcet-stats"] });
    } catch (err: any) {
      toast({ title: "Action Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this contribution record?")) return;
    try {
      await deleteKcetContribution(id);
      toast({ title: "Deleted" });
      qc.invalidateQueries({ queryKey: ["admin-kcet-contributions"] });
      qc.invalidateQueries({ queryKey: ["admin-kcet-stats"] });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    }
  };

  const handlePreview = async (id: number, fileUrl: string) => {
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      const res = await apiFetch(`/api/admin/kcet/contributions/${id}/preview?mode=json`);
      const data = await res.json();
      if (data?.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    } catch {
      toast({ title: "Could not open file preview", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] dark:text-white">
          KCET Student Contributions
        </h1>
        <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
          Review student-shared KCET notes, PYQs &amp; formula sheets and publish approved ones with 1 click.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading contributions...</div>
        ) : !items?.length ? (
          <div className="p-10 text-center space-y-2">
            <UploadCloud className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-[#0f172a] dark:text-white">No student contributions yet</p>
            <p className="text-xs text-[#64748b] dark:text-[#94A3B8]">
              Submissions from /kcet/contribute will appear here for review.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f1f5f9] dark:divide-[#293548]">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge className="bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-0 text-[10px]">
                      {item.subject}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {item.category}
                    </Badge>
                    {item.year && (
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {item.year}
                      </Badge>
                    )}
                    <Badge
                      className={`text-[10px] border-0 ${
                        item.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : item.status === "rejected"
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-sm text-[#0f172a] dark:text-white">{item.title}</h3>
                  <p className="text-xs text-[#64748b] dark:text-[#94A3B8]">
                    {item.chapter ? `Chapter: ${item.chapter} • ` : ""}
                    By {item.contributorName || "Anonymous"}
                    {item.contributorContact ? ` (${item.contributorContact})` : ""}
                  </p>
                  {item.description && (
                    <p className="text-xs text-[#475569] dark:text-[#CBD5E1]">{item.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(item.id, item.fileUrl)}
                    className="gap-1.5 text-xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </Button>

                  {item.status !== "approved" && (
                    <Button
                      size="sm"
                      onClick={() => handleAction(item.id, "approve")}
                      className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve &amp; Publish</span>
                    </Button>
                  )}

                  {item.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(item.id, "reject")}
                      className="gap-1.5 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
