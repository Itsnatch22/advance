import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const HIDDEN = new Set(['System Health', 'System Metrics']);

type APIStatus = 'healthy' | 'degraded' | 'down';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('api_health')
      .select('name, status, latency_ms, updated_at')
      .order('name', { ascending: true });

    if (error || !data) {
      console.error('[status] api_health query failed:', error?.message);
      return NextResponse.json(
        { status: 'down', message: 'Failed to retrieve service status.' },
        { status: 503 }
      );
    }

    const visible = data.filter((r) => !HIDDEN.has(r.name));

    const services: Record<string, { name: string; status: string; message: string }> = {};
    for (const row of visible) {
      const key = row.name.toLowerCase().replace(/\s+/g, '_');
      services[key] = {
        name: row.name,
        status: row.status ?? 'down',
        message:
          row.status === 'healthy'
            ? 'Operational'
            : row.status === 'degraded'
            ? 'Experiencing issues'
            : 'Service unavailable',
      };
    }

    const statuses = visible.map((r) => r.status as APIStatus);
    const overall_status: APIStatus = statuses.includes('down')
      ? 'down'
      : statuses.includes('degraded')
      ? 'degraded'
      : 'healthy';

    const avg_latency =
      visible.length > 0
        ? Math.round(
            visible.reduce((sum, r) => sum + (r.latency_ms ?? 0), 0) / visible.length
          )
        : 0;

    const last_updated =
      visible.reduce((latest, r) => {
        return !latest || r.updated_at > latest ? r.updated_at : latest;
      }, null as string | null) ?? new Date().toISOString();

    return NextResponse.json({
      status: overall_status,
      timestamp: last_updated,
      latency: `${avg_latency}ms`,
      services,
      system: {
        memory: { free: '–', total: '–', usage: '0%' },
        uptime: '–',
        platform: 'Cloud',
        cpus: 0,
      },
    });
  } catch (err) {
    console.error('[status] Unexpected error:', err);
    return NextResponse.json(
      { status: 'down', message: 'Failed to retrieve service status.' },
      { status: 503 }
    );
  }
}