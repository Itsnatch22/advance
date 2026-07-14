import { Section, Heading, Text, Button } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface NewsletterConfirmationProps {
  email: string;
  confirmUrl: string;
}

export default function NewsletterConfirmation({ email, confirmUrl }: NewsletterConfirmationProps) {
  return (
    <EmailLayout
      previewText="Confirm your EaziWage newsletter subscription"
      footerLinks={[{ label: "Website", href: "" }, { label: "Security", href: "/security" }]}
    >
      <Section>
        <Heading style={h1}>Confirm your subscription</Heading>

        <Text style={text}>Hi there,</Text>

        <Text style={text}>
          You requested to subscribe <strong>{email}</strong> to EaziWage
          updates. Click below to confirm — this link expires in{" "}
          <strong>24 hours</strong>.
        </Text>

        <Button style={button} href={confirmUrl}>
          Confirm Subscription
        </Button>

        <Text style={mutedText}>
          If you didn&apos;t request this, you can safely ignore this email.
          The link will expire automatically and your email won&apos;t be
          added.
        </Text>
      </Section>
    </EmailLayout>
  );
}

/* ----------------------------- styles ----------------------------- */

const h1 = {
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 24px",
  lineHeight: "1.3",
  textAlign: "center" as const,
  fontFamily: 'Georgia, "Times New Roman", serif',
};

const text = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const mutedText = {
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "24px 0 0",
};

const button = {
  backgroundColor: "#059669",
  borderRadius: "16px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 24px",
  margin: "32px 0",
};
