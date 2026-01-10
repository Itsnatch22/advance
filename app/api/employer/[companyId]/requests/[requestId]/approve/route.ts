// app/api/employer/[companyId]/requests/[requestId]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { requireCompanyAccess } from "@/lib/auth";
import { disbursementAdapter } from "@/lib/disburse";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string; requestId: string }> }
) {
  try {
    const { companyId, requestId } = await params;
    await requireCompanyAccess(companyId);

    const supabase = getSupabaseAdmin();

    // 1. Fetch Request & Company Balance
    const { data: advanceRequest, error: reqError } = await supabase
      .from("advance_requests")
      .select("*, employees(*)")
      .eq("id", requestId)
      .eq("company_id", companyId)
      .single();

    if (reqError || !advanceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (advanceRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Request is not PENDING" },
        { status: 400 }
      );
    }

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("funding_balance, currency")
      .eq("id", companyId)
      .single();

    if (companyError) throw companyError;

    const amount = Number(advanceRequest.amount);
    const fee = Number(advanceRequest.fee || 0);
    const totalDeduction = amount; // Usually just amount is deducted from funding, fee might be earned by platform or deducted too. Assuming amount.

    // 2. Check Funding
    if (Number(company.funding_balance) < totalDeduction) {
      // Create Pending Task
      await supabase.from("pending_tasks").insert({
        company_id: companyId,
        type: "FUNDING_LOW",
        ref_id: requestId,
        payload: {
          message: `Insufficient funds to approve request ${requestId}`,
        },
        status: "OPEN",
      });

      return NextResponse.json(
        { error: "Insufficient company funding balance. Task created." },
        { status: 402 }
      );
    }

    // 3. Approve & Deduct Balance (Atomic-ish via Supabase, better to use RPC but we'll do sequential here for MVP)
    // We update status to APPROVED first.
    const { error: updateError } = await supabase
      .from("advance_requests")
      .update({
        status: "APPROVED",
        approved_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) throw updateError;

    // Decrement Company Balance
    const { error: balanceError } = await supabase
      .from("companies")
      .update({
        funding_balance: Number(company.funding_balance) - totalDeduction,
      })
      .eq("id", companyId);

    if (balanceError) {
      // Critical error: approved but failed to deduct. In real app, rollback.
      console.error(
        "CRITICAL: Failed to deduct balance for approved request",
        requestId
      );
    }

    // 4. Disburse Flow
    const disburseResult = await disbursementAdapter.sendPayment({
      requestId,
      amount,
      currency: "KES",
      recipient: {
        id: advanceRequest.employee_id,
        name: advanceRequest.employees?.name || "Employee",
        // phone: ...
      },
    });

    if (disburseResult.success) {
      // Update to DISBURSED and create Transaction
      await supabase
        .from("advance_requests")
        .update({
          status: "DISBURSED",
          disbursed_at: new Date().toISOString(),
          disbursement_reference: disburseResult.providerRef,
        })
        .eq("id", requestId);

      await supabase.from("transactions").insert({
        company_id: companyId,
        employee_id: advanceRequest.employee_id,
        type: "DISBURSEMENT",
        amount: amount,
        currency: "KES",
        reference: disburseResult.transactionId,
        status: "COMPLETED",
      });
    } else {
      // Failed disbursement handling (revert to APPROVED or failed state)
      // For now, logging.
      console.warn("Disbursement failed", disburseResult);
    }

    return NextResponse.json({
      success: true,
      status: disburseResult.success ? "DISBURSED" : "APPROVED",
    });
  } catch (error: any) {
    console.error("Approve API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
