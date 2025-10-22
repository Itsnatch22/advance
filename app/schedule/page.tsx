"use client";

import React, { useMemo, useState } from "react";

/**
 * page.tsx
 * A Next.js (app router) client page component that helps users pick a meeting type,
 * select a date + time slot, and open the corresponding Calendly scheduling page.
 *
 * How to use:
 * 1. Replace the `CALENDLY_LINK` fields in `MEETING_TYPES` with your Calendly event types.
 *    e.g. https://calendly.com/your-org/30min-consult
 * 2. Drop this file into /app/schedule/page.tsx
 * 3. Tailwind CSS required (this uses Tailwind utility classes)
 *
 * Notes:
 * - This intentionally keeps interactions simple and reliable: we open the Calendly page in a new tab
 *   and prefill `name` & `email` query params (Calendly supports these prefill keys on scheduling pages).
 * - If you want Calendly's inline popup widget instead, swap the `openCalendly` method with Calendly's
 *   popup widget JS (Calendly.initPopupWidget). Keep in mind that using that requires loading Calendly's script.
 */

type MeetingType = {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  calendlyUrl: string; // full Calendly scheduling page url for this meeting type
};

const MEETING_TYPES: MeetingType[] = [
  {
    id: "quick-15",
    title: "Quick 15 — Intro call",
    description: "Fast intro, quick questions, rapid decisions.",
    durationMinutes: 15,
    calendlyUrl: "https://calendly.com/your-org/15min", // << REPLACE THIS
  },
  {
    id: "deep-30",
    title: "Deep 30 — Problem solving",
    description: "30 minutes for a technical deep-dive or planning.",
    durationMinutes: 30,
    calendlyUrl: "https://calendly.com/your-org/30min", // << REPLACE THIS
  },
  {
    id: "strategy-60",
    title: "Strategy 60 — Roadmap & follow-ups",
    description: "Longer planning session, deliverables and next steps.",
    durationMinutes: 60,
    calendlyUrl: "https://calendly.com/your-org/60min", // << REPLACE THIS
  },
];

const BUSINESS_START = 9; // local hour (9am)
const BUSINESS_END = 17; // local hour (5pm)
const SLOT_STEP_MINUTES = 30; // generate half-hour slots

export default function SchedulePage() {
  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", []);

  const [selectedMeeting, setSelectedMeeting] = useState<MeetingType | null>(MEETING_TYPES[0]);
  const [selectedDate, setSelectedDate] = useState<string>(getISODate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const slots = useMemo(() => {
    // generate slots for selectedDate in local timezone
    const day = selectedDate ? new Date(selectedDate + "T00:00:00") : new Date();
    return generateSlotsForDay(day, BUSINESS_START, BUSINESS_END, SLOT_STEP_MINUTES);
  }, [selectedDate]);

  function handlePickSlot(slotIso: string) {
    setSelectedSlot(slotIso);
  }

  function openCalendly() {
    if (!selectedMeeting) return;

    // Build calendly URL with some prefill query params (name, email). Calendly supports these keys on scheduling pages.
    // NOTE: Calendly's query param support is stable for `name` and `email`. If you need to preselect a date/time
    // using Calendly API, consider using their widget API or passing `date` params where supported.
    const url = new URL(selectedMeeting.calendlyUrl);
    if (name) url.searchParams.set("name", name);
    if (email) url.searchParams.set("email", email);

    // If user selected a slot, also attach a `source` param that you can use in Calendly to identify the slot (optional)
    if (selectedSlot) url.searchParams.set("source_slot", selectedSlot);

    // Open in new tab
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  function quickOpen(meeting: MeetingType) {
    setSelectedMeeting(meeting);
    // open immediately without picking slot
    const url = new URL(meeting.calendlyUrl);
    if (name) url.searchParams.set("name", name);
    if (email) url.searchParams.set("email", email);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Schedule a meeting</h1>
        <p className="text-sm opacity-80 mt-1">Timezone detected: <strong>{timezone}</strong></p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="md:col-span-1">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl shadow-sm border">
              <h2 className="font-semibold">Your details</h2>
              <p className="text-xs opacity-70 mb-2">Prefill your name & email to speed up Calendly.</p>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-2 rounded-md border mt-2" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@work.com" className="w-full p-2 rounded-md border mt-2" />
            </div>

            <div className="p-4 rounded-2xl shadow-sm border">
              <h2 className="font-semibold">Meeting types</h2>
              <div className="mt-3 space-y-3">
                {MEETING_TYPES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMeeting(m)}
                    className={`w-full text-left p-3 rounded-lg border flex items-center justify-between hover:shadow ${selectedMeeting?.id === m.id ? "bg-slate-50 border-slate-300" : "bg-white"}`}
                  >
                    <div>
                      <div className="font-medium">{m.title}</div>
                      <div className="text-xs opacity-70">{m.durationMinutes} mins • {m.description}</div>
                    </div>
                    <div className="text-xs opacity-60">Book</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => quickOpen(MEETING_TYPES[0])} className="px-3 py-2 rounded bg-indigo-600 text-white text-sm">Quick book (15m)</button>
                <button onClick={() => quickOpen(MEETING_TYPES[1])} className="px-3 py-2 rounded border text-sm">Open Calendly</button>
              </div>
            </div>

            <div className="p-4 rounded-2xl shadow-sm border text-xs opacity-80">
              Pro tip: If you want an inline Calendly popup instead of opening a new tab, add Calendly's widget script
              and swap the open function to use Calendly.initPopupWidget.
            </div>
          </div>
        </aside>

        <div className="md:col-span-2">
          <div className="p-4 rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedMeeting?.title}</h3>
                <p className="text-sm opacity-70">{selectedMeeting?.description}</p>
              </div>
              <div className="text-sm opacity-70">Duration: {selectedMeeting?.durationMinutes} mins</div>
            </div>

            <div className="mt-4">
              <label className="block text-xs opacity-80">Pick a date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2 p-2 rounded-md border"
              />

              <div className="mt-4">
                <label className="block text-xs opacity-80">Available slots</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {slots.length === 0 && <div className="text-sm opacity-70">No slots for this date.</div>}
                  {slots.map((s) => (
                    <button
                      key={s.iso}
                      onClick={() => handlePickSlot(s.iso)}
                      className={`p-2 rounded-md border text-sm text-left ${selectedSlot === s.iso ? "bg-indigo-600 text-white" : "bg-white"}`}
                    >
                      <div className="font-medium">{s.label}</div>
                      <div className="text-xs opacity-60">{s.localLabel}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3 items-center">
                <button onClick={openCalendly} className="px-4 py-2 rounded bg-green-600 text-white font-medium">Schedule on Calendly</button>
                <button onClick={() => { setSelectedSlot(""); setName(""); setEmail(""); }} className="px-3 py-2 rounded border text-sm">Reset</button>
                <div className="text-xs opacity-70">We will open Calendly in a new tab with your details prefilled.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer className="mt-6 text-xs opacity-70 text-center">Made with ❤️ — swap the Calendly URLs with your event types and you're good to go.</footer>
    </main>
  );
}

/** Helpers **/

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
