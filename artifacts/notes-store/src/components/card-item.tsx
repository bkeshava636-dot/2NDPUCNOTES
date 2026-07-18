import { Link } from "wouter";
import { Card as CardType } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, IndianRupee } from "lucide-react";
import { formatRupees } from "@/lib/utils";

export function CardItem({ card }: { card: CardType }) {
  return (
    <Link href={`/card/${card.id}`}>
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-gray-200">
        <div className="aspect-[4/3] bg-muted relative overflow-hidden flex items-center justify-center">
          {card.thumbnailUrl ? (
            <img 
              src={card.thumbnailUrl} 
              alt={card.title} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-muted-foreground flex flex-col items-center">
              <FileText className="h-10 w-10 mb-2 opacity-50" />
              <span className="text-sm font-medium">No Preview</span>
            </div>
          )}
          {card.isFree && (
            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">Free</Badge>
          )}
        </div>
        <CardContent className="flex-1 p-4 flex flex-col">
          <div className="flex gap-2 flex-wrap mb-2">
            {card.subject && (
              <Badge variant="secondary" className="text-xs">{card.subject}</Badge>
            )}
            <Badge variant="outline" className="text-xs">{card.resourceType}</Badge>
          </div>
          <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
            {card.title}
          </h3>
          {card.chapter && (
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">{card.chapter}</p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between border-t mt-auto bg-gray-50/50">
          <div className="font-bold text-lg flex items-center">
            {card.isFree ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span className="text-gray-900">{formatRupees(card.pricePaise)}</span>
            )}
          </div>
          <Button variant={card.isFree ? "outline" : "default"} size="sm" className="gap-2 rounded-full px-4">
            {card.isFree ? (
              <>
                <Download className="h-4 w-4" />
                Get
              </>
            ) : (
              <>Buy Now</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
