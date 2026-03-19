import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 21600;

export async function GET() {
    const { data, error } = await supabase
    .from("public_stats")
    .select("total_users, active_employers, active_employees, total_disbursed, updated_at")
    .eq('id', 1)
    .single();

    if (error || !data) {
       return NextResponse.json({ data: null, error: error?.message ?? "No data" }, { status: 502 });
    }

    return NextResponse.json({ data }, { status: 200 });
}