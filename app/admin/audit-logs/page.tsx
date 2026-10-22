import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type AuditLogRow = {
  id: string;
  admin_id: string;
  admin_name: string | null;
  target_id: string | null;
  target_type: string | null;
  action: string;
  old_value: unknown;
  new_value: unknown;
  reason: string | null;
  metadata: unknown;
  created_at: string;
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function dateBoundary(value: string | undefined, endOfDay = false) {
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}

function formatJson(value: unknown) {
  if (value === null || value === undefined) return null;
  return JSON.stringify(value, null, 2);
}

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const supabaseClient = await createRouteHandlerClient();
  const {
    data: { user },
    error: authError,
  } = await supabaseClient.auth.getUser();

  if (authError || !user) {
    return (
      <AccessMessage
        title="Sign in required"
        message="Sign in with an administrator account to view the audit trail."
      />
    );
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <AccessMessage
        title="Service unavailable"
        message="Audit log storage is not configured."
      />
    );
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: adminRecord, error: adminError } = await adminClient
    .from("system_admins")
    .select("id, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (adminError || !adminRecord?.is_admin) {
    return (
      <AccessMessage
        title="Access restricted"
        message="You must be a system administrator to view audit records."
      />
    );
  }

  const requestedLimit = Number(valueOf(params.limit));
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(200, Math.max(10, requestedLimit))
    : 50;
  const requestedPage = Number(valueOf(params.page));
  const page = Number.isInteger(requestedPage) ? Math.max(0, requestedPage) : 0;
  const adminId = valueOf(params.admin_id)?.trim() ?? "";
  const action = valueOf(params.action)?.trim() ?? "";
  const targetType = valueOf(params.target_type)?.trim() ?? "";
  const targetId = valueOf(params.target_id)?.trim() ?? "";
  const fromDate = valueOf(params.from) ?? "";
  const toDate = valueOf(params.to) ?? "";
  const fromBoundary = dateBoundary(fromDate);
  const toBoundary = dateBoundary(toDate, true);
  const hasInvalidFilter =
    (Boolean(adminId) && !UUID_PATTERN.test(adminId)) ||
    (Boolean(fromDate) && !fromBoundary) ||
    (Boolean(toDate) && !toBoundary) ||
    Boolean(fromBoundary && toBoundary && fromBoundary > toBoundary);

  let query = adminClient
    .from("system_audit_logs")
    .select(
      "id, admin_id, admin_name, target_id, target_type, action, old_value, new_value, reason, metadata, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (!hasInvalidFilter) {
    if (adminId) query = query.eq("admin_id", adminId);
    if (action) query = query.eq("action", action);
    if (targetType) query = query.eq("target_type", targetType);
    if (targetId) query = query.eq("target_id", targetId);
    if (fromBoundary) query = query.gte("created_at", fromBoundary);
    if (toBoundary) query = query.lte("created_at", toBoundary);
  }

  const from = page * limit;
  const to = from + limit - 1;
  const { data, error, count } = hasInvalidFilter
    ? { data: [], error: null, count: 0 }
    : await query.range(from, to);

  if (error) {
    console.error("[system-audit] fetch error", error);
    return (
      <AccessMessage
        title="Could not load audit records"
        message="The audit trail could not be loaded. Try again in a moment."
      />
    );
  }

  const logs = (data ?? []) as AuditLogRow[];
  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);
  const exportParams = new URLSearchParams();
  if (adminId) exportParams.set("admin_id", adminId);
  if (action) exportParams.set("action", action);
  if (targetType) exportParams.set("target_type", targetType);
  if (targetId) exportParams.set("target_id", targetId);
  if (fromDate) exportParams.set("from", fromDate);
  if (toDate) exportParams.set("to", toDate);

  const pageParams = new URLSearchParams(exportParams);
  pageParams.set("limit", String(limit));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            Administration
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Audit trail
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Review administrator actions and the record changes attached to
            them.
          </p>
        </div>
        <a
          href={`/api/admin/audit-logs/export${exportParams.size ? `?${exportParams.toString()}` : ""}`}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Export CSV
        </a>
      </div>

      <section
        className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        aria-label="Audit log filters"
      >
        <form method="get" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-slate-600">
            Action
            <input
              name="action"
              defaultValue={action}
              placeholder="e.g. campaign.send"
              className={controlClassName}
            />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Target type
            <input
              name="target_type"
              defaultValue={targetType}
              placeholder="e.g. campaign"
              className={controlClassName}
            />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Target ID
            <input
              name="target_id"
              defaultValue={targetId}
              placeholder="Record ID"
              className={controlClassName}
            />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Admin ID
            <input
              name="admin_id"
              defaultValue={adminId}
              placeholder="UUID"
              className={controlClassName}
            />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            From
            <input
              type="date"
              name="from"
              defaultValue={fromDate}
              className={controlClassName}
            />
          </label>
          <label className="text-xs font-semibold text-slate-600">
            To
            <input
              type="date"
              name="to"
              defaultValue={toDate}
              className={controlClassName}
            />
          </label>
          <input type="hidden" name="limit" value={limit} />
          <div className="flex items-end gap-2 sm:col-span-2 lg:justify-end">
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              Apply filters
            </button>
            <Link
              href="/admin/audit-logs"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Clear
            </Link>
          </div>
        </form>
      </section>

      {hasInvalidFilter ? (
        <div
          className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="status"
        >
          Check the admin ID and date range. Enter a valid UUID and dates where
          the start is before the end.
        </div>
      ) : null}

      <section
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        aria-label="Audit log records"
      >
        <div className="flex flex-col gap-1 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Administrator activity
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {total === 0
                ? "No records found"
                : `Showing ${from + 1}–${Math.min(to + 1, total)} of ${total}`}
            </p>
          </div>
          <span className="text-xs text-slate-400">
            Times shown in East Africa Time
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "When",
                  "Administrator",
                  "Action",
                  "Target",
                  "Change details",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase sm:px-5"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <p className="font-serif text-lg font-semibold text-slate-800">
                      No audit records yet
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Administrator actions will appear here when written to the
                      system audit log.
                    </p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const oldValue = formatJson(log.old_value);
                  const newValue = formatJson(log.new_value);
                  const metadata = formatJson(log.metadata);
                  const hasDetails =
                    oldValue || newValue || metadata || log.reason;

                  return (
                    <tr
                      key={log.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-slate-600 sm:px-5">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <div className="font-medium text-slate-800">
                          {log.admin_name || "Administrator"}
                        </div>
                        <div
                          className="mt-1 font-mono text-xs text-slate-400"
                          title={log.admin_id}
                        >
                          {log.admin_id.slice(0, 8)}…
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/10">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600 sm:px-5">
                        {log.target_type ? (
                          <span className="font-medium">{log.target_type}</span>
                        ) : (
                          "—"
                        )}
                        {log.target_id ? (
                          <div
                            className="mt-1 max-w-48 truncate font-mono text-xs text-slate-400"
                            title={log.target_id}
                          >
                            {log.target_id}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        {hasDetails ? (
                          <details className="max-w-md">
                            <summary className="cursor-pointer text-sm font-medium text-emerald-800 hover:text-emerald-900">
                              View details
                            </summary>
                            <div className="mt-3 space-y-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                              {log.reason ? (
                                <p>
                                  <span className="font-semibold">Reason:</span>{" "}
                                  {log.reason}
                                </p>
                              ) : null}
                              {oldValue ? (
                                <JsonBlock
                                  label="Previous value"
                                  value={oldValue}
                                />
                              ) : null}
                              {newValue ? (
                                <JsonBlock label="New value" value={newValue} />
                              ) : null}
                              {metadata ? (
                                <JsonBlock label="Metadata" value={metadata} />
                              ) : null}
                            </div>
                          </details>
                        ) : (
                          <span className="text-slate-400">
                            No additional details
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-4 sm:px-5">
          <span className="text-sm text-slate-500">
            Page {page + 1}
            {totalPages ? ` of ${totalPages}` : ""}
          </span>
          <div className="flex gap-2">
            {page > 0 ? (
              <Link
                href={`?${new URLSearchParams([...pageParams, ["page", String(page - 1)]]).toString()}`}
                className={paginationClassName}
              >
                Previous
              </Link>
            ) : (
              <span
                className={`${paginationClassName} cursor-not-allowed opacity-40`}
              >
                Previous
              </span>
            )}
            {from + logs.length < total ? (
              <Link
                href={`?${new URLSearchParams([...pageParams, ["page", String(page + 1)]]).toString()}`}
                className={paginationClassName}
              >
                Next
              </Link>
            ) : (
              <span
                className={`${paginationClassName} cursor-not-allowed opacity-40`}
              >
                Next
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const controlClassName =
  "mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10";
const paginationClassName =
  "rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50";

function JsonBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 font-semibold">{label}</p>
      <pre className="max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white p-2 font-mono break-words whitespace-pre-wrap">
        {value}
      </pre>
    </div>
  );
}

function AccessMessage({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
}
