import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

function main() {
  const infile = process.argv[2];
  if (!infile) {
    console.error("Usage: ts-node convert-xlsx-to-json.ts PATH_TO_XLSX");
    process.exit(1);
  }

  if (!fs.existsSync(infile)) {
    console.error(`Error: File not found at ${infile}`);
    process.exit(1);
  }

  try {
    const workbook = XLSX.readFile(infile, {
      cellDates: true,
      cellNF: false,
      cellText: false,
    });

    const result: Record<string, any[]> = {};

    workbook.SheetNames.forEach((sheetName) => {
      const ws = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: null }) as any[];
      result[sheetName] = rows;
    });

    const outPath = path.join(process.cwd(), "data", "excel.json");
    
    // Ensure data directory exists
    const dataDir = path.dirname(outPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
    console.log("Successfully wrote JSON to", outPath);
  } catch (error) {
    console.error("Error processing XLSX file:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
