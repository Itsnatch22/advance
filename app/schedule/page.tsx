"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

/* ----------------------------- types ----------------------------- */

type MeetingType = {
  id: string;
  title: string;
  description?: string;
  duration: number;
  scheduling_url: string;
};

type BookingMode = "user-books" | "admin-books";

/* ----------------------------- config ----------------------------- */

const BUSINESS_START = 9;
const BUSINESS_END = 17;
const SLOT_STEP_MINUTES = 30;
const MIN_BOOKING_HOURS_AHEAD = 2; // Minimum hours in advance for booking

/* ----------------------------- helpers ----------------------------- */

function getISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function isSlotAvailable(slotDate: Date): boolean {
  const now = new Date();
  const minBookingTime = new Date(now.getTime() + MIN_BOOKING_HOURS_AHEAD * 60 * 60 * 1000);
  return slotDate >= minBookingTime;
}

function generateSlotsForDay(
  day: Date,
  startHour: number,
  endHour: number,
  stepMinutes: number
) {
  const slots: { iso: string; label: string; localLabel: string; available: boolean }[] = [];
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
    const available = isSlotAvailable(slotDate);
    slots.push({ iso, label, localLabel, available });
  }

  return slots;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ----------------------------- components ----------------------------- */

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        Loading meeting types...
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-red-900 dark:bg-red-900/20">
      <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
      <p className="mt-4 text-center text-red-800 dark:text-red-300">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}

function ModeToggle({ 
  mode, 
  onModeChange 
}: { 
  mode: BookingMode; 
  onModeChange: (mode: BookingMode) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-full border border-green-600/30 bg-white/50 p-1.5 backdrop-blur-md dark:bg-neutral-900/50">
      <button
        onClick={() => onModeChange("user-books")}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
          mode === "user-books"
            ? "bg-green-600 text-white shadow-lg"
            : "text-neutral-600 hover:text-green-600 dark:text-neutral-400"
        }`}
      >
        <User className="h-4 w-4" />
        <span>Book with EaziWage</span>
      </button>
      <button
        onClick={() => onModeChange("admin-books")}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
          mode === "admin-books"
            ? "bg-green-600 text-white shadow-lg"
            : "text-neutral-600 hover:text-green-600 dark:text-neutral-400"
        }`}
      >
        <Calendar className="h-4 w-4" />
        <span>EaziWage Books for You</span>
      </button>
    </div>
  );
}

/* ----------------------------- main component ----------------------------- */

export default function SchedulePage() {
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  );

  const [mode, setMode] = useState<BookingMode>("user-books");
  const [meetings, setMeetings] = useState<MeetingType[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    slot?: string;
  }>({});

  const today = useMemo(() => getISODate(new Date()), []);
  const maxDate = useMemo(() => {
    const max = new Date();
    max.setDate(max.getDate() + 60); // 60 days in advance
    return getISODate(max);
  }, []);

  const slots = useMemo(() => {
    if (!selectedDate) return [];
    const day = new Date(selectedDate + "T00:00:00");
    return generateSlotsForDay(day, BUSINESS_START, BUSINESS_END, SLOT_STEP_MINUTES);
  }, [selectedDate]);

  // Initialize date
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(today);
    }
  }, [selectedDate, today]);

  // Fetch Calendly meetings
  useEffect(() => {
    async function fetchCalendlyEvents() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/calendly-events");
        if (!res.ok) {
          throw new Error(`Failed to load meetings (${res.status})`);
        }
        const data = await res.json();

        if (data && Array.isArray(data.collection)) {
          const formatted: MeetingType[] = data.collection.map((e: any) => ({
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
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load meetings";
        console.error("Calendly fetch error:", err);
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendlyEvents();
  }, []);

  // Change date handler
  function changeDate(direction: 1 | -1) {
    const current = new Date(selectedDate + "T00:00:00");
    current.setDate(current.getDate() + direction);
    const newDate = getISODate(current);
    
    if (newDate >= today && newDate <= maxDate) {
      setSelectedDate(newDate);
      setSelectedSlot(""); // Reset slot selection
    }
  }

  // Validation
  function validateForm(): boolean {
    const errors: typeof validationErrors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!selectedSlot) {
      errors.slot = "Please select a time slot";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Open Calendly
  function handleSchedule() {
    if (!validateForm() || !selectedMeeting) return;

    const url = new URL(selectedMeeting.scheduling_url);
    url.searchParams.set("name", name);
    url.searchParams.set("email", email);
    url.searchParams.set("a1", selectedSlot); // Calendly custom parameter
    url.searchParams.set("booking_mode", mode);

    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  // Reset form
  function handleReset() {
    setSelectedSlot("");
    setName("");
    setEmail("");
    setValidationErrors({});
  }

  /* ----------------------------- render ----------------------------- */

  return (
    <main className="relative min-h-screen bg-gray-50 py-12 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-3 bg-linear-to-r from-green-600 to-emerald-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Schedule a Meeting
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Book a time that works best for you
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-neutral-500">
            <Clock className="h-4 w-4" />
            <span>Timezone: {timezone}</span>
          </div>

          <div className="mt-6">
            <ModeToggle mode={mode} onModeChange={setMode} />
          </div>
        </motion.header>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : meetings.length === 0 ? (
          <ErrorState message="No meeting types available at this time." />
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 lg:col-span-1"
            >
              {/* Your Details */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                  <User className="h-5 w-5 text-green-600" />
                  Your Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setValidationErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="John Doe"
                      className={`w-full rounded-lg border px-4 py-2.5 transition focus:outline-none focus:ring-2 ${
                        validationErrors.name
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-neutral-300 focus:border-green-500 focus:ring-green-500/20 dark:border-neutral-700"
                      } dark:bg-neutral-800 dark:text-white`}
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setValidationErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="john@company.com"
                      className={`w-full rounded-lg border px-4 py-2.5 transition focus:outline-none focus:ring-2 ${
                        validationErrors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-neutral-300 focus:border-green-500 focus:ring-green-500/20 dark:border-neutral-700"
                      } dark:bg-neutral-800 dark:text-white`}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Meeting Types */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
                  Meeting Types
                </h2>
                <div className="space-y-3">
                  {meetings.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMeeting(m)}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        selectedMeeting?.id === m.id
                          ? "border-green-500 bg-green-50 shadow-md dark:bg-green-900/20"
                          : "border-neutral-200 bg-white hover:border-green-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900 dark:text-white">
                            {m.title}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                            <Clock className="h-3 w-3" />
                            <span>{m.duration} minutes</span>
                          </div>
                          {m.description && (
                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                              {m.description}
                            </p>
                          )}
                        </div>
                        {selectedMeeting?.id === m.id && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                {/* Meeting Info */}
                <div className="mb-8 border-b border-neutral-200 pb-6 dark:border-neutral-800">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {selectedMeeting?.title || "No meeting selected"}
                  </h3>
                  {selectedMeeting?.description && (
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                      {selectedMeeting.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {selectedMeeting?.duration || "—"} minutes</span>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="mb-8">
                  <label className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Select Date
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => changeDate(-1)}
                      disabled={selectedDate <= today}
                      className="rounded-lg border border-neutral-300 p-2 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedSlot("");
                      }}
                      min={today}
                      max={maxDate}
                      className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                    
                    <button
                      onClick={() => changeDate(1)}
                      disabled={selectedDate >= maxDate}
                      className="rounded-lg border border-neutral-300 p-2 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    {formatDate(selectedDate)}
                  </p>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Available Time Slots
                  </label>
                  
                  {slots.filter(s => s.available).length === 0 ? (
                    <p className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
                      No available slots for this date. Please select another date.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {slots.map((s) => (
                        <button
                          key={s.iso}
                          onClick={() => {
                            if (s.available) {
                              setSelectedSlot(s.iso);
                              setValidationErrors((prev) => ({ ...prev, slot: undefined }));
                            }
                          }}
                          disabled={!s.available}
                          className={`rounded-lg border p-3 text-center transition-all ${
                            selectedSlot === s.iso
                              ? "border-green-500 bg-green-600 text-white shadow-lg"
                              : s.available
                              ? "border-neutral-300 bg-white hover:border-green-400 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                              : "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900"
                          }`}
                        >
                          <div className="font-medium">{s.label}</div>
                          <div className="mt-1 text-xs opacity-70">{s.localLabel}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {validationErrors.slot && (
                    <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.slot}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800 sm:flex-row">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSchedule}
                    disabled={!selectedMeeting || !name || !email || !selectedSlot}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Continue to Calendly</span>
                  </motion.button>

                  <button
                    onClick={handleReset}
                    className="rounded-xl border border-neutral-300 px-6 py-3.5 font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    Reset Selection
                  </button>
                </div>

                {/* Info Note */}
                <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Note:</strong> You'll be redirected to Calendly to complete your booking. 
                    All slots are shown in your local timezone ({timezone}).
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}