// app/api/employers/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("employers")
      .select("id, company")
      .order("company", { ascending: true });

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "DB error" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
