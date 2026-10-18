import { useState } from "react";
import { Link } from "wouter";
import {
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  Copy,
  Info,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  FileText,
  Send,
  Loader2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-context";

const SUBJECT_OPTIONS = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "Computer Science",
  "Kannada",
  "English",
  "Hindi",
  "Sanskrit",
  "Other / General",
];

const RESOURCE_TYPES = [
  "Chapter Notes & Explanations",
  "Model Question Paper / Blueprint",
  "Previous Year Question Paper (PYQ)",
  "Passing Package / High Yield",
  "Practical Manual / Record / Viva",
  "Formulas & Derivations Sheet",
  "Textbook Solutions",
  "Other",
];

export default function ContributePage() {
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const [contributorName, setContributorName] = useState("");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [resourceType, setResourceType] = useState(RESOURCE_TYPES[0]);
  const [materialTitle, setMaterialTitle] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const isValidDriveUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return false;
    // Allow Google Drive, OneDrive, Dropbox, Mega, etc., but emphasize Google Drive
    return (
      trimmed.includes("drive.google.com") ||
      trimmed.includes("docs.google.com") ||
      trimmed.includes("onedrive.live.com") ||
      trimmed.includes("1drv.ms") ||
      trimmed.includes("dropbox.com") ||
      trimmed.includes("mega.nz") ||
      trimmed.startsWith("https://")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUrl = driveUrl.trim();
    if (!trimmedUrl) {
      toast({
        title: t("Drive Link Required", "ಡ್ರೈವ್ ಲಿಂಕ್ ಅಗತ್ಯವಿದೆ"),
        description: t(
          "Please paste your Google Drive share link to submit your notes.",
          "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ನಮೂದಿಸಿ."
        ),
        variant: "destructive",
      });
      return;
    }

    if (!isValidDriveUrl(trimmedUrl)) {
      toast({
        title: t("Invalid Link", "ಅಮಾನ್ಯವಾದ ಲಿಂಕ್"),
        description: t(
          "Please provide a valid web link (e.g., https://drive.google.com/file/d/...)",
          "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ವೆಬ್ ಲಿಂಕ್ ಒದಗಿಸಿ."
        ),
        variant: "destructive",
      });
      return;
    }

    if (!materialTitle.trim()) {
      toast({
        title: t("Title Required", "ಶೀರ್ಷಿಕೆ ಅಗತ್ಯವಿದೆ"),
        description: t("Please enter a title describing your notes.", "ದಯವಿಟ್ಟು ನೋಟ್ಸ್ ಶೀರ್ಷಿಕೆಯನ್ನು ನಮೂದಿಸಿ."),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL;
      const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";

      // Format payload nicely for admin review
      const formattedMessage = [
        `[COMMUNITY CONTRIBUTION]`,
        `Subject: ${subject}`,
        `Resource Type: ${resourceType}`,
        `Material Title: ${materialTitle.trim()}`,
        `Google Drive Link: ${trimmedUrl}`,
        contributorName.trim() ? `Contributor: ${contributorName.trim()}` : `Contributor: Anonymous`,
        additionalNotes.trim() ? `Notes / Description: ${additionalNotes.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contribution",
          rating: "working_great",
          message: formattedMessage,
          contact: contact.trim() || contributorName.trim() || undefined,
          pageUrl: window.location.href,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit contribution");

      setIsSubmitted(true);
      toast({
        title: t("Contribution Received!", "ಕೊಡುಗೆ ಯಶಸ್ವಿಯಾಗಿ ತಲುಪಿದೆ!"),
        description: t(
          "Thank you! Our academic team will verify the Drive link and publish it for students.",
          "ಧನ್ಯವಾದಗಳು! ನಮ್ಮ ತಂಡವು ಲಿಂಕ್ ಪರಿಶೀಲಿಸಿ ಪ್ರಕಟಿಸಲಿದೆ."
        ),
      });
    } catch (err: any) {
      toast({
        title: t("Submission Error", "ಸಲ್ಲಿಕೆಯಲ್ಲಿ ದೋಷ"),
        description: err.message || t("Please check your internet connection.", "ದಯವಿಟ್ಟು ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copySampleText = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    toast({
      title: "Copied!",
      description: "Permission instructions copied to clipboard.",
    });
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-3.5rem)] py-8 sm:py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb] text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("Community Notes & Materials", "ವಿದ್ಯಾರ್ಥಿ ಸಮುದಾಯ ನೋಟ್ಸ್ ಕೊಡುಗೆ")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
            {t("Contribute Study Materials", "ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ")}
          </h1>
          <p className="text-sm text-[#64748b] mt-2 leading-relaxed">
            {t(
              "Help thousands of Karnataka 2nd PUC students by sharing your handwritten notes, blueprints, or solved question papers. We host all student materials via Google Drive links for fast, free access.",
              "ನಿಮ್ಮ ನೋಟ್ಸ್ ಅಥವಾ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುವ ಮೂಲಕ ಕರ್ನಾಟಕದ ಸಾವಿರಾರು ದ್ವಿತೀಯ ಪಿಯುಸಿ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸಹಾಯ ಮಾಡಿ."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── Visual Step-by-Step Guide ── */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-[#e2e8f0] shadow-sm rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-[#f8fafc] border-b border-[#f1f5f9] pb-3.5">
                <CardTitle className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-[#2563eb]" />
                  <span>{t("How to Get Your Google Drive Link", "ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ಪಡೆಯುವುದು ಹೇಗೆ?")}</span>
                </CardTitle>
                <CardDescription className="text-xs text-[#64748b]">
                  {t("Follow these 4 simple steps on your phone or computer", "ನಿಮ್ಮ ಮೊಬೈಲ್ ಅಥವಾ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಈ 4 ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ")}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#eff6ff] text-[#2563eb] font-bold flex items-center justify-center shrink-0 border border-[#bfdbfe]">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-[#0f172a]">
                      {t("Upload PDF to Google Drive", "ಗೂಗಲ್ ಡ್ರೈವ್‌ಗೆ PDF ಅಪ್‌ಲೋಡ್ ಮಾಡಿ")}
                    </p>
                    <p className="text-[#64748b] leading-relaxed">
                      {t("Open Google Drive app or visit", "ಗೂಗಲ್ ಡ್ರೈವ್ ಆ್ಯಪ್ ತೆರೆಯಿರಿ ಅಥವಾ ಭೇಟಿ ನೀಡಿ")}{" "}
                      <a
                        href="https://drive.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2563eb] font-medium inline-flex items-center gap-0.5 hover:underline"
                      >
                        drive.google.com <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                      , {t("tap '+ New' and upload your PDF file.", "'+ New' ಕ್ಲಿಕ್ ಮಾಡಿ ನಿಮ್ಮ ನೋಟ್ಸ್ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.")}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#eff6ff] text-[#2563eb] font-bold flex items-center justify-center shrink-0 border border-[#bfdbfe]">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-[#0f172a]">
                      {t("Tap 'Share' on your file", "ಫೈಲ್ ಮೇಲೆ 'Share' (ಹಂಚಿಕೊಳ್ಳಿ) ಕ್ಲಿಕ್ ಮಾಡಿ")}
                    </p>
                    <p className="text-[#64748b] leading-relaxed">
                      {t(
                        "Right click on the PDF (or tap the 3 dots on mobile) and select 'Share' &rarr; 'Share'.",
                        "ಪಿಡಿಎಫ್ ಫೈಲ್ ಮೇಲಿನ 3 ಚುಕ್ಕೆಗಳನ್ನು ಒತ್ತಿ 'Share' ಆಯ್ಕೆಮಾಡಿ."
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 3 (Crucial) */}
                <div className="flex gap-3 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                  <div className="h-6 w-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-emerald-950 flex items-center gap-1">
                      <span>{t("Change to 'Anyone with the link'", "General Access ಬದಲಾಯಿಸಿ")}</span>
                    </p>
                    <p className="text-emerald-800 leading-relaxed text-[11.5px]">
                      {t(
                        "Under 'General access', change from 'Restricted' to ",
                        "'General access' ಅಡಿಯಲ್ಲಿ 'Restricted' ನಿಂದ "
                      )}
                      <strong className="text-emerald-950">
                        {t('"Anyone with the link" (Viewer)', '"Anyone with the link" ಗೆ')}
                      </strong>{" "}
                      {t(
                        "so students can read it without needing permission.",
                        "ಬದಲಾಯಿಸಿ."
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#eff6ff] text-[#2563eb] font-bold flex items-center justify-center shrink-0 border border-[#bfdbfe]">
                    4
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-[#0f172a]">
                      {t("Copy Link & Paste in Form", "ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಿ ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ")}
                    </p>
                    <p className="text-[#64748b] leading-relaxed">
                      {t(
                        "Click 'Copy Link' and paste it in the Drive Link input on this page.",
                        "'Copy Link' ಒತ್ತಿ, ಈ ಕೆಳಗಿನ ಫಾರ್ಮ್‌ನಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ ಸಲ್ಲಿಸಿ."
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Benefits Card */}
            <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs space-y-2 text-xs">
              <span className="font-bold text-[#0f172a] block">
                {t("Why Google Drive links?", "ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ಏಕೆ?")}
              </span>
              <ul className="space-y-1.5 text-[#64748b]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{t("You maintain full ownership of your document", "ನಿಮ್ಮ ನೋಟ್ಸ್ ಮಾಲೀಕತ್ವ ನಿಮ್ಮ ಬಳಿಯೇ ಇರುತ್ತದೆ")}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{t("You can update your notes anytime without re-uploading", "ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ನೋಟ್ಸ್ ಅಪ್ಡೇಟ್ ಮಾಡಬಹುದು")}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{t("100% free and fast cloud downloads for students", "ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವೇಗದ ಮತ್ತು ಉಚಿತ ಡೌನ್‌ಲೋಡ್")}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Contribution Form ── */}
          <div className="lg:col-span-7">
            <Card className="border-[#e2e8f0] shadow-sm rounded-xl overflow-hidden bg-white">
              <CardHeader className="border-b border-[#f1f5f9] pb-4">
                <CardTitle className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-[#2563eb]" />
                  <span>{t("Submit Your Study Material", "ನಿಮ್ಮ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ ಸಲ್ಲಿಸಿ")}</span>
                </CardTitle>
                <CardDescription className="text-xs text-[#64748b]">
                  {t("Fill in details and provide your viewable Google Drive link", "ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ಒದಗಿಸಿ")}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 sm:p-6">
                {isSubmitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-[#0f172a]">
                        {t("Thank You for Contributing!", "ಕೊಡುಗೆ ನೀಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!")}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#64748b] max-w-md mx-auto leading-relaxed">
                        {t(
                          "We received your Drive link. Our academic team will verify the link access and publish it to the 2PUC portal shortly.",
                          "ನಿಮ್ಮ ಡ್ರೈವ್ ಲಿಂಕ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಪರಿಶೀಲನೆಯ ನಂತರ ಶೀಘ್ರದಲ್ಲೇ 2PUC ನಲ್ಲಿ ಪ್ರಕಟಿಸಲಾಗುವುದು."
                        )}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsSubmitted(false);
                          setMaterialTitle("");
                          setDriveUrl("");
                          setAdditionalNotes("");
                        }}
                        className="rounded-lg text-xs font-semibold"
                      >
                        {t("Contribute Another Note", "ಮತ್ತೊಂದು ನೋಟ್ಸ್ ಸಲ್ಲಿಸಿ")}
                      </Button>
                      <Link href="/">
                        <Button size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-semibold">
                          {t("Back to Home", "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Material Title */}
                    <div className="space-y-1.5">
                      <Label htmlFor="materialTitle" className="text-xs font-bold text-[#334155]">
                        {t("Notes / Material Title *", "ನೋಟ್ಸ್ ಅಥವಾ ಸಾಮಗ್ರಿಯ ಶೀರ್ಷಿಕೆ *")}
                      </Label>
                      <Input
                        id="materialTitle"
                        required
                        placeholder={t(
                          "e.g., Physics Chapter 3 Current Electricity Handwritten Notes",
                          "ಉದಾ: ಭೌತಶಾಸ್ತ್ರ ಅಧ್ಯಾಯ 3 ಹ್ಯಾಂಡ್‌ರಿಟನ್ ನೋಟ್ಸ್"
                        )}
                        value={materialTitle}
                        onChange={(e) => setMaterialTitle(e.target.value)}
                        className="text-xs sm:text-sm rounded-lg border-[#cbd5e1] focus-visible:ring-[#2563eb]"
                      />
                    </div>

                    {/* Subject & Resource Type Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Subject */}
                      <div className="space-y-1.5">
                        <Label htmlFor="subject" className="text-xs font-bold text-[#334155]">
                          {t("Subject *", "ವಿಷಯ *")}
                        </Label>
                        <select
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full h-9 rounded-lg border border-[#cbd5e1] bg-white px-3 text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                        >
                          {SUBJECT_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Resource Type */}
                      <div className="space-y-1.5">
                        <Label htmlFor="resourceType" className="text-xs font-bold text-[#334155]">
                          {t("Resource Type *", "ಸಂಪನ್ಮೂಲ ಮಾದರಿ *")}
                        </Label>
                        <select
                          id="resourceType"
                          value={resourceType}
                          onChange={(e) => setResourceType(e.target.value)}
                          className="w-full h-9 rounded-lg border border-[#cbd5e1] bg-white px-3 text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                        >
                          {RESOURCE_TYPES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Google Drive Link Input (Core Highlight) */}
                    <div className="space-y-1.5 p-3 sm:p-4 rounded-xl bg-[#eff6ff]/60 border border-[#bfdbfe]">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="driveUrl" className="text-xs font-bold text-[#1e40af] flex items-center gap-1.5">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>{t("Google Drive / Cloud Share Link *", "ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ *")}</span>
                        </Label>
                        <span className="text-[10px] text-[#2563eb] font-semibold">
                          {t("Anyone with link: Viewer", "ವೀವರ್ ಆಕ್ಸೆಸ್ ಇರಬೇಕು")}
                        </span>
                      </div>
                      <Input
                        id="driveUrl"
                        required
                        type="url"
                        placeholder="https://drive.google.com/file/d/..."
                        value={driveUrl}
                        onChange={(e) => setDriveUrl(e.target.value)}
                        className="text-xs sm:text-sm bg-white rounded-lg border-[#93c5fd] font-mono focus-visible:ring-[#2563eb]"
                      />
                      <p className="text-[11px] text-[#64748b]">
                        {t(
                          "Make sure link sharing is set to 'Anyone with the link' so our team can access and publish it.",
                          "ಲಿಂಕ್ ಪ್ರವೇಶವನ್ನು 'Anyone with the link' ಗೆ ಹೊಂದಿಸಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ."
                        )}
                      </p>
                    </div>

                    {/* Contributor Name & Contact (Optional) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="contributorName" className="text-xs font-bold text-[#334155]">
                          {t("Your Name / Credit (Optional)", "ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)")}
                        </Label>
                        <Input
                          id="contributorName"
                          placeholder={t("e.g. Ramesh K. (PU Lecturer)", "ಉದಾ: ರಮೇಶ್")}
                          value={contributorName}
                          onChange={(e) => setContributorName(e.target.value)}
                          className="text-xs sm:text-sm rounded-lg border-[#cbd5e1]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="contact" className="text-xs font-bold text-[#334155]">
                          {t("Email or Telegram (Optional)", "ಇಮೇಲ್ ಅಥವಾ ಟೆಲಿಗ್ರಾಂ (ಐಚ್ಛಿಕ)")}
                        </Label>
                        <Input
                          id="contact"
                          placeholder="e.g. @username or student@gmail.com"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="text-xs sm:text-sm rounded-lg border-[#cbd5e1]"
                        />
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-1.5">
                      <Label htmlFor="additionalNotes" className="text-xs font-bold text-[#334155]">
                        {t("Additional Description (Optional)", "ಹೆಚ್ಚುವರಿ ವಿವರಣೆ (ಐಚ್ಛಿಕ)")}
                      </Label>
                      <Textarea
                        id="additionalNotes"
                        rows={2}
                        placeholder={t(
                          "Include chapter numbers, key topics covered, or college name...",
                          "ಅಧ್ಯಾಯದ ಸಂಖ್ಯೆಗಳು ಅಥವಾ ಪ್ರಮುಖ ಮುಖ್ಯಾಂಶಗಳನ್ನು ನಮೂದಿಸಿ..."
                        )}
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        className="text-xs sm:text-sm rounded-lg border-[#cbd5e1] resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs sm:text-sm h-10 rounded-lg shadow-2xs gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{t("Submitting Contribution...", "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...")}</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>{t("Submit Study Material Link", "ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ ಲಿಂಕ್ ಸಲ್ಲಿಸಿ")}</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
