import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminKcetSubjects,
  createKcetSubject,
  updateKcetSubject,
  deleteKcetSubject,
  reorderKcetSubjects,
  fetchAdminKcetCategories,
  createKcetCategory,
  updateKcetCategory,
  deleteKcetCategory,
  reorderKcetCategories,
  KcetSubject,
  KcetCategory,
} from "@/lib/kcet-api";
import {
  KcetDynamicIcon,
  KCET_ICON_OPTIONS,
  KCET_GRADIENT_OPTIONS,
} from "@/components/kcet/kcet-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  FolderTree,
  Layers,
  Loader2,
} from "lucide-react";

export default function KcetAdminTaxonomy() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: subjects, isLoading: subLoading } = useQuery({
    queryKey: ["admin-kcet-subjects"],
    queryFn: fetchAdminKcetSubjects,
  });

  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ["admin-kcet-categories"],
    queryFn: fetchAdminKcetCategories,
  });

  // Subject dialog state
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<KcetSubject | null>(null);
  const [subName, setSubName] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subIcon, setSubIcon] = useState("Atom");
  const [subGradient, setSubGradient] = useState(KCET_GRADIENT_OPTIONS[0].value);
  const [subVisible, setSubVisible] = useState(true);
  const [subSaving, setSubSaving] = useState(false);

  // Category dialog state
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<KcetCategory | null>(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catIcon, setCatIcon] = useState("FileText");
  const [catVisible, setCatVisible] = useState(true);
  const [catSaving, setCatSaving] = useState(false);

  const openAddSubject = () => {
    setEditingSub(null);
    setSubName("");
    setSubDesc("");
    setSubIcon("Atom");
    setSubGradient(KCET_GRADIENT_OPTIONS[0].value);
    setSubVisible(true);
    setSubModalOpen(true);
  };

  const openEditSubject = (s: KcetSubject) => {
    setEditingSub(s);
    setSubName(s.name);
    setSubDesc(s.description || "");
    setSubIcon(s.iconName || "Atom");
    setSubGradient(s.gradient || KCET_GRADIENT_OPTIONS[0].value);
    setSubVisible(s.isVisible);
    setSubModalOpen(true);
  };

  const handleSaveSubject = async () => {
    if (!subName.trim()) return;
    setSubSaving(true);
    try {
      if (editingSub) {
        await updateKcetSubject(editingSub.id, {
          name: subName.trim(),
          description: subDesc.trim(),
          iconName: subIcon,
          gradient: subGradient,
          isVisible: subVisible,
        });
        toast({ title: "KCET Subject Updated" });
      } else {
        await createKcetSubject({
          name: subName.trim(),
          description: subDesc.trim(),
          iconName: subIcon,
          gradient: subGradient,
          isVisible: subVisible,
          sortOrder: (subjects?.length ?? 0) + 1,
        });
        toast({ title: "KCET Subject Created" });
      }
      qc.invalidateQueries({ queryKey: ["admin-kcet-subjects"] });
      qc.invalidateQueries({ queryKey: ["kcet-subjects"] });
      setSubModalOpen(false);
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally {
      setSubSaving(false);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    if (!confirm("Delete this KCET Subject?")) return;
    try {
      await deleteKcetSubject(id);
      toast({ title: "Subject Deleted" });
      qc.invalidateQueries({ queryKey: ["admin-kcet-subjects"] });
      qc.invalidateQueries({ queryKey: ["kcet-subjects"] });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    }
  };

  const moveSubject = async (idx: number, dir: -1 | 1) => {
    if (!subjects) return;
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= subjects.length) return;
    const copy = [...subjects];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    await reorderKcetSubjects(copy.map((s) => s.id));
    qc.invalidateQueries({ queryKey: ["admin-kcet-subjects"] });
    qc.invalidateQueries({ queryKey: ["kcet-subjects"] });
  };

  // Category Handlers
  const openAddCategory = () => {
    setEditingCat(null);
    setCatName("");
    setCatDesc("");
    setCatIcon("FileText");
    setCatVisible(true);
    setCatModalOpen(true);
  };

  const openEditCategory = (c: KcetCategory) => {
    setEditingCat(c);
    setCatName(c.name);
    setCatDesc(c.description || "");
    setCatIcon(c.iconName || "FileText");
    setCatVisible(c.isVisible);
    setCatModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!catName.trim()) return;
    setCatSaving(true);
    try {
      if (editingCat) {
        await updateKcetCategory(editingCat.id, {
          name: catName.trim(),
          description: catDesc.trim(),
          iconName: catIcon,
          isVisible: catVisible,
        });
        toast({ title: "KCET Category Updated" });
      } else {
        await createKcetCategory({
          name: catName.trim(),
          description: catDesc.trim(),
          iconName: catIcon,
          isVisible: catVisible,
          sortOrder: (categories?.length ?? 0) + 1,
        });
        toast({ title: "KCET Category Created" });
      }
      qc.invalidateQueries({ queryKey: ["admin-kcet-categories"] });
      qc.invalidateQueries({ queryKey: ["kcet-categories"] });
      setCatModalOpen(false);
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally {
      setCatSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Delete this KCET Category?")) return;
    try {
      await deleteKcetCategory(id);
      toast({ title: "Category Deleted" });
      qc.invalidateQueries({ queryKey: ["admin-kcet-categories"] });
      qc.invalidateQueries({ queryKey: ["kcet-categories"] });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    }
  };

  const moveCategory = async (idx: number, dir: -1 | 1) => {
    if (!categories) return;
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= categories.length) return;
    const copy = [...categories];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    await reorderKcetCategories(copy.map((c) => c.id));
    qc.invalidateQueries({ queryKey: ["admin-kcet-categories"] });
    qc.invalidateQueries({ queryKey: ["kcet-categories"] });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] dark:text-white">
          KCET Subjects &amp; Categories
        </h1>
        <p className="text-xs text-[#64748b] dark:text-[#A1AEC2] mt-1">
          Add, edit, delete, or reorder KCET subjects and material categories dynamically without affecting 2nd PUC.
        </p>
      </div>

      {/* 1. KCET Subjects Section */}
      <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="font-bold text-base text-[#0f172a] dark:text-white">KCET Subjects</h2>
          </div>
          <Button size="sm" onClick={openAddSubject} className="gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white">
            <Plus className="h-4 w-4" />
            <span>Add Subject</span>
          </Button>
        </div>

        {subLoading ? (
          <p className="text-xs text-slate-400">Loading subjects...</p>
        ) : (
          <div className="divide-y divide-[#f1f5f9] dark:divide-[#293548]">
            {(subjects || []).map((s, idx) => (
              <div key={s.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center shrink-0`}>
                    <KcetDynamicIcon name={s.iconName} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0f172a] dark:text-white">{s.name}</span>
                      {!s.isVisible && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                    </div>
                    <p className="text-xs text-[#64748b] dark:text-[#94A3B8] truncate">{s.description || "No description"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={idx === 0} onClick={() => moveSubject(idx, -1)}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={idx === (subjects?.length ?? 0) - 1} onClick={() => moveSubject(idx, 1)}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditSubject(s)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600" onClick={() => handleDeleteSubject(s.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. KCET Categories Section */}
      <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <h2 className="font-bold text-base text-[#0f172a] dark:text-white">KCET Material Categories</h2>
          </div>
          <Button size="sm" onClick={openAddCategory} className="gap-1.5 bg-violet-600 hover:bg-violet-500 text-white">
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Button>
        </div>

        {catLoading ? (
          <p className="text-xs text-slate-400">Loading categories...</p>
        ) : (
          <div className="divide-y divide-[#f1f5f9] dark:divide-[#293548]">
            {(categories || []).map((c, idx) => (
              <div key={c.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-violet-50 dark:bg-[#1C2638] text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-[#293548] flex items-center justify-center shrink-0">
                    <KcetDynamicIcon name={c.iconName} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0f172a] dark:text-white">{c.name}</span>
                      {!c.isVisible && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                    </div>
                    <p className="text-xs text-[#64748b] dark:text-[#94A3B8] truncate">{c.description || "No description"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={idx === 0} onClick={() => moveCategory(idx, -1)}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={idx === (categories?.length ?? 0) - 1} onClick={() => moveCategory(idx, 1)}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditCategory(c)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600" onClick={() => handleDeleteCategory(c.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subject Modal */}
      <Dialog open={subModalOpen} onOpenChange={setSubModalOpen}>
        <DialogContent className="dark:bg-[#151D2E] dark:border-[#293548]">
          <DialogHeader>
            <DialogTitle>{editingSub ? "Edit KCET Subject" : "Add KCET Subject"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Subject Name *</Label>
              <Input value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="e.g. Physics or Kannada" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={subDesc} onChange={(e) => setSubDesc(e.target.value)} placeholder="Short summary of subject focus" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Icon</Label>
                <select
                  value={subIcon}
                  onChange={(e) => setSubIcon(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {KCET_ICON_OPTIONS.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Accent Gradient</Label>
                <select
                  value={subGradient}
                  onChange={(e) => setSubGradient(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-sm"
                >
                  {KCET_GRADIENT_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <Label>Visible in KCET Arena</Label>
              <Switch checked={subVisible} onCheckedChange={setSubVisible} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSubject} disabled={subSaving}>
              {subSaving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Save Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Modal */}
      <Dialog open={catModalOpen} onOpenChange={setCatModalOpen}>
        <DialogContent className="dark:bg-[#151D2E] dark:border-[#293548]">
          <DialogHeader>
            <DialogTitle>{editingCat ? "Edit KCET Category" : "Add KCET Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Category Name *</Label>
              <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Chapter Tests or Crash Course" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Short description of category" />
            </div>
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <select
                value={catIcon}
                onChange={(e) => setCatIcon(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-sm"
              >
                {KCET_ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between pt-1">
              <Label>Visible in KCET Arena</Label>
              <Switch checked={catVisible} onCheckedChange={setCatVisible} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory} disabled={catSaving}>
              {catSaving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
