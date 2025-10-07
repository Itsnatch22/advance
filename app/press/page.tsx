"use client";

import { useEffect, useState } from "react";
import { fetchNewsAxios } from "@/lib/newsapi";
import { motion } from "framer-motion";

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
};

export default function PressMediaPage() {
    const [news, setNews] = useState<Article[]>([]);
    const [query, setQuery] = useState("finance");
    const [loading, setLoading] = useState(true);

    function setArticles(articles: Article[]) {
        setNews(articles);
    }

    useEffect(() => {
        const getNews = async () => {
            const res = await fetch(`/api/news?q=kenya`);
            const data = await res.json();
            setArticles(data.articles || []);
            setLoading(false);
        };
        getNews();
    }, [query]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 text-gray-900">
            {/* Hero */}
            <div className="text-center py-20 bg-white shadow">
                <h1 className="text-5xl font-extrabold mb-4 font-mono">Press & Media</h1>
                <p className="text-gray-500">Stay updated with the latest news and stories across the financial world.</p>
            </div>

            {/* Search */}
            <div className="flex justify-center mt-10">
                <input
                    type="text"
                    placeholder="Search news..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="p-3 w-96 rounded-xl border border-gray-300 shadow"
                />
            </div>

            {/* News Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    news.map((article, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.03 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                        >
                            {article.urlToImage && (
                                <img src={article.urlToImage} alt="" className="w-full h-56 object-cover" />
                            )}
                            <div className="p-5">
                                <h2 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h2>
                                <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 font-medium mt-3 inline-block"
                                >
                                    Read More →
                                </a>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
function setArticles(arg0: any) {
    throw new Error("Function not implemented.");
}

