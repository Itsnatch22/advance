// app/api/employer/[companyId]/settings/route.ts
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

    // 1. Fetch Company details
    const { data: company, error: compError } = await supabase
      .from("companies")
      .select("name, domain") // Tax ID might be added to schema later, using domain/name for now
      .eq("id", companyId)
      .single();

    if (compError) throw compError;

    // 2. Fetch Settings
    const { data: settings, error: setError } = await supabase
      .from("company_settings")
      .select("*")
      .eq("company_id", companyId)
      .single();

    // If no settings row, returns null or error. We handle gracefully.

    return NextResponse.json({
      companyProfile: {
        name: company.name,
        taxId: "XX-XXXX452", // Placeholder as schema didn't have tax_id
      },
      policies: {
        withdrawalLimitPercent: settings?.withdrawal_limit_percent || 0.5,
        autoApproveEnabled: settings?.auto_approve_enabled || false,
        autoApproveThreshold: settings?.auto_approve_threshold || 500,
      },
    });
  } catch (error: any) {
    console.error("Settings GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    await requireCompanyAccess(companyId);

    const body = await request.json();
    const { withdrawalLimitPercent, autoApproveEnabled, autoApproveThreshold } =
      body;

    const supabase = getSupabaseAdmin();

    // Upsert settings
    const { error } = await supabase.from("company_settings").upsert({
      company_id: companyId,
      withdrawal_limit_percent: withdrawalLimitPercent,
      auto_approve_enabled: autoApproveEnabled,
      auto_approve_threshold: autoApproveThreshold,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Settings PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
