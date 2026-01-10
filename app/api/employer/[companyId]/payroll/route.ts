// app/api/employer/[companyId]/payroll/route.ts
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

    // Fetch active or upcoming payroll cycle
    const { data: cycle, error } = await supabase
      .from("payroll_cycles")
      .select("*")
      .eq("company_id", companyId)
      .in("status", ["ACTIVE", "UPCOMING", "PROCESSING"])
      .order("period_start", { ascending: true })
      .limit(1)
      .single();

    // If no cycle, we might return null or a mock "Next Cycle"
    const payrollData = cycle || {
      period_start: new Date().toISOString(),
      period_end: new Date(
        new Date().setDate(new Date().getDate() + 30)
      ).toISOString(),
      total_net: 425000, // Mock if missing
      status: "UPCOMING",
    };

    // Calculate dynamic values if needed (e.g. Total Funding Required)
    // For now returning stored or mocked values matching UI
    return NextResponse.json({
      cycle: {
        period: "May 2024", // Dynamic date formatting in frontend usually
        periodStart: payrollData.period_start,
        periodEnd: payrollData.period_end,
        settlementDate: payrollData.period_end, // Usually same or +1 day
        status: payrollData.status,
      },
      funding: {
        required: 443450.0, // Should be calculated: Net Salaries + Fees + Reconcile
        netSalaries: 425000.0,
        reconcile: 18450.0,
        status: "Fully Funded", // Logic: if company.funding_balance >= required
      },
    });
  } catch (error: any) {
    if (error.code !== "PGRST116") {
      // Ignore single() no rows found
      console.error("Payroll API Error:", error);
    }
    // Return fallback for UI if no cycle found
    return NextResponse.json({
      cycle: {
        period: "June 2024",
        status: "UPCOMING",
      },
      funding: {
        required: 0,
        netSalaries: 0,
        reconcile: 0,
        status: "Pending",
      },
    });
  }
}
