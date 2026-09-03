import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { 
  useAdminListSections, 
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
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getAdminToken } from "@/lib/utils";

const RESOURCE_TYPES = [
  "Notes", 
  "Important Questions", 
  "Previous Year Papers", 
  "Question Banks",
  "Formula Sheets", 
  "Model Papers", 
  "Assignments", 
  "Lab Manuals",
  "Practical Records", 
  "Sample Papers", 
  "Revision Notes", 
  "Study Materials",
];

type CardFormData = {
  sectionId: string;
  title: string;
  description: string;
  subject: string;
  chapter: string;
  semester: string;
  resourceType: string;
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
  subject: "", 
  chapter: "",
  semester: "2nd PUC", 
  resourceType: "Notes", 
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
  const createCard = useAdminCreateCard();
  const updateCard = useAdminUpdateCard();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState<CardFormData>({ ...defaultForm, ...initialData });
  const [uploading, setUploading] = useState<"pdf" | "image" | null>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  function set(key: keyof CardFormData, value: any) {
    setForm(f => ({ ...f, [key]: value }));
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
        // Automatically populate file size in KB if empty
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
      toast({ title: "Missing fields", description: "Category and Title are required.", variant: "destructive" });
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
      updateCard.mutate({ id: cardId, data: payload }, {
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
          Configure details, pricing, study material category, and downloadable files
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Basic Information */}
        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white">
          <CardHeader className="pb-3 pt-5 px-5 border-b border-[#eef2f6]">
            <CardTitle className="text-sm font-bold text-[#112542]">1. Basic Information</CardTitle>
            <CardDescription className="text-xs text-[#64748b]">Core title and curriculum metadata</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#334155]">Category / Section *</Label>
                <Select value={form.sectionId} onValueChange={v => set("sectionId", v)}>
                  <SelectTrigger className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sections?.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#334155]">Resource Type *</Label>
                <Select value={form.resourceType} onValueChange={v => set("resourceType", v)}>
                  <SelectTrigger className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#334155]">Subject</Label>
                <Input 
                  value={form.subject} 
                  onChange={e => set("subject", e.target.value)} 
                  placeholder="e.g. Physics" 
                  className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#334155]">Chapter / Topic</Label>
                <Input 
                  value={form.chapter} 
                  onChange={e => set("chapter", e.target.value)} 
                  placeholder="e.g. Chapter 1" 
                  className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#334155]">Class / Board</Label>
                <Input 
                  value={form.semester} 
                  onChange={e => set("semester", e.target.value)} 
                  placeholder="e.g. 2nd PUC" 
                  className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]"
                />
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
            {/* Free vs Paid Toggle Buttons */}
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

        {/* Section 3: Files & Uploads */}
        <Card className="rounded-xl border-[#e2e8f0] shadow-none bg-white">
          <CardHeader className="pb-3 pt-5 px-5 border-b border-[#eef2f6]">
            <CardTitle className="text-sm font-bold text-[#112542]">3. PDF File & Thumbnail</CardTitle>
            <CardDescription className="text-xs text-[#64748b]">Upload downloadable note PDF and preview visual</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {/* PDF File Upload */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-[#334155]">Downloadable PDF Document</Label>
              {form.pdfFileKey ? (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-[#eaf5ec] border-[#d7ecdc]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-5 w-5 text-[#167035] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#167035] truncate">{form.pdfFileKey}</p>
                      <p className="text-[10px] text-[#588366]">Secured in Supabase Storage</p>
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

            {/* Thumbnail Image Upload */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-[#334155]">Resource Cover / Thumbnail</Label>
              {form.thumbnailUrl ? (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-[#ebf3ff] border-[#dce8fa]">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={form.thumbnailUrl} alt="Thumbnail preview" className="h-10 w-10 object-cover rounded border border-[#dce8fa] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1856b8] truncate">Thumbnail uploaded</p>
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
                <p className="text-[11px] text-[#64748b]">When active, students can discover and purchase this note</p>
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
