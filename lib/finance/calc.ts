import { promises as fs } from "fs";
import path from "path";

export { calc } from "./calc-engine";
export type { CalcResult, JsonConfig, Payload } from "./calc-engine";

export async function readCountryConfig(countryCode: string) {
  const fileMap: Record<string, string> = {
    KE: "calcke.json",
    UG: "calcug.json",
    TZ: "calctz.json",
    RW: "calcrw.json",
  };

  const code = (countryCode || "KE").toUpperCase();
  const fileName = fileMap[code] || fileMap["KE"];
  const filePath = path.join(process.cwd(), "data", fileName);

  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Config file not found: ${filePath}`);
  }

  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);

  const meta = {
    code,
    name:
      code === "KE"
        ? "Kenya"
        : code === "UG"
          ? "Uganda"
          : code === "TZ"
            ? "Tanzania"
            : "Rwanda",
    flag:
      code === "KE" ? "🇰🇪" : code === "UG" ? "🇺🇬" : code === "TZ" ? "🇹🇿" : "🇷🇼",
    currency:
      code === "KE"
        ? "KES"
        : code === "UG"
          ? "UGX"
          : code === "TZ"
            ? "TZS"
            : "RWF",
    lastUpdated:
      parsed.meta?.lastUpdated || new Date().toISOString().split("T")[0],
    description: parsed.meta?.description || "",
    rulesVersion: parsed.meta?.rulesVersion,
    effectiveFrom: parsed.meta?.effectiveFrom,
  };

  const deductions = [];
  if (parsed.nssf) deductions.push("NSSF");
  if (parsed.shif) deductions.push("SHIF/NHIF");
  if (parsed.housing) deductions.push("Housing Levy");
  if (parsed.rssb) deductions.push("RSSB");
  if (parsed.paye) deductions.push("PAYE");
  if (parsed.sdl) deductions.push("SDL");
  if (parsed.wcf) deductions.push("WCF");
  if (parsed.lst) deductions.push("LST");

  return { ...parsed, meta, deductions };
}
