import { ShieldCheck } from "lucide-react";
import { LegalPage, PolicySection } from "@/components/legal-page";

export default function PrivacyPolicy() {
  return <LegalPage title="Privacy Policy" description="How 2PUC Notes Store handles the information you share while finding and downloading study materials." icon={ShieldCheck}>
    <p className="mb-6 text-sm text-gray-400">Last updated: 18 July 2026</p>
    <PolicySection title="Information we collect"><p>We collect the details needed to process your order and provide your PDF downloads, such as your name, phone number, email address (if provided), purchase details, and download history.</p><p>Razorpay processes card, UPI, net-banking, and wallet payments. We do not store your complete card, UPI, or other payment credentials.</p></PolicySection>
    <PolicySection title="How we use your information"><ul className="list-disc space-y-1 pl-5"><li>Confirm payments and deliver purchased PDF notes.</li><li>Help you recover downloads through My Purchases.</li><li>Respond to support or refund requests on Telegram.</li><li>Maintain store security and improve our study-material service.</li></ul></PolicySection>
    <PolicySection title="Sharing and security"><p>We share information only with service providers needed to operate the store, including Razorpay for secure payment processing. We do not sell your personal information.</p><p>We use reasonable safeguards to protect your information, but no online service can guarantee absolute security.</p></PolicySection>
    <PolicySection title="Your choices"><p>You may ask about, correct, or request deletion of your personal information by contacting us on Telegram. Some purchase records may need to be retained for accounting, legal, or fraud-prevention purposes.</p></PolicySection>
  </LegalPage>;
}
