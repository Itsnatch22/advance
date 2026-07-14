import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedAdmin } from "@/lib/admin/campaigns";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedAdmin(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const url = new URL(request.url);
  const adminIdFilter = url.searchParams.get("admin_id") || null;
  const actionFilter = url.searchParams.get("action") || null;
  const objectTypeFilter = url.searchParams.get("object_type") || null;
  const objectIdFilter = url.searchParams.get("object_id") || null;
  const fromDate = url.searchParams.get("from") || null;
  const toDate = url.searchParams.get("to") || null;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let query = supabase
    .from("admin_audit_logs")
    .select("id, admin_id, action, object_type, object_id, meta, created_at")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (adminIdFilter) query = query.eq("admin_id", adminIdFilter);
  if (actionFilter) query = query.eq("action", actionFilter);
  if (objectTypeFilter) query = query.eq("object_type", objectTypeFilter);
  if (objectIdFilter) query = query.eq("object_id", objectIdFilter);
  if (fromDate) query = query.gte("created_at", fromDate);
  if (toDate) query = query.lte("created_at", toDate);

  const { data, error } = await query;

  if (error) {
    console.error("[admin-audit] export fetch error", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }

  const header = ["id", "admin_id", "action", "object_type", "object_id", "meta", "created_at"];
  const rows = (data ?? []).map((row) =>
    [
      row.id,
      row.admin_id,
      row.action,
      row.object_type,
      row.object_id,
      JSON.stringify(row.meta ?? {}),
      row.created_at,
    ]
      .map(csvEscape)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="admin-audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
