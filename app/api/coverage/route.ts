import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const CODE_TO_NAME: Record<string, string> = {
  KE: "Kenya",
  UG: "Uganda",
  TZ: "Tanzania",
  RW: "Rwanda",
};

export async function GET() {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured for public read access." },
        { status: 503 }
      );
    }

    const countries = ["KE", "UG", "TZ", "RW"];
    
    try {
        const results = await Promise.all(
        countries.map((code) =>
            supabase
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("status", "Active")
            .eq("country", code)
        )
        );

        const counts: Record<string, number> = {};
        countries.forEach((code, i) => {
            const name = CODE_TO_NAME[code];
            counts[name] = results[i].count ?? 0;
        });

        return NextResponse.json(counts, {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}