import axios from "axios";

// Article type definition removed for JavaScript compatibility

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

export const fetchNewsAxios = async (query) => {
  if (!NEWS_API_KEY) {
    console.error("News API key not found! Set NEXT_PUBLIC_NEWS_API_KEY in your env.");
    return [];
  }

  try {
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        apiKey: NEWS_API_KEY,
        pageSize: 6, // Chill limit, tweak if ya want more chaos
        sortBy: "publishedAt",
      },
    });

    return response.data.articles || [];
  } catch (error) {
    console.error("News fetch went sideways:", error);
    return [];
  }
};