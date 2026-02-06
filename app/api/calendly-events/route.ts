import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CALENDLY_API = "https://api.calendly.com/event_types";
const CALENDLY_USER = process.env.CALENDLY_USER_URI || ""; // Optional: specify a Calendly user URI

export async function GET(request: Request) {
  const token = process.env.CALENDLY_API_KEY;

  if (!token) {
    return NextResponse.json(
      { error: "Missing CALENDLY_API_KEY environment variable." },
      { status: 500 }
    );
  }

  try {
    // Build Calendly API URL with optional user parameter
    let calendlyUrl = CALENDLY_API;
    if (CALENDLY_USER) {
      const url = new URL(CALENDLY_API);
      url.searchParams.set("user", CALENDLY_USER);
      calendlyUrl = url.toString();
    }

    const res = await fetch(calendlyUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      let errorBody = {};
      try {
        errorBody = await res.json();
      } catch {
        errorBody = { message: await res.text() };
      }
      
      console.error("Calendly API error:", errorBody);
      
      return NextResponse.json(
        {
          error: "Calendly API request failed",
          status: res.status,
          details: errorBody,
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Store meeting types in Supabase
    if (data && Array.isArray(data.collection)) {
      await storeMeetingsInSupabase(data.collection);
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Calendly API fetch failed:", message);
    return NextResponse.json(
      { error: "Internal server error while fetching Calendly events." },
      { status: 500 }
    );
  }
}

// Store meeting types in Supabase
async function storeMeetingsInSupabase(meetings: any[]) {
  try {
    // First, clear existing meetings (optional)
    await supabase
      .from('meeting_types')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    // Prepare meetings for insertion
    const meetingRecords = meetings.map(meeting => ({
      id: meeting.uri.split('/').pop() || meeting.uri, // Extract ID from URI
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
      created_at: new Date().toISOString(),
    }));

    // Insert into Supabase
    const { error } = await supabase
      .from('meeting_types')
      .upsert(meetingRecords, {
        onConflict: 'calendly_uri'
      });

    if (error) {
      console.error("Supabase insert error:", error);
    } else {
      console.log(`Successfully stored ${meetingRecords.length} meeting types in Supabase`);
    }
  } catch (error) {
    console.error("Error storing meetings in Supabase:", error);
  }
}