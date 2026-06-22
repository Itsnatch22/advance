import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

let cache: { ts: number; data: unknown } | null = null;
const CACHE_TTL = 1000 * 60 * 1;

export async function GET() {
  const file = path.join(process.cwd(), "data", "excel.json");
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    await fs.access(file);
  } catch {
    return NextResponse.json({ error: "excel.json missing" }, { status: 500 });
  }

  const raw = await fs.readFile(file, "utf8");
  const data = JSON.parse(raw);
  cache = { ts: Date.now(), data };
  return NextResponse.json(data);
}
