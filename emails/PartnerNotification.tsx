import  EmailLayout  from "./EmailLayout";
import {
  Section, Text, Heading
} from "@react-email/components"

interface PartnerNotificationEmailProps {
  partnerType: string;
  companyName: string;
  industry: string;
  contactName: string;
  jobTitle: string;
  email: string;
  phone: string;
  companySize: string;
  message: string;
}

export default function PartnerNotificationEmail({
  partnerType,
  companyName,
  industry,
  contactName,
  jobTitle,
  email,
  phone,
  companySize,
  message,
}: PartnerNotificationEmailProps) {
  return (
    <EmailLayout
      previewText={`New Partnership Application: ${companyName}`}
      showBorder
      showBorderBottom
      showBorderTop
      footerLinks={[]}
    >
      {/* Content */}
      <Section>
        <Heading style={h1}>New Partnership Application</Heading>

        <Section style={highlightBox}>
          <Text style={text}><strong>Partner Type:</strong> {partnerType}</Text>
          <Text style={text}><strong>Company:</strong> {companyName}</Text>
          <Text style={text}><strong>Industry:</strong> {industry}</Text>
          <Text style={text}><strong>Contact:</strong> {contactName} ({jobTitle})</Text>
          <Text style={text}><strong>Email:</strong> {email}</Text>
          <Text style={text}><strong>Phone:</strong> {phone}</Text>
          <Text style={text}><strong>Company Size:</strong> {companySize}</Text>
        </Section>

        <Text style={text}><strong>Message:</strong></Text>
        <Text style={messageText}>{message}</Text>
      </Section>
    </EmailLayout>
  );
}

/* ----------------------------- styles ----------------------------- */

const h1 = {
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "24px",
  fontFamily: 'Georgia, "Times New Roman", serif',
};

const text = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "8px 0",
};

const messageText = {
  ...text,
  backgroundColor: "#f8fafc",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};

const highlightBox = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "24px",
};