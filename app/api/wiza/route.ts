import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type ApiRequestBody = { q?: string };

type SearchResult = {
  found: boolean;
  answer: string;
  source?: string | null;
  fallbackEmail?: string | null;
};

// Proper type for your docs
interface WizaDoc {
  title?: string;
  sections?: {
    heading?: string;
    content?: string;
  }[];
  [key: string]: unknown;
}

// Load all JSON files from /data
async function loadDataFiles() {
  const dataDir = path.join(process.cwd(), "data");

  try {
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const items: { filename: string; content: WizaDoc }[] = [];

    for (const file of jsonFiles) {
      const raw = await fs.readFile(path.join(dataDir, file), "utf-8");
      items.push({
        filename: file,
        content: JSON.parse(raw) as WizaDoc,
      });
    }

    return items;
  } catch {
    return [];
  }
}

// Score match strength inside the doc
function scoreMatch(query: string, item: WizaDoc) {
  const q = query.toLowerCase();
  let score = 0;

  if (typeof item.title === "string" && item.title.toLowerCase().includes(q)) {
    score += 50;
  }

  if (Array.isArray(item.sections)) {
    for (const s of item.sections) {
      if (typeof s.heading === "string" && s.heading.toLowerCase().includes(q))
        score += 20;

      if (typeof s.content === "string" && s.content.toLowerCase().includes(q))
        score += 10;
    }
  }

  // fallback top-level string fields
  for (const k of Object.keys(item)) {
    const v = item[k];
    if (typeof v === "string" && v.toLowerCase().includes(q)) score += 5;
  }

  return score;
}

// Build answer response
function buildAnswerFromItem(item: WizaDoc, query: string) {
  const q = query.toLowerCase();

  if (Array.isArray(item.sections)) {
    let best: { heading?: string; content?: string } | null = null;
    let bestScore = 0;

    for (const s of item.sections) {
      let score = 0;

      if (typeof s.heading === "string" && s.heading.toLowerCase().includes(q))
        score += 30;

      if (typeof s.content === "string" && s.content.toLowerCase().includes(q))
        score += 20;

      if (score > bestScore) {
        best = s;
        bestScore = score;
      }
    }

    if (best && bestScore > 0) {
      return `${best.heading}\n\n${best.content}`;
    }
  }

  // fallback: title + first section
  const first =
    Array.isArray(item.sections) && item.sections.length > 0
      ? item.sections[0]
      : null;

  return `${item.title ?? ""}${
    first ? ` — ${first.heading}\n\n${first.content}` : ""
  }`;
}

// POST handler
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ApiRequestBody;
    const q = body.q?.trim() ?? "";

    if (!q) {
      return NextResponse.json(
        {
          found: false,
          answer: "Please ask a specific question.",
        } as SearchResult,
        { status: 400 }
      );
    }

    const items = await loadDataFiles();

    // Score all docs
    let bestItem: { filename: string; content: WizaDoc } | null = null;
    let bestScore = 0;

    for (const it of items) {
      const s = scoreMatch(q, it.content);
      if (s > bestScore) {
        bestScore = s;
        bestItem = { filename: it.filename, content: it.content };
      }
    }

    // If match strong enough
    if (bestItem && bestScore >= 10) {
      const answer = buildAnswerFromItem(bestItem.content, q);

      return NextResponse.json({
        found: true,
        answer,
        source: bestItem.filename,
      } as SearchResult);
    }

    // Fallback: not found
    return NextResponse.json({
      found: false,
      answer:
        "I couldn't find a match in the docs. You can choose to send this question to our support team.",
      fallbackEmail: "support@eaziwage.com",
    } as SearchResult);
  } catch (err) {
    console.error("Wiza route error:", err);

    return NextResponse.json(
      {
        found: false,
        answer: "Server error — try again later.",
      },
      { status: 500 }
    );
  }
}
