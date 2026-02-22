// /app/api/meta/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = (searchParams.get("country") || "KE").toUpperCase();

    const filePath = path.join(
      process.cwd(),
      "data",
      `${country.toLowerCase()}.json`
    );
    const raw = await fs.readFile(filePath, "utf8");
    const cfg = JSON.parse(raw);

    return NextResponse.json({
      success: true,
      taxBrackets: cfg.taxBrackets || [],
      deductions: cfg.deductions || [],
    });
  } catch (err: { message?: string } | unknown) {
    // 👈 FIXED HERE
    console.error("meta route error:", err);
    const errorMessage = err instanceof Error ? err.message : "server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
