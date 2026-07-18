import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useGetCard } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Download, BookOpen, Hash, FileDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupees } from "@/lib/utils";

export default function CardPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const [previewIdx, setPreviewIdx] = useState(0);

  const { data: card, isLoading } = useGetCard(id, { query: { enabled: !!id, queryKey: ["card", id] } });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!card) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
      Resource not found. <Link href="/"><Button variant="link">Go Home</Button></Link>
    </div>
  );

  const previewImages = card.previewImageUrls ?? [];

  function handleBuy() {
    setLocation(`/checkout?cardId=${card!.id}`);
  }

  function handleFreeDownload() {
    setLocation(`/checkout?cardId=${card!.id}&free=true`);
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Thumbnail / preview */}
        <div className="aspect-video bg-muted relative flex items-center justify-center">
          {previewImages.length > 0 ? (
            <img src={previewImages[previewIdx]} alt={card.title} className="object-contain w-full h-full" />
          ) : card.thumbnailUrl ? (
            <img src={card.thumbnailUrl} alt={card.title} className="object-contain w-full h-full" />
          ) : (
            <div className="text-muted-foreground flex flex-col items-center gap-2">
              <FileText className="h-16 w-16 opacity-30" />
              <span className="text-sm">No Preview Available</span>
            </div>
          )}
        </div>

        {/* Preview thumbnails */}
        {previewImages.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto border-b border-gray-100">
            {previewImages.map((url, i) => (
              <button
                key={i}
                onClick={() => setPreviewIdx(i)}
                className={`shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${i === previewIdx ? "border-primary" : "border-gray-200"}`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="p-5 md:p-6 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {card.subject && <Badge variant="secondary">{card.subject}</Badge>}
            <Badge variant="outline">{card.resourceType}</Badge>
            {card.isFree && <Badge className="bg-green-500 hover:bg-green-600">Free</Badge>}
            {card.isFeatured && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Featured</Badge>}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{card.title}</h1>

          {card.description && (
            <p className="text-gray-600 leading-relaxed">{card.description}</p>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
            {card.chapter && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> <span>{card.chapter}</span>
              </div>
            )}
            {card.semester && (
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4" /> <span>{card.semester}</span>
              </div>
            )}
            {card.pageCount && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> <span>{card.pageCount} pages</span>
              </div>
            )}
            {card.fileSizeKb && (
              <div className="flex items-center gap-2">
                <FileDown className="h-4 w-4" /> <span>{(card.fileSizeKb / 1024).toFixed(1)} MB</span>
              </div>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              {card.isFree ? (
                <span className="text-2xl font-bold text-green-600">Free</span>
              ) : (
                <span className="text-2xl font-bold text-gray-900">{formatRupees(card.pricePaise)}</span>
              )}
            </div>
            {card.isFree ? (
              <Button onClick={handleFreeDownload} className="gap-2">
                <Download className="h-4 w-4" /> Download Free
              </Button>
            ) : (
              <Button onClick={handleBuy} size="lg" className="gap-2">
                Buy Now &rarr;
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
