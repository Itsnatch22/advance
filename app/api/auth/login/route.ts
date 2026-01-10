// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import { createSession, SessionPayload } from "@/lib/server/session";
import { createClient } from "@supabase/supabase-js";

// Use anon client for end-user authentication
function getSupabaseAnon() {
  const url = process.env.SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Missing Supabase anon credentials. Ensure SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY) are set."
    );
  }
  return createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

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

    const { email, password } = parsed.data;
    const supabase = getSupabaseAnon();

    // 1. Authenticate user using anon client
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData?.user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userId = authData.user.id;

    // 2. Get user profile (select only required columns to avoid shape mismatches)
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("email, full_name, role, company_id, company_join_status")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    // Build session payload using available data
    const sessionPayload: SessionPayload = {
      userId,
      email: (userProfile?.email ?? authData.user.email ?? email) as string,
      role: (userProfile?.role ?? "employee") as "employer" | "employee",
      companyId: userProfile?.company_id ?? null,
      companyJoinStatus: (userProfile?.company_join_status ?? null) as
        | "joined"
        | "pending"
        | null,
    };

    await createSession(sessionPayload);

    const redirectUrl =
      sessionPayload.role === "employer"
        ? "/employer-dashboard"
        : "/employee-dashboard";

    return NextResponse.json({
      success: true,
      message: "Login successful",
      redirectTo: redirectUrl,
      user: {
        id: userId,
        email: sessionPayload.email,
        fullName: userProfile?.full_name ?? null,
        role: sessionPayload.role,
        companyId: sessionPayload.companyId,
        companyJoinStatus: sessionPayload.companyJoinStatus,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
