import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";

export const revalidate = 0;

export async function GET() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data, error } = await getSupabaseAdmin().rpc("get_stats");

  if (error || !data) {
    console.error("[api/stats] Failed to load public stats:", error);
    return NextResponse.json(
      { data: null, error: "Unable to load stats" },
      { status: 502 }
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return NextResponse.json({ data: {} }, { status: 200 });
  }

  return NextResponse.json({ data: data[0] }, { status: 200 });
}
