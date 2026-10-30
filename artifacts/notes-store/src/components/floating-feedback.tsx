import { useState } from "react";
import { MessageSquarePlus, Flag, CheckCircle2, AlertTriangle, Send, X, Loader2, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-context";

type FeedbackType = "feedback" | "bug_report" | "broken_link" | "content_error";
type Rating = "working_great" | "minor_issue" | "broken";

export function FloatingFeedback() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("feedback");
  const [rating, setRating] = useState<Rating>("working_great");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleOpen = () => {
    setOpen(true);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL;
      const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : "";
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          rating,
          message: message.trim(),
          contact: contact.trim() || undefined,
          pageUrl: window.location.href,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit feedback");

      setSubmitted(true);
      toast({
        title: type === "feedback" ? "Thank You for Feedback!" : "Report Submitted",
        description: "Your report has been recorded. Our team will review it.",
      });
      setMessage("");
      setContact("");
    } catch (err: any) {
      toast({
        title: "Error submitting feedback",
        description: err.message || "Please check your network connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Pill / Button in Right Bottom */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group print:hidden">
        <button
          type="button"
          onClick={handleOpen}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] dark:bg-[#1C2638] dark:hover:bg-[#253248] dark:border-[#293548] text-white shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] active:scale-95"
          aria-label={t("Give Feedback or Report an Issue", "ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ ಅಥವಾ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ")}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563eb] text-white">
            <MessageSquarePlus className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-tight pr-0.5">{t("Feedback", "ಪ್ರತಿಕ್ರಿಯೆ")}</span>
        </button>
      </div>

      {/* Interactive Modal Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-[#151D2E] border border-[#e2e8f0] dark:border-[#293548] shadow-xl sm:rounded-2xl">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-lg font-bold text-[#0f172a] dark:text-[#F1F5F9] flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
                <MessageSquarePlus className="h-4 w-4" />
              </div>
              <span>{t("Feedback & Issue Report", "ಪ್ರತಿಕ್ರಿಯೆ ಮತ್ತು ವರದಿ")}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748b] dark:text-[#94A3B8]">
              {t("Help us keep 2PUC study notes and downloads running smoothly for all students.", "2PUC ನೋಟ್ಸ್ ಮತ್ತು ಡೌನ್‌ಲೋಡ್‌ಗಳನ್ನು ಉತ್ತಮವಾಗಿಡಲು ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ತಿಳಿಸಿ.")}
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-base text-[#0f172a] dark:text-[#F1F5F9]">{t("Received with thanks!", "ಧನ್ಯವಾದಗಳು! ಸ್ವೀಕರಿಸಲಾಗಿದೆ")}</h3>
              <p className="text-xs text-[#64748b] dark:text-[#94A3B8] max-w-xs mx-auto">
                {t("Thank you for helping us maintain accurate notes and instant PDF downloads.", "ನಿಖರವಾದ ನೋಟ್ಸ್ ಮತ್ತು ಡೌನ್‌ಲೋಡ್‌ಗಳನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು.")}
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => setOpen(false)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs h-9 px-5 font-semibold"
                >
                  {t("Close", "ಮುಚ್ಚಿ")}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Type Switcher */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#334155] dark:text-[#F1F5F9]">What would you like to do?</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("feedback")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      type === "feedback"
                        ? "bg-[#eff6ff] dark:bg-[#1C2638] border-[#2563eb] dark:border-[#818CF8] text-[#2563eb] dark:text-[#818CF8] shadow-2xs"
                        : "bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#64748b] dark:text-[#94A3B8] hover:bg-[#f1f5f9]"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Give Feedback</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("bug_report")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      type === "bug_report" || type === "broken_link" || type === "content_error"
                        ? "bg-[#fff1f2] dark:bg-rose-950/30 border-[#e11d48] dark:border-rose-700 text-[#e11d48] dark:text-rose-400 shadow-2xs"
                        : "bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#64748b] dark:text-[#94A3B8] hover:bg-[#f1f5f9]"
                    }`}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    <span>Report an Issue</span>
                  </button>
                </div>
              </div>

              {/* Specific report category if issue is selected */}
              {(type === "bug_report" || type === "broken_link" || type === "content_error") && (
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setType("bug_report")}
                    className={`px-2.5 py-1 rounded-lg border font-medium ${
                      type === "bug_report"
                        ? "bg-[#e11d48] text-white border-[#e11d48]"
                        : "bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#64748b] dark:text-[#94A3B8]"
                    }`}
                  >
                    Bug / Error
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("broken_link")}
                    className={`px-2.5 py-1 rounded-lg border font-medium ${
                      type === "broken_link"
                        ? "bg-[#e11d48] text-white border-[#e11d48]"
                        : "bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#64748b] dark:text-[#94A3B8]"
                    }`}
                  >
                    Broken PDF / Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("content_error")}
                    className={`px-2.5 py-1 rounded-lg border font-medium ${
                      type === "content_error"
                        ? "bg-[#e11d48] text-white border-[#e11d48]"
                        : "bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#64748b] dark:text-[#94A3B8]"
                    }`}
                  >
                    Content Issue
                  </button>
                </div>
              )}

              {/* Status / Check Question */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#334155] dark:text-[#F1F5F9]">How is the website working for you?</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRating("working_great")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      rating === "working_great"
                        ? "bg-[#f0fdf4] dark:bg-emerald-950/30 border-[#16a34a] dark:border-emerald-600 text-[#16a34a] dark:text-emerald-400 font-bold shadow-2xs"
                        : "bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#64748b] dark:text-[#94A3B8] hover:bg-[#f1f5f9]"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-[#16a34a]" />
                    <span className="text-[11px] block leading-tight">Working Well</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRating("minor_issue")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      rating === "minor_issue"
                        ? "bg-[#fffbeb] dark:bg-amber-950/30 border-[#d97706] dark:border-amber-600 text-[#d97706] dark:text-amber-400 font-bold shadow-2xs"
                        : "bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#64748b] dark:text-[#94A3B8] hover:bg-[#f1f5f9]"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4 mx-auto mb-1 text-[#d97706]" />
                    <span className="text-[11px] block leading-tight">Minor Issue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRating("broken")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      rating === "broken"
                        ? "bg-[#fff1f2] border-[#e11d48] text-[#e11d48] font-bold shadow-2xs"
                        : "bg-[#f8fafc] dark:bg-[#1C2638] border-[#e2e8f0] dark:border-[#293548] text-[#64748b] dark:text-[#94A3B8] hover:bg-[#f1f5f9]"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-[#e11d48]" />
                    <span className="text-[11px] block leading-tight">Something's Broken</span>
                  </button>
                </div>
              </div>

              {/* Message field */}
              <div className="space-y-1.5">
                <Label htmlFor="fb-message" className="text-xs font-bold text-[#334155] dark:text-[#F1F5F9]">
                  {type === "feedback" ? "Your Feedback / Suggestion *" : "Details of the Issue *"}
                </Label>
                <Textarea
                  id="fb-message"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === "feedback"
                      ? "Tell us how we can improve 2PUC notes, subjects, or study features..."
                      : "Which PDF, chapter or page had an issue? Please describe what happened..."
                  }
                  className="text-xs rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border-[#cbd5e1] dark:border-[#293548] text-[#0f172a] dark:text-[#F1F5F9] dark:text-[#F1F5F9] focus-visible:ring-[#2563eb]"
                />
              </div>

              {/* Optional Contact */}
              <div className="space-y-1.5">
                <Label htmlFor="fb-contact" className="text-xs font-medium text-[#64748b] dark:text-[#94A3B8]">
                  Mobile / Telegram / Email (Optional for updates)
                </Label>
                <Input
                  id="fb-contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Optional contact details"
                  className="h-9 text-xs rounded-xl bg-[#f8fafc] dark:bg-[#1C2638] border-[#cbd5e1] dark:border-[#293548] text-[#0f172a] dark:text-[#F1F5F9] dark:text-[#F1F5F9] focus-visible:ring-[#2563eb]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9] dark:border-[#293548]">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="text-xs h-9 rounded-xl text-[#64748b] dark:text-[#94A3B8]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !message.trim()}
                  size="sm"
                  className="gap-1.5 h-9 px-4 text-xs font-semibold rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#818CF8] dark:hover:bg-[#6366F1] text-white shadow-2xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>{type === "feedback" ? "Submit Feedback" : "Submit Report"}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
