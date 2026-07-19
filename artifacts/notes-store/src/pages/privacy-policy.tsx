import { ShieldCheck } from "lucide-react";
import { LegalPage, PolicySection } from "@/components/legal-page";

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Learn how 2nd PUC Notes collects, uses, and protects your personal information while you access our notes and study materials."
      icon={ShieldCheck}
    >
      <p className="mb-6 text-sm text-gray-400">
        Last Updated: 18 July 2026
      </p>

      <PolicySection title="Information We Collect">
        <p>
          To process your orders and provide access to purchased study
          materials, we may collect your name, phone number, email address
          (optional), purchase details, and download history.
        </p>

        <p>
          Payments are securely processed through <strong>Razorpay</strong>. We
          do not store your card details, UPI credentials, net banking
          information, or wallet credentials.
        </p>
      </PolicySection>

      <PolicySection title="How We Use Your Information">
        <ul className="list-disc space-y-1 pl-5">
          <li>Process and confirm your payments.</li>
          <li>Provide access to purchased notes and study materials.</li>
          <li>Help you recover downloads through the My Purchases page.</li>
          <li>Respond to customer support and refund requests.</li>
          <li>Maintain platform security and improve our services.</li>
        </ul>
      </PolicySection>

      <PolicySection title="Sharing of Information">
        <p>
          We only share your information with trusted service providers required
          to operate our platform, including Razorpay for secure payment
          processing.
        </p>

        <p>
          We never sell, rent, or trade your personal information to third
          parties.
        </p>
      </PolicySection>

      <PolicySection title="Data Security">
        <p>
          We take reasonable measures to protect your personal information from
          unauthorized access, misuse, or disclosure.
        </p>

        <p>
          However, no method of internet transmission or electronic storage is
          completely secure, and we cannot guarantee absolute security.
        </p>
      </PolicySection>

      <PolicySection title="Your Rights">
        <p>
          You may contact us to request access to, correction of, or deletion of
          your personal information where applicable.
        </p>

        <p>
          Some purchase records may be retained to comply with legal,
          accounting, and fraud-prevention requirements.
        </p>
      </PolicySection>
    </LegalPage>
  );
}