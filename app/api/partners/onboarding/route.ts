import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import PartnerOnboardingEmail from "@/emails/Partner-onboarding";

/* ----------------------------- validation ----------------------------- */

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

/* ----------------------------- clients ----------------------------- */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

/* ----------------------------- handler ----------------------------- */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = partnerFormSchema.parse(body);

    // Store in Supabase
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

    // Send confirmation email to partner
    try {
      await resend.emails.send({
        from: "EaziWage Partnerships <partnerships@eaziwage.com>",
        to: validatedData.email,
        subject: "Partnership Application Received - EaziWage",
        react: PartnerOnboardingEmail({
          contactName: validatedData.contactName,
          companyName: validatedData.companyName,
        }),
      });
    } catch (emailError) {
      console.error("Email error:", emailError);
      // Don't fail the request if email fails
    }

    // Send notification to internal team
    try {
      await resend.emails.send({
        from: "EaziWage System <noreply@eaziwage.com>",
        to: "partnerships@eaziwage.com",
        subject: `New ${validatedData.partnerType} Partnership Application`,
        html: `
          <h2>New Partnership Application</h2>
          <p><strong>Partner Type:</strong> ${validatedData.partnerType}</p>
          <p><strong>Company:</strong> ${validatedData.companyName}</p>
          <p><strong>Industry:</strong> ${validatedData.industry}</p>
          <p><strong>Contact:</strong> ${validatedData.contactName} (${validatedData.jobTitle})</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Phone:</strong> ${validatedData.phone}</p>
          <p><strong>Company Size:</strong> ${validatedData.companySize}</p>
          <p><strong>Message:</strong></p>
          <p>${validatedData.message}</p>
        `,
      });
    } catch (emailError) {
      console.error("Internal notification error:", emailError);
    }

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