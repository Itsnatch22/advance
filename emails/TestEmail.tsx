import { Section, Heading, Text } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface TestEmailProps {
  message: string;
}

export default function TestEmail({ message }: TestEmailProps) {
  return (
    <EmailLayout
      previewText="Test Email - EaziWage"
      showLogo
      showFooter
    >
      <Section>
        <Heading style={h1}>Test Email</Heading>
        <Text style={text}>{message}</Text>
      </Section>
    </EmailLayout>
  );
}

const h1 = {
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 24px",
  lineHeight: "1.3",
  textAlign: "center" as const,
  fontFamily: 'Georgia, "Times New Roman", serif',
};

const text = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};