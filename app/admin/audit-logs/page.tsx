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

  async function loadLogs() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/audit-logs?limit=100`, {
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

      <div style={{ marginBottom: 12 }}>
        <input
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          placeholder="Admin ID (x-admin-id header)"
          style={{ padding: 8, width: 420 }}
        />
        <button onClick={loadLogs} style={{ marginLeft: 8, padding: '8px 12px' }}>
          {loading ? 'Loading...' : 'Load'}
        </button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {logs && (
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
      )}

      {!logs && !error && <div style={{ color: '#666' }}>No logs loaded yet.</div>}
    </div>
  );
}
