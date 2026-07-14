"use client";

import React, { useState } from "react";

type LogRow = {
  id: string;
  admin_id: string | null;
  action: string;
  object_type: string | null;
  object_id: string | null;
  meta: Record<string, unknown>;
  created_at: string;
};

export default function AdminAuditLogsPage() {
  const [adminId, setAdminId] = useState("");
  const [logs, setLogs] = useState<LogRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(0);
  const [actionFilter, setActionFilter] = useState("");
  const [objectTypeFilter, setObjectTypeFilter] = useState("");
  const [total, setTotal] = useState<number | null>(null);

  async function loadLogs(pageToLoad = page) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('limit', String(limit));
      params.set('page', String(pageToLoad));
      if (actionFilter) params.set('action', actionFilter);
      if (objectTypeFilter) params.set('object_type', objectTypeFilter);
      if (adminId) params.set('admin_id', adminId);

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`, {
        headers: {
          "x-admin-id": adminId || "",
          Accept: "application/json",
        },
      });
      if (!res.ok) {
        const txt = await res.text();
        setError(`Failed to fetch logs: ${res.status} ${txt}`);
        setLogs(null);
      } else {
        const body = await res.json();
        setLogs(body.data || []);
        setTotal(body.total ?? null);
        setPage(pageToLoad);
      }
    } catch (e) {
      setError(String(e));
      setLogs(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Audit Logs</h1>
      <p>Provide an admin id (header x-admin-id) to authenticate the request, then click "Load".</p>

      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="Admin ID (x-admin-id header)"
          style={{ padding: 8, width: 300 }}
        />
        <input
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          placeholder="Action filter (e.g. campaign.send)"
          style={{ padding: 8, width: 220 }}
        />
        <input
          value={objectTypeFilter}
          onChange={(e) => setObjectTypeFilter(e.target.value)}
          placeholder="Object type (e.g. campaign)"
          style={{ padding: 8, width: 180 }}
        />
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <button onClick={() => loadLogs(0)} style={{ padding: '8px 12px' }}>{loading ? 'Loading...' : 'Load'}</button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {logs && (
        <>
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
            <button onClick={() => loadLogs(Math.max(0, page - 1))} disabled={page === 0}>Prev</button>
            <button onClick={() => loadLogs(page + 1)} disabled={logs.length < limit}>Next</button>
          </div>
        </>
      )}

      {!logs && !error && <div style={{ color: '#666' }}>No logs loaded yet.</div>}
    </div>
  );
}
