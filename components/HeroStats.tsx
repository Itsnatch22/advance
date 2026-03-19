'use client';

// advance — components/HeroStats.tsx
//
// Fetches live stats from /api/stats with a 6-hour revalidation cycle.
// Falls back gracefully to static marketing copy if the fetch fails or
// the stats row hasn't been seeded yet (pre-launch).

import { useState, useEffect } from 'react';
import { Users, Banknote, Zap, Star, Building2 } from "lucide-react";

interface PublicStats {
  total_users: number;
  active_employers: number;
  active_employees: number;
  total_disbursed: number;
  updated_at: string;
}

// ── Formatters ──────────────────────────────────────────────

function formatUsers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K+`;
  return `${n}+`;
}

function formatDisbursed(n: number): string {
  // Convert KES to USD for display (rough 1 USD = 129 KES)
  // Swap this for a real FX value if needed
  const usd = n / 129;
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B+`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M+`;
  if (usd >= 1_000) return `$${Math.floor(usd / 1_000)}K+`;
  return `$${usd.toFixed(0)}`;
}

// ── Static fallbacks (shown pre-launch or on fetch failure) ──

const STATIC_STATS = [
  { value: "50K+",  label: "Active Users",      icon: Users     },
  { value: "$2B+",  label: "Disbursed",          icon: Banknote  },
  { value: "<3s",   label: "Instant Transfer",   icon: Zap       },
  { value: "4.9",   label: "Rating",             icon: Star      },
];

// ── Data fetching (client component) ────────────────────────

async function fetchStats(): Promise<PublicStats | null> {
  try {
    const res = await fetch('/api/stats', {
      next: { revalidate: 21600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

// ── Component ────────────────────────────────────────────────

export default function HeroStats() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  // If we have live data and total_users > 0, show real numbers.
  // Keeps <3s and 4.9 as static — these are marketing claims, not DB values.
  const resolvedStats = stats && stats.total_users > 0
    ? [
        {
          value: formatUsers(stats.total_users),
          label: "Active Users",
          icon: Users,
        },
        {
          value: formatDisbursed(stats.total_disbursed),
          label: "Disbursed",
          icon: Banknote,
        },
        {
          value: "<3s",
          label: "Instant Transfer",
          icon: Zap,
        },
        {
          value: "4.9",
          label: "Rating",
          icon: Star,
        },
      ]
    : STATIC_STATS;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {resolvedStats.map(({ value, label, icon: Icon }) => (
        <div key={label} className="flex flex-col items-center gap-2 text-center">
          <Icon className="h-5 w-5 text-green-500" />
          <span className="text-2xl font-black tracking-tight text-slate-900">
            {value}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
