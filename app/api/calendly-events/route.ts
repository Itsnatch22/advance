import { NextResponse } from "next/server";

const CALENDLY_API = "https://api.calendly.com/event_types";

/**
 * GET /api/calendly-events
 * Fetches a list of Calendly event types for your organization or user.
 *
 * 🔑 Requires CALENDLY_API_KEY to be set in .env.local:
 * CALENDLY_API_KEY=your_personal_or_org_token
 *
 * Docs: https://developer.calendly.com/api-docs
 */

export async function GET() {
  const token = process.env.CALENDLY_API_KEY;
  if (!token) {
    return NextResponse.json(
      { error: "Missing CALENDLY_API_KEY in environment." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(CALENDLY_API, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Calendly API error: ${errorText}`);
    }

    const data: unknown = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Calendly API Fetch Failed:", message);
    return NextResponse.json(
      { error: "Failed to fetch Calendly events.", details: message },
      { status: 500 }
    );
  }
}
