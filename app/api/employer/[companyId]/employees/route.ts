// app/api/employer/[companyId]/employees/route.ts
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
    const search = searchParams.get("search") || "";

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("employees")
      .select("id, name, role, salary, status, employee_identifier")
      .eq("company_id", companyId);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data: employees, error } = await query;

    if (error) throw error;

    // Calculate 'withdrawnThisMonth' for each employee
    // This is N+1 if we do it naively. Better to aggregate in SQL or fetch all transactions for month.
    // Given the employee count likely isn't huge for this dashboard page (paginated usually), we can fetch aggregate.
    // For now, let's just fetch all disbursements for this company this month and map them.

    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();

    const { data: transactions } = await supabase
      .from("transactions")
      .select("employee_id, amount")
      .eq("company_id", companyId)
      .eq("type", "DISBURSEMENT")
      .gte("created_at", startOfMonth);

    const withdrawalsMap = new Map<string, number>();
    transactions?.forEach((tx) => {
      const current = withdrawalsMap.get(tx.employee_id) || 0;
      withdrawalsMap.set(tx.employee_id, current + Number(tx.amount));
    });

    // Transform to UI shape
    const formattedEmployees = employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      role: emp.role || "Employee",
      salary: Number(emp.salary),
      withdrawnThisMonth: withdrawalsMap.get(emp.id) || 0,
      status: emp.status,
      employeeIdentifier: emp.employee_identifier,
    }));

    return NextResponse.json(formattedEmployees);
  } catch (error: any) {
    console.error("Employees API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
