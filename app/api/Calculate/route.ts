import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { salary, cycleDays, workedDays } = data;

    // Kenyan rates
    const NSSF = Math.min(salary * 0.06, 2160);
    const NHIF = 1200;
    const HOUSING = salary * 0.015;
    const totalDeductions = NSSF + NHIF + HOUSING;
    const netAfterDeductions = salary - totalDeductions;

    const accrued = (salary / cycleDays) * workedDays;
    const accessCap = accrued * 0.6; // 60% rule

    return NextResponse.json({
      success: true,
      results: {
        NSSF,
        NHIF,
        HOUSING,
        totalDeductions,
        netAfterDeductions,
        accrued,
        accessCap,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error", error });
  }
}

