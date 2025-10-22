"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

type MeetingType = {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  calendlyUrlUser: string; // when user books EaziWage
  calendlyUrlAdmin: string; // when EaziWage books user
};

const MEETING_TYPES: MeetingType[] = [
  {
    id: "quick-15",
    title: "Quick 15 — Intro Call",
    description: "A short sync for introductions or quick updates.",
    durationMinutes: 15,
    calendlyUrlUser: "https://calendly.com/your-org/15min",
    calendlyUrlAdmin: "https://calendly.com/your-team/15min",
  },
  {
    id: "deep-30",
    title: "Deep 30 — Problem Solving",
    description: "30 minutes for technical or product deep dives.",
    durationMinutes: 30,
    calendlyUrlUser: "https://calendly.com/your-org/30min",
    calendlyUrlAdmin: "https://calendly.com/your-team/30min",
  },
  {
    id: "strategy-60",
    title: "Strategy 60 — Roadmap & Planning",
    description: "An hour for roadmap reviews, strategy, and follow-ups.",
    durationMinutes: 60,
    calendlyUrlUser: "https://calendly.com/your-org/60min",
    calendlyUrlAdmin: "https://calendly.com/your-team/60min",
  },
];

const BUSINESS_START = 9;
const BUSINESS_END = 17;
const SLOT_STEP_MINUTES = 30;

export default function SchedulePage() {
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  );

  const [mode, setMode] = useState<"user-books" | "admin-books">("user-books");
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingType | null>(
    MEETING_TYPES[0]
  );
  const [selectedDate, setSelectedDate] = useState<string>(getISODate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const slots = useMemo(() => {
    const day = selectedDate ? new Date(selectedDate + "T00:00:00") : new Date();
    return generateSlotsForDay(day, BUSINESS_START, BUSINESS_END, SLOT_STEP_MINUTES);
  }, [selectedDate]);

  const handlePickSlot = (slotIso: string) => setSelectedSlot(slotIso);

  function openCalendly() {
    if (!selectedMeeting) return;

    const url = new URL(
      mode === "user-books"
        ? selectedMeeting.calendlyUrlUser
        : selectedMeeting.calendlyUrlAdmin
    );
    if (name) url.searchParams.set("name", name);
    if (email) url.searchParams.set("email", email);
    if (selectedSlot) url.searchParams.set("source_slot", selectedSlot);

    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <main className="p-6 max-w-5xl mx-auto relative">
      <header className="mb-6 mt-15 text-center">
        <motion.h1
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Schedule a Meeting
        </motion.h1>
        <p className="text-sm opacity-80 mt-1">
          Detected timezone: <strong>{timezone}</strong>
        </p>

        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-3 rounded-full border border-green-600/40 px-3 py-2 bg-white/5 backdrop-blur-md">
            <button
              onClick={() => setMode("user-books")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                mode === "user-books"
                  ? "bg-green-600 text-white"
                  : "text-gray-500 hover:text-green-500"
              }`}
            >
              User → EaziWage
            </button>
            <button
              onClick={() => setMode("admin-books")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                mode === "admin-books"
                  ? "bg-green-600 text-white"
                  : "text-gray-500 hover:text-green-500"
              }`}
            >
              EaziWage → User
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/10 dark:bg-neutral-900/50 border border-green-500/20 shadow-[0_0_15px_rgba(22,163,74,0.15)]">
              <h2 className="font-semibold flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-green-600" /> Your Details
              </h2>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full p-2 rounded-md border border-gray-200 mt-3"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@work.com"
                className="w-full p-2 rounded-md border border-gray-200 mt-2"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/10 dark:bg-neutral-900/50 border border-green-500/20">
              <h2 className="font-semibold">Meeting Types</h2>
              <div className="mt-3 space-y-3">
                {MEETING_TYPES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMeeting(m)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between hover:shadow ${
                      selectedMeeting?.id === m.id
                        ? "bg-green-50 border-green-500/60"
                        : "bg-white dark:bg-neutral-900"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{m.title}</div>
                      <div className="text-xs opacity-70">
                        {m.durationMinutes} mins • {m.description}
                      </div>
                    </div>
                    <div className="text-xs opacity-60">Select</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Panel */}
        <div className="md:col-span-2">
          <div className="p-4 rounded-2xl bg-white/10 dark:bg-neutral-900/50 border border-green-500/20 shadow-sm">
            <h3 className="text-lg font-semibold">
              {selectedMeeting?.title}
            </h3>
            <p className="text-sm opacity-70">{selectedMeeting?.description}</p>
            <p className="text-xs opacity-60 mt-1">
              Duration: {selectedMeeting?.durationMinutes} mins
            </p>

            <div className="mt-4">
              <label className="block text-xs opacity-80">Pick a date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2 p-2 rounded-md border"
              />

              <div className="mt-4">
                <label className="block text-xs opacity-80">
                  Available Slots
                </label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.iso}
                      onClick={() => handlePickSlot(s.iso)}
                      className={`p-2 rounded-md border text-sm text-left transition-all ${
                        selectedSlot === s.iso
                          ? "bg-green-600 text-white"
                          : "bg-white hover:bg-green-50"
                      }`}
                    >
                      <div className="font-medium">{s.label}</div>
                      <div className="text-xs opacity-60">{s.localLabel}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3 items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openCalendly}
                  className="px-4 py-2 rounded-xl bg-green-600 text-white font-medium shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:shadow-[0_0_25px_rgba(22,163,74,0.6)] transition-all"
                >
                  Schedule via Calendly
                </motion.button>

                <button
                  onClick={() => {
                    setSelectedSlot("");
                    setName("");
                    setEmail("");
                  }}
                  className="px-3 py-2 rounded-lg border text-sm hover:bg-neutral-100"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-8 text-xs opacity-60 text-center">
        Made with 💚 by EaziWage — integrate your own Calendly URLs to go live.
      </footer>
    </main>
  );
}

/* ---------------- Helpers ---------------- */
function getISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function generateSlotsForDay(day: Date, startHour: number, endHour: number, stepMinutes: number) {
  const slots: { iso: string; label: string; localLabel: string }[] = [];
  const base = new Date(day.getFullYear(), day.getMonth(), day.getDate(), startHour, 0, 0);
  const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), endHour, 0, 0);

  for (let t = base.getTime(); t < end.getTime(); t += stepMinutes * 60000) {
    const slotDate = new Date(t);
    const iso = slotDate.toISOString();
    const label = `${pad(slotDate.getHours())}:${pad(slotDate.getMinutes())}`;
    const localLabel = slotDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    slots.push({ iso, label, localLabel });
  }

  return slots;
}
