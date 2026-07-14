import { NextResponse } from 'next/server';
import { logAdminAction } from '../../lib/admin/audit';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isAdminRequest(req: Request) {
  const adminHeader = req.headers.get('x-admin-id');
  return Boolean(adminHeader);
}

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const url = new URL(req.url);
  const limit = Math.min(100, Number(url.searchParams.get('limit') || 50));
  const page = Math.max(0, Number(url.searchParams.get('page') || 0));

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const from = page * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('admin_audit_logs')
    .select('id, admin_id, action, object_type, object_id, meta, created_at')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('[admin-audit] fetch error', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { admin_id, action, object_type, object_id, meta } = body || {};

  if (!action) {
    return NextResponse.json({ error: 'Missing action' }, { status: 400 });
  }

  try {
    await logAdminAction(admin_id ?? null, action, {
      objectType: object_type,
      objectId: object_id,
      meta: meta ?? {},
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin-audit] insert failed', err);
    return NextResponse.json({ error: 'Failed to write log' }, { status: 500 });
  }
}
