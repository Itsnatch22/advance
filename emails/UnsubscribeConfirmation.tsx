import { Section, Heading, Text, Button } from "@react-email/components";
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
      footerLinks={[{ label: "Website", href: "" }]}
    >
      <Section>
        <Heading style={h1}>Unsubscription confirmed</Heading>

        <Text style={text}>Hi there,</Text>

        <Text style={text}>
          <strong>{email}</strong> has been removed from{" "}
          <strong>{label}</strong>. You won&apos;t receive any more of these
          emails. Please allow a few days for all sends to stop.
        </Text>

        <Text style={text}>
          Changed your mind? You can re-subscribe at any time from our
          website.
        </Text>

        <Button style={button} href={resubscribeUrl}>
          Visit EaziWage
        </Button>
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
