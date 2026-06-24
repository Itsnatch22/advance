"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

export interface GifResult {
  id: string;
  url: string;
  preview: string;
  title: string;
}

interface GifPickerProps {
  onSelect: (gif: GifResult) => void;
  onClose: () => void;
  position?: "above" | "below";
}

export function GifPicker({ onSelect, onClose, position = "above" }: GifPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gifs?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as { gifs?: GifResult[] };
      setResults(data.gifs ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search("");
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: position === "above" ? 6 : -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: position === "above" ? 6 : -6 }}
      transition={{ duration: 0.15 }}
      className={`absolute ${position === "above" ? "bottom-full mb-2" : "top-full mt-2"} left-0 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900`}
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
        <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search GIFs…"
          className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
        />
        <button
          onClick={onClose}
          className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      <div className="grid max-h-52 grid-cols-3 gap-1 overflow-y-auto p-2">
        {loading ? (
          <div className="col-span-3 flex h-28 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : results.length === 0 ? (
          <div className="col-span-3 flex h-28 items-center justify-center">
            <p className="text-xs text-slate-400">
              {query ? "No GIFs found" : "No GIF API key configured"}
            </p>
          </div>
        ) : (
          results.map((gif) => (
            <button
              key={gif.id}
              onClick={() => { onSelect(gif); onClose(); }}
              className="aspect-square overflow-hidden rounded-lg bg-slate-100 transition-opacity hover:opacity-80 dark:bg-slate-800"
            >
              <img
                src={gif.preview}
                alt={gif.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))
        )}
      </div>

      <div className="border-t border-slate-100 px-3 py-1.5 dark:border-slate-800">
        <span className="text-[10px] text-slate-300 dark:text-slate-600">
          Powered by GIPHY
        </span>
      </div>
    </motion.div>
  );
}
