import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type APIStatus = 'healthy' | 'degraded' | 'down' | 'unknown';

interface ServiceEntry {
  name: string;
  status: APIStatus;
  message: string;
  stale: boolean;
}

interface IncidentDay {
  date: string;           // YYYY-MM-DD
  status: APIStatus;
  affected_services: string[];
  note: string | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HIDDEN = new Set(['System Health', 'System Metrics']);
const STALE_THRESHOLD_MS = 30 * 60 * 1000;
const CALENDAR_DAYS = 90;

// ---------------------------------------------------------------------------
// Supabase service-role client
// ---------------------------------------------------------------------------

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const [healthResult, incidentResult] = await Promise.all([
      supabase
        .from('api_health')
        .select('name, status, latency_ms, last_check, updated_at')
        .order('name', { ascending: true }),
      supabase
        .from('incident_log')
        .select('date, status, affected_services, note')
        .gte(
          'date',
          new Date(Date.now() - CALENDAR_DAYS * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]
        )
        .order('date', { ascending: false }),
    ]);

    if (healthResult.error || !healthResult.data) {
      console.error('[/api/status] api_health query failed:', healthResult.error?.message);
      return NextResponse.json(
        { status: 'down', message: 'Failed to retrieve service status.' },
        { status: 503 }
      );
    }

    const now = Date.now();
    const visible = healthResult.data.filter((r) => !HIDDEN.has(r.name));

    const latestCheckAt = visible.reduce<string | null>((latest, r) => {
      const ts = r.last_check ?? r.updated_at;
      if (!ts) return latest;
      if (!latest) return ts;
      return new Date(ts) > new Date(latest) ? ts : latest;
    }, null);

    const ageMs = latestCheckAt ? now - new Date(latestCheckAt).getTime() : Infinity;
    const isStale = ageMs > STALE_THRESHOLD_MS;
    const lastCheckedAgoSeconds = Math.floor(ageMs / 1000);

    const services: Record<string, ServiceEntry> = {};
    for (const row of visible) {
      const rowTs = row.last_check ?? row.updated_at;
      const rowStale = rowTs ? now - new Date(rowTs).getTime() > STALE_THRESHOLD_MS : true;
      const status: APIStatus =
        rowStale
          ? 'unknown'
          : row.status === 'healthy' || row.status === 'degraded' || row.status === 'down'
          ? row.status
          : 'unknown';

      const key = row.name.toLowerCase().replace(/\s+/g, '_');
      services[key] = {
        name: row.name,
        status,
        message: rowStale
          ? 'Status data is stale — check pending'
          : status === 'healthy'
          ? 'Operational'
          : status === 'degraded'
          ? 'Experiencing issues'
          : 'Service unavailable',
        stale: rowStale,
      };
    }

    const statuses = Object.values(services).map((s) => s.status);
    const overall_status: APIStatus = isStale
      ? 'unknown'
      : statuses.includes('down')
      ? 'down'
      : statuses.includes('degraded')
      ? 'degraded'
      : statuses.includes('unknown')
      ? 'unknown'
      : 'healthy';

    const avg_latency_ms =
      visible.length > 0
        ? Math.round(
            visible.reduce((sum, r) => sum + (r.latency_ms ?? 0), 0) / visible.length
          )
        : 0;

    const incidentHistory: IncidentDay[] = (incidentResult.data ?? []).map((r) => ({
      date: r.date,
      status: r.status as APIStatus,
      affected_services: r.affected_services ?? [],
      note: r.note ?? null,
    }));

    return NextResponse.json({
      status: overall_status,
      stale: isStale,
      last_checked_at: latestCheckAt,
      last_checked_ago_seconds: lastCheckedAgoSeconds,
      avg_latency_ms,
      services,
      incident_history: incidentHistory,
    });
  } catch (err) {
    console.error('[/api/status] Unexpected error:', err);
    return NextResponse.json(
      { status: 'down', message: 'Failed to retrieve service status.' },
      { status: 503 }
    );
  }
}