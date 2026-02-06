// emails/SalesNotification.tsx
import * as React from "react";
import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Heading } from "@react-email/heading";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

interface SalesNotificationProps {
  name: string;
  email: string;
  company: string;
  message: string;
}

export default function SalesNotification({ name, email, company, message }: SalesNotificationProps) {
  return (
    <Html>
      <Head />
      <Container style={{ maxWidth: "580px", margin: "0 auto", padding: "20px" }}>
        <Heading style={{ color: "#333", fontSize: "24px" }}>New Sales Lead</Heading>
        <Text style={{ fontSize: "16px", color: "#333" }}>
          You have a new demo request from:
        </Text>
        <Section style={{ marginBottom: "20px" }}>
          <Text><strong>Name:</strong> {name}</Text>
          <Text><strong>Email:</strong> {email}</Text>
          <Text><strong>Company:</strong> {company}</Text>
          <Text><strong>Message:</strong> {message}</Text>
        </Section>
        <Hr style={{ margin: "20px 0" }} />
        <Button
          href={`mailto:${email}`}
          style={{ background: "#22c55e", color: "#fff", padding: "12px 20px", borderRadius: "8px" }}
        >
          Reply to Lead
        </Button>
      </Container>
    </Html>
  );
}