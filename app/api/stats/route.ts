import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";

export const revalidate = 0;

function toFiniteNumber(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeStats(value: unknown) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const row = value as Record<string, unknown>;
  const totalUsers = toFiniteNumber(row.total_users);
  const activeEmployers = toFiniteNumber(row.active_employers);
  const activeEmployees = toFiniteNumber(row.active_employees);
  const totalDisbursed = toFiniteNumber(row.total_disbursed);
  const updatedAt = row.updated_at;

  if (
    totalUsers === null ||
    activeEmployers === null ||
    activeEmployees === null ||
    totalDisbursed === null ||
    typeof updatedAt !== "string"
  ) {
    return null;
  }

  return {
    total_users: totalUsers,
    active_employers: activeEmployers,
    active_employees: activeEmployees,
    total_disbursed: totalDisbursed,
    updated_at: updatedAt,
  };
}

export async function GET() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { data, error } = await getSupabaseAdmin().rpc("get_stats");
  const rows: unknown = data;

  if (error) {
    console.error("[api/stats] Failed to load public stats:", error);
    return NextResponse.json(
      { data: null, error: "Unable to load stats" },
      { status: 502 }
    );
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ data: {} }, { status: 200 });
  }

  const stats = normalizeStats(rows[0]);
  if (!stats) {
    console.error("[api/stats] Stats RPC returned an unexpected response.");
    return NextResponse.json(
      { data: null, error: "Unable to load stats" },
      { status: 502 }
    );
  }

  return NextResponse.json({ data: stats }, { status: 200 });
}
