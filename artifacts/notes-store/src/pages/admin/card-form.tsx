import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useAdminListSections, useAdminCreateCard, useAdminUpdateCard, getAdminListCardsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X, FileText, Image } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getAdminToken } from "@/lib/utils";

const RESOURCE_TYPES = [
  "Notes", "Important Questions", "Previous Year Papers", "Question Banks",
  "Formula Sheets", "Model Papers", "Assignments", "Lab Manuals",
  "Practical Records", "Sample Papers", "Revision Notes", "Study Materials",
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
  sectionId: "", title: "", description: "", subject: "", chapter: "",
  semester: "", resourceType: "Notes", isFree: true, priceRupees: "",
  discountPriceRupees: "", telegramLink: "", isNew: false,
  thumbnailUrl: "", previewImageUrls: [], pdfFileKey: "", pageCount: "",
  fileSizeKb: "", isFeatured: false, isVisible: true,
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
    setUploading(type);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const token = getAdminToken();
      const res = await fetch(`/api/admin/upload/${type}`, {
        method: "POST",
        headers: token ? { "x-admin-token": token } : {},
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (type === "pdf") {
        set("pdfFileKey", data.key);
        toast({ title: "PDF uploaded" });
      } else {
        set("thumbnailUrl", data.url);
        toast({ title: "Image uploaded" });
      }
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sectionId || !form.title) return;

    const payload = {
      sectionId: parseInt(form.sectionId),
      title: form.title,
      description: form.description || undefined,
      subject: form.subject || undefined,
      chapter: form.chapter || undefined,
      semester: form.semester || undefined,
      resourceType: form.resourceType,
      isFree: form.isFree,
      pricePaise: form.isFree ? 0 : Math.round(parseFloat(form.priceRupees || "0") * 100),
      discountPricePaise: !form.isFree && form.discountPriceRupees
        ? Math.round(parseFloat(form.discountPriceRupees) * 100)
        : undefined,
      telegramLink: form.telegramLink || undefined,
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
          toast({ title: "Card updated" });
          queryClient.invalidateQueries({ queryKey: getAdminListCardsQueryKey() });
          setLocation("/admin/cards");
        },
        onError: () => toast({ title: "Error", description: "Failed to update card", variant: "destructive" }),
      });
    } else {
      createCard.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Card created" });
          queryClient.invalidateQueries({ queryKey: getAdminListCardsQueryKey() });
          setLocation("/admin/cards");
        },
        onError: () => toast({ title: "Error", description: "Failed to create card", variant: "destructive" }),
      });
    }
  }

  const isPending = createCard.isPending || updateCard.isPending;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/cards">
          <Button variant="ghost" size="sm" className="gap-2 mb-4"><ArrowLeft className="h-4 w-4" /> Back to Cards</Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{cardId ? "Edit Card" : "New Card"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Section *</Label>
              <Select value={form.sectionId} onValueChange={v => set("sectionId", v)}>
                <SelectTrigger><SelectValue placeholder="Select a section" /></SelectTrigger>
                <SelectContent>
                  {sections?.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Physics Chapter 1 Notes" required />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Short description of the resource" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Input value={form.subject} onChange={e => set("subject", e.target.value)} placeholder="e.g. Physics" />
              </div>
              <div className="space-y-1.5">
                <Label>Chapter</Label>
                <Input value={form.chapter} onChange={e => set("chapter", e.target.value)} placeholder="e.g. Chapter 1" />
              </div>
              <div className="space-y-1.5">
                <Label>Semester/Class</Label>
                <Input value={form.semester} onChange={e => set("semester", e.target.value)} placeholder="e.g. 2nd PUC" />
              </div>
              <div className="space-y-1.5">
                <Label>Resource Type</Label>
                <Select value={form.resourceType} onValueChange={v => set("resourceType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button type="button" variant={form.isFree ? "default" : "outline"} onClick={() => set("isFree", true)}>Free</Button>
              <Button type="button" variant={!form.isFree ? "default" : "outline"} onClick={() => set("isFree", false)}>Paid</Button>
            </div>
            {!form.isFree && (
              <>
                <div className="space-y-1.5">
                  <Label>Price (in Rupees)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">&#x20b9;</span>
                    <Input className="pl-7" value={form.priceRupees} onChange={e => set("priceRupees", e.target.value)} placeholder="0.00" type="number" min="0" step="0.01" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Discount Price (optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">&#x20b9;</span>
                    <Input className="pl-7" value={form.discountPriceRupees} onChange={e => set("discountPriceRupees", e.target.value)} placeholder="Leave blank if no discount" type="number" min="0" step="0.01" />
                  </div>
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label>Telegram Link (optional)</Label>
              <Input value={form.telegramLink} onChange={e => set("telegramLink", e.target.value)} placeholder="https://t.me/..." />
            </div>
          </CardContent>
        </Card>

        {/* Files */}
        <Card>
          <CardHeader><CardTitle className="text-base">Files</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>PDF File</Label>
              {form.pdfFileKey ? (
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700 flex-1 truncate">{form.pdfFileKey}</span>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => set("pdfFileKey", "")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], "pdf")} />
                  <Button type="button" variant="outline" className="gap-2 w-full" onClick={() => pdfRef.current?.click()} disabled={uploading === "pdf"}>
                    <Upload className="h-4 w-4" /> {uploading === "pdf" ? "Uploading..." : "Upload PDF"}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Thumbnail Image</Label>
              {form.thumbnailUrl ? (
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
                  <Image className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-700 flex-1 truncate">Thumbnail uploaded</span>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => set("thumbnailUrl", "")}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], "image")} />
                  <Button type="button" variant="outline" className="gap-2 w-full" onClick={() => imageRef.current?.click()} disabled={uploading === "image"}>
                    <Upload className="h-4 w-4" /> {uploading === "image" ? "Uploading..." : "Upload Thumbnail"}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Page Count</Label>
                <Input type="number" min="1" value={form.pageCount} onChange={e => set("pageCount", e.target.value)} placeholder="e.g. 24" />
              </div>
              <div className="space-y-1.5">
                <Label>File Size (KB)</Label>
                <Input type="number" min="1" value={form.fileSizeKb} onChange={e => set("fileSizeKb", e.target.value)} placeholder="e.g. 1024" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader><CardTitle className="text-base">Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><Label>Visible on Store</Label><p className="text-xs text-gray-400">Students can see and purchase this resource</p></div>
              <Switch checked={form.isVisible} onCheckedChange={v => set("isVisible", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Featured</Label><p className="text-xs text-gray-400">Show in Featured section on homepage</p></div>
              <Switch checked={form.isFeatured} onCheckedChange={v => set("isFeatured", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div><Label>New</Label><p className="text-xs text-gray-400">Show a "New" badge on the card</p></div>
              <Switch checked={form.isNew} onCheckedChange={v => set("isNew", v)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending || !form.sectionId || !form.title} className="flex-1">
            {isPending ? "Saving..." : cardId ? "Save Changes" : "Create Card"}
          </Button>
          <Link href="/admin/cards">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
