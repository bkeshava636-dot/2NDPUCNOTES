import { useState, useMemo } from "react";
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
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  FolderTree, 
  Eye, 
  EyeOff, 
  Loader2, 
  ExternalLink,
  Link2,
  Sparkles,
  BookOpen,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type SectionForm = { name: string; description: string; officialSourceUrl: string; isVisible: boolean };

const STANDARD_CURRICULUM_SUBJECTS = [
  { name: "Physics", slug: "physics", description: "Comprehensive 2nd PUC Physics notes, derivations, and question banks" },
  { name: "Chemistry", slug: "chemistry", description: "Organic, inorganic, and physical chemistry notes and reactions" },
  { name: "Computer Science", slug: "computer-science", description: "2nd PUC Computer Science notes, programs, question banks, and practicals" },
  { name: "Biology", slug: "biology", description: "Botany and zoology diagrams, summaries, and key concepts" },
  { name: "Mathematics", slug: "mathematics", description: "Calculus, vectors, probability, and algebra solutions" },
  { name: "English", slug: "english", description: "2nd PUC English literature notes, summaries, grammar, and model answers" },
  { name: "Hindi", slug: "hindi", description: "Sahitya, kavita, nibandh, and grammar notes for 2nd PUC Hindi" },
  { name: "Kannada", slug: "kannada", description: "Kannada sahitya, gadya, padya, and grammar study materials" },
  { name: "Sanskrit", slug: "sanskrit", description: "Sanskrit slokas, vyakarana, translation, and chapter notes" },
];

const STANDARD_RESOURCE_CATEGORIES = [
  { 
    name: "Model Question Papers (MQP)", 
    slug: "mqp", 
    description: "Official Karnataka Board model question papers and blueprint-based sample tests with answer keys",
    officialSourceUrl: "https://kseab.karnataka.gov.in/"
  },
  { 
    name: "Multiple Choice Questions (MCQ)", 
    slug: "mcq", 
    description: "Chapterwise multiple choice questions, assertion-reasoning, and objective practice sets",
    officialSourceUrl: ""
  },
  { 
    name: "Question Bank", 
    slug: "question-bank", 
    description: "Curated question banks, important derivations, repeated board questions, and model answers",
    officialSourceUrl: "https://kseab.karnataka.gov.in/"
  },
  { 
    name: "Practical", 
    slug: "practical", 
    description: "Practical marking schemes, lab manuals, viva questions, and procedural guides for Core Science subjects",
    officialSourceUrl: ""
  },
  { 
    name: "Previous Year Question Papers (PYQs)", 
    slug: "pyq", 
    description: "Past Karnataka 2nd PUC examination question papers categorized by Midterm, Preparatory, and Annual exams",
    officialSourceUrl: ""
  },
  { 
    name: "Passing Package", 
    slug: "passing-package", 
    description: "High-yield guaranteed scoring questions and simplified notes tailored for scoring passing and first-class marks",
    officialSourceUrl: ""
  },
  { 
    name: "Publication Books", 
    slug: "publication-books", 
    description: "Reference material, workbook guides, and renowned publisher study packages",
    officialSourceUrl: ""
  },
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

  const [activeTab, setActiveTab] = useState<"all" | "subjects" | "categories">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<SectionForm>({ name: "", description: "", officialSourceUrl: "", isVisible: true });
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  // Quick edit official link modal state
  const [quickLinkEdit, setQuickLinkEdit] = useState<{ id: number; name: string; url: string } | null>(null);
  const [isSavingQuickLink, setIsSavingQuickLink] = useState(false);

  function isCategorySection(item: any): boolean {
    const slug = (item.slug || "").toLowerCase();
    const name = (item.name || "").toLowerCase();
    return (
      slug === "mqp" || name.includes("model") ||
      slug === "mcq" || name.includes("multiple choice") ||
      slug === "question-bank" || name.includes("question bank") ||
      slug === "practical" || name.includes("practical") ||
      slug === "pyq" || name.includes("previous") ||
      slug === "passing-package" || name.includes("passing") ||
      slug === "publication-books" || name.includes("publication")
    );
  }

  const filteredSections = useMemo(() => {
    if (!sections) return [];
    return sections.filter((s) => {
      const isCat = isCategorySection(s);
      if (activeTab === "subjects" && isCat) return false;
      if (activeTab === "categories" && !isCat) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesDesc = (s.description || "").toLowerCase().includes(q);
        const matchesSlug = (s.slug || "").toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesSlug;
      }
      return true;
    });
  }, [sections, activeTab, searchQuery]);

  // Check which standard categories or subjects are missing from the database
  const missingCategories = useMemo(() => {
    if (!sections) return [];
    return STANDARD_RESOURCE_CATEGORIES.filter((c) => {
      return !sections.some((s) => {
        const sSlug = (s.slug || "").toLowerCase();
        const sName = (s.name || "").toLowerCase();
        const cSlug = c.slug.toLowerCase();
        const cName = c.name.toLowerCase();
        return (
          sSlug === cSlug ||
          sName === cName ||
          (cSlug === "mqp" && (sSlug.includes("mqp") || sName.includes("model"))) ||
          (cSlug === "mcq" && (sSlug.includes("mcq") || sName.includes("multiple choice"))) ||
          (cSlug === "pyq" && (sSlug.includes("pyq") || sName.includes("previous"))) ||
          (cSlug === "question-bank" && (sSlug.includes("question-bank") || sName.includes("question bank")))
        );
      });
    });
  }, [sections]);

  const missingSubjects = useMemo(() => {
    if (!sections) return [];
    const existingSlugs = new Set(sections.map((s) => (s.slug || "").toLowerCase()));
    return STANDARD_CURRICULUM_SUBJECTS.filter((s) => !existingSlugs.has(s.slug.toLowerCase()));
  }, [sections]);

  function openCreate(prefill?: { name: string; description?: string; officialSourceUrl?: string }) {
    setEditId(null);
    setForm({ 
      name: prefill?.name || "", 
      description: prefill?.description || "", 
      officialSourceUrl: prefill?.officialSourceUrl || "", 
      isVisible: true 
    });
    setShowDialog(true);
  }

  function openEdit(s: any) {
    setEditId(s.id);
    setForm({ 
      name: s.name, 
      description: s.description || "", 
      officialSourceUrl: s.officialSourceUrl || "", 
      isVisible: s.isVisible 
    });
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
            toast({ title: "Section updated successfully" }); 
            setShowDialog(false); 
            invalidate(); 
          },
          onError: () => toast({ title: "Error", description: "Failed to update section", variant: "destructive" }),
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
            toast({ title: "Section created successfully" }); 
            setShowDialog(false); 
            invalidate(); 
          },
          onError: () => toast({ title: "Error", description: "Failed to create section", variant: "destructive" }),
        }
      );
    }
  }

  function handleQuickSaveOfficialLink() {
    if (!quickLinkEdit) return;
    setIsSavingQuickLink(true);
    updateSection.mutate(
      {
        id: quickLinkEdit.id,
        data: {
          officialSourceUrl: quickLinkEdit.url.trim() || null,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: quickLinkEdit.url.trim() ? "Official link saved" : "Official link cleared",
            description: `Updated official link for ${quickLinkEdit.name}`,
          });
          setQuickLinkEdit(null);
          setIsSavingQuickLink(false);
          invalidate();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to update official link", variant: "destructive" });
          setIsSavingQuickLink(false);
        },
      }
    );
  }

  function handleSeedItem(item: { name: string; description?: string; officialSourceUrl?: string }) {
    createSection.mutate(
      {
        data: {
          name: item.name,
          description: item.description,
          officialSourceUrl: item.officialSourceUrl,
          isVisible: true,
        },
      },
      {
        onSuccess: () => {
          toast({ title: `Added "${item.name}" to store` });
          invalidate();
        },
        onError: () => toast({ title: "Error", description: "Failed to create section", variant: "destructive" }),
      }
    );
  }

  function handleSeedAllCategories() {
    missingCategories.forEach((cat) => {
      handleSeedItem(cat);
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteSection.mutate(
      { id: deleteId },
      {
        onSuccess: () => { 
          toast({ title: "Section deleted" }); 
          setDeleteId(null); 
          invalidate(); 
        },
        onError: () => toast({ title: "Error", description: "Failed to delete section", variant: "destructive" }),
      }
    );
  }

  function handleDragStart(id: number) {
    setDraggingId(id);
  }

  function handleDragOver(e: React.DragEvent, id: number) {
    e.preventDefault();
    setDragOverId(id);
  }

  function handleDrop(targetId: number) {
    if (draggingId === null || draggingId === targetId || !sections) return;
    const ids = sections.map((s) => s.id);
    const fromIdx = ids.indexOf(draggingId);
    const toIdx = ids.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const reordered = [...ids];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    reorderSections.mutate(
      { data: { ids: reordered } },
      {
        onSuccess: () => { invalidate(); },
        onError: () => toast({ title: "Error", description: "Failed to reorder sections", variant: "destructive" }),
      }
    );
    setDraggingId(null);
    setDragOverId(null);
  }

  const subjectCount = sections?.filter((s) => !isCategorySection(s)).length ?? 0;
  const categoryCount = sections?.filter((s) => isCategorySection(s)).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">
            Subjects & Categories
          </h1>
          <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">
            Configure curriculum subjects, resource categories, official government links, and display order
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5 text-xs text-[#5a6b82] border-[#e2e8f0]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-[#1856b8]" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button 
            onClick={() => openCreate()} 
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold bg-[#1856b8] hover:bg-[#124494] text-white shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        </div>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e2e8f0] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f1f5f9] rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-white text-[#112542] shadow-2xs"
                : "text-[#64748b] hover:text-[#112542]"
            }`}
          >
            All Items ({sections?.length ?? 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subjects")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "subjects"
                ? "bg-white text-[#1856b8] shadow-2xs"
                : "text-[#64748b] hover:text-[#112542]"
            }`}
          >
            Curriculum Subjects ({subjectCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "categories"
                ? "bg-white text-[#0284c7] shadow-2xs"
                : "text-[#64748b] hover:text-[#112542]"
            }`}
          >
            Browse by Category ({categoryCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items or links..."
            className="pl-9 h-8 text-xs bg-[#f8fafc] border-[#e2e8f0]"
          />
        </div>
      </div>

      {/* Missing Categories Quick Seed Alert */}
      {missingCategories.length > 0 && (
        <div className="p-4 rounded-xl border border-sky-200 bg-sky-50 text-sky-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-[#0284c7] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#0369a1]">
                {missingCategories.length} "Browse by Category" types not yet in database
              </p>
              <p className="text-[11px] text-[#0284c7] mt-0.5">
                Enable them so you can configure their descriptions and official source links:{" "}
                <span className="font-semibold">{missingCategories.map((c) => c.name).join(", ")}</span>
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleSeedAllCategories}
            className="h-8 text-xs bg-[#0284c7] hover:bg-[#0369a1] text-white shrink-0 shadow-2xs"
          >
            Seed Missing Categories
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[#112542]">Failed to load categories</h3>
          <p className="text-xs text-[#64748b] mt-1 mb-5">
            {(error as any)?.message || "A network or server error occurred."}
          </p>
          <Button onClick={() => refetch()} className="gap-2 text-xs bg-[#1856b8] text-white">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : (
        /* Data Table */
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-2xs">
          <Table>
            <TableHeader className="bg-[#f8fafc]/80 border-b border-[#e2e8f0]">
              <TableRow>
                <TableHead className="w-10 pl-4"></TableHead>
                <TableHead className="text-xs font-semibold text-[#64748b] py-3">Type & Name</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748b] py-3">Slug & Target</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748b] py-3">Official Source Link</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748b] py-3 text-center">Resources</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748b] py-3 text-center">Visibility</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748b] py-3 pr-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-[#64748b] text-xs">
                    <FolderTree className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
                    No items matched your filter or search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSections.map((sec) => {
                  const isCat = isCategorySection(sec);
                  const isDragging = draggingId === sec.id;
                  const isOver = dragOverId === sec.id;
                  const livePath = isCat ? `/category/${sec.slug}` : `/subject/${sec.slug}`;

                  return (
                    <TableRow
                      key={sec.id}
                      draggable
                      onDragStart={() => handleDragStart(sec.id)}
                      onDragOver={(e) => handleDragOver(e, sec.id)}
                      onDrop={() => handleDrop(sec.id)}
                      className={`border-[#eef2f6] transition-colors ${
                        isDragging ? "opacity-30 bg-[#f8fafc]" : isOver ? "bg-[#ebf3ff]/40" : "hover:bg-[#f8fafc]/60"
                      }`}
                    >
                      {/* Drag Handle */}
                      <TableCell className="pl-4 py-3.5">
                        <GripVertical className="h-4 w-4 text-[#94a3b8] cursor-grab active:cursor-grabbing hover:text-[#112542]" />
                      </TableCell>

                      {/* Name & Description */}
                      <TableCell className="py-3.5">
                        <div className="flex items-start gap-2.5">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isCat 
                              ? "bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd]"
                              : "bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa]"
                          }`}>
                            {isCat ? <Layers className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 max-w-[260px]">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-xs text-[#112542]">{sec.name}</p>
                              <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                                isCat
                                  ? "bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd]"
                                  : "bg-[#f5f3ff] text-[#6d28d9] border border-[#ede9fe]"
                              }`}>
                                {isCat ? "Category" : "Subject"}
                              </span>
                            </div>
                            {sec.description && (
                              <p className="text-[11px] text-[#64748b] truncate mt-0.5" title={sec.description}>
                                {sec.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Slug & Target */}
                      <TableCell className="py-3.5">
                        <div className="font-mono text-[11px] text-[#5a6b82] flex items-center gap-1">
                          <span>{sec.slug}</span>
                          <a
                            href={livePath}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1856b8] hover:text-[#124494] p-0.5 rounded hover:bg-[#ebf3ff]"
                            title={`Open live page: ${livePath}`}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </TableCell>

                      {/* Official Source Link */}
                      <TableCell className="py-3.5">
                        {sec.officialSourceUrl ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={sec.officialSourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0284c7] bg-[#e0f2fe] border border-[#bae6fd] px-2 py-0.5 rounded hover:bg-[#bae6fd] transition-colors truncate max-w-[170px]"
                              title={sec.officialSourceUrl}
                            >
                              <Link2 className="h-3 w-3 shrink-0" />
                              <span className="truncate">{sec.officialSourceUrl.replace(/^https?:\/\//, "")}</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => setQuickLinkEdit({ id: sec.id, name: sec.name, url: sec.officialSourceUrl || "" })}
                              className="p-1 text-[#64748b] hover:text-[#0284c7] rounded hover:bg-[#f1f5f9]"
                              title="Edit Official Link"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setQuickLinkEdit({ id: sec.id, name: sec.name, url: "" })}
                            className="inline-flex items-center gap-1 text-[10px] text-[#94a3b8] hover:text-[#0284c7] border border-dashed border-[#cbd5e1] hover:border-[#0284c7] px-2 py-0.5 rounded transition-colors"
                          >
                            <Plus className="h-2.5 w-2.5" />
                            <span>Add Official Link</span>
                          </button>
                        )}
                      </TableCell>

                      {/* Resource Count */}
                      <TableCell className="py-3.5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f1f5f9] text-[#475569]">
                          {sec.cardCount} resources
                        </span>
                      </TableCell>

                      {/* Visibility Toggle */}
                      <TableCell className="py-3.5 text-center">
                        <Switch
                          checked={sec.isVisible}
                          onCheckedChange={(checked) => {
                            updateSection.mutate(
                              { id: sec.id, data: { isVisible: checked } },
                              { onSuccess: () => invalidate() }
                            );
                          }}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-[#64748b] hover:text-[#1856b8] hover:bg-[#ebf3ff]"
                            onClick={() => openEdit(sec)}
                            title="Edit Details"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-[#64748b] hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteId(sec.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Quick Edit Official Link Dialog */}
      <Dialog open={!!quickLinkEdit} onOpenChange={(open) => !open && setQuickLinkEdit(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#112542] flex items-center gap-2">
              <Link2 className="h-4 w-4 text-[#0284c7]" />
              Official Source Link
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748b]">
              Attach or change the official Karnataka Board (KSEAB) or government source link for{" "}
              <strong className="text-[#112542]">{quickLinkEdit?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#112542]">Government / Department Source URL</Label>
              <Input
                placeholder="https://kseab.karnataka.gov.in/..."
                value={quickLinkEdit?.url || ""}
                onChange={(e) => quickLinkEdit && setQuickLinkEdit({ ...quickLinkEdit, url: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
            <p className="text-[11px] text-[#64748b]">
              Students viewing this category/subject will see a verified badge pointing directly to this official resource link.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickLinkEdit(null)}
              disabled={isSavingQuickLink}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleQuickSaveOfficialLink}
              disabled={isSavingQuickLink}
              className="text-xs bg-[#0284c7] hover:bg-[#0369a1] text-white"
            >
              {isSavingQuickLink ? "Saving..." : "Save Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Section Modal */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#112542]">
              {editId ? "Edit Section / Category" : "Add New Subject or Category"}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748b]">
              Configure taxonomy item, description, and official verification source
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#112542]">Name *</Label>
              <Input
                placeholder="e.g. Model Question Papers (MQP) or Physics"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#112542]">Description</Label>
              <Input
                placeholder="Short description for students browsing this section..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#112542]">Official Source Link (URL)</Label>
              <Input
                placeholder="https://kseab.karnataka.gov.in/..."
                value={form.officialSourceUrl}
                onChange={(e) => setForm({ ...form, officialSourceUrl: e.target.value })}
                className="h-9 text-xs"
              />
              <p className="text-[10px] text-[#64748b]">
                Optional URL linking to official department question bank or board blueprint
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
              <div>
                <p className="text-xs font-semibold text-[#112542]">Storefront Visibility</p>
                <p className="text-[10px] text-[#64748b]">Show in navigation and student browse menus</p>
              </div>
              <Switch
                checked={form.isVisible}
                onCheckedChange={(checked) => setForm({ ...form, isVisible: checked })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDialog(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="text-xs bg-[#1856b8] hover:bg-[#124494] text-white"
            >
              {editId ? "Update Item" : "Create Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base text-[#112542]">Delete section?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#64748b]">
              This will remove this taxonomy section from the store. Any study resources currently linked will remain intact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="text-xs bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
