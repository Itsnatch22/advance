import EmailLayout  from "./EmailLayout";
import { Section, Text, Heading, Link, Button} from "@react-email/components"

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
    <EmailLayout
      previewText="New Sales Lead Notification"
      showBorder
      showBorderBottom
      showBorderTop
    >
      {/* Content */}
      <Section>
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

const footerLink = {
  color: "#16a34a",
  textDecoration: "none",
  fontWeight: "600",
};