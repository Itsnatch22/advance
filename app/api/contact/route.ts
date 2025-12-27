import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactNotification } from "@/components/emails/ContactNotification";
import { contactSchema } from "@/lib/validations/contact";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      // Return structured Zod issues without leaking internal details
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
        },
        { status: 400 }
      );
    }

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const { name, email, message, subject } = parsed.data;

    // Store contact message in Supabase (server admin client)
    const { error } = await supabaseAdmin
      .from("contacts")
      .insert([{ name, email, subject, message }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const submittedAtIso = new Date().toISOString();

    await resend.emails.send({
      from: "Contact Form <support@eaziwage.com>",
      to: email,
      subject: `We received your message, ${name}!`,
      text: `Hi ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest regards,\nThe Eaziwage Team`,
      react: ContactNotification({
        name,
        email,
        subject,
        message,
        submittedAt: new Date(submittedAtIso).toLocaleString(),
      }),
    });

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (err: any) {
    console.error("Error handling contact form submission:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
