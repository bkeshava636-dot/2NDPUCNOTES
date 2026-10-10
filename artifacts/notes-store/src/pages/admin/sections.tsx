import { useState } from "react";
import { 
  useAdminListSections, 
  useAdminCreateSection, 
  useAdminUpdateSection, 
  useAdminDeleteSection, 
  useAdminReorderSections, 
  getAdminListSectionsQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, GripVertical, FolderTree, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type SectionForm = { name: string; description: string; officialSourceUrl: string; isVisible: boolean };

const STANDARD_CATEGORIES = [
  { name: "Computer Science", description: "2nd PUC Computer Science notes, programs, question banks, and practicals" },
  { name: "English", description: "2nd PUC English literature notes, summaries, grammar, and model answers" },
  { name: "Hindi", description: "Sahitya, kavita, nibandh, and grammar notes for 2nd PUC Hindi" },
  { name: "Kannada", description: "Kannada sahitya, gadya, padya, and grammar study materials" },
  { name: "Sanskrit", description: "Sanskrit slokas, vyakarana, translation, and chapter notes" },
];

export default function AdminSections() {
  const { data: sections, isLoading, isError, error, isFetching, refetch } = useAdminListSections({
    query: {
      queryKey: getAdminListSectionsQueryKey(),
      retry: 1,
    },
  });
  const createSection = useAdminCreateSection();
  const updateSection = useAdminUpdateSection();
  const deleteSection = useAdminDeleteSection();
  const reorderSections = useAdminReorderSections();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<SectionForm>({ name: "", description: "", officialSourceUrl: "", isVisible: true });
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  function openCreate(prefill?: { name: string; description?: string }) {
    setEditId(null);
    setForm({ name: prefill?.name || "", description: prefill?.description || "", officialSourceUrl: "", isVisible: true });
    setShowDialog(true);
  }

  function openEdit(s: any) {
    setEditId(s.id);
    setForm({ name: s.name, description: s.description || "", officialSourceUrl: s.officialSourceUrl || "", isVisible: s.isVisible });
    setShowDialog(true);
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getAdminListSectionsQueryKey() });
  }

  function handleSave() {
    if (!form.name.trim()) return;
    if (editId) {
      updateSection.mutate(
        { 
          id: editId, 
          data: { 
            name: form.name.trim(), 
            description: form.description?.trim() || null, 
            officialSourceUrl: form.officialSourceUrl?.trim() || null,
            isVisible: form.isVisible 
          } 
        },
        {
          onSuccess: () => { 
            toast({ title: "Category updated successfully" }); 
            setShowDialog(false); 
            invalidate(); 
          },
          onError: () => toast({ title: "Error", description: "Failed to update category", variant: "destructive" }),
        }
      );
    } else {
      createSection.mutate(
        { 
          data: { 
            name: form.name.trim(), 
            description: form.description?.trim() || undefined, 
            officialSourceUrl: form.officialSourceUrl?.trim() || undefined,
            isVisible: form.isVisible 
          } 
        },
        {
          onSuccess: () => { 
            toast({ title: "Category created successfully" }); 
            setShowDialog(false); 
            invalidate(); 
          },
          onError: () => toast({ title: "Error", description: "Failed to create category", variant: "destructive" }),
        }
      );
    }
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteSection.mutate(
      { id: deleteId },
      {
        onSuccess: () => { 
          toast({ title: "Category deleted" }); 
          setDeleteId(null); 
          invalidate(); 
        },
        onError: () => { 
          toast({ title: "Error", description: "Failed to delete category", variant: "destructive" }); 
          setDeleteId(null); 
        },
      }
    );
  }

  function handleToggleVisible(id: number, current: boolean) {
    updateSection.mutate(
      { id, data: { isVisible: !current } },
      {
        onSuccess: () => {
          toast({ title: current ? "Category hidden from store" : "Category visible on store" });
          invalidate();
        },
      }
    );
  }

  function handleDragStart(id: number) { setDraggingId(id); }
  function handleDragOver(e: React.DragEvent, id: number) { e.preventDefault(); setDragOverId(id); }
  function handleDrop() {
    if (!draggingId || !dragOverId || draggingId === dragOverId || !sections) return;
    const ids = sections.map(s => s.id);
    const fromIdx = ids.indexOf(draggingId);
    const toIdx = ids.indexOf(dragOverId);
    const newIds = [...ids];
    newIds.splice(fromIdx, 1);
    newIds.splice(toIdx, 0, draggingId);
    reorderSections.mutate({ data: { ids: newIds } }, { 
      onSuccess: () => {
        toast({ title: "Categories reordered" });
        invalidate();
      }
    });
    setDraggingId(null);
    setDragOverId(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">Categories & Subjects</h1>
            <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">
              Organize syllabus streams, languages, and custom resource collections
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
            <FolderTree className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[#112542]">Failed to load categories</h3>
          <p className="text-xs text-[#64748b] mt-1 mb-5">
            {(error as any)?.message || "A network or database error occurred while retrieving categories."}
          </p>
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 text-xs bg-[#2f74de] hover:bg-[#1f63c8] text-white"
          >
            <Loader2 className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Retry Connection</span>
          </Button>
        </div>
      </div>
    );
  }

  const isSaving = createSection.isPending || updateSection.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">Categories & Sections</h1>
          <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">
            Organize study materials into subjects and homepage branches (drag rows to reorder)
          </p>
        </div>
        <Button 
          onClick={() => openCreate()} 
          className="h-9 gap-1.5 text-xs font-semibold bg-[#2f74de] hover:bg-[#1f63c8] text-white shadow-none transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </Button>
      </div>

      {/* Suggested Standard Categories Quick Add */}
      {(() => {
        const existingNames = new Set((sections || []).map(s => s.name.toLowerCase()));
        const missing = STANDARD_CATEGORIES.filter(c => !existingNames.has(c.name.toLowerCase()));
        if (missing.length === 0) return null;
        return (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs text-[#5a6b82]">
            <span className="font-semibold text-[#112542]">Quick Add Standard Categories:</span>
            {missing.map(cat => (
              <Button
                key={cat.name}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1 bg-white border-[#dce8fa] text-[#1856b8] hover:bg-[#ebf3ff]"
                onClick={() => openCreate(cat)}
              >
                <Plus className="h-3 w-3" />
                <span>Add {cat.name}</span>
              </Button>
            ))}
          </div>
        );
      })()}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-none">
        <Table>
          <TableHeader className="bg-[#f8fafc]">
            <TableRow className="border-[#eef2f6] hover:bg-transparent">
              <TableHead className="w-10 pl-4"></TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3">Category Name</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3">Description</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3 text-center">Resources</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3 text-center">Visible</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3 pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-[#64748b] text-xs">
                  <FolderTree className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
                  No categories created yet. Click "New Category" to get started.
                </TableCell>
              </TableRow>
            ) : (
              sections?.map(s => (
                <TableRow
                  key={s.id}
                  draggable
                  onDragStart={() => handleDragStart(s.id)}
                  onDragOver={(e) => handleDragOver(e, s.id)}
                  onDrop={handleDrop}
                  className={`border-[#eef2f6] cursor-grab active:cursor-grabbing transition-colors ${
                    dragOverId === s.id ? "bg-[#ebf3ff]" : "hover:bg-[#f8fafc]/60"
                  }`}
                >
                  <TableCell className="pl-4 py-3.5">
                    <GripVertical className="h-4 w-4 text-[#cbd5e1] hover:text-[#64748b]" />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="font-bold text-xs text-[#112542]">{s.name}</div>
                    <div className="text-[10px] text-[#94a3b8] font-mono mt-0.5">{s.slug}</div>
                  </TableCell>
                  <TableCell className="py-3.5 text-xs text-[#64748b] max-w-[260px] truncate">
                    {s.description || "—"}
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
                      {s.cardCount ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    <Switch 
                      checked={s.isVisible} 
                      onCheckedChange={() => handleToggleVisible(s.id, s.isVisible)} 
                      aria-label="Toggle visibility"
                    />
                  </TableCell>
                  <TableCell className="pr-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-[#64748b] hover:text-[#1856b8] hover:bg-[#ebf3ff]" 
                        onClick={() => openEdit(s)}
                        title="Edit Category"
                        aria-label="Edit Category"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-[#64748b] hover:text-red-600 hover:bg-red-50" 
                        onClick={() => setDeleteId(s.id)}
                        title="Delete Category"
                        aria-label="Delete Category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Category Cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {sections?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#e2e8f0] p-6 text-[#64748b] text-xs">
            <FolderTree className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
            No categories created yet.
          </div>
        ) : (
          sections?.map((s) => (
            <div key={s.id} className="bg-white border border-[#e2e8f0] rounded-xl p-4 space-y-3 shadow-none">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#112542]">{s.name}</h3>
                  <p className="text-[11px] text-[#64748b] mt-0.5">{s.description || "No description"}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
                  {s.cardCount ?? 0} items
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#eef2f6]">
                <div className="flex items-center gap-2">
                  <Switch checked={s.isVisible} onCheckedChange={() => handleToggleVisible(s.id, s.isVisible)} />
                  <span className="text-xs text-[#64748b]">{s.isVisible ? "Visible" : "Hidden"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs border-[#e2e8f0] text-[#112542]" onClick={() => openEdit(s)}>
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50" onClick={() => setDeleteId(s.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="border-[#e2e8f0] rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#112542]">
              {editId ? "Edit Category" : "New Category"}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748b]">
              Categories group notes by subjects or academic themes on the store
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#334155]">Category Name *</Label>
              <Input 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                placeholder="e.g. Physics, Mathematics, Model Papers" 
                className="h-9 text-xs sm:text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#334155]">Description (Optional)</Label>
              <Input 
                value={form.description} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                placeholder="Short tagline or student guidance..." 
                className="h-9 text-xs sm:text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#334155]">Official Source URL (Optional)</Label>
              <Input 
                value={form.officialSourceUrl} 
                onChange={e => setForm(f => ({ ...f, officialSourceUrl: e.target.value }))} 
                placeholder="https://kseab.karnataka.gov.in/..." 
                className="h-9 text-xs sm:text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] border border-[#eef2f6]">
              <div>
                <Label className="text-xs font-semibold text-[#112542] block">Visible on Storefront</Label>
                <p className="text-[11px] text-[#64748b]">Students will see this section on the homepage</p>
              </div>
              <Switch checked={form.isVisible} onCheckedChange={v => setForm(f => ({ ...f, isVisible: v }))} />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" size="sm" className="h-9 text-xs border-[#e2e8f0]" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleSave} 
              disabled={!form.name.trim() || isSaving}
              className="h-9 text-xs font-semibold bg-[#2f74de] hover:bg-[#1f63c8] text-white shadow-none"
            >
              {isSaving ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </span>
              ) : editId ? (
                "Save Changes"
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent className="border-[#e2e8f0] rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-[#112542]">
              Delete this Category?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#64748b] leading-relaxed">
              This will remove the category from the store. Study resources within this category will NOT be deleted, but will become unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs h-9 border-[#e2e8f0]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="text-xs h-9 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
