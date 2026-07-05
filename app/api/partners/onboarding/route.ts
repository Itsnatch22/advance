import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import PartnerOnboardingEmail from "@/emails/Partner-onboarding";
import PartnerNotificationEmail from "@/emails/PartnerNotification";

const partnerFormSchema = z.object({
  partnerType: z.enum(["banking", "enterprise", "technology"]),
  companyName: z.string().min(2),
  industry: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  jobTitle: z.string().min(2),
  companySize: z.enum(["1-50", "51-200", "201-1000", "1001-5000", "5000+"]),
  message: z.string().min(20),
});

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ error: "Email service unavailable" }, { status: 503 });
  }
  const resend = new Resend(resendApiKey);

  try {
    const body = await request.json();

    const validatedData = partnerFormSchema.parse(body);

    const { data: partnerData, error: dbError } = await supabase
      .from("partner_applications")
      .insert([
        {
          partner_type: validatedData.partnerType,
          company_name: validatedData.companyName,
          industry: validatedData.industry,
          contact_name: validatedData.contactName,
          email: validatedData.email,
          phone: validatedData.phone,
          job_title: validatedData.jobTitle,
          company_size: validatedData.companySize,
          message: validatedData.message,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save application" },
        { status: 500 }
      );
    }

    const emailPromises = [
      resend.emails.send({
        from: "EaziWage Partnerships <partnerships@eaziwage.com>",
        to: validatedData.email,
        subject: "Partnership Application Received - EaziWage",
        react: PartnerOnboardingEmail({
          contactName: validatedData.contactName,
          companyName: validatedData.companyName,
        }),
      }),

      resend.emails.send({
        from: "EaziWage System <noreply@eaziwage.com>",
        to: "partnerships@eaziwage.com",
        subject: `New ${validatedData.partnerType} Partnership Application`,
        react: PartnerNotificationEmail({
          partnerType: validatedData.partnerType,
          companyName: validatedData.companyName,
          industry: validatedData.industry,
          contactName: validatedData.contactName,
          jobTitle: validatedData.jobTitle,
          email: validatedData.email,
          phone: validatedData.phone,
          companySize: validatedData.companySize,
          message: validatedData.message,
        }),
      }),
    ];

    const emailResults = await Promise.allSettled(emailPromises);
    emailResults.forEach((result, idx) => {
      if (result.status === "rejected") {
        console.error(
          `Email ${idx === 0 ? "partner" : "internal"} failed:`,
          result.reason
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: partnerData,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
