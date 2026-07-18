import { FileText } from "lucide-react";
import { LegalPage, PolicySection } from "@/components/legal-page";

export default function TermsAndConditions() {
  return <LegalPage title="Terms & Conditions" description="The terms for using 2PUC Notes Store and purchasing downloadable Karnataka 2nd PUC study materials." icon={FileText}>
    <p className="mb-6 text-sm text-gray-400">Last updated: 18 July 2026</p>
    <PolicySection title="Using our materials"><p>2PUC Notes Store provides digital PDF notes and learning resources for Karnataka 2nd PUC students. These materials are for your personal study use only and do not replace your school, college, teacher, or official board resources.</p></PolicySection>
    <PolicySection title="Orders and payments"><p>Prices are shown in Indian Rupees and may change before an order is placed. Payments are processed securely through Razorpay. Your purchase is confirmed only after successful payment verification.</p><p>After confirmation, your PDF download will be made available immediately and can be accessed later through My Purchases using the phone number provided at checkout.</p></PolicySection>
    <PolicySection title="Personal licence"><p>When you purchase a resource, you receive a limited, non-transferable licence to use it for your own studies. You may not resell, share, upload, reproduce, distribute, or claim ownership of the PDFs without written permission.</p></PolicySection>
    <PolicySection title="Availability and updates"><p>We aim to keep the store and downloads available, but access can occasionally be interrupted for maintenance, technical issues, or circumstances beyond our control. We may update or correct resources when needed.</p></PolicySection>
    <PolicySection title="Questions"><p>If you need help with an order or these terms, contact our support team on Telegram with your purchase details.</p></PolicySection>
  </LegalPage>;
}
