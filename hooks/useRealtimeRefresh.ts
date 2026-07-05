"use client";

import { useEffect, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface RealtimeTable {
  table: string;
  filter?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
}

/**
 * Subscribe to one or more Supabase table changes and call `onRefresh` when
 * any of them fire. Drop this into any marketing page that displays live data
 * — blog listings, homepage stats, announcements, the status page — so content
 * pushed from the admin panel appears without visitors needing to reload.
 *
 * The callback receives the table name so callers can show targeted toasts or
 * selectively re-fetch only the data that changed.
 *
 * Tables must be added to the `supabase_realtime` publication before events
 * will arrive. Currently enabled for: blogs, announcements, public_stats,
 * api_health.
 *
 * Usage:
 *   useRealtimeRefresh(
 *     [{ table: "blogs", event: "INSERT" }],
 *     (table) => void fetchLatestPosts()
 *   );
 */
export function useRealtimeRefresh(
  tables: RealtimeTable[],
  onRefresh: (table: string) => void
) {
  // Stable ref so the subscription doesn't re-fire when the caller passes
  // an inline arrow function (the common pattern with useCallback).
  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  // Derived key so the channel only re-subscribes when the actual table
  // config changes (e.g. a dynamic filter becomes known after auth resolves).
  const configKey = tables
    .map((t) => `${t.table}:${t.filter ?? "*"}:${t.event ?? "*"}`)
    .join("|");

  useEffect(() => {
    if (!tables.length) return;

    const supabase = getSupabaseBrowserClient();
    const channelName = `realtime-refresh:${configKey}`;
    let channel = supabase.channel(channelName);

    for (const { table, filter, event = "*" } of tables) {
      channel = channel.on(
        "postgres_changes" as const,
        { event, schema: "public", table, ...(filter ? { filter } : {}) },
        () => onRefreshRef.current(table)
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // configKey is the stable dependency — tables array identity changes on
    // every render so we intentionally ignore it here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey]);
}
