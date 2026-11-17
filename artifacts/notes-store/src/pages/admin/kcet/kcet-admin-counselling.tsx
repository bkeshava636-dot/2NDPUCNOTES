import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminKcetCounsellingGuide,
  updateKcetCounsellingGuide,
  KcetCounsellingGuide,
} from "@/lib/kcet-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Compass,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  Edit3,
} from "lucide-react";
import { Link } from "wouter";

export default function KcetAdminCounselling() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: guide, isLoading } = useQuery({
    queryKey: ["kcet-admin-counselling-guide"],
    queryFn: fetchAdminKcetCounsellingGuide,
  });

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [notice, setNotice] = useState("");
  const [academicYear, setAcademicYear] = useState("2026");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (guide) {
      setTitle(guide.title || "");
      setSubtitle(guide.subtitle || "");
      setNotice(guide.notice || "");
      setAcademicYear(guide.academicYear || "2026");
      setContent(guide.content || "");
      setIsPublished(guide.isPublished ?? true);
    }
  }, [guide]);

  const saveMutation = useMutation({
    mutationFn: updateKcetCounsellingGuide,
    onSuccess: (updated) => {
      queryClient.setQueryData(["kcet-admin-counselling-guide"], updated);
      queryClient.invalidateQueries({ queryKey: ["kcet-counselling-guide"] });
      toast({
        title: "Counselling Guide Saved!",
        description: "Your changes are now live on the public KCET Counselling section.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Save Failed",
        description: err?.message || "Failed to save counselling guide",
        variant: "destructive",
      });
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please provide the guide content before saving.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate({
      title: title.trim() || "Official KCET 2026 KEA Counselling Guide",
      subtitle: subtitle.trim() || null,
      notice: notice.trim() || null,
      academicYear: academicYear.trim() || "2026",
      content: content.trim(),
      isPublished,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e8f0] dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
              <Compass className="h-6 w-6 text-sky-600 dark:text-cyan-400" />
              <span>KCET Counselling Guide Manager</span>
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-cyan-500/15 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-cyan-400/30">
              Live Editor
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-slate-400 mt-1">
            Update official KEA counselling rules, advisory banners, and option entry procedures in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/kcet/counselling" target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Live Page</span>
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            size="sm"
            className="gap-1.5 text-xs bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white font-bold"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saveMutation.isPending ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Configuration Card */}
        <div className="rounded-2xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24] p-5 sm:p-6 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-[#0f172a] dark:text-white uppercase tracking-wider">
            General Guide Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="guide-title" className="text-xs font-semibold">
                Guide Title
              </Label>
              <Input
                id="guide-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Official KCET 2026 KEA Counselling Guide"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="academic-year" className="text-xs font-semibold">
                Academic Session
              </Label>
              <Input
                id="academic-year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2026"
                className="h-9 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guide-subtitle" className="text-xs font-semibold">
              Subtitle / Overview
            </Label>
            <Input
              id="guide-subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Step-by-step breakdown of seats, verification slip, option entry, mock round, and college admission"
              className="h-9 text-xs"
            />
          </div>

          {/* Urgent Advisory Notice Banner Input */}
          <div className="space-y-1.5 pt-2 border-t border-[#f1f5f9] dark:border-slate-800">
            <div className="flex items-center justify-between">
              <Label htmlFor="guide-notice" className="text-xs font-semibold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Urgent Advisory Notice Banner (Appears at top of page)</span>
              </Label>
              <span className="text-[11px] text-[#94a3b8]">Optional • Leave empty to hide banner</span>
            </div>
            <Textarea
              id="guide-notice"
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
              placeholder="e.g. Pre-Round update: Currently removed by KEA for 2026. Computer Science seat cap (900 seats/college) order is yet to be officially issued."
              rows={2}
              className="text-xs resize-y"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#0f172a] dark:text-white">Published Status</span>
              <p className="text-[11px] text-[#64748b] dark:text-slate-400">
                When enabled, this guide is visible to all students on the public KCET site.
              </p>
            </div>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
        </div>

        {/* Content Markdown Editor */}
        <div className="rounded-2xl border border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#090f24] overflow-hidden shadow-2xs">
          <div className="px-5 py-3 border-b border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between bg-[#f8fafc] dark:bg-[#060a19]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "edit"
                    ? "bg-white dark:bg-[#111827] text-sky-600 dark:text-cyan-400 shadow-2xs border border-[#e2e8f0] dark:border-slate-800"
                    : "text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Markdown Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "preview"
                    ? "bg-white dark:bg-[#111827] text-sky-600 dark:text-cyan-400 shadow-2xs border border-[#e2e8f0] dark:border-slate-800"
                    : "text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-[#94a3b8]">
              {content.length.toLocaleString()} characters
            </span>
          </div>

          <div className="p-4 sm:p-5">
            {activeTab === "edit" ? (
              <div className="space-y-2">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the full counselling guide in Markdown format..."
                  rows={26}
                  className="font-mono text-xs leading-relaxed resize-y min-h-[460px] bg-[#fafcff] dark:bg-[#050814] border-[#cbd5e1] dark:border-slate-800"
                />
                <p className="text-[11px] text-[#64748b] dark:text-slate-400">
                  Tip: Supports full Markdown headings (#, ##, ###), bold (**text**), lists, tables, links, and code blocks.
                </p>
              </div>
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap font-sans p-4 rounded-xl bg-[#f8fafc] dark:bg-[#050814] border border-[#e2e8f0] dark:border-slate-800 min-h-[460px]">
                {content}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="gap-2 px-6 h-10 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 text-white font-bold shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>{saveMutation.isPending ? "Saving Guide..." : "Save Counselling Guide"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
