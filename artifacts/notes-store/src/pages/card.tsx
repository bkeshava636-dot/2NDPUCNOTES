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
        <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900 -ml-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Image Preview & Description */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Main Preview Container */}
            <div className="aspect-[16/10] sm:aspect-video bg-gray-50 relative flex items-center justify-center overflow-hidden border-b border-gray-100">
              {currentPreview ? (
                <img
                  src={currentPreview}
                  alt={card.title}
                  className="object-contain w-full h-full max-h-[440px] p-2"
                />
              ) : (
                <div className="text-gray-300 flex flex-col items-center gap-2 p-8 text-center">
                  <FileText className="h-12 w-12" />
                  <span className="text-xs font-medium text-gray-400">No Preview Available</span>
                </div>
              )}

              {/* Status Badge overlay */}
              <div className="absolute top-3 left-3 flex gap-2">
                {card.isFree && (
                  <span className="bg-emerald-600 text-white font-semibold text-[11px] px-2.5 py-0.5 rounded-md">
                    Free
                  </span>
                )}
                {card.isFeatured && (
                  <span className="bg-amber-500 text-white font-semibold text-[11px] px-2.5 py-0.5 rounded-md">
                    Popular
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail carousel selector */}
            {previewImages.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-slate-50/50 border-t border-gray-100">
                {previewImages.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewIdx(i)}
                    className={`shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      i === previewIdx
                        ? "border-primary"
                        : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
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
            <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-2.5">
              <h2 className="text-sm sm:text-base font-bold text-gray-900">About this Resource</h2>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                {card.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Title, Metadata Chips, Pricing & Purchase CTA */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-5">
            {/* Subject and tags */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {card.subject && (
                  <Badge variant="secondary" className="font-semibold text-xs bg-blue-50 text-primary border border-blue-100">
                    {card.subject}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs font-medium text-gray-600 border-gray-200">
                  {card.resourceType}
                </Badge>
                {card.classLevel && (
                  <Badge variant="outline" className="text-xs font-medium text-gray-600 border-gray-200">
                    {card.classLevel}
                  </Badge>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug tracking-tight">
                {card.title}
              </h1>
            </div>

            {/* Structured Metadata Chips Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {card.chapter && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-gray-100 text-xs text-gray-700">
                  <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate font-medium">{card.chapter}</span>
                </div>
              )}
              {card.board && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-gray-100 text-xs text-gray-700">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate font-medium">{card.board} Board</span>
                </div>
              )}
              {card.semester && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-gray-100 text-xs text-gray-700">
                  <Hash className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate font-medium">{card.semester}</span>
                </div>
              )}
              {card.pageCount && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-gray-100 text-xs text-gray-700">
                  <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-medium">{card.pageCount} pages</span>
                </div>
              )}
              {card.fileSizeKb && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-gray-100 text-xs text-gray-700">
                  <FileDown className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-medium">{(card.fileSizeKb / 1024).toFixed(1)} MB PDF</span>
                </div>
              )}
            </div>

            {/* Pricing Section */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-0.5">Price</span>
                  {card.isFree ? (
                    <span className="text-2xl sm:text-3xl font-bold text-emerald-600">Free</span>
                  ) : hasDiscount ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {formatRupees(card.discountPricePaise!)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {formatRupees(card.pricePaise)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {formatRupees(card.pricePaise)}
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded">
                    Discounted
                  </span>
                )}
              </div>

              {/* Purchase / Download Button */}
              {card.isFree ? (
                <Button onClick={handleFreeDownload} size="lg" className="w-full gap-2 rounded-lg text-sm font-semibold h-11">
                  <Download className="h-4 w-4" />
                  <span>Download Free</span>
                </Button>
              ) : (
                <Button onClick={handleBuy} size="lg" className="w-full gap-2 rounded-lg text-sm font-semibold h-11">
                  <span>Buy Now &rarr;</span>
                </Button>
              )}

              {/* Reassurance bullet points */}
              <div className="space-y-1.5 pt-1 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Instant PDF download after checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Re-download anytime from My Purchases</span>
                </div>
              </div>
            </div>
          </div>

          {/* Telegram Support prompt */}
          <div className="bg-slate-50 border border-gray-200 rounded-lg p-3.5 flex items-center justify-between text-xs text-gray-700">
            <span>Have questions about this material?</span>
            <a
              href={card.telegramLink || TELEGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
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

