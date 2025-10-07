"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Article {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  urlToImage?: string;
}

interface NewsResponse {
  articles: Article[];
}

export default function NewsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "kenya";
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("API went rogue 😤");
        const data: NewsResponse = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError("Failed to fetch—blame the news gods? Try refreshing.");
        console.error("News fetch flop:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 text-center">
        <p className="text-gray-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-white px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl lg:text-5xl font-bold mb-10 text-center border-b border-green-600/40 pb-4 font-serif mt-12 text-black"
      >
        Latest Buzz in{" "}
        <span className="text-green-500 italic">&quot;{query}&quot;</span> 🗞️
      </motion.h1>

      {articles.length === 0 ? (
        <p className="text-gray-400 text-center">
          No headlines today—too peaceful, innit? 😴
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-green-700/20 hover:border-green-400/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-500"
            >
              {article.urlToImage && (
                <Image
                  width={120}
                  height={60}
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-52 object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              )}
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-green-400">
                    {article.title}
                  </h2>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {article.description}
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{new Date(article.publishedAt).toLocaleDateString("en-GB")}</span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-400 transition-colors"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
