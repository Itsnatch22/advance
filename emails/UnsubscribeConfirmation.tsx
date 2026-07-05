import {
  Section as OuterSection,
  Tailwind,
  Body as InnerBody,
  Container as InnerContainer,
  Section as InnerSection,
  Heading as InnerHeading,
  Text as InnerText,
  Button as InnerButton,
  Hr as InnerHr,
} from "@react-email/components";
import EmailLayout from "./EmailLayout";

const PRODUCT_LABELS: Record<string, string> = {
  newsletter: "Newsletter",
  partners: "Partner Emails",
  sales: "Sales & Leads",
  all: "All EaziWage Emails",
};

interface UnsubscribeConfirmationProps {
  email: string;
  product: string;
  resubscribeUrl?: string;
}

export default function UnsubscribeConfirmation({
  email,
  product,
  resubscribeUrl = "https://eaziwage.com",
}: UnsubscribeConfirmationProps) {
  const label = PRODUCT_LABELS[product] ?? product;

  return (
    <EmailLayout
      previewText={`You've been unsubscribed from ${label}`}
      showLogo={false}
      showFooter={false}
    >
      <OuterSection>
        <Tailwind>
          <InnerBody className="bg-slate-50 font-sans">
            <InnerContainer className="mx-auto py-12 px-4 max-w-xl">
              <InnerSection className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">

                {/* Brand */}
                <InnerHeading className="text-2xl font-bold text-slate-900 mb-1">
                  EaziWage
                </InnerHeading>
                <InnerText className="text-slate-500 text-sm mt-0 mb-6">
                  Earned Wage Access for East Africa
                </InnerText>

                <InnerHr className="border-slate-100 mb-6" />

                {/* Confirmation */}
                <InnerHeading className="text-lg font-semibold text-slate-900 mb-2">
                  Unsubscription confirmed ✓
                </InnerHeading>
                <InnerText className="text-slate-600 text-sm leading-relaxed mb-2">
                  Hi there,
                </InnerText>
                <InnerText className="text-slate-600 text-sm leading-relaxed mb-6">
                  <strong>{email}</strong> has been removed from{" "}
                  <strong>{label}</strong>. You won&apos;t receive any more of
                  these emails. Please allow a few days for all sends to stop.
                </InnerText>

                <InnerText className="text-slate-600 text-sm leading-relaxed mb-6">
                  Changed your mind? You can re-subscribe at any time from our
                  website.
                </InnerText>

                <InnerButton
                  href={resubscribeUrl}
                  className="bg-emerald-600 text-white text-sm font-semibold px-6 py-3 rounded-xl no-underline block text-center"
                >
                  Visit EaziWage
                </InnerButton>

                <InnerHr className="border-slate-100 mt-6 mb-4" />

                <InnerText className="text-xs text-slate-400 text-center">
                  EaziWage · Nairobi, Kenya · support@eaziwage.com
                </InnerText>
              </InnerSection>
            </InnerContainer>
          </InnerBody>
        </Tailwind>
      </OuterSection>
    </EmailLayout>
  );
}
