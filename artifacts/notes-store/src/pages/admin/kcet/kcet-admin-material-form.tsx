import { useState, useEffect, useRef, FormEvent, ChangeEvent, DragEvent } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminKcetSubjects,
  fetchAdminKcetCategories,
  fetchAdminKcetMaterials,
  createKcetMaterial,
  updateKcetMaterial,
  uploadKcetPdf,
} from "@/lib/kcet-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle2, Link2 } from "lucide-react";

export default function KcetAdminMaterialForm() {
  const params = useParams<{ id?: string }>();
  const editId = params.id ? parseInt(params.id, 10) : null;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: subjects } = useQuery({
    queryKey: ["admin-kcet-subjects"],
    queryFn: fetchAdminKcetSubjects,
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-kcet-categories"],
    queryFn: fetchAdminKcetCategories,
  });

  const { data: allMaterials } = useQuery({
    queryKey: ["admin-kcet-materials"],
    queryFn: fetchAdminKcetMaterials,
    enabled: Boolean(editId),
  });

  const [subject, setSubject] = useState("Physics");
  const [category, setCategory] = useState("Notes");
  const [title, setTitle] = useState("");
  const [chapter, setChapter] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [fileSizeKb, setFileSizeKb] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (subjects && subjects.length > 0 && !editId) {
      setSubject(subjects[0].name);
    }
  }, [subjects, editId]);

  useEffect(() => {
    if (categories && categories.length > 0 && !editId) {
      setCategory(categories[0].name);
    }
  }, [categories, editId]);

  useEffect(() => {
    if (editId && allMaterials) {
      const match = allMaterials.find((m) => m.id === editId);
      if (match) {
        setSubject(match.subject);
        setCategory(match.category);
        setTitle(match.title);
        setChapter(match.chapter || "");
        setDescription(match.description || "");
        setYear(match.year ? String(match.year) : "");
        setPdfUrl(match.pdfUrl);
        setPageCount(match.pageCount ? String(match.pageCount) : "");
        setFileSizeKb(match.fileSizeKb ? String(match.fileSizeKb) : "");
        setSortOrder(String(match.sortOrder || 0));
        setIsFeatured(match.isFeatured);
        setIsVisible(match.isVisible);
      }
    }
  }, [editId, allMaterials]);

  const processPdfFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload or drop a valid PDF file.", variant: "destructive" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max PDF upload size is 50 MB.", variant: "destructive" });
      return;
    }

    setUploadingPdf(true);
    try {
      const res = await uploadKcetPdf(file);
      setPdfUrl(res.key);
      if (res.sizeKb) setFileSizeKb(String(res.sizeKb));
      if (!title.trim()) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
      toast({ title: "PDF Uploaded", description: "Stored in isolated KCET storage bucket." });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processPdfFile(file);
  };

  const handlePdfDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    const file = e.dataTransfer.files?.[0];
    if (file && !uploadingPdf) {
      await processPdfFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !pdfUrl.trim()) {
      toast({ title: "Title and PDF File/URL are required", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        subject,
        category,
        title: title.trim(),
        chapter: chapter.trim() || null,
        description: description.trim() || null,
        year: year.trim() ? parseInt(year.trim(), 10) : null,
        pdfUrl: pdfUrl.trim(),
        pageCount: pageCount.trim() ? parseInt(pageCount.trim(), 10) : null,
        fileSizeKb: fileSizeKb.trim() ? parseInt(fileSizeKb.trim(), 10) : null,
        sortOrder: sortOrder.trim() ? parseInt(sortOrder.trim(), 10) : 0,
        isFeatured,
        isVisible,
      };

      if (editId) {
        await updateKcetMaterial(editId, payload);
        toast({ title: "KCET Material Updated" });
      } else {
        await createKcetMaterial(payload);
        toast({ title: "KCET Material Published" });
      }

      qc.invalidateQueries({ queryKey: ["admin-kcet-materials"] });
      qc.invalidateQueries({ queryKey: ["admin-kcet-stats"] });
      qc.invalidateQueries({ queryKey: ["kcet-materials"] });
      qc.invalidateQueries({ queryKey: ["kcet-stats"] });
      setLocation("/admin/kcet/materials");
    } catch (err: any) {
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/kcet/materials">
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Materials</span>
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] dark:text-white">
          {editId ? "Edit KCET Material" : "Add New KCET Material"}
        </h1>
        <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">
          Stored strictly inside isolated KCET collections without touching 2nd PUC data
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] p-5 sm:p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Subject *</Label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              {(subjects || [{ name: "Physics" }, { name: "Chemistry" }, { name: "Mathematics" }, { name: "Biology" }]).map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Material Category *</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              {(categories || [
                { name: "Notes" },
                { name: "PYQs" },
                { name: "Mock Papers" },
                { name: "Syllabus" },
                { name: "Objective Books" },
                { name: "Formulas" },
              ]).map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Title *</Label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. KCET 2024 Physics Official Paper with Key & Solutions"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Chapter / Topic Name</Label>
            <Input
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="e.g. Ray Optics & Optical Instruments"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Year (Optional — especially for PYQs)</Label>
            <Input
              type="number"
              min={2000}
              max={2035}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 2024"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what's covered in this KCET PDF..."
          />
        </div>

        {/* File / PDF URL */}
        <div className="space-y-3 p-4 rounded-xl bg-[#f8fafc] dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#293548]">
          <Label className="flex items-center gap-1.5 font-bold">
            <FileText className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span>PDF File Upload (Drag &amp; Drop) or Cloud/Drive URL *</span>
          </Label>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div
            role="button"
            tabIndex={0}
            onClick={() => !uploadingPdf && fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !uploadingPdf) {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (!isDraggingPdf) setIsDraggingPdf(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDraggingPdf(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsDraggingPdf(false);
              }
            }}
            onDrop={handlePdfDrop}
            className={`rounded-xl border-2 border-dashed p-5 text-center transition-all cursor-pointer select-none ${
              isDraggingPdf
                ? "border-cyan-500 bg-cyan-50/70 dark:bg-cyan-500/15 scale-[1.01]"
                : "border-[#cbd5e1] dark:border-[#293548] hover:border-cyan-500 bg-white dark:bg-[#0B0F19]"
            }`}
          >
            {uploadingPdf ? (
              <div className="flex flex-col items-center gap-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Uploading PDF to isolated KCET storage...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-xs">
                <Upload className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <span className="font-semibold text-[#0f172a] dark:text-white">
                  {isDraggingPdf ? "Drop KCET PDF here" : "Drag & drop PDF here or click to browse"}
                </span>
                <span className="text-[11px] text-[#64748b] dark:text-[#94A3B8]">PDF files up to 50 MB</span>
              </div>
            )}
          </div>

          <div className="relative flex items-center">
            <Link2 className="h-4 w-4 text-slate-400 absolute left-3" />
            <Input
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="Or paste Google Drive / Direct PDF URL"
              className="pl-9"
            />
          </div>

          {pdfUrl && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="truncate">Resource attached: {pdfUrl}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>Page Count</Label>
            <Input type="number" value={pageCount} onChange={(e) => setPageCount(e.target.value)} placeholder="e.g. 24" />
          </div>
          <div className="space-y-1.5">
            <Label>File Size (KB)</Label>
            <Input type="number" value={fileSizeKb} onChange={(e) => setFileSizeKb(e.target.value)} placeholder="e.g. 2400" />
          </div>
          <div className="space-y-1.5">
            <Label>Sort Order</Label>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} placeholder="0" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <div className="flex items-center gap-2">
            <Switch checked={isVisible} onCheckedChange={setIsVisible} />
            <Label>Visible in KCET Arena</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            <Label>Featured / Top Pick</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link href="/admin/kcet/materials">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{editId ? "Update Material" : "Publish Material"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
