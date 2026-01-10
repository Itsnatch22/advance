// app/api/employer/[companyId]/pending-approvals/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { requireCompanyAccess } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    await requireCompanyAccess(companyId);

    const supabase = getSupabaseAdmin();

    // Fetch 'PENDING' advance requests
    const { data: requests, error } = await supabase
      .from("advance_requests")
      .select("*, employees(name)")
      .eq("company_id", companyId)
      .eq("status", "PENDING")
      .order("requested_at", { ascending: true }); // Oldest first

    if (error) throw error;

    // UI expects: { requestId, name, amount, time }
    // Time relative "2h ago" is usually calculated on frontend, but we pass ISO string.
    const formatted = requests.map((req) => ({
      requestId: req.id,
      name: req.employees?.name || "Unknown",
      amount: Number(req.amount),
      requestedAt: req.requested_at,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Pending Approvals API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
