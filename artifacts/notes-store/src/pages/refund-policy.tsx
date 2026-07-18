import { RotateCcw } from "lucide-react";
import { LegalPage, PolicySection } from "@/components/legal-page";

export default function RefundPolicy() {
  return <LegalPage title="Refund Policy" description="Clear guidance for refunds on digital PDF notes purchased through 2PUC Notes Store." icon={RotateCcw}>
    <p className="mb-6 text-sm text-gray-400">Last updated: 18 July 2026</p>
    <PolicySection title="Digital product policy"><p>Our notes are digital downloads that become available immediately after a successful Razorpay payment. Because a PDF can be accessed straight away, completed purchases are generally non-refundable.</p></PolicySection>
    <PolicySection title="When we can help"><p>Please contact us on Telegram if you were charged but did not receive access, received the wrong resource, have a duplicate charge, or experience a technical download problem that we cannot resolve. We will review eligible requests fairly.</p></PolicySection>
    <PolicySection title="How to request support"><ul className="list-disc space-y-1 pl-5"><li>Message us on Telegram as soon as possible after the purchase.</li><li>Include your name, phone number used at checkout, resource name, and Razorpay payment or order ID.</li><li>Describe the issue and attach a screenshot if it helps.</li></ul></PolicySection>
    <PolicySection title="Refund processing"><p>If a refund is approved, it is returned to the original payment method through the applicable payment channel. Processing times may vary depending on Razorpay, your bank, or payment provider.</p></PolicySection>
  </LegalPage>;
}
