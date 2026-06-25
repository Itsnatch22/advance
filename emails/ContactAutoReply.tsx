import {
  Section,
  Heading,
  Text,
  Link,
  Img,
} from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface ContactAutoReplyProps {
  name: string;
  subject: string;
}

export default function ContactAutoReply({
  name,
  subject,
}: ContactAutoReplyProps) {
  return (
    <EmailLayout
      previewText="We received your message - EaziWage"
      showBorder
      showBorderBottom
      showBorderTop
    >
      {/* Header */}
      {/* Logo is handled by EmailLayout by default */}
      
      {/* Content */}
      <Section>
        <Heading style={h1}>Hi {name},</Heading>

        <Text style={text}>
          Thank you for reaching out to us. We've received your message and
          our team will get back to you within 24 hours.
        </Text>

        <Section style={highlightBox}>
          <Text style={highlightText}>
            <strong>Your Message Subject:</strong> {subject}
          </Text>
        </Section>

        <Text style={text}>
          In the meantime, feel free to explore more about how EaziWage is
          transforming financial wellbeing for Africa's workforce.
        </Text>

        <Text style={text}>
          Best regards,
          <br />
          <strong>The EaziWage Team</strong>
        </Text>
      </Section>

      {/* Footer custom content */}
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

const footerLink = {
  color: "#16a34a",
  textDecoration: "none",
  fontWeight: "600",
};