import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  fetchKcetSubjects,
  fetchKcetCategories,
  submitKcetContribution,
} from "@/lib/kcet-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MetaNoIndex } from "@/components/meta-noindex";
import {
  UploadCloud,
  CheckCircle2,
  ArrowLeft,
  Link2,
  FileCheck,
  Loader2,
  Rocket,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";

export default function KcetContributePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: subjects } = useQuery({
    queryKey: ["kcet-subjects"],
    queryFn: fetchKcetSubjects,
  });

  const { data: categories } = useQuery({
    queryKey: ["kcet-categories"],
    queryFn: fetchKcetCategories,
  });

  const subjectOptions = subjects?.map((s) => s.name) || [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
  ];
  const categoryOptions = categories?.map((c) => c.name) || [
    "Notes",
    "PYQs",
    "Mock Papers",
    "Syllabus",
    "Objective Books",
    "Formulas",
  ];

  const [subject, setSubject] = useState("Physics");
  const [category, setCategory] = useState("Notes");
  const [title, setTitle] = useState("");
  const [chapter, setChapter] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [contributorContact, setContributorContact] = useState("");

  const [uploadMode, setUploadMode] = useState<"file" | "link">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [driveUrl, setDriveUrl] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError(
        `File is ${(file.size / (1024 * 1024)).toFixed(1)} MB (max 25 MB direct upload). Please switch to Cloud / Drive Link mode.`
      );
      setUploadMode("link");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: "Material title required", variant: "destructive" });
      return;
    }

    if (uploadMode === "file" && !selectedFile) {
      toast({ title: "Please choose a PDF or Document file", variant: "destructive" });
      return;
    }

    if (uploadMode === "link" && !driveUrl.trim().startsWith("http")) {
      toast({ title: "Please enter a valid Google Drive or PDF URL", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("subject", subject);
      fd.append("category", category);
      fd.append("title", title.trim());
      if (chapter.trim()) fd.append("chapter", chapter.trim());
      if (year.trim()) fd.append("year", year.trim());
      if (description.trim()) fd.append("description", description.trim());
      if (contributorName.trim()) fd.append("contributorName", contributorName.trim());
      if (contributorContact.trim()) fd.append("contributorContact", contributorContact.trim());

      if (uploadMode === "file" && selectedFile) {
        fd.append("file", selectedFile);
      } else {
        fd.append("fileUrl", driveUrl.trim());
      }

      await submitKcetContribution(fd);
      setSubmitted(true);
      toast({
        title: "KCET Material Submitted!",
        description: "Your resource has been queued in the KCET Admin Board for quick review.",
      });
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setChapter("");
    setYear("");
    setDescription("");
    setSelectedFile(null);
    setDriveUrl("");
    setSubmitted(false);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      <MetaNoIndex />

      <div className="flex items-center justify-between">
        <Link href="/kcet">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to KCET Arena</span>
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Rocket className="h-3.5 w-3.5" />
          <span>KCET Student Contribution</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Share KCET Notes &amp; Study Material
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Upload KCET chapter notes, shortcuts, formula cheat sheets, previous year papers, or mock tests. Approved submissions are published straight to the KCET Arena!
        </p>
      </div>

      {submitted ? (
        <div className="rounded-3xl border border-emerald-500/40 bg-[#081523] p-8 text-center space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.12)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Submission Received!</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you for contributing <strong className="text-cyan-300">{title}</strong> ({subject} • {category}). An admin can publish it with 1 click from the KCET Admin Board.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold"
            >
              Share Another Resource
            </Button>
            <Link href="/kcet">
              <Button variant="outline" className="border-slate-700 bg-transparent text-slate-200 hover:bg-white/5">
                Return to KCET Arena
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-cyan-500/25 bg-[#090f24]/95 p-5 sm:p-8 space-y-5 shadow-[0_0_30px_rgba(6,182,212,0.08)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-200">Subject *</Label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-10 rounded-xl bg-[#050814] border border-slate-700 px-3 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-200">Category *</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-xl bg-[#050814] border border-slate-700 px-3 text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kcet-contrib-title" className="text-xs font-bold text-slate-200">
              Material Title *
            </Label>
            <Input
              id="kcet-contrib-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Electrostatics KCET Formula Sheet & Shortcut Tricks"
              className="bg-[#050814] border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="kcet-contrib-chapter" className="text-xs font-bold text-slate-200">
                Chapter / Topic Name
              </Label>
              <Input
                id="kcet-contrib-chapter"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g. Electric Charges & Fields"
                className="bg-[#050814] border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="kcet-contrib-year" className="text-xs font-bold text-slate-200">
                Exam Year <span className="text-slate-400 font-normal">(optional, for PYQs)</span>
              </Label>
              <Input
                id="kcet-contrib-year"
                type="number"
                min={2005}
                max={2030}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2024"
                className="bg-[#050814] border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-cyan-400"
              />
            </div>
          </div>

          {/* Upload Mode Switcher */}
          <div className="space-y-2.5 pt-1">
            <Label className="text-xs font-bold text-slate-200">Resource File or Cloud Link *</Label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#050814] border border-slate-800">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  uploadMode === "file"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload PDF (Max 25MB)</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("link")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  uploadMode === "link"
                    ? "bg-violet-500/20 text-violet-300 border border-violet-400/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Link2 className="h-3.5 w-3.5" />
                <span>Paste Drive / PDF Link</span>
              </button>
            </div>

            {fileError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{fileError}</span>
              </div>
            )}

            {uploadMode === "file" ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-400/60 bg-[#050814]/80 p-6 text-center cursor-pointer transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileCheck className="h-6 w-6 text-emerald-400 shrink-0" />
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-white truncate max-w-xs">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <UploadCloud className="h-7 w-7 text-cyan-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-200">
                      Click to select a PDF or Word document
                    </p>
                    <p className="text-[11px] text-slate-500">Stored cleanly in isolated KCET storage</p>
                  </div>
                )}
              </div>
            ) : (
              <Input
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... or direct PDF URL"
                className="bg-[#050814] border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-violet-400"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kcet-contrib-desc" className="text-xs font-bold text-slate-200">
              Description / Notes (Optional)
            </Label>
            <Textarea
              id="kcet-contrib-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what's inside (e.g., all formulas + 50 solved KCET MCQs)..."
              className="bg-[#050814] border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="kcet-contrib-name" className="text-xs font-bold text-slate-200">
                Your Name (Optional)
              </Label>
              <Input
                id="kcet-contrib-name"
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder="e.g. Aditi S. / Student"
                className="bg-[#050814] border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="kcet-contrib-contact" className="text-xs font-bold text-slate-200">
                Telegram / Email (Optional)
              </Label>
              <Input
                id="kcet-contrib-contact"
                value={contributorContact}
                onChange={(e) => setContributorContact(e.target.value)}
                placeholder="e.g. @username or email"
                className="bg-[#050814] border-slate-700 text-white placeholder:text-slate-500 focus-visible:border-cyan-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold shadow-[0_0_24px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading to KCET Repository...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Submit KCET Study Material</span>
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
