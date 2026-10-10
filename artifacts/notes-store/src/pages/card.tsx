import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useGetCard } from "@workspace/api-client-react";
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
  Sparkles
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupees } from "@/lib/utils";
import { TELEGRAM_LINK } from "@/lib/site-config";

export default function CardPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const [previewIdx, setPreviewIdx] = useState(0);

  const { data: card, isLoading } = useGetCard(id, { query: { enabled: !!id, queryKey: ["card", id] } });

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
        <h2 className="text-xl font-bold text-gray-900 mb-2">Resource not found</h2>
        <p className="text-sm text-gray-500 mb-6">The requested notes card may have been moved or is unavailable.</p>
        <Link href="/">
          <Button variant="default">Go Home</Button>
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

  function handleFreeDownload() {
    setLocation(`/checkout?cardId=${card!.id}&free=true`);
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 sm:py-10">
      {/* Back button */}
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 text-[#5a6b82] hover:text-[#112542] -ml-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Image Preview & Description */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
            {/* Main Preview Container */}
            <div className="aspect-[16/10] sm:aspect-video bg-[#f8fafc] relative flex items-center justify-center overflow-hidden border-b border-[#eef2f6]">
              {currentPreview ? (
                <img
                  src={currentPreview}
                  alt={card.title}
                  className="object-contain w-full h-full max-h-[440px] p-2"
                />
              ) : (
                <div className="text-[#94a3b8] flex flex-col items-center gap-2 p-8 text-center">
                  <FileText className="h-12 w-12 opacity-60" />
                  <span className="text-xs font-medium text-[#94a3b8]">No Preview Available</span>
                </div>
              )}

              {/* Status Badge overlay */}
              <div className="absolute top-3 left-3 flex gap-2">
                {card.isFree && (
                  <span className="bg-[#16a34a] text-white font-semibold text-[11px] px-2.5 py-0.5 rounded-md shadow-2xs">
                    Free
                  </span>
                )}
                {card.isFeatured && (
                  <span className="bg-[#d97706] text-white font-semibold text-[11px] px-2.5 py-0.5 rounded-md shadow-2xs">
                    Popular
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail carousel selector */}
            {previewImages.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-[#f8fafc]/50 border-t border-[#eef2f6]">
                {previewImages.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewIdx(i)}
                    className={`shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1856b8] ${
                      i === previewIdx
                        ? "border-[#1856b8]"
                        : "border-[#e2e8f0] hover:border-[#cbd5e1] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Card */}
          {card.description && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 sm:p-6 space-y-2.5">
              <h2 className="text-sm sm:text-base font-bold text-[#112542]">About this Resource</h2>
              <p className="text-[#5a6b82] leading-relaxed text-sm whitespace-pre-line">
                {card.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Title, Metadata Chips, Pricing & Purchase CTA */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 sm:p-6 space-y-5">
            {/* Subject and tags */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {card.isRecommended && (
                  <Badge className="font-semibold text-xs bg-[#0284c7] text-white border-0">
                    Recommended
                  </Badge>
                )}
                {card.subject && (
                  <Badge variant="secondary" className="font-semibold text-xs bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa]">
                    {card.subject}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs font-medium text-[#64748b] border-[#e2e8f0] bg-[#f8fafc]">
                  {card.resourceType}
                </Badge>
                {card.subtype && (
                  <Badge variant="outline" className="text-xs font-medium text-[#0369a1] border-[#bae6fd] bg-[#f0f9ff]">
                    {card.subtype}
                  </Badge>
                )}
                {card.classLevel && (
                  <Badge variant="outline" className="text-xs font-medium text-[#64748b] border-[#e2e8f0] bg-[#f8fafc]">
                    {card.classLevel}
                  </Badge>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-[#112542] leading-snug tracking-tight">
                {card.title}
              </h1>

              {(card.answerKeyUrl || card.officialSourceUrl) && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {card.answerKeyUrl && (
                    <a
                      href={card.answerKeyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284c7] bg-[#e0f2fe] hover:bg-[#bae6fd] border border-[#bae6fd] px-2.5 py-1 rounded-md transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      View Linked Answer Key
                    </a>
                  )}
                  {card.officialSourceUrl && (
                    <a
                      href={card.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0b57d0] bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#e2e8f0] px-2.5 py-1 rounded-md transition-colors"
                    >
                      Official Source Link &rarr;
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Structured Metadata Chips Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {card.chapter && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#334155]">
                  <BookOpen className="h-3.5 w-3.5 text-[#1856b8] shrink-0" />
                  <span className="truncate font-medium">{card.chapter}</span>
                </div>
              )}
              {card.board && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#334155]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#1856b8] shrink-0" />
                  <span className="truncate font-medium">{card.board} Board</span>
                </div>
              )}
              {card.semester && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#334155]">
                  <Hash className="h-3.5 w-3.5 text-[#1856b8] shrink-0" />
                  <span className="truncate font-medium">{card.semester}</span>
                </div>
              )}
              {card.pageCount && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#334155]">
                  <FileText className="h-3.5 w-3.5 text-[#1856b8] shrink-0" />
                  <span className="font-medium">{card.pageCount} pages</span>
                </div>
              )}
              {card.fileSizeKb ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#334155]">
                  <FileDown className="h-3.5 w-3.5 text-[#1856b8] shrink-0" />
                  <span className="font-medium">{(card.fileSizeKb / 1024).toFixed(1)} MB PDF</span>
                </div>
              ) : card.pdfFileKey?.startsWith("http") ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#ebf3ff] border border-[#dce8fa] text-xs text-[#1856b8]">
                  <FileText className="h-3.5 w-3.5 text-[#1856b8] shrink-0" />
                  <span className="font-medium">Google Drive Document</span>
                </div>
              ) : null}
            </div>

            {/* Pricing Section */}
            <div className="pt-4 border-t border-[#eef2f6] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] block mb-0.5">Price</span>
                  {card.isFree ? (
                    <span className="text-2xl sm:text-3xl font-bold text-[#16a34a]">Free</span>
                  ) : hasDiscount ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-[#112542]">
                        {formatRupees(card.discountPricePaise!)}
                      </span>
                      <span className="text-sm text-[#94a3b8] line-through">
                        {formatRupees(card.pricePaise)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-[#112542]">
                      {formatRupees(card.pricePaise)}
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <span className="bg-[#eaf5ec] text-[#167035] border border-[#d7ecdc] text-xs font-semibold px-2 py-0.5 rounded">
                    Discounted
                  </span>
                )}
              </div>

              {/* Purchase / Download Button */}
              {card.isFree ? (
                <Button onClick={handleFreeDownload} size="lg" className="w-full gap-2 rounded-lg text-sm font-semibold h-11 bg-[#1856b8] hover:bg-[#0b57d0] text-white shadow-none transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Download Free</span>
                </Button>
              ) : (
                <Button onClick={handleBuy} size="lg" className="w-full gap-2 rounded-lg text-sm font-semibold h-11 bg-[#2f74de] hover:bg-[#1f63c8] text-white shadow-none transition-colors">
                  <span>Buy Now &rarr;</span>
                </Button>
              )}

              {/* Reassurance bullet points */}
              <div className="space-y-1.5 pt-1 text-xs text-[#5a6b82]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16a34a] shrink-0" />
                  <span>Instant PDF download after checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16a34a] shrink-0" />
                  <span>Re-download anytime from My Purchases</span>
                </div>
              </div>
            </div>
          </div>

          {/* Telegram Support prompt */}
          <div className="bg-[#eaf2fd] border border-[#dce7f7] rounded-xl p-3.5 flex items-center justify-between text-xs text-[#112542]">
            <span>Have questions about this material?</span>
            <a
              href={card.telegramLink || TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#0284c7] hover:text-[#0369a1] transition-colors"
            >
              <Send className="h-3 w-3" />
              <span>Ask Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

