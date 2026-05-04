"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Script from "next/script";
import { GridSystem } from "@/components/grid";

const FloatingOrb = ({
  color,
  delay,
  className,
}: {
  color: string;
  delay: number;
  className?: string;
}) => (
  <motion.div
    animate={{ y: [0, -40, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
    transition={{
      duration: 10 + Math.random() * 5,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className={`absolute h-125 w-125 rounded-full opacity-20 blur-[120px] ${color} ${className}`}
  />
);

const CALENDLY_LINKS: Record<"user_to_admin" | "admin_to_user", string> = {
  user_to_admin:
    process.env.NEXT_PUBLIC_CALENDLY_USER_URL || "https://calendly.com/eaziwage/user-consultation?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=16a34a",
  admin_to_user:
    process.env.NEXT_PUBLIC_CALENDLY_ADMIN_URL || "https://calendly.com/eaziwage/admin-call?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=16a34a",
};

export default function SchedulePage() {
  const [meetingType, setMeetingType] = useState<
    "admin_to_user" | "user_to_admin"
  >("user_to_admin");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [calendlyError, setCalendlyError] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);

  // Initialize or re-initialize the Calendly widget
  useEffect(() => {
    if (!scriptReady || isScheduled || !embedRef.current) return;

    // Clear previous widget instance before re-mounting
    embedRef.current.innerHTML = "";

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).Calendly.initInlineWidget({
        url: CALENDLY_LINKS[meetingType],
        parentElement: embedRef.current,
        prefill: {},
        utm: {},
      });
      setCalendlyError(false);
    } catch (error) {
      console.error("Calendly initialization error:", error);
      setCalendlyError(true);
    }
  }, [scriptReady, meetingType, isScheduled]);

  // Listen for Calendly post-message events
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com" || !e.data?.event) return;

      if (e.data.event === "calendly.event_scheduled") {
        handleMeetingScheduled(e.data.payload);
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingType]);

  const handleMeetingScheduled = async (payload: any) => {
    setIsScheduled(true);

    try {
      await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: payload?.invitee?.email ?? "",
          adminEmail: "support@eaziwage.com",
          meetingType,
          calendlyEventId: payload?.event?.uuid ?? "",
          scheduledAt: payload?.event?.start_time ?? new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to log meeting:", error);
    }
  };

  const handleMeetingTypeChange = (type: "admin_to_user" | "user_to_admin") => {
    setMeetingType(type);
    // Clear embed so useEffect re-mounts cleanly
    if (embedRef.current) embedRef.current.innerHTML = "";
  };

return (
    <>
      <main
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-white"
    >
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-[-10%] left-[10%]"
        />
        <FloatingOrb
          color="bg-emerald-100"
          delay={2}
          className="right-[10%] bottom-[10%]"
        />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-40">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
          >
            <Calendar size={14} className="animate-pulse" />
            <span>Meeting Scheduler</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl"
          >
            Let&apos;s Connect and <br />
            <span className="text-green-600">Grow Together</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mx-auto mt-8 max-w-2xl text-xl text-slate-500"
          >
            Schedule a session with our team to discuss partnerships, support,
            or how EaziWage can transform your workforce.
          </motion.p>
        </div>

        {/* Meeting Type Toggle */}
        {!isScheduled && (
          <div className="mb-12 flex justify-center">
            <div className="flex rounded-2xl bg-slate-100 p-1">
              <button
                onClick={() => handleMeetingTypeChange("user_to_admin")}
                className={`rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                  meetingType === "user_to_admin"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                User to Admin
              </button>
              <button
                onClick={() => handleMeetingTypeChange("admin_to_user")}
                className={`rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                  meetingType === "admin_to_user"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Admin to User
              </button>
            </div>
          </div>
        )}

        {/* Embed Area */}
        <div className="relative mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            {isScheduled ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center rounded-[3rem] border border-slate-200 bg-white/40 py-20 text-center shadow-2xl backdrop-blur-2xl"
              >
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="mb-4 font-serif text-4xl font-bold text-slate-900">
                  Meeting Scheduled!
                </h2>
                <p className="mx-auto mb-12 max-w-md text-xl text-slate-500">
                  We&apos;ve sent a confirmation email to you. We look forward
                  to our conversation.
                </p>
                <button
                  onClick={() => setIsScheduled(false)}
                  className="flex items-center gap-3 rounded-2xl bg-slate-900 px-10 py-5 font-bold text-white shadow-2xl transition-all hover:bg-green-600"
                >
                  Schedule Another <ArrowRight size={20} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="calendly"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="overflow-hidden rounded-[3rem] border border-slate-200 bg-white/40 shadow-2xl backdrop-blur-2xl"
              >
                {/* Loading shimmer shown until script fires onReady */}
                {!scriptReady && (
                  <div className="flex h-[700px] items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
                      <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                        Loading scheduler...
                      </p>
                    </div>
                  </div>
                )}

                {/* Calendly mounts here via initInlineWidget */}
                <div
                  ref={embedRef}
                  className={`h-[700px] w-full transition-opacity duration-300 ${
                    scriptReady ? "opacity-100" : "absolute opacity-0"
                  }`}
                />
                
                {/* Error state */}
                {calendlyError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[3rem] border border-slate-200 bg-white/40 p-8 text-center backdrop-blur-2xl">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Calendar size={32} />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-slate-900">
                      Scheduler Unavailable
                    </h3>
                    <p className="mb-6 max-w-md text-slate-500">
                      The Calendly integration is not configured. Please contact support or email us directly at <a href="mailto:support@eaziwage.com" className="text-green-600 hover:text-green-700">support@eaziwage.com</a> to schedule a meeting.
                    </p>
                    <div className="rounded-lg bg-slate-100 p-4 text-left">
                      <p className="mb-2 text-sm font-semibold text-slate-700">To fix this issue:</p>
                      <ol className="list-decimal list-inside text-sm text-slate-600">
                        <li>Create Calendly event types in your account</li>
                        <li>Update environment variables with correct URLs</li>
                        <li>Ensure your Calendly account is properly configured</li>
                      </ol>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-40 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: Clock,
              title: "Flexible Timing",
              desc: "Choose a slot that works best for your schedule across all timezones.",
            },
            {
              icon: Users,
              title: "Expert Guidance",
              desc: "Talk directly with our product and partnership experts.",
            },
            {
              icon: ShieldCheck,
              title: "Secure & Private",
              desc: "All meetings are conducted through secure, encrypted video channels.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-4xl border border-slate-200/60 bg-white/40 p-8 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600 transition-transform duration-500 group-hover:scale-110">
                <item.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="leading-relaxed text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Add error handling for script loading
          setTimeout(() => {
            if (!(window as any).Calendly) {
              console.error("Calendly script failed to load properly");
              setCalendlyError(true);
            }
          }, 3000);
        }}
        onReady={() => setScriptReady(true)}
        onError={() => {
          console.error("Failed to load Calendly script");
          setCalendlyError(true);
        }}
      />
    </>
  );
}
