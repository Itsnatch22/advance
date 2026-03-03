// app/api/cookie-consent/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { choice } = await req.json();

    if (!choice || !["accepted", "rejected"].includes(choice)) {
      return NextResponse.json({ error: "Invalid choice" }, { status: 400 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const userAgent = req.headers.get("user-agent") ?? "unknown";

    const { error: insertError } = await supabaseAdmin
      .from("cookie_consents")
      .insert({
        user_choice: choice,
        ip_address: ip,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("❌ Supabase insert error:", insertError);
      return NextResponse.json({ error: "Failed to save consent" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("❌ /api/cookie-consent failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
