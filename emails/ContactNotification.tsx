import {
  Section,
  Heading,
  Text,
  Link,
  Button,
} from "@react-email/components";
import EmailLayout from "./EmailLayout";

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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eaziwage.com";

  return (
    <EmailLayout
      previewText="New Contact Form Submission Received"
      showBorder
      showBorderBottom
      showBorderTop
      footerContent={<></>} // Empty to use default footer from EmailLayout
    >
      {/* Header */}
      {/* Logo is handled by EmailLayout by default */}
      
      {/* Content */}
      <Section>
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

        <Button style={button} href={`${baseUrl}/admin`}>
          Go to Dashboard
        </Button>
      </Section>
    </EmailLayout>
  );
}

/* ----------------------------- styles ----------------------------- */

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