"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Zap, TrendingUp } from "lucide-react";

interface CountryStats {
  name: string;
  users: string;
  transactions: string;
  growth: string;
  activePartners: number;
  coordinates: { x: string; y: string };
}

const impactData: CountryStats[] = [
  {
    name: "Kenya",
    users: "25,000+",
    transactions: "1.2M",
    growth: "+24%",
    activePartners: 45,
    coordinates: { x: "72%", y: "42%" },
  },
  {
    name: "Uganda",
    users: "12,000+",
    transactions: "450K",
    growth: "+18%",
    activePartners: 28,
    coordinates: { x: "48%", y: "38%" },
  },
  {
    name: "Tanzania",
    users: "8,000+",
    transactions: "280K",
    growth: "+15%",
    activePartners: 22,
    coordinates: { x: "62%", y: "72%" },
  },
  {
    name: "Rwanda",
    users: "5,000+",
    transactions: "150K",
    growth: "+32%",
    activePartners: 15,
    coordinates: { x: "38%", y: "62%" },
  },
];

export default function ImpactMap() {
  const [hoveredCountry, setHoveredCountry] = useState<CountryStats | null>(null);

  return (
    <div className="relative w-full aspect-square md:aspect-video max-w-5xl mx-auto bg-slate-50/50 rounded-[3rem] border border-slate-200/60 overflow-hidden shadow-inner">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
      
      {/* Abstract East Africa Map Placeholder (Simplified SVG) */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <svg
          viewBox="0 0 800 800"
          className="w-full h-full text-slate-200 fill-current drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simplified shape of East Africa region */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M400,100 L550,150 L650,300 L700,500 L600,700 L450,750 L300,700 L200,550 L150,350 L250,150 Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      </div>

      {/* Interactive Pulses */}
      {impactData.map((country) => (
        <div
          key={country.name}
          className="absolute"
          style={{ left: country.coordinates.x, top: country.coordinates.y }}
          onMouseEnter={() => setHoveredCountry(country)}
          onMouseLeave={() => setHoveredCountry(null)}
        >
          <div className="relative flex items-center justify-center">
            {/* Pulse Rings */}
            <motion.div
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute h-12 w-12 rounded-full bg-green-500/30"
            />
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
              className="absolute h-8 w-8 rounded-full bg-green-500/40"
            />
            
            {/* Core Dot */}
            <motion.div 
              whileHover={{ scale: 1.2 }}
              className="relative h-4 w-4 rounded-full bg-green-600 border-2 border-white shadow-lg cursor-pointer"
            />

            {/* Country Label (Static) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/80 px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">
                {country.name}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Glassmorphic Tooltip */}
      <AnimatePresence>
        {hoveredCountry && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-8 left-8 right-8 md:left-auto md:right-8 md:w-80 z-20"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-2xl shadow-2xl">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-green-500/10 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-500/20">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{hoveredCountry.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-600">Regional Impact</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Users className="h-3 w-3" /> Active Users
                    </p>
                    <p className="text-lg font-black text-slate-900">{hoveredCountry.users}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Zap className="h-3 w-3" /> Transactions
                    </p>
                    <p className="text-lg font-black text-slate-900">{hoveredCountry.transactions}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <TrendingUp className="h-3 w-3" /> Monthly Growth
                    </p>
                    <p className="text-lg font-black text-green-600">{hoveredCountry.growth}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Zap className="h-3 w-3" /> Partners
                    </p>
                    <p className="text-lg font-black text-slate-900">{hoveredCountry.activePartners}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute top-8 left-8 hidden md:block">
        <div className="rounded-2xl border border-white/20 bg-white/40 p-4 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Active Node</span>
          </div>
          <p className="text-xs text-slate-400 max-w-[140px]">Real-time infrastructure visualization across East Africa.</p>
        </div>
      </div>
    </div>
  );
}
