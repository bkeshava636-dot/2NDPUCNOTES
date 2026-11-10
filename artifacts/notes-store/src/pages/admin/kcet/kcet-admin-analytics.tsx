import { useQuery } from "@tanstack/react-query";
import { fetchAdminKcetDownloads, fetchKcetAdminStats } from "@/lib/kcet-api";
import { Badge } from "@/components/ui/badge";
import { DownloadCloud, BarChart3 } from "lucide-react";

export default function KcetAdminAnalytics() {
  const { data: downloads, isLoading } = useQuery({
    queryKey: ["admin-kcet-downloads"],
    queryFn: fetchAdminKcetDownloads,
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-kcet-stats"],
    queryFn: fetchKcetAdminStats,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] dark:text-white">
          KCET Downloads Audit &amp; Analytics
        </h1>
        <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
          Real-time log of student PDF downloads inside KCET Mode.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-4 space-y-1">
          <span className="text-xs text-[#64748b] dark:text-[#94A3B8] font-semibold">Total KCET Downloads</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {(stats?.totalDownloads ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-4 space-y-1">
          <span className="text-xs text-[#64748b] dark:text-[#94A3B8] font-semibold">Published Materials</span>
          <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{stats?.totalMaterials ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-4 space-y-1">
          <span className="text-xs text-[#64748b] dark:text-[#94A3B8] font-semibold">Recent Download Events</span>
          <p className="text-2xl font-black text-violet-600 dark:text-violet-400">{downloads?.length ?? 0}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] overflow-hidden">
        <div className="p-4 border-b border-[#f1f5f9] dark:border-[#293548] flex items-center gap-2">
          <DownloadCloud className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <h2 className="font-bold text-sm text-[#0f172a] dark:text-white">Recent KCET Download Log</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading download logs...</div>
        ) : !downloads?.length ? (
          <div className="p-10 text-center space-y-2">
            <BarChart3 className="h-7 w-7 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-[#0f172a] dark:text-white">No KCET downloads recorded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f1f5f9] dark:divide-[#293548]">
            {downloads.map((d) => (
              <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">{d.subject}</Badge>
                    <Badge variant="outline" className="text-[10px]">{d.category}</Badge>
                  </div>
                  <p className="font-semibold text-sm text-[#0f172a] dark:text-white truncate">{d.materialTitle}</p>
                  <p className="text-[11px] text-[#64748b] dark:text-[#94A3B8] truncate">
                    IP: {d.ipAddress || "Unknown"}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#64748b] dark:text-[#94A3B8] shrink-0">
                  {new Date(d.downloadedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
