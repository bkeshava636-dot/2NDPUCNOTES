import { Link } from "wouter";
import { Card as CardType } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { formatRupees } from "@/lib/utils";

export function CardItem({ card }: { card: CardType }) {
  const hasDiscount = Boolean(
    !card.isFree &&
    card.discountPricePaise &&
    card.discountPricePaise < card.pricePaise
  );

  return (
    <Link href={`/card/${card.id}`} className="block h-full group focus-visible:outline-none">
      <Card className="h-full flex flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-all duration-200 hover:border-primary/40 hover:shadow-md active:scale-[0.99] focus-within:ring-2 focus-within:ring-primary/30">
        {/* Preview image */}
        <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden flex items-center justify-center border-b border-gray-100">
          {card.thumbnailUrl ? (
            <img
              src={card.thumbnailUrl}
              alt={card.title}
              loading="lazy"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-1">
              <FileText className="h-9 w-9 opacity-40" />
              <span className="text-xs font-medium">No Preview</span>
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <div className="flex gap-1.5 flex-wrap">
              {card.isNew && (
                <Badge className="bg-blue-600 text-white font-semibold text-[11px] px-2 py-0.5 shadow-xs border-0">
                  New
                </Badge>
              )}
              {card.isFeatured && (
                <Badge className="bg-amber-500 text-white font-semibold text-[11px] px-2 py-0.5 shadow-xs border-0">
                  Popular
                </Badge>
              )}
            </div>

            {card.isFree && (
              <Badge className="bg-emerald-600 text-white font-semibold text-[11px] px-2 py-0.5 shadow-xs border-0 ml-auto">
                Free
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4 flex flex-col">
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {card.subject && (
              <Badge variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">
                {card.subject}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs font-medium text-gray-600 border-gray-200">
              {card.resourceType}
            </Badge>
          </div>

          <h3 className="font-bold text-base leading-snug text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {card.title}
          </h3>

          {card.chapter && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">
              {card.chapter}
            </p>
          )}
        </CardContent>

        {/* Footer with pricing and CTA */}
        <CardFooter className="p-3.5 px-4 flex items-center justify-between border-t border-gray-100 mt-auto bg-gray-50/60">
          <div>
            {card.isFree ? (
              <span className="font-bold text-base text-emerald-600">Free</span>
            ) : hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-base text-gray-900">
                  {formatRupees(card.discountPricePaise!)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatRupees(card.pricePaise)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-base text-gray-900">
                {formatRupees(card.pricePaise)}
              </span>
            )}
          </div>

          <Button
            variant={card.isFree ? "outline" : "default"}
            size="sm"
            className={`gap-1.5 rounded-lg text-xs font-medium px-3.5 h-8 transition-transform group-hover:scale-[1.02] ${
              card.isFree ? "border-gray-200 text-gray-700 hover:bg-gray-100" : "shadow-xs"
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

