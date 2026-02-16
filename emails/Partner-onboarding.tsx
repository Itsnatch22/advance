import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PartnerOnboardingEmailProps {
  contactName: string;
  companyName: string;
}

export default function PartnerOnboardingEmail({
  contactName,
  companyName,
}: PartnerOnboardingEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your partnership interest in EaziWage</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={heading}>EaziWage</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>Partnership Application Received</Heading>

            <Text style={text}>Hi {contactName},</Text>

            <Text style={text}>
              Thank you for your interest in partnering with EaziWage on behalf
              of <strong>{companyName}</strong>.
            </Text>

            <Text style={text}>
              We've received your partnership application and our team is
              excited to review it. We carefully evaluate each partnership
              opportunity to ensure we can create meaningful value together.
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightText}>
                <strong>What happens next?</strong>
              </Text>
              <Text style={highlightText}>
                • Our partnerships team will review your application within 2-3
                business days
                <br />
                • We'll reach out to schedule an introductory call
                <br />
                • We'll discuss how we can work together to empower Africa's
                workforce
              </Text>
            </Section>

            <Text style={text}>
              In the meantime, feel free to explore more about EaziWage and how
              we're revolutionizing financial wellbeing:
            </Text>

            <Button
              style={button}
              href="https://eaziwage.com"
            >
              Learn More About EaziWage
            </Button>

            <Text style={text}>
              If you have any urgent questions, please don't hesitate to reach
              out to us at{" "}
              <Link href="mailto:partnerships@eaziwage.com" style={link}>
                partnerships@eaziwage.com
              </Link>
              .
            </Text>

            <Text style={text}>
              Best regards,
              <br />
              The EaziWage Partnerships Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2025 EaziWage. Empowering Africa's workforce.
            </Text>
            <Text style={footerText}>
              <Link href="https://eaziwage.com" style={footerLink}>
                Website
              </Link>{" "}
              •{" "}
              <Link href="https://eaziwage.com/privacy" style={footerLink}>
                Privacy Policy
              </Link>{" "}
              •{" "}
              <Link href="https://eaziwage.com/terms" style={footerLink}>
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ----------------------------- styles ----------------------------- */

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 48px",
  borderBottom: "1px solid #e5e7eb",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#059669",
  margin: "0",
};

const content = {
  padding: "32px 48px",
};

const h1 = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 24px",
  lineHeight: "1.3",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const highlightBox = {
  backgroundColor: "#f0fdf4",
  border: "2px solid #86efac",
  borderRadius: "12px",
  padding: "20px",
  margin: "24px 0",
};

const highlightText = {
  color: "#065f46",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "8px 0",
};

const button = {
  backgroundColor: "#059669",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 24px",
  margin: "24px 0",
};

const link = {
  color: "#059669",
  textDecoration: "underline",
};

const footer = {
  borderTop: "1px solid #e5e7eb",
  padding: "24px 48px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "8px 0",
};

const footerLink = {
  color: "#6b7280",
  textDecoration: "underline",
};