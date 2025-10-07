import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "kenya";

  const url = `https://newsapi.org/v2/everything`;

  try {
    const { data } = await axios.get(url, {
      params: {
        q: query,
        apiKey: process.env.NEWS_API_KEY,
        pageSize: 6,
        sortBy: "publishedAt",
      },
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Server-side NewsAPI error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch news" }), { status: 500 });
  }
}
