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
  Img,
} from "@react-email/components";

interface SalesNotificationProps {
  name: string;
  email: string;
  company: string;
  message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eaziwage.com";

export default function SalesNotification({
  name,
  email,
  company,
  message,
}: SalesNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New Sales Lead Notification</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`/logo.png`}
              width="140"
              height="auto"
              alt="EaziWage"
              style={logo}
            />
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>New Sales Lead Received</Heading>

            <Text style={text}>Hi Team,</Text>

            <Text style={text}>
              A potential client has reached out expressing interest in EaziWage. Details are below:
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
                <strong>Company:</strong> {company}
              </Text>
              <Text style={highlightText}>
                <strong>Message:</strong> {message}
              </Text>
            </Section>

            <Text style={text}>
              Please follow up promptly to engage this lead and explore potential opportunities.
            </Text>

            <Button style={button} href={`${baseUrl}/admin`}>
              Go to Dashboard
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2026 EaziWage. Empowering Africa's workforce.
            </Text>
            <Text style={footerText}>
              <Link href={baseUrl} style={footerLink}>
                Website
              </Link>{" "}
              •{" "}
              <Link href={`${baseUrl}/data.pdf`} style={footerLink}>
                Privacy Policy
              </Link>{" "}
              •{" "}
              <Link href={`${baseUrl}/terms.pdf`} style={footerLink}>
                Terms of Service
              </Link>{" "}
              •{" "}
              <Link href={`${baseUrl}/unsubscribe`} style={footerLink}>
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
  padding: "0 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

const header = {
  padding: "32px 48px",
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #f3f4f6",
};

const logo = {
  margin: "0 auto",
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
  textAlign: "center" as const,
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const highlightBox = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #d1fae5",
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
  backgroundColor: "#16a34a",
  borderRadius: "12px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 24px",
  margin: "32px 0",
};

const link = {
  color: "#16a34a",
  textDecoration: "underline",
};

const footer = {
  borderTop: "1px solid #f3f4f6",
  padding: "32px 48px",
  textAlign: "center" as const,
  backgroundColor: "#f9fafb",
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "4px 0",
};

const footerLink = {
  color: "#16a34a",
  textDecoration: "none",
  fontWeight: "600",
};
