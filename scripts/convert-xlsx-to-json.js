// scripts/convert-xlsx-to-json.js
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const infile = process.argv[2];
if (!infile) {
  console.error("Usage: node convert-xlsx-to-json.js PATH_TO_XLSX");
  process.exit(1);
}

const workbook = XLSX.readFile(infile, {
  cellDates: true,
  cellNF: false,
  cellText: false,
});
// We'll convert each sheet to an array of objects (first row headers)
const result = {};

workbook.SheetNames.forEach((sheetName) => {
  const ws = workbook.Sheets[sheetName];
  // convert to JSON rows
  const rows = XLSX.utils.sheet_to_json(ws, { defval: null }); // defval ensures missing cells are null
  result[sheetName] = rows;
});

// Also export raw named ranges if you used them (optional)
const outPath = path.join(process.cwd(), "data", "excel.json");
fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
console.log("Wrote", outPath);
