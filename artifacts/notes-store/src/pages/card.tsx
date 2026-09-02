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
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
            {/* Main Preview Container */}
            <div className="aspect-[16/10] sm:aspect-video bg-gray-50 relative flex items-center justify-center overflow-hidden border-b border-gray-100">
              {currentPreview ? (
                <img
                  src={currentPreview}
                  alt={card.title}
                  className="object-contain w-full h-full max-h-[440px] p-2"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center gap-2 p-8 text-center">
                  <FileText className="h-16 w-16 opacity-30" />
                  <span className="text-sm font-medium">No Preview Available</span>
                </div>
              )}

              {/* Status Badge overlay */}
              <div className="absolute top-3 left-3 flex gap-2">
                {card.isFree && (
                  <Badge className="bg-emerald-600 text-white font-semibold text-xs px-2.5 py-0.5 shadow-xs border-0">
                    Free
                  </Badge>
                )}
                {card.isFeatured && (
                  <Badge className="bg-amber-500 text-white font-semibold text-xs px-2.5 py-0.5 shadow-xs border-0 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Popular
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail carousel selector */}
            {previewImages.length > 1 && (
              <div className="flex gap-2.5 p-3.5 overflow-x-auto bg-gray-50/50 border-t border-gray-100">
                {previewImages.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewIdx(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      i === previewIdx
                        ? "border-primary ring-2 ring-primary/20 shadow-xs"
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
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-gray-900">About this Resource</h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {card.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Title, Metadata Chips, Pricing & Purchase CTA */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-xs space-y-6">
            {/* Subject and tags */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {card.subject && (
                  <Badge variant="secondary" className="font-semibold text-xs bg-primary/10 text-primary border-0">
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

              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug tracking-tight">
                {card.title}
              </h1>
            </div>

            {/* Structured Metadata Chips Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {card.chapter && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate font-medium">{card.chapter}</span>
                </div>
              )}
              {card.board && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate font-medium">{card.board} Board</span>
                </div>
              )}
              {card.semester && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                  <Hash className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate font-medium">{card.semester}</span>
                </div>
              )}
              {card.pageCount && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium">{card.pageCount} pages</span>
                </div>
              )}
              {card.fileSizeKb && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                  <FileDown className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium">{(card.fileSizeKb / 1024).toFixed(1)} MB PDF</span>
                </div>
              )}
            </div>

            {/* Pricing Section */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Price</span>
                  {card.isFree ? (
                    <span className="text-3xl font-extrabold text-emerald-600">Free</span>
                  ) : hasDiscount ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-gray-900">
                        {formatRupees(card.discountPricePaise!)}
                      </span>
                      <span className="text-base text-gray-400 line-through">
                        {formatRupees(card.pricePaise)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-extrabold text-gray-900">
                      {formatRupees(card.pricePaise)}
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold">
                    Special Offer
                  </Badge>
                )}
              </div>

              {/* Purchase / Download Button */}
              {card.isFree ? (
                <Button onClick={handleFreeDownload} size="lg" className="w-full gap-2 rounded-xl text-base font-semibold shadow-md py-6">
                  <Download className="h-5 w-5" />
                  <span>Download Free</span>
                </Button>
              ) : (
                <Button onClick={handleBuy} size="lg" className="w-full gap-2 rounded-xl text-base font-semibold shadow-md py-6">
                  <span>Buy Now &rarr;</span>
                </Button>
              )}

              {/* Reassurance bullet points */}
              <div className="space-y-2 pt-2 text-xs text-gray-500">
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
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex items-center justify-between text-xs text-blue-900">
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

