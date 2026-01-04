import fs from "fs";
import path from "path";

export type Band = { lower: number; upper: number | null; rate: number };

interface CalcData {
  Rates?: unknown[];
}

// Row shape coming from the spreadsheet-like JSON
// Keys include a trailing space in "General " based on the source data
export type RateRow = {
  "General "?: string | number;
  "Amount/Threshold"?: number | string | null;
  Description?: number | string;
  [key: string]: unknown;
};

export function loadCalcJson() {
  const JSON_PATH = path.join(process.cwd(), "data", "calc.json");
  const raw = fs.readFileSync(JSON_PATH, "utf8");
  return JSON.parse(raw);
}

export function parseRatesSheet(data: unknown) {
  const ratesSheet = (data as CalcData)?.Rates ?? [];
  const rows: RateRow[] = Array.isArray(ratesSheet)
    ? (ratesSheet as RateRow[]).filter(Boolean)
    : [];

  // Extract named rates from rows where "General " is a string label
  const rates: Record<string, number> = {};
  for (const row of rows) {
    const general = row["General "];
    const amount = row["Amount/Threshold"];

    if (typeof general === "string") {
      const key = general.trim();
      if (
        key &&
        !key.startsWith("Lower") &&
        !key.startsWith("PAYE") &&
        amount !== undefined &&
        amount !== null &&
        !Number.isNaN(Number(amount))
      ) {
        rates[key] = Number(amount);
      }
    }
  }

  // Extract bands where both lower and rate are numeric
  const bands: Band[] = [];
  for (const row of rows) {
    const general = row["General "];
    const description = row.Description;

    if (typeof general === "number" && typeof description === "number") {
      const lower = general;
      const upperRaw = row["Amount/Threshold"];
      const upper = typeof upperRaw === "number" ? upperRaw : null;
      const rate = description;
      bands.push({ lower, upper, rate });
    }
  }

  return { rates, bands };
}
