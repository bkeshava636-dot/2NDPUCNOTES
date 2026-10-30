import { Link } from "wouter";
import { Card as CardType } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { formatRupees } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { getSubjectDisplayName, getResourceTypeDisplayName } from "@/lib/site-navigation";

function getSubjectBadgeStyle(subject?: string) {
  if (!subject) return "bg-[#f0f4f9] dark:bg-[#1C2638] text-[#475569] dark:text-[#94A3B8] border-[#e2e8f0] dark:border-[#293548]";
  const lower = subject.toLowerCase();
  if (lower.includes("phys")) return "bg-[#ebf3ff] dark:bg-blue-950/40 text-[#1856b8] dark:text-blue-300 border-[#dce8fa] dark:border-blue-900/60";
  if (lower.includes("chem")) return "bg-[#fdece9] dark:bg-rose-950/40 text-[#b83226] dark:text-rose-300 border-[#f9dcd7] dark:border-rose-900/60";
  if (lower.includes("comp")) return "bg-[#ecfeff] dark:bg-cyan-950/40 text-[#0e7490] dark:text-cyan-300 border-[#cffafe] dark:border-cyan-900/60";
  if (lower.includes("math")) return "bg-[#eaf5ec] dark:bg-emerald-950/40 text-[#167035] dark:text-emerald-300 border-[#d7ecdc] dark:border-emerald-900/60";
  if (lower.includes("bio")) return "bg-[#fdf5e2] dark:bg-amber-950/40 text-[#9e5e00] dark:text-amber-300 border-[#f9ecc8] dark:border-amber-900/60";
  if (lower.includes("eng")) return "bg-[#f5f3ff] dark:bg-purple-950/40 text-[#6d28d9] dark:text-purple-300 border-[#ede9fe] dark:border-purple-900/60";
  if (lower.includes("hin")) return "bg-[#fff7ed] dark:bg-orange-950/40 text-[#c2410c] dark:text-orange-300 border-[#ffedd5] dark:border-orange-900/60";
  if (lower.includes("kan")) return "bg-[#f0fdf4] dark:bg-emerald-950/40 text-[#15803d] dark:text-emerald-300 border-[#dcfce7] dark:border-emerald-900/60";
  if (lower.includes("san")) return "bg-[#fffbeb] dark:bg-amber-950/40 text-[#b45309] dark:text-amber-300 border-[#fef3c7] dark:border-amber-900/60";
  return "bg-[#f0f4f9] dark:bg-[#1C2638] text-[#475569] dark:text-[#94A3B8] border-[#e2e8f0] dark:border-[#293548]";
}

export function CardItem({ card }: { card: CardType }) {
  const queryClient = useQueryClient();
  const { language, t } = useLanguage();
  const isKn = language === "kn";
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
      <Card className="h-full flex flex-col overflow-hidden rounded-xl border border-[#e2e8f0] dark:border-[#293548] bg-white dark:bg-[#151D2E] transition-all duration-200 hover:border-[#93c5fd] dark:hover:border-[#818CF8]/60 hover:shadow-sm focus-within:ring-2 focus-within:ring-[#2563eb]/20 dark:focus-within:ring-[#818CF8]/20">
        {/* Preview image (only when thumbnail is provided) */}
        {card.thumbnailUrl && (
          <div className="aspect-[16/10] bg-[#f8fafc] dark:bg-[#111827] relative overflow-hidden flex items-center justify-center border-b border-[#eef2f6] dark:border-[#293548]">
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
                    {t("Recommended", "ಶಿಫಾರಸು")}
                  </span>
                )}
                {card.isNew && (
                  <span className="bg-[#dc2626] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                    {t("New", "ಹೊಸದು")}
                  </span>
                )}
                {card.isFeatured && (
                  <span className="bg-[#d97706] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                    {t("Popular", "ಜನಪ್ರಿಯ")}
                  </span>
                )}
              </div>

              {card.isFree && (
                <span className="bg-[#16a34a] text-white font-semibold text-[10px] px-2 py-0.5 rounded ml-auto shadow-2xs">
                  {t("Free", "ಉಚಿತ")}
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
                    {getSubjectDisplayName(card.subject, isKn)}
                  </span>
                )}
                <Badge variant="outline" className="text-[11px] font-medium text-[#475569] dark:text-[#94A3B8] border-[#e2e8f0] dark:border-[#293548] bg-[#f8fafc] dark:bg-[#1C2638]">
                  {getResourceTypeDisplayName(card.resourceType, isKn)}
                </Badge>
                {card.subtype && (
                  <Badge variant="outline" className="text-[10px] font-medium text-[#0284c7] dark:text-[#818CF8] border-[#bae6fd] dark:border-[#293548] bg-[#f0f9ff] dark:bg-[#1C2638]">
                    {card.subtype}
                  </Badge>
                )}
                {!card.thumbnailUrl && card.isRecommended && (
                  <span className="bg-[#0284c7] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                    {t("Recommended", "ಶಿಫಾರಸು")}
                  </span>
                )}
                {!card.thumbnailUrl && card.isNew && (
                  <span className="bg-[#dc2626] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                    {t("New", "ಹೊಸದು")}
                  </span>
                )}
                {!card.thumbnailUrl && card.isFeatured && (
                  <span className="bg-[#d97706] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs">
                    {t("Popular", "ಜನಪ್ರಿಯ")}
                  </span>
                )}
              </div>

              {!card.thumbnailUrl && card.isFree && (
                <span className="bg-[#16a34a] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-2xs ml-auto">
                  {t("Free", "ಉಚಿತ")}
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
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0284c7] dark:text-[#818CF8] bg-[#f0f9ff] dark:bg-[#1C2638] hover:bg-[#e0f2fe] dark:hover:bg-[#293548] border border-[#bae6fd] dark:border-[#293548] px-2 py-0.5 rounded transition-colors"
                  title={t("View Official Answer Key", "ಅಧಿಕೃತ ಕೀ ಉತ್ತರಗಳನ್ನು ವೀಕ್ಷಿಸಿ")}
                >
                  <span>{t("Answer Key Included", "ಉತ್ತರ ಸಹಿತ")}</span>
                </a>
              </div>
            )}

            {/* Title */}
            <h3 className="font-semibold text-sm sm:text-base leading-snug text-[#0f172a] dark:text-[#F1F5F9] group-hover:text-[#2563eb] dark:group-hover:text-[#818CF8] transition-colors line-clamp-2">
              {card.title}
            </h3>

            {/* Chapter subtitle if present */}
            {card.chapter && (
              <p className="text-xs text-[#64748b] dark:text-[#94A3B8] mt-1.5 line-clamp-1">
                {card.chapter}
              </p>
            )}
          </div>
        </CardContent>

        {/* Footer with pricing and CTA */}
        <CardFooter className="p-3.5 px-4.5 flex items-center justify-between border-t border-[#f1f5f9] dark:border-[#293548] mt-auto bg-[#fafcff] dark:bg-[#111827]">
          <div>
            {card.isFree ? (
              <span className="font-bold text-base text-[#16a34a] dark:text-[#4ade80]">{t("Free", "ಉಚಿತ")}</span>
            ) : hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-base text-[#0f172a] dark:text-[#F1F5F9]">
                  {formatRupees(card.discountPricePaise!)}
                </span>
                <span className="text-xs text-[#94a3b8] dark:text-[#64748b] line-through">
                  {formatRupees(card.pricePaise)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-base text-[#0f172a] dark:text-[#F1F5F9]">
                {formatRupees(card.pricePaise)}
              </span>
            )}
          </div>

          <Button
            variant={card.isFree ? "outline" : "default"}
            size="sm"
            className={`gap-1.5 rounded-lg text-xs font-semibold px-3.5 h-8.5 transition-all ${
              card.isFree
                ? "border-[#cbd5e1] dark:border-[#293548] text-[#334155] dark:text-[#F1F5F9] hover:bg-[#f1f5f9] dark:hover:bg-[#1C2638] hover:border-[#94a3b8] dark:hover:border-[#3b4b63] shadow-none"
                : "bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#818CF8] dark:hover:bg-[#6366F1] text-white dark:text-[#0B0F19] dark:font-bold shadow-2xs"
            }`}
          >
            {card.isFree ? (
              <>
                <Download className="h-3.5 w-3.5 text-[#475569] dark:text-[#94A3B8]" />
                <span>{t("Get PDF", "PDF ಪಡೆಯಿರಿ")}</span>
              </>
            ) : (
              <span>{t("Buy Now", "ಖರೀದಿಸಿ")}</span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

