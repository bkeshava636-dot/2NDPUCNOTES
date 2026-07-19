import { FileText } from "lucide-react";
import { LegalPage, PolicySection } from "@/components/legal-page";

export default function TermsAndConditions() {
  return (
    <LegalPage
      title="Terms & Conditions"
      description="Please read these terms carefully before using 2nd PUC Notes or purchasing our digital study materials."
      icon={FileText}
    >
      <p className="mb-6 text-sm text-gray-400">
        Last Updated: 18 July 2026
      </p>

      <PolicySection title="Use of Our Services">
        <p>
          2nd PUC Notes provides digital notes and study materials for
          Karnataka 2nd PUC students. These resources are intended to support
          your learning and should not replace official textbooks, classroom
          teaching, or board-prescribed study materials.
        </p>
      </PolicySection>

      <PolicySection title="Orders & Payments">
        <p>
          All prices are displayed in Indian Rupees (INR) and may change
          without prior notice until an order is successfully placed.
          Payments are processed securely through Razorpay.
        </p>

        <p>
          Your purchase is confirmed only after successful payment
          verification. Once confirmed, your purchased study material will be
          available immediately and can be accessed later through the
          <strong> My Purchases </strong> page using the phone number provided
          during checkout.
        </p>
      </PolicySection>

      <PolicySection title="Personal Licence">
        <p>
          When you purchase a digital resource, you receive a limited,
          non-exclusive, non-transferable licence to use it for your personal
          educational purposes only.
        </p>

        <p>
          You may not copy, reproduce, resell, redistribute, upload, share,
          modify, or claim ownership of any study material without prior
          written permission from 2nd PUC Notes.
        </p>
      </PolicySection>

      <PolicySection title="Availability & Updates">
        <p>
          We strive to keep our website and digital downloads available at all
          times. However, temporary interruptions may occur due to maintenance,
          technical issues, or circumstances beyond our control.
        </p>

        <p>
          We reserve the right to update, improve, or correct our study
          materials whenever necessary.
        </p>
      </PolicySection>

      <PolicySection title="Limitation of Liability">
        <p>
          While we make every effort to provide accurate and useful study
          materials, we do not guarantee specific examination results. Users
          are responsible for using the materials appropriately as part of
          their own preparation.
        </p>
      </PolicySection>

      <PolicySection title="Contact Us">
        <p>
          If you have any questions regarding these Terms & Conditions or your
          purchase, please contact us through our official Telegram support.
        </p>
      </PolicySection>
    </LegalPage>
  );
}