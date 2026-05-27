import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

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
    <Html>
      <Head />
      <Preview>New Partnership Application: {companyName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
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
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  borderRadius: "8px",
};

const content = {
  padding: "20px",
};

const h1 = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "24px",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "8px 0",
};

const messageText = {
  ...text,
  backgroundColor: "#f9fafb",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const highlightBox = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #d1fae5",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
};
