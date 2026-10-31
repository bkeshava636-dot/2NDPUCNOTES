import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MetaNoIndex } from "@/components/meta-noindex";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.pauseAdRequests = 1;
        const autoPlacedAds = document.querySelectorAll(".google-auto-placed, ins.adsbygoogle");
        autoPlacedAds.forEach((ad) => {
          try {
            ad.remove();
          } catch {}
        });
      } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#0B0F19] p-4">
      <MetaNoIndex />
      <Card className="w-full max-w-md mx-4 shadow-sm border-gray-200 dark:border-[#293548] dark:bg-[#151D2E]">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-rose-950/40 text-red-500 dark:text-rose-400 mx-auto">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">Page Not Found</h1>
          <p className="text-sm text-gray-600 dark:text-[#94A3B8]">
            The study material or page you requested could not be located.
          </p>
          <div className="pt-2">
            <Link href="/">
              <Button className="gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#818CF8] dark:hover:bg-[#6366F1] text-white">
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
