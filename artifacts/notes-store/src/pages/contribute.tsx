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

  // Direct file upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedDriveUrl, setUploadedDriveUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Maximum file size: 25 MB
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(t("File size exceeds 25 MB. Please choose a smaller file.", "ಫೈಲ್ ಗಾತ್ರ 25 MB ಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ."));
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);

    // If title is empty, prefill from file name
    if (!materialTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setMaterialTitle(cleanName);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileError(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(t("File size exceeds 25 MB. Please choose a smaller file.", "ಫೈಲ್ ಗಾತ್ರ 25 MB ಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ."));
      return;
    }

    setSelectedFile(file);
    if (!materialTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setMaterialTitle(cleanName);
    }
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

    if (!selectedFile) {
      toast({
        title: t("PDF File Required", "ಪಿಡಿಎಫ್ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ"),
        description: t("Please choose your study notes PDF file to upload.", "ದಯವಿಟ್ಟು ನಿಮ್ಮ ನೋಟ್ಸ್ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ."),
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

    setIsUploading(true);
    setUploadProgressText(t("Reading file & uploading to Google Drive...", "ಗೂಗಲ್ ಡ್ರೈವ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."));

    try {
      // Step 1: Convert file to Base64
      const base64Content = await fileToBase64(selectedFile);

      // Step 2: Send directly to Google Apps Script Web App (uploads into user's Google Drive)
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

      const generatedDriveUrl = driveData.fileUrl;
      setUploadedDriveUrl(generatedDriveUrl);

      // Step 3: Record contribution in the backend database for Admin approval
      setUploadProgressText(t("Registering contribution for Admin review...", "ಅಡ್ಮಿನ್ ಪರಿಶೀಲನೆಗೆ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ..."));

      const rawApiUrl = import.meta.env.VITE_API_URL;
      const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";

      const formattedMessage = [
        `[COMMUNITY CONTRIBUTION]`,
        `Subject: ${subject}`,
        `Resource Type: ${resourceType}`,
        `Material Title: ${materialTitle.trim()}`,
        `Google Drive Link: ${generatedDriveUrl}`,
        `File Name: ${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)`,
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
        console.warn("Could not save to feedback db, but file uploaded to Drive successfully.");
      }

      setIsSubmitted(true);
      toast({
        title: t("Uploaded to Google Drive!", "ಗೂಗಲ್ ಡ್ರೈವ್‌ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ!"),
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
              "Select your PDF notes, solutions, or model question papers. Your file is automatically saved into our Google Drive library and published for thousands of 2nd PUC students.",
              "ನಿಮ್ಮ ಪಿಡಿಎಫ್ ನೋಟ್ಸ್ ಅಥವಾ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ. ನಿಮ್ಮ ಫೈಲ್ ನೇರವಾಗಿ ನಮ್ಮ ಗೂಗಲ್ ಡ್ರೈವ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತದೆ."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Easy Benefits & Info ── */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-[#e2e8f0] shadow-sm rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-[#f8fafc] border-b border-[#f1f5f9] pb-3.5">
                <CardTitle className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-[#2563eb]" />
                  <span>{t("Direct Cloud Upload", "ನೇರ ಕ್ಲೌಡ್ ಅಪ್‌ಲೋಡ್")}</span>
                </CardTitle>
                <CardDescription className="text-xs text-[#64748b]">
                  {t("No Google Drive setup needed from your side", "ನಿಮ್ಮ ಕಡೆಯಿಂದ ಯಾವುದೇ ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ಅಗತ್ಯವಿಲ್ಲ")}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 space-y-3.5 text-xs">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f172a]">
                      {t("Zero Burden On You", "ಯಾವುದೇ ಗೊಂದಲವಿಲ್ಲ")}
                    </p>
                    <p className="text-[#64748b] leading-relaxed mt-0.5">
                      {t(
                        "You don't need to configure permissions or create links. Just pick your PDF and hit upload.",
                        "ನೀವು ಲಿಂಕ್ ರಚಿಸುವ ಅಗತ್ಯವಿಲ್ಲ. ಕೇವಲ ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f172a]">
                      {t("Saved Directly into 2PUC Cloud", "2PUC ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಸಂಗ್ರಹ")}
                    </p>
                    <p className="text-[#64748b] leading-relaxed mt-0.5">
                      {t(
                        "Uploaded files go straight into our permanent Google Drive storage.",
                        "ಫೈಲ್‌ಗಳು ಸುರಕ್ಷಿತವಾಗಿ ಗೂಗಲ್ ಡ್ರೈವ್‌ನಲ್ಲಿ ಸಂಗ್ರಹವಾಗುತ್ತವೆ."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f172a]">
                      {t("Verified Before Publishing", "ಪರಿಶೀಲಿಸಿ ಪ್ರಕಟ")}
                    </p>
                    <p className="text-[#64748b] leading-relaxed mt-0.5">
                      {t(
                        "Our admin team checks the syllabus alignment and publishes it under the right subject & category.",
                        "ನಮ್ಮ ತಂಡವು ಪಠ್ಯಕ್ರಮ ಪರಿಶೀಲಿಸಿ ಸೂಕ್ತ ವಿಷಯದಡಿಯಲ್ಲಿ ಪ್ರಕಟಿಸುತ್ತದೆ."
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supported formats card */}
            <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs space-y-2 text-xs">
              <span className="font-bold text-[#0f172a] block">
                {t("Supported File Formats", "ಬೆಂಬಲಿತ ಫೈಲ್‌ಗಳು")}
              </span>
              <p className="text-[#64748b] leading-relaxed">
                {t(
                  "PDF documents, scanned notes, blueprints, and question papers up to 25 MB are supported.",
                  "25 MB ವರೆಗಿನ PDF ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳು ಮತ್ತು ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ನೋಟ್ಸ್‌ಗಳು ಬೆಂಬಲಿತವಾಗಿವೆ."
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
                    {/* Direct File Drag & Drop / Browse Box */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#334155]">
                        {t("Select PDF Document *", "PDF ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ *")}
                      </Label>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {!selectedFile ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          className="border-2 border-dashed border-[#93c5fd] hover:border-[#2563eb] bg-[#eff6ff]/40 hover:bg-[#eff6ff]/70 transition-all rounded-xl p-6 sm:p-8 text-center cursor-pointer group"
                        >
                          <div className="h-12 w-12 rounded-full bg-white text-[#2563eb] flex items-center justify-center mx-auto mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                            <UploadCloud className="h-6 w-6" />
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-[#0f172a]">
                            {t("Click to browse or drag and drop your PDF here", "PDF ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಇಲ್ಲಿ ಎಳೆಯಿರಿ")}
                          </p>
                          <p className="text-[11px] text-[#64748b] mt-1">
                            {t("PDF files up to 25 MB", "ಗರಿಷ್ಠ 25 MB ವರೆಗಿನ PDF")}
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
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; PDF
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
