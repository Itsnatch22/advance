import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export const ContactNotification = ({
  name,
  email,
  subject,
  message,
  submittedAt,
}: ContactNotificationProps) => (
  <Html>
    <Head />
    <Preview>New Contact Form Submission from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>EaziWage Contact Form Submission</Heading>
          <Text style={subtitle}>
            Earned Wage Access for Employees Across Africa
          </Text>
        </Section>

        <Section style={content}>
          <Row>
            <Column>
              <Text style={label}>Submitted At:</Text>
              <Text style={value}>{submittedAt}</Text>
            </Column>
          </Row>

          <Row style={row}>
            <Column style={halfColumn}>
              <Text style={label}>Name:</Text>
              <Text style={value}>{name}</Text>
            </Column>
            <Column style={halfColumn}>
              <Text style={label}>Email:</Text>
              <Text style={value}>{email}</Text>
            </Column>
          </Row>

          <Row style={row}>
            <Column>
              <Text style={label}>Subject:</Text>
              <Text style={value}>{subject}</Text>
            </Column>
          </Row>

          <Row style={row}>
            <Column>
              <Text style={label}>Message:</Text>
              <Text style={messageStyle}>{message}</Text>
            </Column>
          </Row>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            This message was sent via the EaziWage contact form. Please respond
            within 24 hours.
          </Text>
          <Text style={footerText}>
            Nairobi, Kenya | +254 723 154900 | support@eaziwage.com
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles remain the same as in previous example
const main = { backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" };
const container = { margin: "0 auto", padding: "20px", maxWidth: "600px" };
const header = {
  backgroundColor: "#16a34a",
  padding: "30px",
  textAlign: "center" as const,
  borderRadius: "8px 8px 0 0",
};
const h1 = { color: "#ffffff", margin: "0", fontSize: "24px" };
const subtitle = { color: "#d1fae5", margin: "5px 0 0", fontSize: "14px" };
const content = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "0 0 8px 8px",
};
const row = { margin: "20px 0" };
const halfColumn = { width: "48%", display: "inline-block" };
const label = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 5px",
};
const value = { color: "#111827", fontSize: "16px", margin: "0 0 15px" };
const messageStyle = {
  color: "#111827",
  fontSize: "16px",
  lineHeight: "1.6",
  backgroundColor: "#f9fafb",
  padding: "15px",
  borderRadius: "4px",
  border: "1px solid #e5e7eb",
};
const footer = {
  marginTop: "30px",
  paddingTop: "20px",
  borderTop: "1px solid #e5e7eb",
};
const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "5px 0",
};
