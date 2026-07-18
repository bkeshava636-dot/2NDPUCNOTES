import { MessageCircle, ReceiptText, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalPage } from "@/components/legal-page";
import { TELEGRAM_LINK } from "@/lib/site-config";

export default function ContactUs() {
  return <LegalPage title="Contact Us" description="Need help with a download, payment, or a 2nd PUC study resource? Our support team is on Telegram." icon={MessageCircle}>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 sm:col-span-2"><MessageCircle className="mb-3 h-7 w-7 text-primary" /><h2 className="text-xl font-bold text-gray-900">Chat with us on Telegram</h2><p className="mt-2 text-sm leading-6 text-gray-600">Telegram is the fastest way to reach 2PUC Notes Store for purchase questions, download assistance, and refund support.</p><a className="mt-5 inline-block" href={TELEGRAM_LINK} target="_blank" rel="noreferrer"><Button className="gap-2"><MessageCircle className="h-4 w-4" /> Contact on Telegram</Button></a></div>
      <div className="rounded-xl border border-gray-200 p-5"><ReceiptText className="mb-3 h-6 w-6 text-primary" /><h2 className="font-bold text-gray-900">For order help</h2><p className="mt-2 text-sm leading-6 text-gray-600">Please share the phone number used at checkout, the resource name, and your Razorpay payment or order ID.</p></div>
      <div className="rounded-xl border border-gray-200 p-5"><Clock3 className="mb-3 h-6 w-6 text-primary" /><h2 className="font-bold text-gray-900">Support requests</h2><p className="mt-2 text-sm leading-6 text-gray-600">Tell us clearly what you need—whether it is a download issue, payment concern, or question about a study resource.</p></div>
    </div>
    <div className="mt-6 border-t border-gray-100 pt-6 text-sm leading-6 text-gray-600"><h2 className="mb-2 text-lg font-bold text-gray-900">Before you message</h2><p>For purchased PDFs, you can first try <a className="font-medium text-primary hover:underline" href="/my-purchases">My Purchases</a> with the mobile number used during checkout. If you still need help, send us a Telegram message and we will assist you.</p></div>
  </LegalPage>;
}
