import { useEffect, useState } from "react";
import { Card as CardType } from "@workspace/api-client-react";
import { buildApiUrl } from "@/lib/api";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, ExternalLink, FileWarning, Loader2 } from "lucide-react";

interface ResolvedPdfLinks {
  viewUrl: string;
  openTabUrl: string;
  downloadUrl: string;
}

function extractDriveFileId(url: string): string | null {
  const matchFile = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile?.[1]) return matchFile[1];
  const matchId = url.match(/drive\.google\.com\/(?:open|uc)\?[^#]*[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId?.[1]) return matchId[1];
  const matchFirstParam = url.match(/drive\.google\.com\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/);
  if (matchFirstParam?.[1]) return matchFirstParam[1];
  return null;
}

function resolveDirectPdfLinks(pdfFileKey: string): ResolvedPdfLinks | null {
  if (!pdfFileKey.startsWith("http://") && !pdfFileKey.startsWith("https://")) {
    return null;
  }
  const driveId = extractDriveFileId(pdfFileKey);
  if (driveId) {
    return {
      viewUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      openTabUrl: `https://drive.google.com/file/d/${driveId}/view`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${driveId}`,
    };
  }
  return {
    viewUrl: pdfFileKey,
    openTabUrl: pdfFileKey,
    downloadUrl: pdfFileKey,
  };
}

interface FreePdfPreviewDialogProps {
  card: CardType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: () => void;
}

/**
 * In-page PDF preview modal strictly gated to free 2nd PUC resources.
 */
export function FreePdfPreviewDialog({
  card,
  open,
  onOpenChange,
  onDownload,
}: FreePdfPreviewDialogProps) {
  const { t } = useLanguage();
  const [links, setLinks] = useState<ResolvedPdfLinks | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !card || !card.isFree || !card.pdfFileKey) {
      setLinks(null);
      setErrorMsg(null);
      setLoading(false);
      return;
    }

    const direct = resolveDirectPdfLinks(card.pdfFileKey);
    if (direct) {
      setLinks(direct);
      setErrorMsg(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorMsg(null);

    fetch(buildApiUrl(`/api/cards/${card.id}/free-view`))
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Unable to load PDF preview");
        return data as ResolvedPdfLinks;
      })
      .then((resolved) => {
        if (!cancelled) {
          setLinks(resolved);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          setErrorMsg(err?.message || "Failed to load PDF preview");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, card]);

  if (!card || !card.isFree) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-[#111827] border-[#e2e8f0] dark:border-[#293548] text-[#0f172a] dark:text-[#F1F5F9]">
        <DialogHeader className="px-5 py-3.5 border-b border-[#e2e8f0] dark:border-[#293548] flex flex-row items-center justify-between gap-3">
          <div className="min-w-0 pr-6">
            <DialogTitle className="text-sm sm:text-base font-bold text-[#0f172a] dark:text-[#F1F5F9] truncate">
              {card.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748b] dark:text-[#A1AEC2] truncate">
              {[card.subject, card.resourceType, card.chapter].filter(Boolean).join(" • ")}
            </DialogDescription>
          </div>

          {links && (
            <div className="flex items-center gap-2 shrink-0 mr-6">
              <a
                href={links.openTabUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#f1f5f9] dark:bg-[#1C2638] hover:bg-[#e2e8f0] dark:hover:bg-[#293548] text-[#334155] dark:text-[#F1F5F9] border border-[#cbd5e1] dark:border-[#293548] transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("Open Tab", "ಹೊಸ ಟ್ಯಾಬ್")}</span>
              </a>
              {onDownload ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={onDownload}
                  className="h-8 gap-1.5 px-3 rounded-lg text-xs font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{t("Download", "ಡೌನ್‌ಲೋಡ್")}</span>
                </Button>
              ) : (
                <a
                  href={links.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{t("Download", "ಡೌನ್‌ಲೋಡ್")}</span>
                </a>
              )}
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 bg-[#f1f5f9] dark:bg-[#0B0F19] relative flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-xs text-[#64748b] dark:text-[#A1AEC2]">
              <Loader2 className="h-6 w-6 animate-spin text-[#2563eb] dark:text-[#818CF8]" />
              <span>{t("Loading PDF preview...", "PDF ಪೂರ್ವವೀಕ್ಷಣೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ...")}</span>
            </div>
          ) : errorMsg ? (
            <div className="p-6 text-center max-w-sm space-y-2">
              <FileWarning className="h-8 w-8 text-amber-500 mx-auto" />
              <p className="text-sm font-semibold text-[#0f172a] dark:text-[#F1F5F9]">
                {t("Preview unavailable", "ಪೂರ್ವವೀಕ್ಷಣೆ ಲಭ್ಯವಿಲ್ಲ")}
              </p>
              <p className="text-xs text-[#64748b] dark:text-[#A1AEC2]">{errorMsg}</p>
            </div>
          ) : links ? (
            <iframe
              src={links.viewUrl}
              title={card.title}
              className="w-full h-full border-0"
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
