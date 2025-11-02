import fs from "fs";
import path from "path";

export type Band = { lower: number; upper: number | null; rate: number };

export function loadCalcJson() {
  const JSON_PATH = path.join(process.cwd(), "data", "calc.json");
  const raw = fs.readFileSync(JSON_PATH, "utf8");
  return JSON.parse(raw);
}

export function parseRatesSheet(data: any) {
  const ratesSheet = data?.Rates || [];
  const safeRates = Array.isArray(ratesSheet) ? ratesSheet.filter(Boolean) : [];

  const rates: Record<string, number> = {};
  for (const row of safeRates) {
    if (
      row &&
      typeof row["General "] === "string" &&
      row["Amount/Threshold"] !== undefined
    ) {
      const key = String(row["General "]).trim();
      if (key && !key.startsWith("Lower") && !key.startsWith("PAYE")) {
        rates[key] = Number(row["Amount/Threshold"]);
      }
    }
  }

  const bands: Band[] = [];
  for (const row of safeRates) {
    if (row && typeof row["General "] === "number" && typeof row["Description"] === "number") {
      const lower = Number(row["General "]);
      const upper =
        row["Amount/Threshold"] !== undefined && typeof row["Amount/Threshold"] === "number"
          ? Number(row["Amount/Threshold"])
          : null;
      const rate = Number(row["Description"]);
      bands.push({ lower, upper, rate });
    }
  }

  return { rates, bands };
}
