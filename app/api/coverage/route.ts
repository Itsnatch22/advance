import { NextRequest, NextResponse } from "next/server";
import { publicReadLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import { supabaseServer } from "@/lib/supabase/supabase-server";

const CODE_TO_NAME: Record<string, string> = {
  KE: "Kenya",
  UG: "Uganda",
  TZ: "Tanzania",
  RW: "Rwanda",
};

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(publicReadLimiter, ip);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429, headers: rl.headers });
  }

  try {
    const counts: Record<string, number> = {
      Kenya: 0,
      Uganda: 0,
      Tanzania: 0,
      Rwanda: 0,
    };

    const results = await Promise.all(
      Object.entries(CODE_TO_NAME).map(async ([code, name]) => {
        const { count, error } = await supabaseServer
          .from("employees")
          .select("id", { count: "exact", head: true })
          .eq("status", "Active")
          .eq("country", code);

        if (error) throw error;
        return [name, count ?? 0] as const;
      })
    );

    results.forEach(([name, count]) => {
      counts[name] = count;
    });

    // Also fetch partner availability matrix (if table exists)
    let partners: any[] = [];
    try {
      const { data: pa, error: paErr } = await supabaseServer
        .from('partner_availability')
        .select('partner, country_code, available')
        .order('partner', { ascending: true });
      if (!paErr && pa) {
        // group by partner
        const map: Record<string, Record<string, boolean>> = {};
        pa.forEach((r: any) => {
          map[r.partner] = map[r.partner] || {};
          map[r.partner][r.country_code] = !!r.available;
        });
        partners = Object.keys(map).map((p) => ({ partner: p, availability: map[p] }));
      }
    } catch (e) {
      // ignore — partner table optional
    }

    return NextResponse.json({ counts, partners }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: unknown) {
    console.error("[coverage] Query error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
