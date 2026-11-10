import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminKcetMaterials,
  fetchAdminKcetSubjects,
  fetchAdminKcetCategories,
  updateKcetMaterial,
  deleteKcetMaterial,
  reorderKcetMaterials,
  getKcetViewUrl,
} from "@/lib/kcet-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";

export default function KcetAdminMaterials() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: materials, isLoading } = useQuery({
    queryKey: ["admin-kcet-materials"],
    queryFn: fetchAdminKcetMaterials,
  });

  const { data: subjects } = useQuery({
    queryKey: ["admin-kcet-subjects"],
    queryFn: fetchAdminKcetSubjects,
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-kcet-categories"],
    queryFn: fetchAdminKcetCategories,
  });

  const [search, setSearch] = useState("");
  const [filterSub, setFilterSub] = useState("all");
  const [filterCat, setFilterCat] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (materials || []).filter((m) => {
      if (filterSub !== "all" && m.subject.toLowerCase() !== filterSub.toLowerCase()) return false;
      if (filterCat !== "all" && m.category.toLowerCase() !== filterCat.toLowerCase()) return false;
      if (q) {
        const hay = `${m.title} ${m.chapter || ""} ${m.subject} ${m.category} ${m.year || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [materials, search, filterSub, filterCat]);

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-kcet-materials"] });
    qc.invalidateQueries({ queryKey: ["admin-kcet-stats"] });
    qc.invalidateQueries({ queryKey: ["kcet-materials"] });
    qc.invalidateQueries({ queryKey: ["kcet-stats"] });
  };

  const toggleVisible = async (id: number, current: boolean) => {
    try {
      await updateKcetMaterial(id, { isVisible: !current });
      invalidateAll();
      toast({ title: !current ? "Material Visible" : "Material Hidden" });
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    }
  };

  const toggleFeatured = async (id: number, current: boolean) => {
    try {
      await updateKcetMaterial(id, { isFeatured: !current });
      invalidateAll();
      toast({ title: !current ? "Marked Featured" : "Removed Featured" });
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete KCET material "${title}"?`)) return;
    try {
      await deleteKcetMaterial(id);
      invalidateAll();
      toast({ title: "Material Deleted" });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    }
  };

  const moveMaterial = async (idx: number, dir: -1 | 1) => {
    if (!materials || search || filterSub !== "all" || filterCat !== "all") {
      toast({ title: "Clear filters before reordering", variant: "destructive" });
      return;
    }
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= materials.length) return;
    const copy = [...materials];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    await reorderKcetMaterials(copy.map((m) => m.id));
    invalidateAll();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] dark:text-white">
            KCET Study Materials
          </h1>
          <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
            Full CRUD &amp; order control for KCET Notes, PYQs, Mock Papers, Syllabus, Books &amp; Formulas
          </p>
        </div>

        <Link href="/admin/kcet/materials/new">
          <Button className="gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">
            <Plus className="h-4 w-4" />
            <span>Add KCET Material</span>
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative flex items-center">
          <Search className="h-4 w-4 text-slate-400 absolute left-3" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, chapter, year..."
            className="pl-9"
          />
        </div>

        <select
          value={filterSub}
          onChange={(e) => setFilterSub(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Subjects</option>
          {(subjects || []).map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>

        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All Categories</option>
          {(categories || []).map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading KCET resources...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <p className="text-sm font-semibold text-[#0f172a] dark:text-white">No KCET materials found</p>
            <p className="text-xs text-[#64748b] dark:text-[#94A3B8]">
              Add your first KCET material or adjust search filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f1f5f9] dark:divide-[#293548]">
            {filtered.map((m, idx) => (
              <div key={m.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 hover:bg-[#f8fafc] dark:hover:bg-[#1C2638]/40 transition-colors">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge className="bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-0 text-[10px]">
                      {m.subject}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {m.category}
                    </Badge>
                    {m.year && (
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {m.year}
                      </Badge>
                    )}
                    {!m.isVisible && (
                      <Badge variant="destructive" className="text-[10px]">Hidden</Badge>
                    )}
                    {m.isFeatured && (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-0 text-[10px]">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-[#0f172a] dark:text-white truncate">{m.title}</h3>
                  <p className="text-xs text-[#64748b] dark:text-[#94A3B8] truncate">
                    {m.chapter ? `Chapter: ${m.chapter} • ` : ""}
                    {m.downloadCount} downloads
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveMaterial(idx, -1)} title="Move Up">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveMaterial(idx, 1)} title="Move Down">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFeatured(m.id, m.isFeatured)} title="Toggle Featured">
                    <Star className={`h-3.5 w-3.5 ${m.isFeatured ? "fill-amber-400 text-amber-400" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleVisible(m.id, m.isVisible)} title="Toggle Visibility">
                    {m.isVisible ? <Eye className="h-3.5 w-3.5 text-emerald-500" /> : <EyeOff className="h-3.5 w-3.5 text-slate-400" />}
                  </Button>
                  <a href={getKcetViewUrl(m.id)} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Open PDF">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                  <Link href={`/admin/kcet/materials/${m.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600" onClick={() => handleDelete(m.id, m.title)} title="Delete">
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
