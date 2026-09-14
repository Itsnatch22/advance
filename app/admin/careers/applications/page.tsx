"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Download, RefreshCw } from "lucide-react";

type ApplicationStatus = "submitted" | "under_review" | "shortlisted" | "rejected" | "hired";

type CareerOption = {
  slug: string;
  title: string;
};

type CareerApplication = {
  id: string;
  career_title_snapshot: string;
  career_slug_snapshot: string;
  full_name: string;
  email: string;
  phone: string | null;
  resume_signed_url: string | null;
  status: ApplicationStatus;
  created_at: string;
};

const nextStatuses: Record<ApplicationStatus, ApplicationStatus[]> = {
  submitted: ["under_review"],
  under_review: ["shortlisted", "rejected"],
  shortlisted: ["rejected", "hired"],
  rejected: [],
  hired: [],
};

export default function CareerApplicationsAdminPage() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [careers, setCareers] = useState<CareerOption[]>([]);
  const [statuses, setStatuses] = useState<ApplicationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    from: "",
    to: "",
    search: "",
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/careers/applications${queryString ? `?${queryString}` : ""}`);
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.error ?? "Unable to load career applications.");
      }

      setApplications(result.data.applications ?? []);
      setCareers(result.data.careers ?? []);
      setStatuses(result.data.statuses ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load career applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [queryString]);

  const updateStatus = async (application: CareerApplication, status: ApplicationStatus) => {
    try {
      setSavingId(application.id);
      setError(null);
      const response = await fetch(`/api/admin/careers/applications/${application.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.error ?? "Unable to update status.");
      }

      setApplications((current) =>
        current.map((item) => (item.id === application.id ? { ...item, status } : item))
      );
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Unable to update status.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Career Applications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review candidate submissions and move applications through hiring status.
          </p>
        </div>
        <button
          type="button"
          onClick={loadApplications}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5">
        <select
          value={filters.role}
          onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}
          className={controlClassName}
        >
          <option value="">All roles</option>
          {careers.map((career) => (
            <option key={career.slug} value={career.slug}>
              {career.title}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
          className={controlClassName}
        >
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filters.from}
          onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))}
          className={controlClassName}
          aria-label="Submitted from"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))}
          className={controlClassName}
          aria-label="Submitted to"
        />
        <input
          type="search"
          value={filters.search}
          onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          className={controlClassName}
          placeholder="Candidate search"
        />
      </div>

      {error ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Candidate", "Role", "Status", "Submitted", "Resume", "Move"].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    {Array.from({ length: 6 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-4">
                        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    No applications match these filters.
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr key={application.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{application.full_name}</div>
                      <div className="mt-1 text-xs text-slate-500">{application.email}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {application.career_title_snapshot}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                      {formatDate(application.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      {application.resume_signed_url ? (
                        <a
                          href={application.resume_signed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Resume
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Unavailable</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value=""
                        disabled={savingId === application.id || nextStatuses[application.status].length === 0}
                        onChange={(event) =>
                          updateStatus(application, event.target.value as ApplicationStatus)
                        }
                        className={controlClassName}
                        aria-label={`Move ${application.full_name} to another status`}
                      >
                        <option value="">Select</option>
                        {nextStatuses[application.status].map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const controlClassName =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles: Record<ApplicationStatus, string> = {
    submitted: "bg-slate-50 text-slate-700 ring-slate-500/10",
    under_review: "bg-blue-50 text-blue-700 ring-blue-500/10",
    shortlisted: "bg-green-50 text-green-700 ring-green-500/10",
    rejected: "bg-red-50 text-red-700 ring-red-500/10",
    hired: "bg-emerald-50 text-emerald-700 ring-emerald-500/10",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ${styles[status]}`}>
      {formatStatus(status)}
    </span>
  );
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
