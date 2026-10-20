import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSitePass } from "@/lib/site-pass-context";
import { useLanguage } from "@/lib/language-context";
import {
  Clock,
  PlayCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Loader2,
  Zap,
  Lock,
} from "lucide-react";

// Google Ad Manager Network Code
const GAM_NETWORK_CODE = "23386196117";
// Default Rewarded Ad Unit Code
const GAM_AD_UNIT_PATH = `/${GAM_NETWORK_CODE}/2puc_pass_video`;

declare global {
  interface Window {
    adsbygoogle?: any[];
    googletag?: {
      cmd: any[];
      defineOutOfPageSlot?: (path: string, type: any) => any;
      enums?: {
        OutOfPageType: {
          REWARDED: any;
        };
      };
      pubads?: () => any;
      enableServices?: () => void;
      display?: (slot: any) => void;
    };
  }
}

export function SiteAccessPassModal() {
  const { isFeatureEnabled, isPassActive, isExemptPage, grantPass } = useSitePass();
  const { language, t } = useLanguage();

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(15);
  const [canClaimReward, setCanClaimReward] = useState(false);
  const rewardedSlotRef = useRef<any>(null);

  // If feature is currently OFF, pass is already active, or on an exempt page, do not show lock
  const shouldShowModal = isFeatureEnabled && !isPassActive && !isExemptPage;

  // Initialize Google Publisher Tag (GPT) Web Rewarded Ad Slot
  useEffect(() => {
    if (typeof window === "undefined") return;

    const gTag = (window.googletag = window.googletag || ({ cmd: [] } as any));

    gTag.cmd.push(() => {
      try {
        if (
          gTag.defineOutOfPageSlot &&
          gTag.enums?.OutOfPageType?.REWARDED &&
          typeof gTag.pubads === "function"
        ) {
          // Define official web rewarded ad slot
          const slot = gTag.defineOutOfPageSlot(
            GAM_AD_UNIT_PATH,
            gTag.enums.OutOfPageType.REWARDED
          );

          if (slot) {
            slot.addService(gTag.pubads());
            rewardedSlotRef.current = slot;

            const pubadsService = gTag.pubads();
            if (pubadsService?.addEventListener) {
              // Listen for official reward granted event
              pubadsService.addEventListener("rewardedSlotGranted", () => {
                grantPass();
                setIsWatchingAd(false);
                setCanClaimReward(false);
              });

              // Listen for ad closed event
              pubadsService.addEventListener("rewardedSlotClosed", () => {
                // Destroy or refresh slot for next session
                try {
                  gTag.pubads?.()?.refresh?.([slot]);
                } catch {}
              });
            }

            gTag.enableServices?.();
          }
        }
      } catch (err) {
        console.warn("GPT Rewarded slot registration note:", err);
      }
    });
  }, [grantPass]);

  // Fallback 15s countdown timer when ad watching is active
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWatchingAd && adCountdown > 0) {
      timer = setTimeout(() => {
        setAdCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isWatchingAd && adCountdown <= 0) {
      setCanClaimReward(true);
    }
    return () => clearTimeout(timer);
  }, [isWatchingAd, adCountdown]);

  const handleStartAd = () => {
    setIsWatchingAd(true);
    setAdCountdown(15);
    setCanClaimReward(false);

    // Trigger Google Ad Manager official Rewarded Video display if available
    try {
      if (window.googletag && rewardedSlotRef.current) {
        window.googletag.cmd.push(() => {
          try {
            window.googletag?.display?.(rewardedSlotRef.current);
          } catch {}
        });
      }
    } catch {}
  };

  const handleClaimPass = () => {
    grantPass(); // Grants 5 hours of full access
    setIsWatchingAd(false);
    setCanClaimReward(false);
  };

  return (
    <Dialog open={shouldShowModal} onOpenChange={() => {}}>
      {/* 
        Full lock overlay: no close button, dark backdrop blur to protect materials 
        until the 5-hour pass is unlocked.
      */}
      <DialogContent
        className="max-w-md w-[92vw] sm:w-full p-0 overflow-hidden rounded-2xl bg-white border border-[#cbd5e1] shadow-2xl [&>button]:hidden select-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] text-white p-6 sm:p-7 text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 mb-3 shadow-sm">
            <Lock className="h-6 w-6 text-white" />
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1">
            {t("5-Hour Free Study Pass", "5 ಗಂಟೆಗಳ ಉಚಿತ ಅಧ್ಯಯನ ಪಾಸ್")}
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-blue-100 font-medium max-w-xs mx-auto leading-relaxed">
            {t(
              "Watch 1 short sponsor ad to unlock full access to all notes, model papers, blueprints & free PDFs for 5 hours.",
              "1 ಸಣ್ಣ ಜಾಹೀರಾತು ವೀಕ್ಷಿಸಿ 5 ಗಂಟೆಗಳ ಕಾಲ ಎಲ್ಲ ನೋಟ್ಸ್, ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು ಮತ್ತು PDF ಗಳನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಉಚಿತವಾಗಿ ವೀಕ್ಷಿಸಿ."
            )}
          </DialogDescription>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 bg-white">
          {!isWatchingAd ? (
            <>
              {/* Feature Highlights Grid */}
              <div className="space-y-2.5 text-xs text-[#334155]">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <Clock className="h-4 w-4 text-[#2563eb] shrink-0" />
                  <span className="font-semibold text-[#0f172a]">
                    {t("5 Hours of uninterrupted access across the whole site", "ಇಡೀ ಸೈಟ್‌ನಲ್ಲಿ 5 ಗಂಟೆಗಳ ಕಾಲ ನಿರಂತರ ಪ್ರವೇಶ")}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <Sparkles className="h-4 w-4 text-[#16a34a] shrink-0" />
                  <span className="font-medium text-[#475569]">
                    {t("All Science & Language subjects included", "ಎಲ್ಲ ವಿಜ್ಞಾನ ಮತ್ತು ಭಾಷಾ ವಿಷಯಗಳ ನೋಟ್ಸ್ ಲಭ್ಯ")}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <ShieldCheck className="h-4 w-4 text-[#0284c7] shrink-0" />
                  <span className="font-medium text-[#475569]">
                    {t("Instant PDF downloads with official blueprints", "ಬ್ಲೂಪ್ರಿಂಟ್ ಸಹಿತ ತಕ್ಷಣದ PDF ಡೌನ್‌ಲೋಡ್")}
                  </span>
                </div>
              </div>

              {/* Action Unlock Button */}
              <div className="pt-1">
                <Button
                  onClick={handleStartAd}
                  size="lg"
                  className="w-full gap-2.5 h-12 rounded-xl text-sm font-bold bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                >
                  <PlayCircle className="h-5 w-5" />
                  <span>{t("Watch Ad to Unlock (15 sec)", "ಜಾಹೀರಾತು ನೋಡಿ ಅನ್‌ಲಾಕ್ ಮಾಡಿ (15 ಸೆ)")}</span>
                </Button>
                <p className="text-[11px] text-[#94a3b8] text-center mt-2.5">
                  {t(
                    "Supporting 2PUC creators keeps study materials 100% free for all Karnataka students.",
                    "ಪ್ರಾಯೋಜಕರ ಬೆಂಬಲದಿಂದ ಕರ್ನಾಟಕದ ಎಲ್ಲ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ನೋಟ್ಸ್ ಉಚಿತವಾಗಿ ತಲುಪಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತದೆ."
                  )}
                </p>
              </div>
            </>
          ) : (
            /* Ad Player / Countdown View */
            <div className="text-center space-y-4 py-2">
              <div className="aspect-video w-full rounded-xl bg-[#0f172a] text-white p-4 flex flex-col items-center justify-center relative overflow-hidden border border-[#334155] shadow-inner">
                {/* Ad Container for Google Ad Manager */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">

                  {!canClaimReward ? (
                    <div className="space-y-3 z-10 bg-slate-900/90 p-4 rounded-xl backdrop-blur-sm border border-slate-700/60 max-w-xs">
                      <div className="flex items-center justify-center gap-2 text-blue-400 font-mono text-sm font-bold">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                        <span>
                          {t("Sponsor Ad Playing...", "ಜಾಹೀರಾತು ಪ್ರದರ್ಶನಗೊಳ್ಳುತ್ತಿದೆ...")}
                        </span>
                      </div>
                      <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                        {adCountdown}s
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {t(
                          "Please wait a few seconds to earn your 5-hour site pass.",
                          "ನಿಮ್ಮ 5 ಗಂಟೆಗಳ ಪಾಸ್ ಪಡೆಯಲು ಕೆಲವು ಸೆಕೆಂಡುಗಳ ಕಾಲ ನಿರೀಕ್ಷಿಸಿ."
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 z-10 bg-slate-900/90 p-4 rounded-xl backdrop-blur-sm border border-emerald-500/40 max-w-xs animate-in zoom-in-95">
                      <div className="h-10 w-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/40">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-white">
                        {t("Reward Ready!", "ಪಾಸ್ ಸಿದ್ಧವಾಗಿದೆ!")}
                      </p>
                      <p className="text-xs text-slate-300">
                        {t("Click below to claim your 5-hour access.", "5 ಗಂಟೆಗಳ ಪ್ರವೇಶ ಪಡೆಯಲು ಕೆಳಗೆ ಕ್ಲಿಕ್ ಮಾಡಿ.")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Unlock / Claim Button */}
              {canClaimReward ? (
                <Button
                  onClick={handleClaimPass}
                  size="lg"
                  className="w-full gap-2 h-12 rounded-xl text-sm font-bold bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg animate-pulse"
                >
                  <Zap className="h-5 w-5 fill-white" />
                  <span>{t("Claim 5-Hour Pass & Enter Site", "5 ಗಂಟೆಗಳ ಪಾಸ್ ಪಡೆದು ಸೈಟ್‌ಗೆ ಪ್ರವೇಶಿಸಿ")}</span>
                </Button>
              ) : (
                <div className="text-xs text-[#64748b] flex items-center justify-center gap-1.5 py-1">
                  <Clock className="h-3.5 w-3.5 text-[#2563eb]" />
                  <span>{t(`Unlocking in ${adCountdown} seconds...`, `${adCountdown} ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಅನ್‌ಲಾಕ್ ಆಗಲಿದೆ...`)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
