// app/api/calc/route.ts
import fs from "fs/promises";
import path from "path";
import { calc, Payload, JsonConfig } from "../../../lib/calc";

const dataPath = path.join(process.cwd(), "data");
async function readCountryJson(code: string): Promise<JsonConfig> {
  const map: Record<string, string> = {
    KE: "calcke.json",
    UG: "calcug.json",
    TZ: "calctz.json",
    RW: "calcrw.json",
  };
  const fname = map[code] ?? map["KE"];
  try {
    const txt = await fs.readFile(path.join(dataPath, fname), "utf8");
    return JSON.parse(txt) as JsonConfig;
  } catch (e) {
    console.warn("JSON read error", fname, e);
    return {};
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const country = (url.searchParams.get("country") || "KE").toUpperCase();
    const payload = (await req.json()) as Payload;
    payload.country = (payload.country || (country as any)) as any;

    const cfg = await readCountryJson(country);

    const result = calc(payload, cfg);

    // extra debug envelope for matching and regression testing
    const envelope = {
      ...result,
      _server: {
        timestamp: new Date().toISOString(),
        jsonFile: `data/${(country || "KE").toUpperCase()}.json`,
      },
    };

    return new Response(JSON.stringify(envelope), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("API calc error", err);
    return new Response(JSON.stringify({ success: false, error: String(err?.message ?? err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
