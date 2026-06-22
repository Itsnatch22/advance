import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Tailwind,
} from '@react-email/components';

interface NewsletterConfirmationProps {
  email: string;
  confirmUrl: string;
}

export default function NewsletterConfirmation({ email, confirmUrl }: NewsletterConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your EaziWage newsletter subscription</Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans">
          <Container className="mx-auto py-12 px-4 max-w-xl">
            <Section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">

              {/* Logo / Brand */}
              <Heading className="text-2xl font-bold text-slate-900 mb-1">
                EaziWage
              </Heading>
              <Text className="text-slate-500 text-sm mt-0 mb-6">
                Earned Wage Access for East Africa
              </Text>

              <Hr className="border-slate-100 mb-6" />

              <Heading className="text-lg font-semibold text-slate-900 mb-2">
                Confirm your subscription
              </Heading>
              <Text className="text-slate-600 text-sm leading-relaxed mb-6">
                Hi there! You requested to subscribe <strong>{email}</strong> to EaziWage updates.
                Click the button below to confirm — this link expires in <strong>24 hours</strong>.
              </Text>

              <Button
                href={confirmUrl}
                className="bg-indigo-600 text-white text-sm font-semibold px-6 py-3 rounded-xl no-underline block text-center"
              >
                Confirm Subscription
              </Button>

              <Text className="text-xs text-slate-400 mt-6 leading-relaxed">
                If you didn&apos;t request this, you can safely ignore this email.
                This link will expire automatically and your email won&apos;t be added.
              </Text>

              <Hr className="border-slate-100 mt-6 mb-4" />
              <Text className="text-xs text-slate-400 text-center">
                EaziWage · Nairobi, Kenya · support@eaziwage.com
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}