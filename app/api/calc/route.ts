import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { calculateSalary } from "@/lib/calc";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const filePath = path.join(process.cwd(), "data", "excel.json");

    if (!fs.existsSync(filePath)) {
      console.error("excel.json missing at", filePath);
      return NextResponse.json({
        success: false,
        error: "excel.json missing"
      }, { status: 500 });
    }

    const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const result = calculateSalary(body, json);

    // ✅ Success response (add this before the catch)
   console.log("🔥 Backend result:", result);
    return NextResponse.json({
      success: true,
      ...result,
    });

  } catch (err) {
    // ✅ This is the catch block you're asking about — paste here
    console.error("Server calc failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      success: false,
      error: "Calculation failed",
      detail: message,
    }, { status: 500 });
  }
}
