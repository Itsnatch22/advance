import React from "react";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_UI_TOKEN = process.env.ADMIN_UI_TOKEN;

type LogRow = {
  id: string;
  admin_id: string | null;
  action: string;
  object_type: string | null;
  object_id: string | null;
  meta: Record<string, unknown>;
  created_at: string;
};

export default async function AdminAuditLogsPage({ searchParams }: { searchParams?: any }) {
  // Server-side simple auth using an ADMIN_UI_TOKEN cookie
  const adminToken = cookies().get("admin_token")?.value ?? null;
  if (!ADMIN_UI_TOKEN || adminToken !== ADMIN_UI_TOKEN) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Unauthorized</h1>
        <p>Admin UI token missing or invalid. Set an <code>admin_token</code> cookie to access this page.</p>
      </div>
    );
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Server misconfiguration</h1>
        <p>Missing Supabase configuration.</p>
      </div>
    );
  }

  const limit = Math.min(200, Number(searchParams?.limit ?? 50));
  const page = Math.max(0, Number(searchParams?.page ?? 0));
  const adminIdFilter = searchParams?.admin_id || null;
  const actionFilter = searchParams?.action || null;
  const objectTypeFilter = searchParams?.object_type || null;
  const objectIdFilter = searchParams?.object_id || null;
  const fromDate = searchParams?.from || null;
  const toDate = searchParams?.to || null;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const from = page * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("admin_audit_logs")
    .select("id, admin_id, action, object_type, object_id, meta, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  if (adminIdFilter) query = query.eq("admin_id", adminIdFilter);
  if (actionFilter) query = query.eq("action", actionFilter);
  if (objectTypeFilter) query = query.eq("object_type", objectTypeFilter);
  if (objectIdFilter) query = query.eq("object_id", objectIdFilter);
  if (fromDate) query = query.gte("created_at", fromDate);
  if (toDate) query = query.lte("created_at", toDate);

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("[admin-audit] fetch error", error);
    return (
      <div style={{ padding: 20 }}>
        <h1>Error</h1>
        <p>Failed to fetch logs.</p>
      </div>
    );
  }

  const logs = (data ?? []) as LogRow[];
  const total = count ?? null;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Audit Logs</h1>
      <p>Server-side view. Use query parameters to filter: limit, page, action, object_type, admin_id, from, to.</p>

      <div style={{ marginBottom: 8, color: '#444' }}>Showing page {page + 1}{total ? ` — total ${total}` : ''}</div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>When</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Admin</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Action</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Object</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Meta</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: '8px 4px' }}>{new Date(r.created_at).toLocaleString()}</td>
              <td style={{ padding: '8px 4px' }}>{r.admin_id ?? '-'}</td>
              <td style={{ padding: '8px 4px' }}>{r.action}</td>
              <td style={{ padding: '8px 4px' }}>{(r.object_type ? `${r.object_type}/${r.object_id ?? ''}` : '-')}</td>
              <td style={{ padding: '8px 4px', fontFamily: 'monospace', fontSize: 12 }}>{JSON.stringify(r.meta || {})}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <a href={`?limit=${limit}&page=${Math.max(0, page - 1)}`}><button disabled={page === 0}>Prev</button></a>
        <a href={`?limit=${limit}&page=${page + 1}`}><button disabled={logs.length < limit}>Next</button></a>
      </div>
    </div>
  );
}
