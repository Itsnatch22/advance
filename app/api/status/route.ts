import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Call internal health route directly — no external round trip
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DASHBOARD_APP_URL}/api/admin/check-api-health`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { status: "error", message: "Health check unavailable" },
        { status: 502 }
      );
    }

    const raw = await res.json();

    // Reshape integrations[] → services{} that page.tsx expects
    // Filter out internal noise rows that aren't user-facing services
    const HIDDEN = new Set(["System Health", "System Metrics"]);

    const services: Record<string, { name: string; status: string; message: string }> = {};

    for (const integration of raw.integrations ?? []) {
      if (HIDDEN.has(integration.name)) continue;

      // Derive a safe key from the name
      const key = integration.name.toLowerCase().replace(/\s+/g, "_");

      services[key] = {
        name: integration.name,
        status: integration.status,         // healthy | degraded | down
        message:
          integration.status === "healthy"  ? "Operational" :
          integration.status === "degraded" ? "Experiencing issues" :
                                              "Service unavailable",
      };
    }

    return NextResponse.json({
      status: raw.overall_status,
      timestamp: raw.last_updated,
      latency: `${raw.integrations?.[0]?.latency_ms ?? 0}ms`,
      services,
      // System block — hide real infra details from public
      system: {
        memory: { free: "–", total: "–", usage: "0%" },
        uptime: "–",
        platform: "Cloud",
        cpus: 0,
      },
    });
  } catch {
    return NextResponse.json(
      { status: "down", message: "Failed to reach app server" },
      { status: 503 }
    );
  }
}