import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";

interface SubscriptionNotificationProps {
  email: string;
}

export default function SubscriptionNotification({
  email,
}: SubscriptionNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the EaziWage Newsletter!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={heading}>EaziWage</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>You're Subscribed!</Heading>

            <Text style={text}>Hi, {email}</Text>

            <Text style={text}>
              Thanks for subscribing to the EaziWage newsletter. We're thrilled
              to have you on board and can't wait to share insights, updates,
              and exclusive tips for financial wellbeing.
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightText}>
                <strong>Here's what to expect:</strong>
              </Text>
              <Text style={highlightText}>
                • Weekly updates on EaziWage and fintech trends
                <br />
                • Expert tips to manage your earnings smarter
                <br />
                • Invitations to events and special promotions
              </Text>
            </Section>

            <Text style={text}>
              Stay tuned for our first newsletter, landing straight in your
              inbox soon!
            </Text>

            <Button style={button} href="https://eaziwage.com/newsletter">
              Explore Our Newsletter
            </Button>

            <Text style={text}>
              For any questions, reach out to{" "}
              <Link href="mailto:newsletter@eaziwage.com" style={link}>
                newsletter@eaziwage.com
              </Link>
              .
            </Text>

            <Text style={text}>
              Best regards,
              <br />
              The EaziWage Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2026 EaziWage. Empowering Africa's workforce.
            </Text>
            <Text style={footerText}>
              <Link href="https://eaziwage.com" style={footerLink}>
                Website
              </Link>{" "}
              •{" "}
              <Link href="https://eaziwage.com/data.pdf" style={footerLink}>
                Privacy Policy
              </Link>{" "}
              •{" "}
              <Link href="https://eaziwage.com/terms.pdf" style={footerLink}>
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
