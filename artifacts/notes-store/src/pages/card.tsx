import { SeoHead } from "@/components/seo-head";
import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useGetCard } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Download,
  BookOpen,
  Hash,
  FileDown,
  ShieldCheck,
  CheckCircle2,
  Send,
  Sparkles,
  Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupees } from "@/lib/utils";
import { TELEGRAM_LINK } from "@/lib/site-config";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-context";
import { getSubjectDisplayName, getResourceTypeDisplayName } from "@/lib/site-navigation";

export default function CardPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const [previewIdx, setPreviewIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const isKn = language === "kn";

  const queryClient = useQueryClient();
  const { data: card, isLoading } = useGetCard(id, {
    query: {
      enabled: !!id,
      queryKey: ["card", id],
      initialData: () => {
        // Instant 0ms render if this card exists anywhere in React Query cache
        for (const [, cache] of queryClient.getQueriesData<any>({})) {
          if (Array.isArray(cache)) {
            const match = cache.find((c) => c && typeof c === "object" && c.id === id);
            if (match && match.title) return match;
          }
        }
        return undefined;
      },
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 w-full">
        <Skeleton className="h-8 w-28 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-80 sm:h-96 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mx-auto mb-4">
          <FileText className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t("Resource not found", "ಸಂಪನ್ಮೂಲ ಕಂಡುಬಂದಿಲ್ಲ")}</h2>
        <p className="text-sm text-gray-500 mb-6">{t("The requested notes card may have been moved or is unavailable.", "ಕೋರಿದ ನೋಟ್ಸ್ ಕಾರ್ಡ್ ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ತೆಗೆದುಹಾಕಿರಬಹುದು.")}</p>
        <Link href="/">
          <Button variant="default">{t("Go Home", "ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ")}</Button>
        </Link>
      </div>
    );
  }

  const previewImages = card.previewImageUrls ?? [];
  const currentPreview = previewImages[previewIdx] || card.thumbnailUrl;
  const hasDiscount = Boolean(
    !card.isFree &&
    card.discountPricePaise &&
    card.discountPricePaise < card.pricePaise
  );

  function handleBuy() {
    setLocation(`/checkout?cardId=${card!.id}`);
  }

  async function handleFreeDownload() {
    if (!card) return;
    setDownloading(true);
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL;
      const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";
      const res = await fetch(`${API_URL}/api/checkout/free-download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to download");
      
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = data.filename || `${card.title}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast({ title: t("Download Started", "ಡೌನ್‌ಲೋಡ್ ಪ್ರಾರಂಭವಾಯಿತು"), description: t("Your free PDF study resource is opening.", "ನಿಮ್ಮ ಉಚಿತ PDF ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ ತೆರೆಯುತ್ತಿದೆ.") });
    } catch (err: any) {
      toast({
        title: t("Download Failed", "ಡೌನ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ"),
        description: err.message || t("Failed to download free resource", "ಉಚಿತ ಸಂಪನ್ಮೂಲ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ"),
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 sm:py-10">
      <SeoHead
        title={`${card.title} - 2nd PUC Notes PDF Download | 2PUC`}
        description={`${card.title} for Karnataka 2nd PUC ${card.subject || "Science"}. ${card.description ? card.description.slice(0, 160) : "Download high-quality 2nd PUC study materials, question banks, and solutions."}`}
        keywords={`2nd puc ${card.title.toLowerCase()}, 2nd puc ${card.subject?.toLowerCase() || "science"} notes, karnataka 2nd puc pdf, 2nd puc question bank`}
        canonicalPath={`/card/${card.id}`}
      />
      {/* Back button */}
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 text-[#475569] dark:text-[#A1AEC2] hover:text-[#0f172a] dark:hover:text-[#F1F5F9] -ml-2 mb-6 font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>{t("Back to Notes", "ನೋಟ್ಸ್‌ಗೆ ಹಿಂತಿರುಗಿ")}</span>
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Image Preview (only if available) & Description */}
        <div className={`space-y-6 ${currentPreview || card.description ? "lg:col-span-7" : "hidden"}`}>
          {currentPreview && (
            <div className="bg-white dark:bg-[#151D2E] rounded-2xl border border-[#e2e8f0] dark:border-[#293548] overflow-hidden shadow-xs">
              {/* Main Preview Container */}
              <div className="aspect-[16/10] sm:aspect-video bg-[#f8fafc] dark:bg-[#111827] relative flex items-center justify-center overflow-hidden border-b border-[#eef2f6] dark:border-[#293548]">
                <img
                  src={currentPreview}
                  alt={card.title}
                  className="object-contain w-full h-full max-h-[440px] p-2"
                />

                {/* Status Badge overlay */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {card.isFree && (
                    <span className="bg-[#16a34a] text-white font-semibold text-[11px] px-2.5 py-0.5 rounded shadow-2xs">
                      {t("Free", "ಉಚಿತ")}
                    </span>
                  )}
                  {card.isFeatured && (
                    <span className="bg-[#d97706] text-white font-semibold text-[11px] px-2.5 py-0.5 rounded shadow-2xs">
                      {t("Popular", "ಜನಪ್ರಿಯ")}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail carousel selector */}
              {previewImages.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto bg-[#f8fafc]/50 dark:bg-[#111827]/50 border-t border-[#eef2f6] dark:border-[#293548]">
                  {previewImages.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewIdx(i)}
                      className={`shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] ${
                        i === previewIdx
                          ? "border-[#2563eb] dark:border-[#818CF8]"
                          : "border-[#e2e8f0] dark:border-[#293548] hover:border-[#cbd5e1] dark:hover:border-[#818CF8]/60 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description Card */}
          {card.description && (
            <div className="bg-white dark:bg-[#151D2E] rounded-2xl border border-[#e2e8f0] dark:border-[#293548] p-5 sm:p-6 space-y-2.5 shadow-xs">
              <h2 className="text-sm sm:text-base font-bold text-[#0f172a] dark:text-[#F1F5F9]">{t("About this Resource", "ಸಂಪನ್ಮೂಲದ ವಿವರ")}</h2>
              <p className="text-[#64748b] dark:text-[#A1AEC2] leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                {card.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Title, Metadata Chips, Pricing & Purchase CTA */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-[#151D2E] rounded-2xl border border-[#e2e8f0] dark:border-[#293548] p-5 sm:p-6 space-y-5 shadow-xs">
            {/* Subject and tags */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {card.isRecommended && (
                  <Badge className="font-semibold text-[11px] bg-[#0284c7] text-white border-0 shadow-2xs">
                    {t("Recommended", "ಶಿಫಾರಸು")}
                  </Badge>
                )}
                {card.subject && (
                  <Badge variant="secondary" className="font-semibold text-[11px] bg-[#eff6ff] dark:bg-[#1C2638] text-[#2563eb] dark:text-[#818CF8] border border-[#bfdbfe] dark:border-[#293548]">
                    {getSubjectDisplayName(card.subject, isKn)}
                  </Badge>
                )}
                <Badge variant="outline" className="text-[11px] font-medium text-[#475569] dark:text-[#A1AEC2] border-[#e2e8f0] dark:border-[#293548] bg-[#f8fafc] dark:bg-[#1C2638]">
                  {getResourceTypeDisplayName(card.resourceType, isKn)}
                </Badge>
                {card.subtype && (
                  <Badge variant="outline" className="text-[10px] font-medium text-[#0284c7] dark:text-sky-300 border-[#bae6fd] dark:border-sky-800/50 bg-[#f0f9ff] dark:bg-sky-950/40">
                    {card.subtype}
                  </Badge>
                )}
                {card.classLevel && (
                  <Badge variant="outline" className="text-[11px] font-medium text-[#475569] dark:text-[#A1AEC2] border-[#e2e8f0] dark:border-[#293548] bg-[#f8fafc] dark:bg-[#1C2638]">
                    {card.classLevel}
                  </Badge>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-[#F1F5F9] leading-snug tracking-tight">
                {card.title}
              </h1>

              {(card.answerKeyUrl || card.officialSourceUrl) && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {card.answerKeyUrl && (
                    <a
                      href={card.answerKeyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284c7] dark:text-sky-300 bg-[#f0f9ff] dark:bg-sky-950/40 hover:bg-[#e0f2fe] dark:hover:bg-sky-900/50 border border-[#bae6fd] dark:border-sky-800/50 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {t("View Linked Answer Key", "ಲಿಂಕ್ ಮಾಡಲಾದ ಕೀ ಉತ್ತರಗಳು")}
                    </a>
                  )}
                  {card.officialSourceUrl && (
                    <a
                      href={card.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] dark:text-[#A1AEC2] hover:text-[#0f172a] dark:hover:text-[#F1F5F9] bg-[#f8fafc] dark:bg-[#1C2638] hover:bg-[#e2e8f0] dark:hover:bg-[#253248] border border-[#e2e8f0] dark:border-[#293548] px-2.5 py-1 rounded-md transition-colors"
                    >
                      {t("Official Source Link →", "ಅಧಿಕೃತ ಲಿಂಕ್ →")}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Structured Metadata Chips Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {card.chapter && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] text-xs text-[#334155] dark:text-[#F1F5F9]">
                  <BookOpen className="h-3.5 w-3.5 text-[#2563eb] dark:text-[#818CF8] shrink-0" />
                  <span className="truncate font-semibold">{card.chapter}</span>
                </div>
              )}
              {card.board && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] text-xs text-[#334155] dark:text-[#F1F5F9]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2563eb] dark:text-[#818CF8] shrink-0" />
                  <span className="truncate font-semibold">{card.board} {t("Board", "ಮಂಡಳಿ")}</span>
                </div>
              )}
              {card.semester && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] text-xs text-[#334155] dark:text-[#F1F5F9]">
                  <Hash className="h-3.5 w-3.5 text-[#2563eb] dark:text-[#818CF8] shrink-0" />
                  <span className="truncate font-semibold">{card.semester}</span>
                </div>
              )}
              {card.pageCount && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] text-xs text-[#334155] dark:text-[#F1F5F9]">
                  <FileText className="h-3.5 w-3.5 text-[#2563eb] dark:text-[#818CF8] shrink-0" />
                  <span className="font-semibold">{card.pageCount} {t("pages", "ಪುಟಗಳು")}</span>
                </div>
              )}
              {card.fileSizeKb ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border border-[#e2e8f0] dark:border-[#293548] text-xs text-[#334155] dark:text-[#F1F5F9]">
                  <FileDown className="h-3.5 w-3.5 text-[#2563eb] dark:text-[#818CF8] shrink-0" />
                  <span className="font-semibold">{(card.fileSizeKb / 1024).toFixed(1)} MB PDF</span>
                </div>
              ) : card.pdfFileKey?.startsWith("http") ? (
                <div className={`flex items-center gap-2 p-2.5 rounded-xl text-xs ${
                  card.pdfFileKey.includes("gov.in")
                    ? "bg-[#f0f9ff] border border-[#bae6fd] text-[#0284c7]"
                    : "bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb]"
                }`}>
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-semibold">
                    {card.pdfFileKey.includes("gov.in") ? t("Official Government Resource", "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಸಂಪನ್ಮೂಲ") : t("Google Drive Document", "ಗೂಗಲ್ ಡ್ರೈವ್ ಡಾಕ್ಯುಮೆಂಟ್")}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Pricing Section */}
            <div className="pt-4 border-t border-[#f1f5f9] dark:border-[#293548] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] block mb-0.5">{t("Price", "ಬೆಲೆ")}</span>
                  {card.isFree ? (
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#16a34a]">{t("Free", "ಉಚಿತ")}</span>
                  ) : hasDiscount ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-[#F1F5F9]">
                        {formatRupees(card.discountPricePaise!)}
                      </span>
                      <span className="text-sm text-[#94a3b8] line-through">
                        {formatRupees(card.pricePaise)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-[#F1F5F9]">
                      {formatRupees(card.pricePaise)}
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <span className="bg-[#eff6ff] dark:bg-[#1C2638] text-[#2563eb] dark:text-[#818CF8] border border-[#bfdbfe] dark:border-[#293548] text-xs font-bold px-2 py-0.5 rounded-full">
                    {t("Discounted", "ರಿಯಾಯಿತಿ")}
                  </span>
                )}
              </div>

              {/* Purchase / Download Button */}
              {card.isFree ? (
                <Button 
                  onClick={handleFreeDownload} 
                  disabled={downloading}
                  size="lg" 
                  className="w-full gap-2 rounded-xl text-sm font-semibold h-11 bg-[#16a34a] hover:bg-[#15803d] text-white shadow-2xs transition-all"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t("Opening PDF...", "PDF ತೆರೆಯಲಾಗುತ್ತಿದೆ...")}</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>{t("Download Free PDF", "ಉಚಿತ PDF ಡೌನ್‌ಲೋಡ್")}</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleBuy} size="lg" className="w-full gap-2 rounded-xl text-sm font-semibold h-11 bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#818CF8] dark:hover:bg-[#6366F1] text-white shadow-2xs transition-all">
                  <span>{t("Buy Now →", "ಈಗಲೇ ಖರೀದಿಸಿ →")}</span>
                </Button>
              )}
            </div>
          </div>

          {/* Telegram Support prompt */}
          <div className="bg-[#eff6ff] dark:bg-[#111827] border border-[#bfdbfe]/80 dark:border-[#293548] rounded-2xl p-3.5 px-4.5 flex items-center justify-between text-xs text-[#0f172a] dark:text-[#F1F5F9] shadow-2xs">
            <span className="font-medium text-[#475569] dark:text-[#A1AEC2]">{t("Have questions about this material?", "ಈ ಸಾಮಗ್ರಿಯ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ?")}</span>
            <a
              href={card.telegramLink || TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#2563eb] dark:text-[#818CF8] hover:text-[#1d4ed8] dark:hover:text-[#a5b4fc] transition-colors"
            >
              <Send className="h-3 w-3" />
              <span>{t("Ask Support", "ಸಹಾಯ ಪಡೆಯಿರಿ")}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

