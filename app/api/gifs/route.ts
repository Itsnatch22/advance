import { NextRequest, NextResponse } from "next/server";
import { publicReadLimiter, checkRateLimit } from "@/lib/security/rate-limit";

type GiphyImage = { url: string };
type GiphyItem = {
  id: string;
  title: string;
  images: {
    original: GiphyImage;
    fixed_width_small: GiphyImage;
  };
};

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(publicReadLimiter, ip);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429, headers: rl.headers });
  }

  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GIF service unavailable" }, { status: 503 });

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const endpoint = q
    ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(q)}&limit=15&rating=g&lang=en`
    : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=15&rating=g`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 60 } });
    if (!res.ok) return NextResponse.json({ gifs: [] });
    const data = (await res.json()) as { data?: GiphyItem[] };
    const gifs = (data.data ?? []).map((g) => ({
      id: g.id,
      title: g.title,
      url: g.images.original.url,
      preview: g.images.fixed_width_small.url,
    }));
    return NextResponse.json({ gifs });
  } catch {
    return NextResponse.json({ gifs: [] });
  }
}
