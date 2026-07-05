import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 0;

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.rpc('get_stats');

    if (error || !data) {
        return NextResponse.json({ data: null, error: error?.message ?? "No data" }, { status: 502 });
    }

    if (!Array.isArray(data) || data.length === 0) {
        return NextResponse.json({ data: {} }, { status: 200 });
    }

    return NextResponse.json({ data: data[0] }, { status: 200 });
}