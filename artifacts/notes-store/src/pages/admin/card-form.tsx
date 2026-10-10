import { useState, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { 
  useAdminListSections, 
  useAdminListCards,
  useAdminCreateCard, 
  useAdminUpdateCard, 
  getAdminListCardsQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
  Link2,
  FolderOpen,
  Search
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getAdminToken } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const CORE_SUBJECT_NAMES = ["Physics", "Chemistry", "Computer Science", "Biology"];

const ALL_SUBJECT_OPTIONS = [
  "Physics",
  "Chemistry",
  "Computer Science",
  "Biology",
  "Mathematics",
  "English",
  "Hindi",
  "Kannada",
  "Sanskrit"
];

const CORE_RESOURCE_TYPES = [
  "Notes", 
  "Model Question Papers (MQP)", 
  "MCQ", 
  "Question Bank",
  "Practical", 
  "Previous Year Question Papers (PYQs)", 
  "Passing Package", 
  "Publication Books"
];

const LANGUAGE_RESOURCE_TYPES = [
  "Notes", 
  "Model Question Papers (MQP)", 
  "Question Bank", 
  "Previous Year Question Papers (PYQs)", 
  "Passing Package", 
  "Publication Books",
  "MCQ"
];

const PRACTICAL_SUBTYPES = ["Scheme", "Resources", "Lab Manual", "Viva Questions"];
const PYQ_SUBTYPES = ["Midterm", "Preparatory", "Annual"];

export type CardFormData = {
  sectionId: string;
  title: string;
  description: string;
  subject: string;
  chapter: string;
  semester: string;
  resourceType: string;
  subtype: string;
  isRecommended: boolean;
  answerKeyUrl: string;
  officialSourceUrl: string;
  isFree: boolean;
  priceRupees: string;
  discountPriceRupees: string;
  telegramLink: string;
  isNew: boolean;
  thumbnailUrl: string;
  previewImageUrls: string[];
  pdfFileKey: string;
  pageCount: string;
  fileSizeKb: string;
  isFeatured: boolean;
  isVisible: boolean;
};

const defaultForm: CardFormData = {
  sectionId: "", 
  title: "", 
  description: "", 
  subject: "Physics", 
  chapter: "",
  semester: "2nd PUC", 
  resourceType: "Notes", 
  subtype: "",
  isRecommended: false,
  answerKeyUrl: "",
  officialSourceUrl: "",
  isFree: true, 
  priceRupees: "",
  discountPriceRupees: "", 
  telegramLink: "", 
  isNew: false,
  thumbnailUrl: "", 
  previewImageUrls: [], 
  pdfFileKey: "", 
  pageCount: "",
  fileSizeKb: "", 
  isFeatured: false, 
  isVisible: true,
};

export default function CardForm({ initialData, cardId }: { initialData?: Partial<CardFormData>; cardId?: number }) {
  const [, setLocation] = useLocation();
  const { data: sections } = useAdminListSections();
  const { data: allCards } = useAdminListCards();
  const createCard = useAdminCreateCard();
  const updateCard = useAdminUpdateCard();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState<CardFormData>({ ...defaultForm, ...initialData });
  const [uploading, setUploading] = useState<"pdf" | "image" | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"file" | "drive" | "existing">(
    initialData?.pdfFileKey?.startsWith("http") ? "drive" : "file"
  );
  const [driveUrlInput, setDriveUrlInput] = useState("");
  const [existingSearch, setExistingSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const pdfRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  function set(key: keyof CardFormData, value: any) {
    setForm(f => ({ ...f, [key]: value }));
  }

  // Determine if selected subject is a Core Subject
  const isCoreSubject = useMemo(() => {
    return CORE_SUBJECT_NAMES.some(
      c => c.toLowerCase() === (form.subject || "").toLowerCase()
    );
  }, [form.subject]);

  // Dynamic resource types based on subject
  const availableResourceTypes = isCoreSubject ? CORE_RESOURCE_TYPES : LANGUAGE_RESOURCE_TYPES;

  // Handle subject change: if switching away from core subject and practical was selected, reset resource type
  function handleSubjectChange(subj: string) {
    const isNewCore = CORE_SUBJECT_NAMES.some(c => c.toLowerCase() === subj.toLowerCase());
    set("subject", subj);
    // Find matching section if possible
    if (sections) {
      const match = sections.find(s => s.name.toLowerCase() === subj.toLowerCase());
      if (match) set("sectionId", String(match.id));
    }
    if (!isNewCore && form.resourceType.toLowerCase().includes("practical")) {
      set("resourceType", "Notes");
      set("subtype", "");
    }
  }

  // Handle resource type change
  function handleResourceTypeChange(rType: string) {
    set("resourceType", rType);
    if (!rType.toLowerCase().includes("practical") && !rType.toLowerCase().includes("previous") && !rType.toLowerCase().includes("pyq")) {
      set("subtype", "");
    }
  }

  function handleAttachDriveLink() {
    const trimmed = driveUrlInput.trim();
    if (!trimmed) {
      toast({ title: "Link required", description: "Please enter a valid Google Drive or cloud resource URL", variant: "destructive" });
      return;
    }
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      toast({ title: "Invalid URL", description: "URL must start with https:// or http://", variant: "destructive" });
      return;
    }
    set("pdfFileKey", trimmed);
    setDriveUrlInput("");
    toast({ title: "Drive Link Attached", description: "Google Drive resource link successfully linked to this note." });
  }

  // Unique existing files to choose from
  const existingFiles = useMemo(() => {
    if (!allCards) return [];
    const seen = new Set<string>();
    const list: typeof allCards = [];
    for (const c of allCards) {
      if (c.pdfFileKey && !seen.has(c.pdfFileKey)) {
        seen.add(c.pdfFileKey);
        list.push(c);
      }
    }
    return list;
  }, [allCards]);

  const filteredExistingFiles = useMemo(() => {
    if (!existingSearch.trim()) return existingFiles;
    const q = existingSearch.toLowerCase().trim();
    return existingFiles.filter(
      c =>
        c.title.toLowerCase().includes(q) ||
        (c.subject && c.subject.toLowerCase().includes(q)) ||
        (c.pdfFileKey && c.pdfFileKey.toLowerCase().includes(q))
    );
  }, [existingFiles, existingSearch]);

  function handleLinkExistingCard(c: (typeof existingFiles)[0]) {
    set("pdfFileKey", c.pdfFileKey || "");
    if (c.pageCount && !form.pageCount) set("pageCount", String(c.pageCount));
    if (c.fileSizeKb && !form.fileSizeKb) set("fileSizeKb", String(c.fileSizeKb));
    if (c.thumbnailUrl && !form.thumbnailUrl) set("thumbnailUrl", c.thumbnailUrl);
    setPickerOpen(false);
    toast({
      title: "Existing File Linked",
      description: `Linked resource file from: ${c.title}`,
    });
  }

  async function uploadFile(file: File, type: "pdf" | "image") {
    if (type === "pdf" && !file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a valid PDF document.", variant: "destructive" });
      return;
    }
    if (type === "pdf" && file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large", description: "PDF size must be under 50 MB.", variant: "destructive" });
      return;
    }
    if (type === "image" && file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Image size must be under 10 MB.", variant: "destructive" });
      return;
    }

    setUploading(type);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const token = getAdminToken();
      const rawApiUrl = import.meta.env.VITE_API_URL;
      const baseUrl = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";

      const res = await fetch(`${baseUrl}/api/admin/upload/${type}`, {
        method: "POST",
        headers: token ? { "x-admin-token": token } : {},
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      
      if (type === "pdf") {
        set("pdfFileKey", data.key);
        if (!form.fileSizeKb) {
          set("fileSizeKb", String(Math.round(file.size / 1024)));
        }
        toast({ title: "PDF uploaded successfully" });
      } else {
        set("thumbnailUrl", data.url);
        toast({ title: "Thumbnail uploaded successfully" });
      }
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sectionId || !form.title.trim()) {
      toast({ title: "Missing fields", description: "Subject/Category and Title are required.", variant: "destructive" });
      return;
    }

    const payload = {
      sectionId: parseInt(form.sectionId),
      title: form.title.trim(),
      description: form.description?.trim() || undefined,
      subject: form.subject?.trim() || undefined,
      chapter: form.chapter?.trim() || undefined,
      semester: form.semester?.trim() || undefined,
      resourceType: form.resourceType,
      subtype: form.subtype?.trim() || undefined,
      isRecommended: form.isRecommended,
      answerKeyUrl: form.answerKeyUrl?.trim() || undefined,
      officialSourceUrl: form.officialSourceUrl?.trim() || undefined,
      isFree: form.isFree,
      pricePaise: form.isFree ? 0 : Math.round(parseFloat(form.priceRupees || "0") * 100),
      discountPricePaise: !form.isFree && form.discountPriceRupees
        ? Math.round(parseFloat(form.discountPriceRupees) * 100)
        : undefined,
      telegramLink: form.telegramLink?.trim() || undefined,
      isNew: form.isNew,
      thumbnailUrl: form.thumbnailUrl || undefined,
      previewImageUrls: form.previewImageUrls,
      pdfFileKey: form.pdfFileKey || undefined,
      pageCount: form.pageCount ? parseInt(form.pageCount) : undefined,
      fileSizeKb: form.fileSizeKb ? parseInt(form.fileSizeKb) : undefined,
      isFeatured: form.isFeatured,
      isVisible: form.isVisible,
    };

    if (cardId) {
      updateCard.mutate(
        {
          id: cardId,
          data: {
            ...payload,
            answerKeyUrl: form.answerKeyUrl?.trim() || null,
            officialSourceUrl: form.officialSourceUrl?.trim() || null,
          },
        },
        {
        onSuccess: () => {
          toast({ title: "Resource updated successfully" });
          queryClient.invalidateQueries({ queryKey: getAdminListCardsQueryKey() });
          setLocation("/admin/cards");
        },
        onError: (err: any) => toast({ 
          title: "Error updating", 
          description: err.message || "Failed to update resource", 
          variant: "destructive" 
        }),
      });
    } else {
      createCard.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Resource created successfully" });
          queryClient.invalidateQueries({ queryKey: getAdminListCardsQueryKey() });
          setLocation("/admin/cards");
        },
        onError: (err: any) => toast({ 
          title: "Error creating", 
          description: err.message || "Failed to create resource", 
          variant: "destructive" 
        }),
      });
    }
  }

  const isPending = createCard.isPending || updateCard.isPending;
  const isPractical = form.resourceType.toLowerCase().includes("practical");
  const isPyq = form.resourceType.toLowerCase().includes("previous") || form.resourceType.toLowerCase().includes("pyq");
  const isNotes = form.resourceType.toLowerCase() === "notes";
  const isMqpOrQBank = form.resourceType.toLowerCase().includes("model") || form.resourceType.toLowerCase().includes("bank");

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Top Navigation */}
      <div>
        <Link href="/admin/cards">
          <Button variant="ghost" size="sm" className="gap-2 text-[#5a6b82] hover:text-[#112542] mb-3 -ml-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Resources</span>
          </Button>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">
          {cardId ? "Edit Study Resource" : "Create New Study Resource"}
        </h1>
        <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">
          Configure details, dynamic resource types, pricing, and link downloadable files without duplication
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Basic Information & Dynamic Subject/Type Selection */}
        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white">
          <CardHeader className="pb-3 pt-5 px-5 border-b border-[#eef2f6]">
            <CardTitle className="text-sm font-bold text-[#112542]">1. Subject & Classification</CardTitle>
            <CardDescription className="text-xs text-[#64748b]">Select subject to dynamically unlock compatible resource types</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {/* Subject Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-[#334155]">Subject *</Label>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                  isCoreSubject 
                    ? "bg-[#ebf3ff] text-[#1856b8] border-[#dce8fa]" 
                    : "bg-[#f5f3ff] text-[#6d28d9] border-[#ede9fe]"
                }`}>
                  {isCoreSubject ? "Core Subject (Practicals Supported)" : "Language / Other Subject (No Practicals)"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {ALL_SUBJECT_OPTIONS.map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => handleSubjectChange(subj)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      form.subject.toLowerCase() === subj.toLowerCase()
                        ? "bg-[#1856b8] text-white border-[#1856b8] font-semibold shadow-2xs"
                        : "bg-[#f8fafc] text-[#5a6b82] border-[#e2e8f0] hover:bg-white hover:text-[#112542]"
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#334155]">Store Category / Section *</Label>
                <Select value={form.sectionId} onValueChange={v => set("sectionId", v)}>
                  <SelectTrigger className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]">
                    <SelectValue placeholder="Select section..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sections?.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Resource Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#334155]">Resource Type *</Label>
                <Select value={form.resourceType} onValueChange={handleResourceTypeChange}>
                  <SelectTrigger className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableResourceTypes.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subtypes: Practical or PYQ */}
            {isPractical && (
              <div className="bg-[#f0f7ff] border border-[#dce8fa] rounded-xl p-3.5 space-y-1.5">
                <Label className="text-xs font-semibold text-[#1856b8]">Practical Subtype *</Label>
                <div className="flex flex-wrap gap-1.5">
                  {PRACTICAL_SUBTYPES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => set("subtype", st)}
                      className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                        form.subtype.toLowerCase() === st.toLowerCase()
                          ? "bg-[#1856b8] text-white font-semibold"
                          : "bg-white text-[#1856b8] border border-[#bae6fd] hover:bg-[#e0f2fe]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isPyq && (
              <div className="bg-[#f0f7ff] border border-[#dce8fa] rounded-xl p-3.5 space-y-1.5">
                <Label className="text-xs font-semibold text-[#1856b8]">PYQ Exam Category *</Label>
                <div className="flex flex-wrap gap-1.5">
                  {PYQ_SUBTYPES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => set("subtype", st)}
                      className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                        form.subtype.toLowerCase() === st.toLowerCase()
                          ? "bg-[#1856b8] text-white font-semibold"
                          : "bg-white text-[#1856b8] border border-[#bae6fd] hover:bg-[#e0f2fe]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes: Recommended Toggle */}
            {isNotes && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0fdf4] border border-[#dcfce7]">
                <div>
                  <Label className="text-xs font-semibold text-[#15803d] block">Recommended Note</Label>
                  <p className="text-[11px] text-[#588366]">Highlights this note with a prominent "Recommended" badge on the subject page</p>
                </div>
                <Switch checked={form.isRecommended} onCheckedChange={v => set("isRecommended", v)} />
              </div>
            )}

            {/* MQP & Question Bank: Answer Key URL */}
            {isMqpOrQBank && (
              <div className="space-y-1.5 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <Label className="text-xs font-semibold text-[#334155]">Linked Answer Key URL (Optional)</Label>
                <Input
                  value={form.answerKeyUrl}
                  onChange={e => set("answerKeyUrl", e.target.value)}
                  placeholder="https://drive.google.com/... or download URL"
                  className="h-9 text-xs bg-white border-[#cbd5e1] text-[#112542]"
                />
                <p className="text-[11px] text-[#64748b]">If provided, an "[Answer Key]" button will be rendered next to this question paper for students</p>
              </div>
            )}

            {/* Official Source Link */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#334155]">Official Government Source URL (Optional)</Label>
              <Input
                value={form.officialSourceUrl}
                onChange={e => set("officialSourceUrl", e.target.value)}
                placeholder="https://kseab.karnataka.gov.in/..."
                className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
              />
              <p className="text-[11px] text-[#94a3b8]">Used to display official reference link at the top of category & subject pages</p>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#334155]">Resource Title *</Label>
              <Input 
                value={form.title} 
                onChange={e => set("title", e.target.value)} 
                placeholder="e.g. Physics Chapter 1: Electric Charges and Fields Complete Notes" 
                required 
                className="h-9 text-xs sm:text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542] focus-visible:border-[#1856b8]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#334155]">Chapter / Topic</Label>
                <Input 
                  value={form.chapter} 
                  onChange={e => set("chapter", e.target.value)} 
                  placeholder="e.g. Chapter 1 or Complete Syllabus" 
                  className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-[#334155]">Examination / Academic Year</Label>
                  <span className="text-[10px] text-[#64748b]">e.g. 2025, 2024</span>
                </div>
                <Input 
                  value={form.semester} 
                  onChange={e => set("semester", e.target.value)} 
                  placeholder="e.g. 2025, 2024, or 2nd PUC" 
                  className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
                />
                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                  {["2025", "2024", "2023", "2022", "2021", "2020", "2019"].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => set("semester", yr)}
                      className={`px-1.5 py-0.5 rounded text-[10px] border transition-colors ${
                        form.semester === yr
                          ? "bg-[#1856b8] text-white border-[#1856b8]"
                          : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1856b8] hover:text-[#1856b8]"
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#334155]">Description (Optional)</Label>
              <Textarea 
                value={form.description} 
                onChange={e => set("description", e.target.value)} 
                placeholder="Brief summary of what this resource covers, key formulas, revision points..." 
                rows={3} 
                className="text-xs sm:text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542] focus-visible:border-[#1856b8]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Pricing */}
        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white">
          <CardHeader className="pb-3 pt-5 px-5 border-b border-[#eef2f6]">
            <CardTitle className="text-sm font-bold text-[#112542]">2. Pricing & Access</CardTitle>
            <CardDescription className="text-xs text-[#64748b]">Set whether this resource is free or paid</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="inline-flex rounded-lg border border-[#e2e8f0] p-1 bg-[#f8fafc]">
              <button
                type="button"
                onClick={() => set("isFree", true)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  form.isFree 
                    ? "bg-[#167035] text-white shadow-2xs" 
                    : "text-[#5a6b82] hover:text-[#112542]"
                }`}
              >
                Free Resource
              </button>
              <button
                type="button"
                onClick={() => set("isFree", false)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  !form.isFree 
                    ? "bg-[#1856b8] text-white shadow-2xs" 
                    : "text-[#5a6b82] hover:text-[#112542]"
                }`}
              >
                Paid Resource
              </button>
            </div>

            {!form.isFree && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#334155]">Regular Price (₹) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748b]">₹</span>
                    <Input 
                      className="pl-7 h-9 text-xs sm:text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542]" 
                      value={form.priceRupees} 
                      onChange={e => set("priceRupees", e.target.value)} 
                      placeholder="49" 
                      type="number" 
                      min="1" 
                      step="1" 
                      required={!form.isFree}
                    />
                  </div>
                  <p className="text-[11px] text-[#94a3b8]">Student purchase amount</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#334155]">Discount Price (₹, optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748b]">₹</span>
                    <Input 
                      className="pl-7 h-9 text-xs sm:text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542]" 
                      value={form.discountPriceRupees} 
                      onChange={e => set("discountPriceRupees", e.target.value)} 
                      placeholder="e.g. 29" 
                      type="number" 
                      min="0" 
                      step="1" 
                    />
                  </div>
                  <p className="text-[11px] text-[#94a3b8]">If set, regular price displays strikethrough</p>
                </div>
              </div>
            )}

            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold text-[#334155]">Telegram Channel Link (Optional)</Label>
              <Input 
                value={form.telegramLink} 
                onChange={e => set("telegramLink", e.target.value)} 
                placeholder="https://t.me/secondpuscience" 
                className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Files & Resource Linking (Avoid Duplicate Uploads!) */}
        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white">
          <CardHeader className="pb-3 pt-5 px-5 border-b border-[#eef2f6]">
            <CardTitle className="text-sm font-bold text-[#112542]">3. Resource Document & Linking</CardTitle>
            <CardDescription className="text-xs text-[#64748b]">Upload a new PDF, paste a Drive URL, or link an already-uploaded file to prevent duplication</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Label className="text-xs font-semibold text-[#334155]">Document Attachment</Label>
                <div className="inline-flex rounded-lg border border-[#e2e8f0] p-0.5 bg-[#f8fafc]">
                  <button
                    type="button"
                    onClick={() => setUploadMethod("file")}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-all ${
                      uploadMethod === "file"
                        ? "bg-white text-[#1856b8] shadow-2xs border border-[#dce8fa]"
                        : "text-[#5a6b82] hover:text-[#112542]"
                    }`}
                  >
                    Upload PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod("drive")}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-all ${
                      uploadMethod === "drive"
                        ? "bg-white text-[#1856b8] shadow-2xs border border-[#dce8fa]"
                        : "text-[#5a6b82] hover:text-[#112542]"
                    }`}
                  >
                    Google Drive Link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMethod("existing");
                      setPickerOpen(true);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-all flex items-center gap-1 ${
                      uploadMethod === "existing"
                        ? "bg-white text-[#1856b8] shadow-2xs border border-[#dce8fa]"
                        : "text-[#5a6b82] hover:text-[#112542]"
                    }`}
                  >
                    <FolderOpen className="h-3 w-3" />
                    <span>Link Existing File</span>
                  </button>
                </div>
              </div>

              {/* Display currently attached file or link */}
              {form.pdfFileKey ? (
                form.pdfFileKey.startsWith("http") ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-[#ebf3ff] border-[#dce8fa]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#1856b8] border border-[#dce8fa] shrink-0">
                        <Link2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-[#1856b8]">Google Drive Resource Attached</p>
                          <span className="bg-[#16a34a] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">Cloud</span>
                        </div>
                        <p className="text-[11px] text-[#5a6b82] truncate max-w-xs sm:max-w-md font-mono mt-0.5">{form.pdfFileKey}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <a
                        href={form.pdfFileKey}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-[#1856b8] hover:text-[#0b57d0] hover:bg-white rounded transition-colors"
                        title="Test Link in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-[#9e5d56] hover:bg-white hover:text-red-600 rounded" 
                        onClick={() => set("pdfFileKey", "")}
                        title="Remove Link"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-[#eaf5ec] border-[#d7ecdc]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="h-5 w-5 text-[#167035] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#167035] truncate">{form.pdfFileKey}</p>
                        <p className="text-[10px] text-[#588366]">Linked PDF in Supabase Storage (No duplication)</p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 text-[#9e5d56] hover:bg-white hover:text-red-600 rounded" 
                      onClick={() => set("pdfFileKey", "")}
                      title="Remove PDF"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              ) : uploadMethod === "drive" ? (
                <div className="space-y-2 p-3.5 border rounded-lg bg-[#f8fafc] border-[#e2e8f0]">
                  <Label className="text-[11px] font-semibold text-[#475569]">Google Drive / Cloud Shareable URL</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                      value={driveUrlInput}
                      onChange={e => setDriveUrlInput(e.target.value)}
                      className="h-9 text-xs bg-white border-[#cbd5e1] text-[#112542] focus-visible:border-[#1856b8]"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAttachDriveLink();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAttachDriveLink}
                      className="h-9 px-4 text-xs font-semibold bg-[#2f74de] hover:bg-[#1f63c8] text-white shrink-0"
                    >
                      Attach Link
                    </Button>
                  </div>
                </div>
              ) : uploadMethod === "existing" ? (
                <div className="p-4 border rounded-lg bg-[#f8fafc] border-[#e2e8f0] text-center space-y-2">
                  <p className="text-xs text-[#5a6b82]">
                    Link to any previously uploaded PDF without re-uploading the file.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPickerOpen(true)}
                    className="gap-2 text-xs border-[#1856b8] text-[#1856b8] hover:bg-[#ebf3ff]"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span>Browse Existing Uploaded Files ({existingFiles.length})</span>
                  </Button>
                </div>
              ) : (
                <div>
                  <input 
                    ref={pdfRef} 
                    type="file" 
                    accept=".pdf,application/pdf" 
                    className="hidden" 
                    onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], "pdf")} 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="gap-2 w-full h-10 text-xs font-medium border-dashed border-[#cbd5e1] hover:border-[#1856b8] bg-[#f8fafc] text-[#5a6b82] hover:text-[#1856b8]" 
                    onClick={() => pdfRef.current?.click()} 
                    disabled={uploading === "pdf"}
                  >
                    {uploading === "pdf" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-[#1856b8]" />
                        <span>Uploading PDF to Storage...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 text-[#1856b8]" />
                        <span>Click to Select PDF (up to 50MB)</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Existing File Picker Dialog */}
            <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
              <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-[#112542]">
                    Select Existing Uploaded File
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#64748b]">
                    Re-use an already uploaded PDF key. This saves storage and avoids uploading the same document twice.
                  </DialogDescription>
                </DialogHeader>

                <div className="relative my-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
                  <Input
                    placeholder="Search by title, subject, or filename..."
                    value={existingSearch}
                    onChange={e => setExistingSearch(e.target.value)}
                    className="pl-8 h-9 text-xs bg-[#f8fafc]"
                  />
                </div>

                <div className="overflow-y-auto max-h-[50vh] space-y-2 pr-1">
                  {filteredExistingFiles.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#64748b]">
                      No matching uploaded files found.
                    </div>
                  ) : (
                    filteredExistingFiles.map(c => (
                      <div
                        key={c.id}
                        onClick={() => handleLinkExistingCard(c)}
                        className="p-3 rounded-lg border border-[#e2e8f0] hover:border-[#1856b8] hover:bg-[#f8fbff] transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-3">
                          <p className="text-xs font-semibold text-[#112542] truncate">{c.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#64748b]">
                            {c.subject && <span className="font-medium text-[#1856b8]">{c.subject}</span>}
                            <span>&bull;</span>
                            <span className="font-mono truncate max-w-[200px]">{c.pdfFileKey}</span>
                            {c.fileSizeKb && <span>({(c.fileSizeKb / 1024).toFixed(1)} MB)</span>}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs h-7 shrink-0 text-[#1856b8] border-[#bae6fd]">
                          Link File
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Thumbnail Image Upload */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-[#334155]">Resource Cover / Thumbnail</Label>
              {form.thumbnailUrl ? (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-[#ebf3ff] border-[#dce8fa]">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={form.thumbnailUrl} alt="Thumbnail preview" className="h-10 w-10 object-cover rounded border border-[#dce8fa] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1856b8] truncate">Thumbnail attached</p>
                      <a href={form.thumbnailUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#5a7da8] hover:underline flex items-center gap-1">
                        <span>Preview image</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 text-[#9e5d56] hover:bg-white hover:text-red-600 rounded" 
                    onClick={() => set("thumbnailUrl", "")}
                    title="Remove Thumbnail"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <input 
                    ref={imageRef} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], "image")} 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="gap-2 w-full h-10 text-xs font-medium border-dashed border-[#cbd5e1] hover:border-[#1856b8] bg-[#f8fafc] text-[#5a6b82] hover:text-[#1856b8]" 
                    onClick={() => imageRef.current?.click()} 
                    disabled={uploading === "image"}
                  >
                    {uploading === "image" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-[#1856b8]" />
                        <span>Uploading Image...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4 text-[#1856b8]" />
                        <span>Click to Select Cover Image (PNG, JPG)</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Metadata Numbers */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#334155]">Page Count</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={form.pageCount} 
                  onChange={e => set("pageCount", e.target.value)} 
                  placeholder="e.g. 18" 
                  className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#334155]">File Size (KB)</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={form.fileSizeKb} 
                  onChange={e => set("fileSizeKb", e.target.value)} 
                  placeholder="e.g. 1540" 
                  className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Visibility & Badges */}
        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white">
          <CardHeader className="pb-3 pt-5 px-5 border-b border-[#eef2f6]">
            <CardTitle className="text-sm font-bold text-[#112542]">4. Store Visibility & Flags</CardTitle>
            <CardDescription className="text-xs text-[#64748b]">Control resource discoverability</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8fafc] border border-[#eef2f6]">
              <div>
                <Label className="text-xs font-semibold text-[#112542] block">Published to Storefront</Label>
                <p className="text-[11px] text-[#64748b]">When active, students can discover and access this resource</p>
              </div>
              <Switch checked={form.isVisible} onCheckedChange={v => set("isVisible", v)} />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8fafc] border border-[#eef2f6]">
              <div>
                <Label className="text-xs font-semibold text-[#112542] block">Featured Resource</Label>
                <p className="text-[11px] text-[#64748b]">Pin prominently on the home page</p>
              </div>
              <Switch checked={form.isFeatured} onCheckedChange={v => set("isFeatured", v)} />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8fafc] border border-[#eef2f6]">
              <div>
                <Label className="text-xs font-semibold text-[#112542] block">"NEW" Badge</Label>
                <p className="text-[11px] text-[#64748b]">Displays a distinctive red New badge on cards</p>
              </div>
              <Switch checked={form.isNew} onCheckedChange={v => set("isNew", v)} />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons Bar */}
        <div className="flex items-center gap-3 pt-2">
          <Button 
            type="submit" 
            disabled={isPending || uploading !== null || !form.sectionId || !form.title.trim()} 
            className="flex-1 h-11 text-xs sm:text-sm font-semibold rounded-lg bg-[#2f74de] hover:bg-[#1f63c8] text-white shadow-none transition-colors"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Resource...</span>
              </span>
            ) : cardId ? (
              "Save Changes"
            ) : (
              "Create Resource"
            )}
          </Button>
          <Link href="/admin/cards">
            <Button 
              type="button" 
              variant="outline" 
              className="h-11 px-5 text-xs sm:text-sm border-[#e2e8f0] text-[#5a6b82] hover:text-[#112542] hover:bg-[#f8fafc]"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
