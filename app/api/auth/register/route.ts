// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { createSession, SessionPayload } from "@/lib/server/session";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function extractDomainFromEmail(email: string): string {
  return email.split("@")[1]?.toLowerCase() || "";
}

interface CompanyInsert {
  name: string;
  size: number;
  created_by: string;
  domain: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const {
      fullName,
      email,
      password,
      role,
      companyName,
      companySize,
      inviteToken,
    } = parsed.data;
    const supabaseAdmin = getSupabaseAdmin();

    // 1. Create auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm for now
        user_metadata: { full_name: fullName },
      });

    if (authError) {
      console.error("Auth creation error:", authError);
      return NextResponse.json(
        { error: "Failed to create user", details: authError.message },
        { status: 400 }
      );
    }

    const userId = authData.user.id;
    let companyId: string | null = null;
    let companyJoinStatus: "joined" | "pending" | null = null;

    if (role === "employer") {
      const domain = extractDomainFromEmail(email);
      // Create company for employer
      const companyInsert: CompanyInsert = { name: companyName!, size: companySize!, created_by: userId, domain };
      const { data: companyData, error: companyError } = await supabaseAdmin
        .from("companies")
        .insert(companyInsert)
        .select("id")
        .single();

      if (companyError) {
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return NextResponse.json(
          { error: "Failed to create company", details: companyError.message },
          { status: 500 }
        );
      }
      companyId = (companyData as { id: string })?.id || null;
      companyJoinStatus = "joined";
    } else if (role === "employee") {
      // Handle employee registration
      if (inviteToken) {
        const { data: invite, error: inviteError } = await supabaseAdmin
          .from("employee_invites")
          .select<"*", { id: string; email: string; company_id: string; used: boolean; expires_at: string }>("*")
          .eq("invite_token", inviteToken)
          .single();

        if (inviteError || !invite || invite.used || new Date(invite.expires_at) < new Date() || invite.email.toLowerCase() !== email.toLowerCase()) {
          await supabaseAdmin.auth.admin.deleteUser(userId);
          return NextResponse.json({ error: "Invalid or expired invite token." }, { status: 400 });
        }

        companyId = invite.company_id;
        companyJoinStatus = "joined";

        await supabaseAdmin
          .from("employee_invites")
          .update({ used: true })
          .eq("id", invite.id);

      } else {
        const domain = extractDomainFromEmail(email);
        const { data: existingCompany } = await supabaseAdmin
          .from("companies")
          .select("id")
          .eq("domain", domain)
          .maybeSingle();

        if (existingCompany) {
          companyId = (existingCompany as { id: string })?.id || null;
          companyJoinStatus = "joined";
        } else {
          companyJoinStatus = "pending";
        }
      }
    }

    // 3. Create user profile
    const { error: profileError } = await supabaseAdmin.from("users").insert(
      {
        id: userId,
        email,
        full_name: fullName,
        role,
        company_id: companyId,
        company_join_status: companyJoinStatus,
      }
    );

    if (profileError) {
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      if (role === "employer" && companyId) {
        await supabaseAdmin.from("companies").delete().eq("id", companyId);
      }
      return NextResponse.json(
        {
          error: "Failed to create user profile",
          details: profileError.message,
        },
        { status: 500 }
      );
    }

    // 4. Create session
    const sessionPayload: SessionPayload = {
      userId,
      email,
      role,
      companyId,
      companyJoinStatus,
    };

    await createSession(sessionPayload);

    // 5. Send welcome email
    try {
      if (role === "employer") {
        await resend.emails.send({
          from: "EaziWage <support@eaziwage.com>",
          to: email,
          subject: "Welcome to EaziWage - Company Created",
          html: `
            <h2>Welcome ${fullName}!</h2>
            <p>Your company <strong>${companyName}</strong> has been successfully registered with EaziWage.</p>
            <p>You can now access your employer dashboard to set up wage access for your team.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/employer-dashboard">Go to Dashboard</a></p>
          `,
        });
      } else {
        const emailContent = companyId
          ? `<p>Your account has been successfully linked to an existing company.</p>
             <p>You can now access your employee dashboard.</p>
             <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/employee-dashboard">Go to Dashboard</a></p>`
          : `<p>Your account is pending verification. We'll notify you once we find a matching company or your employer registers with EaziWage.</p>`;

        await resend.emails.send({
          from: "EaziWage <support@eaziwage.com>",
          to: email,
          subject: "Welcome to EaziWage - Account Created",
          html: `
            <h2>Welcome ${fullName}!</h2>
            ${emailContent}
          `,
        });
      }
    } catch (emailError: unknown) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail registration if email fails
    }

    // 6. Return success response with redirect
    const redirectUrl =
      role === "employer" ? "/employer-dashboard" : "/employee-dashboard";

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      redirectTo: redirectUrl,
      user: {
        id: userId,
        email,
        fullName,
        role,
        companyId,
        companyJoinStatus,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
