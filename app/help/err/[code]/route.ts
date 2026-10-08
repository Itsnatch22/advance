import { NextResponse } from "next/server";
import { helpArticles } from "@/lib/help/content";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const normalized = code.toUpperCase();
  const article = helpArticles.find((entry) =>
    entry.errorCodes.some((errorCode) => errorCode.toUpperCase() === normalized),
  );

  if (!article) {
    return NextResponse.redirect(new URL("/help", request.url));
  }

  return NextResponse.redirect(
    new URL(`/help/${article.audience}/${article.slug}`, request.url),
  );
}
