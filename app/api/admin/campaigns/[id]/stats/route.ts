import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import { apiLimiter, checkRateLimit } from "@/lib/security/rate-limit";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function getAuthenticatedAdmin(request: NextRequest) {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Unauthorized", status: 401 as const };

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: adminRecord, error: adminError } = await admin
    .from("system_admins")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (adminError || !adminRecord) {
    return { error: "Forbidden — admins only", status: 403 as const };
  }

  return { user, admin };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(apiLimiter, ip);
  if (!rl.success)
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: rl.headers }
    );

  const auth = await getAuthenticatedAdmin(request);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { admin } = auth;
  const { id } = await params;

  try {
    // Fetch campaign
    const { data: campaign, error: campaignError } = await admin
      .from("email_campaigns")
      .select("*")
      .eq("id", id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Fetch all delivery_status values for this campaign (for grouping)
    const { data: logs, error: logsError } = await admin
      .from("email_campaign_logs")
      .select("delivery_status")
      .eq("campaign_id", id);

    if (logsError) throw logsError;

    // Calculate per-status counts
    const statusCounts = (logs ?? []).reduce<Record<string, number>>(
      (acc, row) => {
        const s: string = row.delivery_status ?? "unknown";
        acc[s] = (acc[s] ?? 0) + 1;
        return acc;
      },
      {}
    );

    const total = logs?.length ?? 0;
    const sent_count = statusCounts["sent"] ?? 0;
    const failed_count = statusCounts["failed"] ?? 0;
    const queued_count = statusCounts["queued"] ?? 0;
    const bounced_count = statusCounts["bounced"] ?? 0;
    const delivery_rate = total > 0 ? Math.round((sent_count / total) * 100 * 100) / 100 : 0;

    // Fetch recent 50 logs (full rows) ordered by created_at DESC
    const { data: recent_logs, error: recentError } = await admin
      .from("email_campaign_logs")
      .select("*")
      .eq("campaign_id", id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (recentError) throw recentError;

    return NextResponse.json({
      campaign,
      stats: {
        total,
        sent_count,
        failed_count,
        queued_count,
        bounced_count,
        delivery_rate,
      },
      recent_logs: recent_logs ?? [],
    });
  } catch (err) {
    console.error("[campaigns/[id]/stats][GET] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
