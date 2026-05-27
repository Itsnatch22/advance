import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const JSON_PATH = path.join(process.cwd(), "data", "calc.json");

async function loadJson() {
  const raw = await fs.readFile(JSON_PATH, "utf8");
  return JSON.parse(raw);
}

function parseRatesSheet(data: unknown) {
  const dataObj = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const ratesSheet = Array.isArray(dataObj?.Rates)
    ? dataObj.Rates
    : [];
  const rates: Record<string, number> = {};

  for (const row of ratesSheet) {
    if (row && typeof row === "object") {
      const rowObj = row as Record<string, unknown>;
      const generalKey = Object.keys(rowObj).find(
        (key) => key.trim().toLowerCase() === "general"
      );
      const amountKey = Object.keys(rowObj).find(
        (key) =>
          key.trim().toLowerCase().includes("amount") ||
          key.trim().toLowerCase().includes("threshold")
      );

      if (!generalKey || !amountKey) continue;

      const rawKey = String(rowObj[generalKey] ?? "").trim();
      const rawAmount = rowObj[amountKey];
      const amount = Number(rawAmount);

      if (
        rawKey &&
        !rawKey.startsWith("Lower") &&
        !rawKey.startsWith("PAYE") &&
        !Number.isNaN(amount)
      ) {
        rates[rawKey] = amount;
      }
    }
  }

  return rates;
}

export async function GET() {
  try {
    const data = await loadJson();
    const rates = parseRatesSheet(data);

    return NextResponse.json({ success: true, rates });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
