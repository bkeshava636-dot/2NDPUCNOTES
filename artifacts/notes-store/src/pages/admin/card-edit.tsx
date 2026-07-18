import { useParams } from "wouter";
import { useAdminListCards } from "@workspace/api-client-react";
import CardForm from "./card-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCardEdit() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");
  const { data: cards, isLoading } = useAdminListCards();

  const card = cards?.find(c => c.id === id);

  if (isLoading) return (
    <div className="space-y-4 max-w-2xl">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-96" />
    </div>
  );

  if (!card) return <div className="text-center py-16 text-gray-500">Card not found.</div>;

  return (
    <CardForm
      cardId={id}
      initialData={{
        sectionId: String(card.sectionId),
        title: card.title,
        description: card.description || "",
        subject: card.subject || "",
        chapter: card.chapter || "",
        semester: card.semester || "",
        resourceType: card.resourceType,
        isFree: card.isFree,
        priceRupees: !card.isFree ? String(card.pricePaise / 100) : "",
        discountPriceRupees: card.discountPricePaise ? String(card.discountPricePaise / 100) : "",
        telegramLink: card.telegramLink || "",
        isNew: card.isNew,
        thumbnailUrl: card.thumbnailUrl || "",
        previewImageUrls: card.previewImageUrls || [],
        pdfFileKey: card.pdfFileKey || "",
        pageCount: card.pageCount ? String(card.pageCount) : "",
        fileSizeKb: card.fileSizeKb ? String(card.fileSizeKb) : "",
        isFeatured: card.isFeatured,
        isVisible: card.isVisible,
      }}
    />
  );
}
