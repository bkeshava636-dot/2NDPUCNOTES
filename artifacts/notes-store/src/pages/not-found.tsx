import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MetaNoIndex } from "@/components/meta-noindex";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <MetaNoIndex />
      <Card className="w-full max-w-md mx-4 shadow-sm border-gray-200">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 mx-auto">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-sm text-gray-600">
            The study material or page you requested could not be located.
          </p>
          <div className="pt-2">
            <Link href="/">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
