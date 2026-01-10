// app/api/employer/[companyId]/transactions/route.ts
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const supabase = getSupabaseAdmin();

    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*, employees(name)")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Transform for UI (if needed, otherwise exact shape is fine)
    // UI expects: id, name, amount, type, date/time
    // The UI in page.tsx shows "Withdrawal - Sarah Jenkins" and "Today, 2:45 PM"
    // We should return raw data and let the frontend format date, or format it here.
    // Let's return a clean shape.
    const formatted = transactions.map((tx) => ({
      id: tx.id,
      employeeName: tx.employees?.name || "Company",
      type: tx.type, // 'DISBURSEMENT', etc.
      amount: Number(tx.amount),
      status: tx.status,
      createdAt: tx.created_at, // ISO string for frontend to format
      reference: tx.reference,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Transactions API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
