// scripts/xlsx-to-json.ts
import * as fs from "fs-extra";
import * as path from "path";
import * as XLSX from "xlsx";

const sourceDir = path.resolve(process.cwd(), "mnt/data"); // adjust if needed
const outDir = path.resolve(process.cwd(), "data");

async function convert(fileName: string, outName: string) {
  const p = path.join(sourceDir, fileName);
  if (!fs.existsSync(p)) {
    console.warn(`No XLSX found at ${p}, skipping`);
    return;
  }
  const wb = XLSX.readFile(p, { cellDates: true });
  const jsonOut: Record<string, unknown> = {};

  // heuristics: find sheets with "Rates", "Inputs", "Workings", "Output"
  wb.SheetNames.forEach((sheet) => {
    const ws = wb.Sheets[sheet];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
    // store raw rows by sheet name for now
    jsonOut[sheet] = rows;
  });

  await fs.ensureDir(outDir);
  await fs.writeFile(
    path.join(outDir, outName),
    JSON.stringify(jsonOut, null, 2),
    "utf8"
  );
  console.log("Wrote", outName);
}

(async () => {
  await convert("calcke.xlsx", "calcke_from_xlsx.json");
  await convert("calcug.xlsx", "calcug_from_xlsx.json");
  await convert("calctz.xlsx", "calctz_from_xlsx.json");
  await convert("calcrw.xlsx", "calcrw_from_xlsx.json");
})();
