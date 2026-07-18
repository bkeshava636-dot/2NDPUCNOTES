import { useState } from "react";
import { Link } from "wouter";
import { useAdminListCards, useAdminDeleteCard, useAdminUpdateCard, getAdminListCardsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatRupees } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminCards() {
  const { data: cards, isLoading } = useAdminListCards();
  const deleteCard = useAdminDeleteCard();
  const updateCard = useAdminUpdateCard();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCard.mutate({ id: deleteId }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Card deleted successfully" });
        queryClient.invalidateQueries({ queryKey: getAdminListCardsQueryKey() });
        setDeleteId(null);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to delete card", variant: "destructive" });
        setDeleteId(null);
      }
    });
  };

  const handleToggleVisibility = (id: number, currentVisible: boolean) => {
    updateCard.mutate({ id, data: { isVisible: !currentVisible } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListCardsQueryKey() });
      }
    });
  };

  const handleToggleFeatured = (id: number, currentFeatured: boolean) => {
    updateCard.mutate({ id, data: { isFeatured: !currentFeatured } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListCardsQueryKey() });
      }
    });
  };

  if (isLoading) return <div>Loading cards...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cards</h1>
          <p className="text-gray-500">Manage study materials</p>
        </div>
        <Link href="/admin/cards/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Card
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No cards found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              cards?.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-medium max-w-[250px] truncate" title={card.title}>
                    {card.title}
                  </TableCell>
                  <TableCell>{card.sectionName || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{card.resourceType}</Badge>
                  </TableCell>
                  <TableCell>
                    {card.isFree ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      <span>{formatRupees(card.pricePaise)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${card.isVisible ? 'text-primary' : 'text-gray-400'}`}
                        onClick={() => handleToggleVisibility(card.id, card.isVisible)}
                        title={card.isVisible ? "Visible" : "Hidden"}
                      >
                        {card.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${card.isFeatured ? 'text-yellow-500' : 'text-gray-400'}`}
                        onClick={() => handleToggleFeatured(card.id, card.isFeatured)}
                        title={card.isFeatured ? "Featured" : "Not Featured"}
                      >
                        <Star className="h-4 w-4" fill={card.isFeatured ? "currentColor" : "none"} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/cards/${card.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this card and its associated files. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
