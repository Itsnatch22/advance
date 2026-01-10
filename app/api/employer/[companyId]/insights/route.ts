// app/api/employer/[companyId]/insights/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireCompanyAccess } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    await requireCompanyAccess(companyId);

    // In a real app, this would aggregate `transactions` table grouped by day of week
    // For MVP/Demo as per UI page.tsx, we return the mock shape
    const engagementData = [
      { name: "Mon", active: 45 },
      { name: "Tue", active: 52 },
      { name: "Wed", active: 68 },
      { name: "Thu", active: 59 },
      { name: "Fri", active: 82 },
      { name: "Sat", active: 30 },
      { name: "Sun", active: 25 },
    ];

    const retentionStats = {
      turnoverReduction: 24, // %
      positiveFeedback: 89, // %
    };

    return NextResponse.json({
      engagementData,
      retentionStats,
    });
  } catch (error: any) {
    console.error("Insights API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
