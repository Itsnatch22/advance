// app/api/employer/[companyId]/requests/[requestId]/reject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { requireCompanyAccess } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string; requestId: string }> }
) {
  try {
    const { companyId, requestId } = await params;
    await requireCompanyAccess(companyId);

    const supabase = getSupabaseAdmin();

    // Verify request exists and is pending
    const { data: requestRecord, error: fetchError } = await supabase
      .from("advance_requests")
      .select("status")
      .eq("id", requestId)
      .eq("company_id", companyId)
      .single();

    if (fetchError || !requestRecord) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (requestRecord.status !== "PENDING") {
      return NextResponse.json(
        { error: "Request is not PENDING" },
        { status: 400 }
      );
    }

    // Update status
    const { error } = await supabase
      .from("advance_requests")
      .update({ status: "REJECTED" })
      .eq("id", requestId)
      .eq("company_id", companyId); // Extra safety check

    if (error) throw error;

    return NextResponse.json({ success: true, status: "REJECTED" });
  } catch (error: any) {
    console.error("Reject API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
