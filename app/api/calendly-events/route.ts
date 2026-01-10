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

function mockResponse() {
  return {
    collection: [
      {
        uri: "mock-1",
        name: "15-min intro",
        description: "Mocked event for local development",
        duration: 15,
        scheduling_url: "https://calendly.com/your/15min",
      },
      {
        uri: "mock-2",
        name: "30-min demo",
        description: "Mocked event for local development",
        duration: 30,
        scheduling_url: "https://calendly.com/your/30min",
      },
    ],
  };
}

export async function GET() {
  const token = process.env.CALENDLY_API_KEY;

  // Allow a mocked response in development when no token is set
  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(mockResponse(), { status: 200 });
    }
    return NextResponse.json(
      { error: "Missing CALENDLY_API_KEY in environment." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(CALENDLY_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // Avoid caching to reflect latest events
      cache: "no-store",
      // Ensure Next.js treats this as a dynamic request
      next: { revalidate: 0 },
    });

    const contentType = res.headers.get("content-type") || "";
    const maybeJson = contentType.includes("application/json");

    if (!res.ok) {
      const bodyText = maybeJson
        ? JSON.stringify(await res.json())
        : await res.text();
      // Propagate Calendly's status to aid debugging
      return NextResponse.json(
        {
          error: "Calendly API error",
          status: res.status,
          statusText: res.statusText,
          body: bodyText,
        },
        { status: 502 }
      );
    }

    const data = maybeJson ? await res.json() : await res.text();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Calendly API Fetch Failed:", message);

    // Provide mock fallback in dev if Calendly call fails
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        {
          warning:
            "Calendly fetch failed; returning mocked events in development.",
          details: message,
          ...mockResponse(),
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch Calendly events.", details: message },
      { status: 500 }
    );
  }
}
