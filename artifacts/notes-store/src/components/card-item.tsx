import { Link } from "wouter";
import { Card as CardType } from "@workspace/api-client-react";
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
  if (lower.includes("math")) return "bg-[#eaf5ec] text-[#167035] border-[#d7ecdc]";
  if (lower.includes("bio")) return "bg-[#fdf5e2] text-[#9e5e00] border-[#f9ecc8]";
  if (lower.includes("eng")) return "bg-[#f5f3ff] text-[#6d28d9] border-[#ede9fe]";
  if (lower.includes("hin")) return "bg-[#fff7ed] text-[#c2410c] border-[#ffedd5]";
  if (lower.includes("kan")) return "bg-[#f0fdf4] text-[#15803d] border-[#dcfce7]";
  if (lower.includes("san")) return "bg-[#fffbeb] text-[#b45309] border-[#fef3c7]";
  return "bg-[#f0f4f9] text-[#475569] border-[#e2e8f0]";
}

export function CardItem({ card }: { card: CardType }) {
  const hasDiscount = Boolean(
    !card.isFree &&
    card.discountPricePaise &&
    card.discountPricePaise < card.pricePaise
  );

  return (
    <Link href={`/card/${card.id}`} className="block h-full group focus-visible:outline-none">
      <Card className="h-full flex flex-col overflow-hidden rounded-xl border border-[#e2e8f0] bg-white transition-all duration-150 hover:border-[#b8d4f8] hover:shadow-xs focus-within:ring-2 focus-within:ring-[#1856b8]/20">
        {/* Preview image */}
        <div className="aspect-[16/10] bg-[#f8fafc] relative overflow-hidden flex items-center justify-center border-b border-[#eef2f6]">
          {card.thumbnailUrl ? (
            <img
              src={card.thumbnailUrl}
              alt={card.title}
              loading="lazy"
              className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-102"
            />
          ) : (
            <div className="text-[#94a3b8] flex flex-col items-center gap-1">
              <FileText className="h-8 w-8 opacity-60" />
              <span className="text-[11px] font-medium text-[#94a3b8]">No Preview</span>
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <div className="flex gap-1.5 flex-wrap">
              {card.isNew && (
                <span className="bg-[#dc2626] text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-2xs">
                  New
                </span>
              )}
              {card.isFeatured && (
                <span className="bg-[#d97706] text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-2xs">
                  Popular
                </span>
              )}
            </div>

            {card.isFree && (
              <span className="bg-[#16a34a] text-white font-semibold text-[10px] px-2 py-0.5 rounded-md ml-auto shadow-2xs">
                Free
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4 flex flex-col">
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {card.subject && (
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getSubjectBadgeStyle(card.subject)}`}>
                {card.subject}
              </span>
            )}
            <Badge variant="outline" className="text-[11px] font-medium text-[#64748b] border-[#e2e8f0] bg-[#f8fafc]">
              {card.resourceType}
            </Badge>
          </div>

          <h3 className="font-bold text-base leading-snug text-[#112542] group-hover:text-[#1856b8] transition-colors line-clamp-2">
            {card.title}
          </h3>

          {card.chapter && (
            <p className="text-xs sm:text-sm text-[#5a6b82] mt-1 line-clamp-1">
              {card.chapter}
            </p>
          )}
        </CardContent>

        {/* Footer with pricing and CTA */}
        <CardFooter className="p-3.5 px-4 flex items-center justify-between border-t border-[#eef2f6] mt-auto bg-[#f8fafc]/70">
          <div>
            {card.isFree ? (
              <span className="font-bold text-base text-[#16a34a]">Free</span>
            ) : hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-base text-[#112542]">
                  {formatRupees(card.discountPricePaise!)}
                </span>
                <span className="text-xs text-[#94a3b8] line-through">
                  {formatRupees(card.pricePaise)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-base text-[#112542]">
                {formatRupees(card.pricePaise)}
              </span>
            )}
          </div>

          <Button
            variant={card.isFree ? "outline" : "default"}
            size="sm"
            className={`gap-1.5 rounded-lg text-xs font-medium px-3.5 h-8 transition-colors ${
              card.isFree
                ? "border-[#d0dbe7] text-[#475569] hover:bg-[#f1f5f9]"
                : "bg-[#2f74de] hover:bg-[#1f63c8] text-white shadow-none"
            }`}
          >
            {card.isFree ? (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Get</span>
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

