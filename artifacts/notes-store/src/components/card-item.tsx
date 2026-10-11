import { Link } from "wouter";
import { Card as CardType } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { formatRupees } from "@/lib/utils";

function getSubjectBadgeStyle(subject?: string) {
  if (!subject) return "bg-[#f0f4f9] text-[#475569] border-[#e2e8f0]";
  const lower = subject.toLowerCase();
  if (lower.includes("phys")) return "bg-[#ebf3ff] text-[#1856b8] border-[#dce8fa]";
  if (lower.includes("chem")) return "bg-[#fdece9] text-[#b83226] border-[#f9dcd7]";
  if (lower.includes("comp")) return "bg-[#ecfeff] text-[#0e7490] border-[#cffafe]";
  if (lower.includes("math")) return "bg-[#eaf5ec] text-[#167035] border-[#d7ecdc]";
  if (lower.includes("bio")) return "bg-[#fdf5e2] text-[#9e5e00] border-[#f9ecc8]";
  if (lower.includes("eng")) return "bg-[#f5f3ff] text-[#6d28d9] border-[#ede9fe]";
  if (lower.includes("hin")) return "bg-[#fff7ed] text-[#c2410c] border-[#ffedd5]";
  if (lower.includes("kan")) return "bg-[#f0fdf4] text-[#15803d] border-[#dcfce7]";
  if (lower.includes("san")) return "bg-[#fffbeb] text-[#b45309] border-[#fef3c7]";
  return "bg-[#f0f4f9] text-[#475569] border-[#e2e8f0]";
}

export function CardItem({ card }: { card: CardType }) {
  const queryClient = useQueryClient();
  const hasDiscount = Boolean(
    !card.isFree &&
    card.discountPricePaise &&
    card.discountPricePaise < card.pricePaise
  );

  const prefetchCard = () => {
    queryClient.setQueryData(["card", card.id], card);
  };

  return (
    <Link 
      href={`/card/${card.id}`} 
      onPointerEnter={prefetchCard}
      onFocus={prefetchCard}
      className="group block h-full focus-visible:outline-none"
    >
      <Card className="h-full flex flex-col overflow-hidden rounded-xl border border-[#e2e8f0] bg-white transition-all duration-200 hover:border-[#93c5fd] hover:shadow-sm focus-within:ring-2 focus-within:ring-[#2563eb]/20">
        {/* Preview image (only when thumbnail is provided) */}
        {card.thumbnailUrl && (
          <div className="aspect-[16/10] bg-[#f8fafc] relative overflow-hidden flex items-center justify-center border-b border-[#eef2f6]">
            <img
              src={card.thumbnailUrl}
              alt={card.title}
              loading="lazy"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-102"
            />

            {/* Top badges on image */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              <div className="flex gap-1.5 flex-wrap">
                {card.isRecommended && (
                  <span className="bg-[#0284c7] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                    Recommended
                  </span>
                )}
                {card.isNew && (
                  <span className="bg-[#dc2626] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                    New
                  </span>
                )}
                {card.isFeatured && (
                  <span className="bg-[#d97706] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                    Popular
                  </span>
                )}
              </div>

              {card.isFree && (
                <span className="bg-[#16a34a] text-white font-semibold text-[10px] px-2 py-0.5 rounded ml-auto shadow-2xs">
                  Free
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <CardContent className="flex-1 p-4.5 flex flex-col justify-between">
          <div>
            {/* Top metadata tags */}
            <div className="flex items-center justify-between gap-1.5 flex-wrap mb-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {card.subject && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getSubjectBadgeStyle(card.subject)}`}>
                    {card.subject}
                  </span>
                )}
                <Badge variant="outline" className="text-[11px] font-medium text-[#475569] border-[#e2e8f0] bg-[#f8fafc]">
                  {card.resourceType}
                </Badge>
                {card.subtype && (
                  <Badge variant="outline" className="text-[10px] font-medium text-[#0284c7] border-[#bae6fd] bg-[#f0f9ff]">
                    {card.subtype}
                  </Badge>
                )}
                {!card.thumbnailUrl && card.isRecommended && (
                  <span className="bg-[#0284c7] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                    Recommended
                  </span>
                )}
                {!card.thumbnailUrl && card.isNew && (
                  <span className="bg-[#dc2626] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                    New
                  </span>
                )}
                {!card.thumbnailUrl && card.isFeatured && (
                  <span className="bg-[#d97706] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                    Popular
                  </span>
                )}
              </div>

              {!card.thumbnailUrl && card.isFree && (
                <span className="bg-[#16a34a] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs ml-auto">
                  Free
                </span>
              )}
            </div>

            {/* Answer key pill if available */}
            {card.answerKeyUrl && (
              <div className="mb-2">
                <a
                  href={card.answerKeyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0284c7] bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#bae6fd] px-2 py-0.5 rounded transition-colors"
                  title="View Official Answer Key"
                >
                  <span>Answer Key Included</span>
                </a>
              </div>
            )}

            {/* Title */}
            <h3 className="font-semibold text-sm sm:text-base leading-snug text-[#0f172a] group-hover:text-[#2563eb] transition-colors line-clamp-2">
              {card.title}
            </h3>

            {/* Chapter subtitle if present */}
            {card.chapter && (
              <p className="text-xs text-[#64748b] mt-1.5 line-clamp-1">
                {card.chapter}
              </p>
            )}
          </div>
        </CardContent>

        {/* Footer with pricing and CTA */}
        <CardFooter className="p-3.5 px-4.5 flex items-center justify-between border-t border-[#f1f5f9] mt-auto bg-[#fafcff]">
          <div>
            {card.isFree ? (
              <span className="font-bold text-base text-[#16a34a]">Free</span>
            ) : hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-base text-[#0f172a]">
                  {formatRupees(card.discountPricePaise!)}
                </span>
                <span className="text-xs text-[#94a3b8] line-through">
                  {formatRupees(card.pricePaise)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-base text-[#0f172a]">
                {formatRupees(card.pricePaise)}
              </span>
            )}
          </div>

          <Button
            variant={card.isFree ? "outline" : "default"}
            size="sm"
            className={`gap-1.5 rounded-lg text-xs font-semibold px-3.5 h-8.5 transition-all ${
              card.isFree
                ? "border-[#cbd5e1] text-[#334155] hover:bg-[#f1f5f9] hover:border-[#94a3b8] shadow-none"
                : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-2xs"
            }`}
          >
            {card.isFree ? (
              <>
                <Download className="h-3.5 w-3.5 text-[#475569]" />
                <span>Get PDF</span>
              </>
            ) : (
              <span>Buy Now</span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

