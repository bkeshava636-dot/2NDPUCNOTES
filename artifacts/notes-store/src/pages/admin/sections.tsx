import { useState } from "react";
import { useAdminListSections, useAdminCreateSection, useAdminUpdateSection, useAdminDeleteSection, useAdminReorderSections, getAdminListSectionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SectionForm = { name: string; description: string; isVisible: boolean };

export default function AdminSections() {
  const { data: sections, isLoading } = useAdminListSections();
  const createSection = useAdminCreateSection();
  const updateSection = useAdminUpdateSection();
  const deleteSection = useAdminDeleteSection();
  const reorderSections = useAdminReorderSections();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<SectionForm>({ name: "", description: "", isVisible: true });
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  function openCreate() {
    setEditId(null);
    setForm({ name: "", description: "", isVisible: true });
    setShowDialog(true);
  }

  function openEdit(s: any) {
    setEditId(s.id);
    setForm({ name: s.name, description: s.description || "", isVisible: s.isVisible });
    setShowDialog(true);
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getAdminListSectionsQueryKey() });
  }

  function handleSave() {
    if (!form.name.trim()) return;
    if (editId) {
      updateSection.mutate({ id: editId, data: { name: form.name, description: form.description || null, isVisible: form.isVisible } }, {
        onSuccess: () => { toast({ title: "Section updated" }); setShowDialog(false); invalidate(); },
        onError: () => toast({ title: "Error", description: "Failed to update", variant: "destructive" }),
      });
    } else {
      createSection.mutate({ data: { name: form.name, description: form.description, isVisible: form.isVisible } }, {
        onSuccess: () => { toast({ title: "Section created" }); setShowDialog(false); invalidate(); },
        onError: () => toast({ title: "Error", description: "Failed to create", variant: "destructive" }),
      });
    }
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteSection.mutate({ id: deleteId }, {
      onSuccess: () => { toast({ title: "Section deleted" }); setDeleteId(null); invalidate(); },
      onError: () => { toast({ title: "Error", description: "Failed to delete", variant: "destructive" }); setDeleteId(null); },
    });
  }

  function handleToggleVisible(id: number, current: boolean) {
    updateSection.mutate({ id, data: { isVisible: !current } }, {
      onSuccess: () => invalidate(),
    });
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
    reorderSections.mutate({ data: { ids: newIds } }, { onSuccess: () => invalidate() });
    setDraggingId(null);
    setDragOverId(null);
  }

  if (isLoading) return <div className="text-center py-8 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sections</h1>
          <p className="text-gray-500">Manage store sections (drag to reorder)</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> New Section</Button>
      </div>

      <div className="bg-white rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Cards</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No sections yet.</TableCell></TableRow>
            ) : sections?.map(s => (
              <TableRow
                key={s.id}
                draggable
                onDragStart={() => handleDragStart(s.id)}
                onDragOver={(e) => handleDragOver(e, s.id)}
                onDrop={handleDrop}
                className={`cursor-grab ${dragOverId === s.id ? "bg-blue-50" : ""}`}
              >
                <TableCell><GripVertical className="h-4 w-4 text-gray-300" /></TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-gray-500 max-w-[200px] truncate">{s.description || "—"}</TableCell>
                <TableCell><Badge variant="secondary">{s.cardCount}</Badge></TableCell>
                <TableCell>
                  <Switch checked={s.isVisible} onCheckedChange={() => handleToggleVisible(s.id, s.isVisible)} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(s.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Section" : "New Section"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Physics" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isVisible} onCheckedChange={v => setForm(f => ({ ...f, isVisible: v }))} />
              <Label>Visible on store</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || createSection.isPending || updateSection.isPending}>
              {editId ? "Save Changes" : "Create Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this section?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the section. Cards inside it will not be deleted but will become orphaned.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
