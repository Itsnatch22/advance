"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

/* ------------------ Types ------------------ */
type MeetingType = {
  id: string;
  title: string;
  description?: string;
  duration: number;
  scheduling_url: string;
};

/* ------------------ Config ------------------ */
const BUSINESS_START = 9;
const BUSINESS_END = 17;
const SLOT_STEP_MINUTES = 30;

/* ------------------ Component ------------------ */
export default function SchedulePage() {
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  );

  const [mode, setMode] = useState<"user-books" | "admin-books">("user-books");
  const [meetings, setMeetings] = useState<MeetingType[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const slots = useMemo(() => {
    if (!selectedDate) return [] as { iso: string; label: string; localLabel: string }[];
    const day = new Date(selectedDate + "T00:00:00");
    return generateSlotsForDay(day, BUSINESS_START, BUSINESS_END, SLOT_STEP_MINUTES);
  }, [selectedDate]);

  /* ------------------ Initialize date ------------------ */
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(getISODate(new Date()));
    }
  }, [selectedDate]);

  /* ------------------ Fetch Calendly ------------------ */
  useEffect(() => {
    async function fetchCalendlyEvents() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/calendly-events");
        if (!res.ok) {
          throw new Error(`API responded with status ${res.status}`);
        }
        const data = await res.json();

        if (data && Array.isArray(data.collection)) {
          const collection = data.collection;
          const formatted: MeetingType[] = collection.map((e: any) => ({
            id: e.uri,
            title: e.name,
            description: e.description ?? "",
            duration: e.duration,
            scheduling_url: e.scheduling_url,
          }));
          setMeetings(formatted);
          if (formatted.length > 0) {
            setSelectedMeeting(formatted[0]);
          }
        } else {
          throw new Error("Invalid response format from Calendly API");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load meeting types";
        console.error("Calendly fetch error:", message);
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendlyEvents();
  }, []);

  /* ------------------ Handlers ------------------ */
  function handlePickSlot(slotIso: string) {
    setSelectedSlot(slotIso);
  }

  function openCalendly() {
    if (!selectedMeeting) return;

    const url = new URL(selectedMeeting.scheduling_url);
    if (name) url.searchParams.set("name", name);
    if (email) url.searchParams.set("email", email);
    if (selectedSlot) url.searchParams.set("source_slot", selectedSlot);

    // Optional param to track who booked who
    url.searchParams.set("mode", mode);

    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  /* ------------------ UI ------------------ */
  return (
    <main className="relative mx-auto max-w-5xl p-6">
      <header className="mt-10 mb-6 text-center">
        <motion.h1
          className="bg-linear-to-r from-green-600 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Schedule a Meeting
        </motion.h1>
        <p className="mt-1 text-sm opacity-80">
          Detected timezone: <strong>{timezone}</strong>
        </p>

        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-green-600/40 bg-white/5 px-3 py-2 backdrop-blur-md">
            <button
              onClick={() => setMode("user-books")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                mode === "user-books"
                  ? "bg-green-600 text-white"
                  : "text-gray-500 hover:text-green-500"
              }`}
            >
              User → EaziWage
            </button>
            <button
              onClick={() => setMode("admin-books")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
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

      {loading ? (
        <p className="text-center text-gray-500">Loading meeting types...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : meetings.length === 0 ? (
        <p className="text-center text-gray-500">No meeting types available at this time.</p>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="space-y-4">
              <div className="rounded-2xl border border-green-500/20 bg-white/10 p-4 shadow-[0_0_15px_rgba(22,163,74,0.15)] dark:bg-neutral-900/50">
                <h2 className="flex items-center gap-2 font-semibold">
                  <CalendarDays className="h-4 w-4 text-green-600" /> Your
                  Details
                </h2>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-3 w-full rounded-md border border-gray-200 p-2"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@work.com"
                  className="mt-2 w-full rounded-md border border-gray-200 p-2"
                />
              </div>

              <div className="rounded-2xl border border-green-500/20 bg-white/10 p-4 dark:bg-neutral-900/50">
                <h2 className="font-semibold">Meeting Types</h2>
                <div className="mt-3 space-y-3">
                  {meetings.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMeeting(m)}
                      className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all hover:shadow ${
                        selectedMeeting?.id === m.id
                          ? "border-green-500/60 bg-transparent"
                          : "bg-white dark:bg-neutral-900"
                      }`}
                    >
                      <div className="text-black dark:text-white">
                        <div className="font-medium">{m.title}</div>
                        <div className="text-xs opacity-70">
                          {m.duration} mins •{" "}
                          {m.description || "Calendly event"}
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
            <div className="rounded-2xl border border-green-500/20 bg-white/10 p-4 shadow-sm dark:bg-neutral-900/50">
              <h3 className="text-lg font-semibold">
                {selectedMeeting?.title || "No meeting selected"}
              </h3>
              <p className="text-sm opacity-70">
                {selectedMeeting?.description ||
                  "Select a meeting to continue."}
              </p>
              <p className="mt-1 text-xs opacity-60">
                Duration: {selectedMeeting?.duration || "—"} mins
              </p>

              <div className="mt-4">
                <label className="block text-xs opacity-80">Pick a date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-2 rounded-md border p-2"
                />

                <div className="mt-4">
                  <label className="block text-xs opacity-80">
                    Available Slots
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {slots.map((s) => (
                      <button
                        key={s.iso}
                        onClick={() => handlePickSlot(s.iso)}
                        className={`rounded-md border p-2 text-left text-sm transition-all ${
                          selectedSlot === s.iso
                            ? "bg-green-600 text-white"
                            : "bg-transparent hover:border-green-500"
                        }`}
                      >
                        <div className="font-medium">{s.label}</div>
                        <div className="text-xs opacity-60">{s.localLabel}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openCalendly}
                    className="rounded-xl bg-green-600 px-4 py-2 font-medium text-white shadow-[0_0_15px_rgba(22,163,74,0.4)] transition-all hover:shadow-[0_0_25px_rgba(22,163,74,0.6)]"
                  >
                    Schedule via Calendly
                  </motion.button>

                  <button
                    onClick={() => {
                      setSelectedSlot("");
                      setName("");
                      setEmail("");
                    }}
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-100"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* ------------------ Helpers ------------------ */
function getISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function generateSlotsForDay(
  day: Date,
  startHour: number,
  endHour: number,
  stepMinutes: number
) {
  const slots: { iso: string; label: string; localLabel: string }[] = [];
  const base = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    startHour,
    0,
    0
  );
  const end = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    endHour,
    0,
    0
  );

  for (let t = base.getTime(); t < end.getTime(); t += stepMinutes * 60000) {
    const slotDate = new Date(t);
    const iso = slotDate.toISOString();
    const label = `${pad(slotDate.getHours())}:${pad(slotDate.getMinutes())}`;
    const localLabel = slotDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    slots.push({ iso, label, localLabel });
  }

  return slots;
}
