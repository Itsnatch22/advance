import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/supabase";

const bodySchema = z.object({
  choice: z.enum(["accepted", "rejected", "customized"]),
  categories: z.object({
    necessary: z.literal(true),
    analytics: z.boolean(),
  }),
});

export async function POST(req: Request) {
  try {
    const parsed = bodySchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid choice" }, { status: 400 });
    }

    const { choice, categories } = parsed.data;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const userAgent = req.headers.get("user-agent") ?? "unknown";

    const { error: insertError } = await supabaseAdmin
      .from("cookie_consents")
      .insert({
        user_choice: choice,
        categories,
        ip_address: ip,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("❌ Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save consent" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("❌ /api/cookie-consent failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
