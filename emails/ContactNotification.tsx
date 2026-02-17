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

interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export default function ContactNotification({
  name,
  email,
  subject,
  message,
  submittedAt,
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Submission Received</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={heading}>EaziWage</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>New Contact Submission</Heading>

            <Text style={text}>Hi Team,</Text>

            <Text style={text}>
              You have received a new contact form submission. Details are as
              follows:
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightText}>
                <strong>Name:</strong> {name}
              </Text>
              <Text style={highlightText}>
                <strong>Email:</strong>{" "}
                <Link href={`mailto:${email}`} style={link}>
                  {email}
                </Link>
              </Text>
              <Text style={highlightText}>
                <strong>Subject:</strong> {subject}
              </Text>
              <Text style={highlightText}>
                <strong>Message:</strong> {message}
              </Text>
              <Text style={highlightText}>
                <strong>Submitted At:</strong> {submittedAt}
              </Text>
            </Section>

            <Text style={text}>
              Please review the submission and follow up accordingly.
            </Text>

            <Button style={button} href="https://eaziwage.com/admin">
              Go to Dashboard
            </Button>
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
              </Link>{" "}
              •{" "}
              <Link href="https://eaziwage.com/unsubscribe" style={footerLink}>
                Unsubscribe
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
