import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/admin/campaigns";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function dateBoundary(value: string | null, endOfDay = false) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(
    `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`
  );
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }
  return date.toISOString();
}

function csvEscape(value: unknown): string {
  let str = value === null || value === undefined ? "" : String(value);
  if (/^[\u0000-\u0020]*[=+\-@]/.test(str)) str = `'${str}`;
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

  const url = new URL(request.url);
  const adminIdFilter = url.searchParams.get("admin_id") || null;
  const actionFilter = url.searchParams.get("action") || null;
  const targetTypeFilter = url.searchParams.get("target_type") || null;
  const targetIdFilter = url.searchParams.get("target_id") || null;
  const fromRaw = url.searchParams.get("from");
  const toRaw = url.searchParams.get("to");
  const fromDate = dateBoundary(fromRaw);
  const toDate = dateBoundary(toRaw, true);

  if (
    (adminIdFilter && !UUID_PATTERN.test(adminIdFilter)) ||
    (fromRaw && !fromDate) ||
    (toRaw && !toDate) ||
    (fromDate && toDate && fromDate > toDate)
  ) {
    return NextResponse.json(
      { error: "Invalid audit log filters" },
      { status: 400 }
    );
  }

  let query = auth.admin
    .from("system_audit_logs")
    .select(
      "id, admin_id, admin_name, target_id, target_type, action, old_value, new_value, reason, metadata, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(5000);

  if (adminIdFilter) query = query.eq("admin_id", adminIdFilter);
  if (actionFilter) query = query.eq("action", actionFilter);
  if (targetTypeFilter) query = query.eq("target_type", targetTypeFilter);
  if (targetIdFilter) query = query.eq("target_id", targetIdFilter);
  if (fromDate) query = query.gte("created_at", fromDate);
  if (toDate) query = query.lte("created_at", toDate);

  const { data, error } = await query;

  if (error) {
    console.error("[admin-audit] export fetch error", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }

  const header = [
    "id",
    "admin_id",
    "admin_name",
    "action",
    "target_type",
    "target_id",
    "old_value",
    "new_value",
    "reason",
    "metadata",
    "created_at",
  ];
  const rows = (data ?? []).map((row) =>
    [
      row.id,
      row.admin_id,
      row.admin_name,
      row.action,
      row.target_type,
      row.target_id,
      JSON.stringify(row.old_value ?? null),
      JSON.stringify(row.new_value ?? null),
      row.reason,
      JSON.stringify(row.metadata ?? {}),
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
      "Content-Disposition": `attachment; filename="system-audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
