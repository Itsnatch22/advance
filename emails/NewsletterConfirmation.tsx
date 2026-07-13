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
import  EmailLayout  from "./EmailLayout";

interface NewsletterConfirmationProps {
  email: string;
  confirmUrl: string;
}

export default function NewsletterConfirmation({ email, confirmUrl }: NewsletterConfirmationProps) {
  return (
    <EmailLayout
      previewText="Confirm your EaziWage newsletter subscription"
      showLogo={false}
      showFooter={false}
    >
      {/* Content */}
      <OuterSection>
        <Tailwind>
          <InnerBody className="bg-slate-50 font-sans">
            <InnerContainer className="mx-auto py-12 px-4 max-w-xl">
              <InnerSection className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                
                {/* Logo / Brand */}
                <InnerHeading className="text-2xl font-bold text-slate-900 mb-1">
                  EaziWage
                </InnerHeading>
                <InnerText className="text-slate-500 text-sm mt-0 mb-6">
                  Earned Wage Access for East Africa
                </InnerText>
                
                <InnerHr className="border-slate-100 mb-6" />
                
                <InnerHeading className="text-lg font-semibold text-slate-900 mb-2">
                  Confirm your subscription
                </InnerHeading>
                <InnerText className="text-slate-600 text-sm leading-relaxed mb-6">
                  Hi there! You requested to subscribe <strong>{email}</strong> to EaziWage updates.
                  Click the button below to confirm — this link expires in <strong>24 hours</strong>.
                </InnerText>
                
                <InnerButton
                  href={confirmUrl}
                  className="bg-green-600 text-white text-sm font-semibold px-6 py-3 rounded-xl no-underline block text-center"
                >
                  Confirm Subscription
                </InnerButton>
                
                <InnerText className="text-xs text-slate-400 mt-6 leading-relaxed">
                  If you didn&apos;t request this, you can safely ignore this email.
                  This link will expire automatically and your email won&apos;t be added.
                </InnerText>
                
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