import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchKcetAdminStats, getKcetDownloadUrl } from "@/lib/kcet-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Files,
  FolderTree,
  DownloadCloud,
  UploadCloud,
  PlusCircle,
  Rocket,
  Layers,
  ExternalLink,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function KcetAdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-kcet-stats"],
    queryFn: fetchKcetAdminStats,
    staleTime: 15_000,
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#09122b] via-[#0c1638] to-[#17113a] p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300">
            <Rocket className="h-3.5 w-3.5" />
            <span>Isolated KCET Control Board</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">KCET Admin Dashboard</h1>
          <p className="text-xs text-slate-300">
            Manage KCET subjects, material categories, study PDFs, PYQs, and student contributions separately from 2nd PUC.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link href="/admin/kcet/materials/new">
            <Button size="sm" className="gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
              <PlusCircle className="h-4 w-4" />
              <span>Add KCET Material</span>
            </Button>
          </Link>
          <a
            href="/kcet"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15"
          >
            <span>Open KCET Arena</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b] dark:text-[#94A3B8]">KCET Materials</span>
              <Files className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-[#0f172a] dark:text-white">{stats?.totalMaterials ?? 0}</p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b] dark:text-[#94A3B8]">KCET Subjects</span>
              <FolderTree className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-[#0f172a] dark:text-white">{stats?.totalSubjects ?? 4}</p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b] dark:text-[#94A3B8]">Categories</span>
              <Layers className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-2xl font-black text-[#0f172a] dark:text-white">{stats?.totalCategories ?? 6}</p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b] dark:text-[#94A3B8]">Total Downloads</span>
              <DownloadCloud className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-[#0f172a] dark:text-white">
              {(stats?.totalDownloads ?? 0).toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-4 shadow-2xs space-y-2 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Pending Shares</span>
              <UploadCloud className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-900 dark:text-amber-200">
              {stats?.pendingContributions ?? 0}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/kcet/materials">
          <div className="group rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] hover:border-cyan-500 p-4 transition-all cursor-pointer space-y-2">
            <div className="flex items-center justify-between">
              <Files className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-sm text-[#0f172a] dark:text-white">Manage Materials</h3>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">Add, edit, delete &amp; reorder KCET PDFs</p>
          </div>
        </Link>

        <Link href="/admin/kcet/taxonomy">
          <div className="group rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] hover:border-violet-500 p-4 transition-all cursor-pointer space-y-2">
            <div className="flex items-center justify-between">
              <FolderTree className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-sm text-[#0f172a] dark:text-white">Subjects &amp; Categories</h3>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">Add custom subjects or material categories</p>
          </div>
        </Link>

        <Link href="/admin/kcet/contributions">
          <div className="group rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] hover:border-amber-500 p-4 transition-all cursor-pointer space-y-2">
            <div className="flex items-center justify-between">
              <UploadCloud className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-sm text-[#0f172a] dark:text-white">Student Contributions</h3>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">Approve &amp; publish shared KCET resources</p>
          </div>
        </Link>

        <Link href="/admin/kcet/analytics">
          <div className="group rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] hover:border-emerald-500 p-4 transition-all cursor-pointer space-y-2">
            <div className="flex items-center justify-between">
              <DownloadCloud className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-sm text-[#0f172a] dark:text-white">Downloads Audit</h3>
            <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">Inspect recent KCET downloads</p>
          </div>
        </Link>
      </div>

      {/* Recent Uploads */}
      <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm sm:text-base text-[#0f172a] dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span>Recently Added KCET Materials</span>
          </h2>
          <Link href="/admin/kcet/materials">
            <Button variant="ghost" size="sm" className="text-xs text-cyan-600 dark:text-cyan-400">
              View All
            </Button>
          </Link>
        </div>

        {!stats?.recentMaterials?.length ? (
          <p className="text-xs text-[#64748b] dark:text-[#94A3B8] py-4 text-center">
            No KCET materials uploaded yet. Click &ldquo;Add KCET Material&rdquo; to publish your first resource.
          </p>
        ) : (
          <div className="divide-y divide-[#f1f5f9] dark:divide-[#293548]">
            {stats.recentMaterials.map((m) => (
              <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <Badge variant="secondary" className="text-[10px]">
                      {m.subject}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {m.category}
                    </Badge>
                    {m.year && (
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {m.year}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#0f172a] dark:text-white truncate">{m.title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-[#64748b] dark:text-[#94A3B8]">
                    {m.downloadCount} DLs
                  </span>
                  <a
                    href={getKcetDownloadUrl(m.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    Open PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
