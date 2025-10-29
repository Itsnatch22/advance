import * as XLSX from "xlsx";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "Copy of 251012_Kenya_EWA_Calculator_FINAL(1).xlsx");
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]]; // first sheet
    const data = XLSX.utils.sheet_to_json(sheet);

    // Example logic: Convert into a clean object
    // Adjust according to your Excel column names
    const rates: Record<string, number> = {};
    data.forEach((row: any) => {
      const key = row["Rate Name"] || row["Name"];
      const value = Number(row["Rate"] || row["Value"]);
      if (key && !isNaN(value)) rates[key] = value;
    });

    return NextResponse.json({ success: true, rates });
  } catch (err) {
    console.error("Error reading Excel:", err);
    return NextResponse.json({ success: false, error: "Failed to load Excel file" }, { status: 500 });
  }
}
