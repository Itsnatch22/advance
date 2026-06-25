import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0;

export async function GET() {
    const { data, error } = await supabase.rpc('get_stats');

    if (error || !data) {
        return NextResponse.json({ data: null, error: error?.message ?? "No data" }, { status: 502 });
    }

    return NextResponse.json({ data: data[0] }, { status: 200 });
}