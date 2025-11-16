// app/api/excel-data/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cache: { ts: number; data: unknown } | null = null;
const CACHE_TTL = 1000 * 60 * 1; // 1 min cache

export async function GET() {
  const file = path.join(process.cwd(), 'data', 'excel.json');
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  if (!fs.existsSync(file)) {
    return NextResponse.json({ error: 'excel.json missing' }, { status: 500 });
  }
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
  cache = { ts: Date.now(), data };
  return NextResponse.json(data);
}
