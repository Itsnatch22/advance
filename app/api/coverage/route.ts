import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CODE_TO_NAME: Record<string, string> = {
  KE: "Kenya",
  UG: "Uganda",
  TZ: "Tanzania",
  RW: "Rwanda",
};

export async function GET() {
    const { data, error } = await supabase
    .from("employee_onboarding")
    .select("country")
    .eq("status", "approved")

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const counts: Record<string, number> = {
        Kenya: 0,
        Uganda: 0,
        Tanzania: 0,
        Rwanda: 0,
    };

    data?.forEach((row) => {
        const name = CODE_TO_NAME[row.country?.trim().toUpperCase()];
        if (name) counts[name]++;
    });

    return NextResponse.json(counts, {
        headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
    });
}