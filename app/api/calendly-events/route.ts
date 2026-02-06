import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ----------------------------- config ----------------------------- */

const CALENDLY_API = "https://api.calendly.com/event_types";
const CALENDLY_USER_URI = process.env.CALENDLY_USER_URI || "";
const CALENDLY_API_KEY = process.env.CALENDLY_API_KEY;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Cache configuration (5 minutes)
const CACHE_DURATION_MS = 5 * 60 * 1000;
let cachedData: { data: any; timestamp: number } | null = null;

/* ----------------------------- types ----------------------------- */

interface CalendlyEventType {
  uri: string;
  name: string;
  description?: string;
  duration: number;
  scheduling_url: string;
  color?: string;
  internal_note?: string;
  active: boolean;
  slug: string;
  kind: string;
  pooling_type?: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

interface MeetingRecord {
  id: string;
  calendly_uri: string;
  name: string;
  description: string | null;
  duration: number;
  scheduling_url: string;
  color: string | null;
  internal_note: string | null;
  active: boolean;
  slug: string;
  kind: string;
  pooling_type: string | null;
  type: string;
  last_updated: string;
}

/* ----------------------------- helpers ----------------------------- */

function extractIdFromUri(uri: string): string {
  const parts = uri.split("/");
  return parts[parts.length - 1] || uri;
}

async function storeMeetingsInSupabase(meetings: CalendlyEventType[]): Promise<void> {
  if (!supabase) {
    console.warn("Supabase not configured, skipping database storage");
    return;
  }

  try {
    // Prepare meeting records
    const meetingRecords: MeetingRecord[] = meetings.map((meeting) => ({
      id: extractIdFromUri(meeting.uri),
      calendly_uri: meeting.uri,
      name: meeting.name,
      description: meeting.description || null,
      duration: meeting.duration,
      scheduling_url: meeting.scheduling_url,
      color: meeting.color || null,
      internal_note: meeting.internal_note || null,
      active: meeting.active,
      slug: meeting.slug,
      kind: meeting.kind,
      pooling_type: meeting.pooling_type || null,
      type: meeting.type,
      last_updated: new Date().toISOString(),
    }));

    // Upsert (insert or update) meeting types
    const { error } = await supabase
      .from("meeting_types")
      .upsert(meetingRecords, {
        onConflict: "calendly_uri",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Supabase upsert error:", error.message);
      // Don't throw - we still want to return data even if DB fails
    } else {
      console.log(`✓ Stored ${meetingRecords.length} meeting types in Supabase`);
    }
  } catch (error) {
    console.error("Error storing meetings in Supabase:", error);
    // Non-blocking error
  }
}

async function fetchFromCalendly(): Promise<any> {
  if (!CALENDLY_API_KEY) {
    throw new Error("CALENDLY_API_KEY not configured");
  }

  // Build URL with optional user parameter
  let url = CALENDLY_API;
  if (CALENDLY_USER_URI) {
    const urlObj = new URL(CALENDLY_API);
    urlObj.searchParams.set("user", CALENDLY_USER_URI);
    urlObj.searchParams.set("active", "true"); // Only active events
    url = urlObj.toString();
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${CALENDLY_API_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorDetails;
    try {
      errorDetails = await response.json();
    } catch {
      errorDetails = { message: await response.text() };
    }

    console.error("Calendly API error:", {
      status: response.status,
      statusText: response.statusText,
      details: errorDetails,
    });

    throw new Error(
      `Calendly API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  // Validate response structure
  if (!data || !Array.isArray(data.collection)) {
    throw new Error("Invalid response format from Calendly API");
  }

  return data;
}

/* ----------------------------- handler ----------------------------- */

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    if (!CALENDLY_API_KEY) {
      return NextResponse.json(
        {
          error: "Server configuration error",
          message: "Calendly API key not configured",
        },
        { status: 500 }
      );
    }

    // Check cache
    const now = Date.now();
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION_MS) {
      console.log("✓ Returning cached Calendly data");
      return NextResponse.json(cachedData.data, {
        headers: {
          "X-Cache": "HIT",
          "Cache-Control": "public, max-age=300", // 5 minutes
        },
      });
    }

    // Fetch from Calendly
    const data = await fetchFromCalendly();

    // Store in cache
    cachedData = {
      data,
      timestamp: now,
    };

    // Store in Supabase (non-blocking)
    if (data.collection && data.collection.length > 0) {
      // Don't await - run in background
      storeMeetingsInSupabase(data.collection).catch((error) => {
        console.error("Background DB storage failed:", error);
      });
    }

    return NextResponse.json(data, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Error in /api/calendly-events:", error);

    const message = error instanceof Error ? error.message : "Unknown error occurred";

    // Try to return from cache if available, even if expired
    if (cachedData) {
      console.warn("Returning stale cache due to error");
      return NextResponse.json(cachedData.data, {
        headers: {
          "X-Cache": "STALE",
          "X-Cache-Error": message,
        },
      });
    }

    return NextResponse.json(
      {
        error: "Failed to fetch meeting types",
        message,
        collection: [], // Return empty collection to prevent UI errors
      },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint to manually refresh cache
export async function POST(request: NextRequest) {
  try {
    // Verify admin authorization (implement your auth logic)
    const authHeader = request.headers.get("authorization");
    const adminKey = process.env.ADMIN_API_KEY;

    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Clear cache
    cachedData = null;

    // Fetch fresh data
    const data = await fetchFromCalendly();

    // Update cache
    cachedData = {
      data,
      timestamp: Date.now(),
    };

    // Store in database
    if (data.collection && data.collection.length > 0) {
      await storeMeetingsInSupabase(data.collection);
    }

    return NextResponse.json({
      success: true,
      message: "Cache refreshed successfully",
      count: data.collection?.length || 0,
    });
  } catch (error) {
    console.error("Error refreshing cache:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to refresh cache",
        message,
      },
      { status: 500 }
    );
  }
}