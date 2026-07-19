import { RotateCcw } from "lucide-react";
import { LegalPage, PolicySection } from "@/components/legal-page";

export default function RefundPolicy() {
  return (
    <LegalPage
      title="Refund Policy"
      description="Our refund policy for digital notes and study materials purchased through 2nd PUC Notes."
      icon={RotateCcw}
    >
      <p className="mb-6 text-sm text-gray-400">
        Last Updated: 18 July 2026
      </p>

      <PolicySection title="Digital Product Policy">
        <p>
          All products sold on 2nd PUC Notes are digital study materials
          delivered instantly after a successful Razorpay payment. Since digital
          files become immediately accessible after purchase, completed
          purchases are generally non-refundable.
        </p>
      </PolicySection>

      <PolicySection title="When We Can Help">
        <p>
          We are happy to assist if you experience any of the following:
        </p>

        <ul className="list-disc space-y-1 pl-5 mt-2">
          <li>You were charged but did not receive your download.</li>
          <li>You received the wrong study material.</li>
          <li>You were charged more than once for the same purchase.</li>
          <li>You experience a technical issue that prevents access to your purchased file.</li>
        </ul>

        <p className="mt-3">
          Every request is reviewed individually, and eligible cases will be
          resolved fairly.
        </p>
      </PolicySection>

      <PolicySection title="How to Request Support">
        <ul className="list-disc space-y-1 pl-5">
          <li>Contact us through our official Telegram support.</li>
          <li>Provide your name and the phone number used during checkout.</li>
          <li>Include the resource name and your Razorpay Order ID or Payment ID.</li>
          <li>Attach screenshots if they help explain the issue.</li>
        </ul>
      </PolicySection>

      <PolicySection title="Refund Processing">
        <p>
          If a refund is approved, it will be issued to your original payment
          method through Razorpay. Processing times may vary depending on your
          bank or payment provider.
        </p>
      </PolicySection>
    </LegalPage>
  );
}