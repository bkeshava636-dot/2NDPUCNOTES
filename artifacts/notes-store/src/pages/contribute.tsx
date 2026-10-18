import { useState, useRef } from "react";
import { Link } from "wouter";
import {
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText,
  Send,
  Loader2,
  HardDrive,
  Check,
  X,
  FileCheck,
  FolderSync,
  Link2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-context";

// User's Google Apps Script Web App that saves uploads straight to their Google Drive
const GOOGLE_SCRIPT_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbzGHjAW2FQg7elDU4lezR2n4jC54qMX7-WoZtk75Jx2qON9mf5kGJIPNVkSRSxMSIg9fQ/exec";

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
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Upload mode: 'file' (direct upload up to 25MB) or 'link' (for files > 25MB or existing Drive links)
  const [uploadMode, setUploadMode] = useState<"file" | "link">("file");
  const [driveUrl, setDriveUrl] = useState("");
  const [largeFileNotice, setLargeFileNotice] = useState<string | null>(null);

  // Direct file upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedDriveUrl, setUploadedDriveUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileSelection = (file: File) => {
    setFileError(null);
    setLargeFileNotice(null);

    // If file > 25 MB, automatically redirect them to Google Drive Link mode
    const maxSize = 25 * 1024 * 1024;
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);

    if (file.size > maxSize) {
      setUploadMode("link");
      setLargeFileNotice(
        t(
          `"${file.name}" is ${fileSizeMb} MB, which is larger than the 25 MB direct upload limit. We switched you to Google Drive Link mode below!`,
          `"${file.name}" ${fileSizeMb} MB ಇದೆ, ಇದು 25 MB ಮಿತಿಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ. ಆದ್ದರಿಂದ ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ!`
        )
      );
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Prefill title if empty
      if (!materialTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setMaterialTitle(cleanName);
      }

      toast({
        title: t("Large File Detected (> 25 MB)", "ದೊಡ್ಡ ಫೈಲ್ ಕಂಡುಬಂದಿದೆ (> 25 MB)"),
        description: t(
          "Switched to Google Drive Link mode. Please upload to your Google Drive and paste the link below.",
          "ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಡ್ರೈವ್ ಲಿಂಕ್ ನಮೂದಿಸಿ."
        ),
      });
      return;
    }

    setSelectedFile(file);

    // If title is empty, prefill from file name
    if (!materialTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setMaterialTitle(cleanName);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }
    processFileSelection(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFileSelection(file);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Split data URL to get just the base64 string
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!materialTitle.trim()) {
      toast({
        title: t("Title Required", "ಶೀರ್ಷಿಕೆ ಅಗತ್ಯವಿದೆ"),
        description: t("Please enter a title describing your notes.", "ದಯವಿಟ್ಟು ನೋಟ್ಸ್ ಶೀರ್ಷಿಕೆಯನ್ನು ನಮೂದಿಸಿ."),
        variant: "destructive",
      });
      return;
    }

    // Direct file upload mode
    if (uploadMode === "file") {
      if (!selectedFile) {
        toast({
          title: t("Document File Required", "ದಾಖಲೆ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ"),
          description: t("Please choose your study notes PDF or Word document (.docx/.doc).", "ದಯವಿಟ್ಟು ನಿಮ್ಮ PDF ಅಥವಾ Word ದಾಖಲೆ ಆಯ್ಕೆಮಾಡಿ."),
          variant: "destructive",
        });
        return;
      }
    } else {
      // Google Drive link mode (for files > 25MB)
      const trimmedUrl = driveUrl.trim();
      if (!trimmedUrl) {
        toast({
          title: t("Google Drive Link Required", "ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ಅಗತ್ಯವಿದೆ"),
          description: t("Please enter your Google Drive share link.", "ದಯವಿಟ್ಟು ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ನಮೂದಿಸಿ."),
          variant: "destructive",
        });
        return;
      }
      if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
        toast({
          title: t("Invalid URL", "ಅಮಾನ್ಯವಾದ ಲಿಂಕ್"),
          description: t("URL must start with https:// or http://", "ಲಿಂಕ್ https:// ಅಥವಾ http:// ನಿಂದ ಪ್ರಾರಂಭವಾಗಬೇಕು."),
          variant: "destructive",
        });
        return;
      }
    }

    if (!materialTitle.trim()) {
      toast({
        title: t("Title Required", "ಶೀರ್ಷಿಕೆ ಅಗತ್ಯವಿದೆ"),
        description: t("Please enter a title describing your notes.", "ದಯವಿಟ್ಟು ನೋಟ್ಸ್ ಶೀರ್ಷಿಕೆಯನ್ನು ನಮೂದಿಸಿ."),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      let finalDriveUrl = "";
      let fileMetaText = "";

      if (uploadMode === "file" && selectedFile) {
        // Direct file upload: upload to user's Google Drive via Apps Script
        setUploadProgressText(t("Reading file & uploading to Google Drive...", "ಗೂಗಲ್ ಡ್ರೈವ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."));
        const base64Content = await fileToBase64(selectedFile);

        setUploadProgressText(t("Uploading directly to Google Drive...", "ಗೂಗಲ್ ಡ್ರೈವ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗುತ್ತಿದೆ..."));

        const googlePayload = {
          fileBase64: base64Content,
          fileName: selectedFile.name,
          mimeType: selectedFile.type || "application/pdf",
          subject,
          resourceType,
          materialTitle: materialTitle.trim(),
          contributorName: contributorName.trim() || "Anonymous",
        };

        const driveRes = await fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(googlePayload),
        });

        const driveData = await driveRes.json();
        if (!driveData || driveData.status !== "success" || !driveData.fileUrl) {
          throw new Error(driveData?.message || "Failed to save file to Google Drive.");
        }

        finalDriveUrl = driveData.fileUrl;
        fileMetaText = `File Name: ${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)`;
        setUploadedDriveUrl(finalDriveUrl);
      } else {
        // Google Drive link mode (for large files > 25MB)
        finalDriveUrl = driveUrl.trim();
        fileMetaText = `Large File / Cloud Link (> 25 MB)`;
        setUploadedDriveUrl(finalDriveUrl);
      }

      // Record contribution in the backend database for Admin approval
      setUploadProgressText(t("Registering contribution for Admin review...", "ಅಡ್ಮಿನ್ ಪರಿಶೀಲನೆಗೆ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ..."));

      const rawApiUrl = import.meta.env.VITE_API_URL;
      const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";

      const formattedMessage = [
        `[COMMUNITY CONTRIBUTION]`,
        `Subject: ${subject}`,
        `Resource Type: ${resourceType}`,
        `Material Title: ${materialTitle.trim()}`,
        `Google Drive Link: ${finalDriveUrl}`,
        fileMetaText,
        contributorName.trim() ? `Contributor: ${contributorName.trim()}` : `Contributor: Anonymous`,
        additionalNotes.trim() ? `Notes / Description: ${additionalNotes.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const dbRes = await fetch(`${API_URL}/api/feedback`, {
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

      if (!dbRes.ok) {
        console.warn("Could not save to feedback db, but link recorded.");
      }

      setIsSubmitted(true);
      toast({
        title: uploadMode === "file" 
          ? t("Uploaded to Google Drive!", "ಗೂಗಲ್ ಡ್ರೈವ್‌ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ!")
          : t("Drive Link Submitted!", "ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ಸಲ್ಲಿಸಲಾಗಿದೆ!"),
        description: t(
          "Your study material is received and ready for review.",
          "ನಿಮ್ಮ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ."
        ),
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({
        title: t("Upload Failed", "ಅಪ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ"),
        description: err.message || t("Please check your internet connection.", "ದಯವಿಟ್ಟು ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ."),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgressText("");
    }
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
            {t("Upload & Share Study Materials", "ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ")}
          </h1>
          <p className="text-sm text-[#64748b] mt-2 leading-relaxed">
            {t(
              "Select your PDF or Word document (.docx/.doc) notes, solutions, or model question papers. Your file is automatically saved into our Google Drive library and published for thousands of 2nd PUC students.",
              "ನಿಮ್ಮ PDF ಅಥವಾ Word ದಾಖಲೆ (.docx/.doc) ನೋಟ್ಸ್ ಅಥವಾ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ. ನಿಮ್ಮ ಫೈಲ್ ನೇರವಾಗಿ ನಮ್ಮ ಗೂಗಲ್ ಡ್ರೈವ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತದೆ."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Step-by-Step Instructions for User ── */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-[#e2e8f0] shadow-sm rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-[#f8fafc] border-b border-[#f1f5f9] pb-3.5">
                <CardTitle className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-[#2563eb]" />
                  <span>{t("How to Submit Notes (3 Easy Steps)", "ನೋಟ್ಸ್ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ? (3 ಸುಲಭ ಹಂತಗಳು)")}</span>
                </CardTitle>
                <CardDescription className="text-xs text-[#64748b]">
                  {t("Follow these quick steps to share your study materials", "ನಿಮ್ಮ ನೋಟ್ಸ್ ಹಂಚಿಕೊಳ್ಳಲು ಈ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ")}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#eff6ff] text-[#2563eb] font-bold flex items-center justify-center shrink-0 border border-[#bfdbfe]">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f172a]">
                      {t("Select Your PDF or Word File", "ನಿಮ್ಮ PDF ಅಥವಾ Word ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ")}
                    </p>
                    <p className="text-[#64748b] leading-relaxed mt-0.5">
                      {t(
                        "Click the upload box on the right (or drag and drop). Select your PDF, DOCX, or DOC file from your phone or computer (up to 25 MB).",
                        "ಬಲಬದಿಯ ಬಾಕ್ಸ್ ಕ್ಲಿಕ್ ಮಾಡಿ ನಿಮ್ಮ ಮೊಬೈಲ್ ಅಥವಾ ಕಂಪ್ಯೂಟರ್‌ನಿಂದ PDF, DOCX ಅಥವಾ DOC ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ (ಗರಿಷ್ಠ 25 MB)."
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#eff6ff] text-[#2563eb] font-bold flex items-center justify-center shrink-0 border border-[#bfdbfe]">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f172a]">
                      {t("Add Title & Choose Subject", "ಶೀರ್ಷಿಕೆ ಮತ್ತು ವಿಷಯ ಆಯ್ಕೆಮಾಡಿ")}
                    </p>
                    <p className="text-[#64748b] leading-relaxed mt-0.5">
                      {t(
                        "Type a clear title (e.g. Physics Chapter 3 Current Electricity) and select the subject & material type (Notes, Blueprints, PYQ).",
                        "ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಯ ಶೀರ್ಷಿಕೆ ಮತ್ತು ಸೂಕ್ತ ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ."
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-950">
                      {t("Click 'Upload & Submit'", "'ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಸಲ್ಲಿಸಿ' ಕ್ಲಿಕ್ ಮಾಡಿ")}
                    </p>
                    <p className="text-emerald-800 leading-relaxed mt-0.5">
                      {t(
                        "Hit the submit button. That's it! Your file is automatically saved into our Google Drive and reviewed by our team to help students.",
                        "ಸಲ್ಲಿಸು ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ. ನಿಮ್ಮ ಫೈಲ್ ನೇರವಾಗಿ ನಮ್ಮ ಗೂಗಲ್ ಡ್ರೈವ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಸೇವ್ ಆಗುತ್ತದೆ."
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dedicated Note for Files Greater than 25 MB */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 shadow-2xs space-y-1.5 text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{t("File Greater Than 25 MB?", "ಫೈಲ್ 25 MB ಗಿಂತ ಹೆಚ್ಚಿದೆಯೇ?")}</span>
              </span>
              <p className="text-amber-800 leading-relaxed text-[11.5px]">
                {t(
                  "If your document or scanned textbook exceeds 25 MB, simply upload it to your Google Drive and share the link. Our system also automatically switches you to Link mode if you select a file larger than 25 MB!",
                  "ನಿಮ್ಮ ಫೈಲ್ 25 MB ಗಿಂತ ಹೆಚ್ಚಿದ್ದರೆ, ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ಹಂಚಿಕೊಳ್ಳಿ. ನೀವು 25 MB ಗಿಂತ ದೊಡ್ಡ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿದಾಗ ವೆಬ್‌ಸೈಟ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಲಿಂಕ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸುತ್ತದೆ!"
                )}
              </p>
            </div>

            {/* What Happens Next Card */}
            <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs space-y-2 text-xs">
              <span className="font-bold text-[#0f172a] block flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>{t("What happens after upload?", "ಅಪ್‌ಲೋಡ್ ಆದ ನಂತರ ಏನಾಗುತ್ತದೆ?")}</span>
              </span>
              <p className="text-[#64748b] leading-relaxed">
                {t(
                  "Our academic team reviews the syllabus alignment, organizes it into the correct subject & chapter, and publishes it with your name credit for all Karnataka students to read free.",
                  "ನಮ್ಮ ಅಧ್ಯಾಪಕರ ತಂಡವು ಪಠ್ಯಕ್ರಮವನ್ನು ಪರಿಶೀಲಿಸಿ, ಸೂಕ್ತ ವಿಷಯ ಮತ್ತು ಅಧ್ಯಾಯದ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಹೆಸರಿನ ಕ್ರೆಡಿಟ್‌ನೊಂದಿಗೆ ಪ್ರಕಟಿಸುತ್ತದೆ."
                )}
              </p>
            </div>
          </div>

          {/* ── Right Column: File Upload Form ── */}
          <div className="lg:col-span-7">
            <Card className="border-[#e2e8f0] shadow-sm rounded-xl overflow-hidden bg-white">
              <CardHeader className="border-b border-[#f1f5f9] pb-4">
                <CardTitle className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-[#2563eb]" />
                  <span>{t("Upload Study Material", "ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ")}</span>
                </CardTitle>
                <CardDescription className="text-xs text-[#64748b]">
                  {t("File will be saved directly into 2PUC Google Drive", "ಫೈಲ್ ನೇರವಾಗಿ ಗೂಗಲ್ ಡ್ರೈವ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತದೆ")}
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
                        {t("File Uploaded Successfully!", "ಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ!")}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#64748b] max-w-md mx-auto leading-relaxed">
                        {t(
                          "Your material has been saved to our Google Drive. Our academic team will review and categorize it in the store shortly.",
                          "ನಿಮ್ಮ ಫೈಲ್ ಗೂಗಲ್ ಡ್ರೈವ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿದೆ. ಪರಿಶೀಲನೆಯ ನಂತರ ಶೀಘ್ರದಲ್ಲೇ ಪ್ರಕಟಿಸಲಾಗುವುದು."
                        )}
                      </p>
                    </div>

                    {uploadedDriveUrl && (
                      <div className="pt-2">
                        <a
                          href={uploadedDriveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff6ff] text-[#2563eb] text-xs font-semibold hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>{t("View in Google Drive", "ಗೂಗಲ್ ಡ್ರೈವ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ")}</span>
                        </a>
                      </div>
                    )}

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsSubmitted(false);
                          setSelectedFile(null);
                          setMaterialTitle("");
                          setAdditionalNotes("");
                          setUploadedDriveUrl("");
                        }}
                        className="rounded-lg text-xs font-semibold"
                      >
                        {t("Upload Another PDF", "ಮತ್ತೊಂದು PDF ಅಪ್‌ಲೋಡ್ ಮಾಡಿ")}
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
                    {/* Notification Banner when File > 25MB is detected */}
                    {largeFileNotice && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5 shadow-2xs">
                        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-amber-900">{largeFileNotice}</p>
                          <p className="text-amber-800 text-[11px] leading-relaxed">
                            {t(
                              "Files over 25 MB should be uploaded to your Google Drive and shared via link to keep uploads fast and error-free.",
                              "25 MB ಗಿಂತ ದೊಡ್ಡದಾದ ಫೈಲ್‌ಗಳನ್ನು ನಿಮ್ಮ ಗೂಗಲ್ ಡ್ರೈವ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಲಿಂಕ್ ಹಂಚಿಕೊಳ್ಳಿ."
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Mode Selector: Direct File Upload vs Google Drive Link */}
                    <div className="flex items-center gap-1.5 p-1 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
                      <button
                        type="button"
                        onClick={() => {
                          setUploadMode("file");
                          setLargeFileNotice(null);
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          uploadMode === "file"
                            ? "bg-white text-[#0f172a] shadow-2xs border border-[#cbd5e1]"
                            : "text-[#64748b] hover:text-[#0f172a]"
                        }`}
                      >
                        <UploadCloud className="h-3.5 w-3.5 text-[#2563eb]" />
                        <span>{t("Direct Upload (Under 25 MB)", "ನೇರ ಅಪ್‌ಲೋಡ್ (25 MB ವರೆಗೆ)")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUploadMode("link")}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          uploadMode === "link"
                            ? "bg-white text-[#0f172a] shadow-2xs border border-[#cbd5e1]"
                            : "text-[#64748b] hover:text-[#0f172a]"
                        }`}
                      >
                        <Link2 className="h-3.5 w-3.5 text-[#2563eb]" />
                        <span>{t("Google Drive Link (Over 25 MB)", "ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ (25 MB ಗಿಂತ ಹೆಚ್ಚು)")}</span>
                      </button>
                    </div>

                    {uploadMode === "file" ? (
                      /* Direct File Drag & Drop / Browse Box */
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold text-[#334155]">
                            {t("Select Document File (PDF, DOCX, DOC) *", "ದಾಖಲೆ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ (PDF, DOCX, DOC) *")}
                          </Label>
                          <span className="text-[11px] text-[#64748b]">
                            {t("Max 25 MB per file", "ಗರಿಷ್ಠ 25 MB")}
                          </span>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {!selectedFile ? (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-[#93c5fd] hover:border-[#2563eb] bg-[#eff6ff]/40 hover:bg-[#eff6ff]/70 transition-all rounded-xl p-6 sm:p-7 text-center cursor-pointer group"
                          >
                            <div className="h-11 w-11 rounded-full bg-white text-[#2563eb] flex items-center justify-center mx-auto mb-2.5 shadow-2xs group-hover:scale-105 transition-transform">
                              <UploadCloud className="h-5 w-5" />
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-[#0f172a]">
                              {t("Click to browse or drag and drop your document here", "ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಇಲ್ಲಿ ಎಳೆಯಿರಿ")}
                            </p>
                            <p className="text-[11px] text-[#64748b] mt-1">
                              {t("PDF, DOCX, DOC files up to 25 MB", "PDF, DOCX, DOC ಫೈಲ್‌ಗಳು (ಗರಿಷ್ಠ 25 MB)")}
                            </p>
                            <p className="text-[10.5px] text-[#2563eb] font-semibold mt-1.5">
                              {t("File > 25 MB? It will auto-switch to Drive Link!", "ಫೈಲ್ > 25 MB ಇದ್ದರೆ, ಡ್ರೈವ್ ಲಿಂಕ್‌ಗೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಬದಲಾಗುತ್ತದೆ!")}
                            </p>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                <FileCheck className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#0f172a] truncate">
                                  {selectedFile.name}
                                </p>
                                <p className="text-[11px] text-[#64748b]">
                                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; {selectedFile.name.split(".").pop()?.toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedFile(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="h-8 w-8 p-0 text-[#64748b] hover:text-[#e11d48] hover:bg-white rounded-lg shrink-0"
                              title="Remove file"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        {fileError && (
                          <p className="text-[11px] text-[#e11d48] font-medium mt-1">{fileError}</p>
                        )}
                      </div>
                    ) : (
                      /* Google Drive Link Input for Files > 25 MB */
                      <div className="space-y-2 p-3.5 sm:p-4 rounded-xl bg-[#eff6ff]/70 border border-[#bfdbfe]">
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
                        <div className="text-[11px] text-[#475569] space-y-1">
                          <p>
                            {t(
                              "1. Upload your large file (> 25 MB) to Google Drive.",
                              "1. ನಿಮ್ಮ ದೊಡ್ಡ ಫೈಲ್ (> 25 MB) ಗೂಗಲ್ ಡ್ರೈವ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
                            )}
                          </p>
                          <p>
                            {t(
                              "2. Set General access to 'Anyone with the link' (Viewer) and paste the link above.",
                              "2. 'Anyone with the link' (Viewer) ಆಯ್ಕೆಮಾಡಿ ಲಿಂಕ್ ಪೇಸ್ಟ್ ಮಾಡಿ."
                            )}
                          </p>
                        </div>
                      </div>
                    )}

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
                      disabled={isUploading}
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs sm:text-sm h-10 rounded-lg shadow-2xs gap-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{uploadProgressText || t("Uploading...", "ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...")}</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4" />
                          <span>{t("Upload & Submit Note", "ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಸಲ್ಲಿಸಿ")}</span>
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
