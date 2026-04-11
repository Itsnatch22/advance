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
    className={`absolute h-125 w-125 rounded-full blur-[120px] opacity-20 ${color} ${className}`}
  />
);

const CALENDLY_LINKS: Record<"user_to_admin" | "admin_to_user", string> = {
  user_to_admin:
    "https://calendly.com/eaziwage/user-consultation?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=16a34a",
  admin_to_user:
    "https://calendly.com/eaziwage/admin-call?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=16a34a",
};

export default function SchedulePage() {
  const [meetingType, setMeetingType] = useState<
    "admin_to_user" | "user_to_admin"
  >("user_to_admin");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);

  // Initialize or re-initialize the Calendly widget
  useEffect(() => {
    if (!scriptReady || isScheduled || !embedRef.current) return;

    // Clear previous widget instance before re-mounting
    embedRef.current.innerHTML = "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Calendly.initInlineWidget({
      url: CALENDLY_LINKS[meetingType],
      parentElement: embedRef.current,
      prefill: {},
      utm: {},
    });
  }, [scriptReady, meetingType, isScheduled]);

  // Listen for Calendly post-message events
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (
        e.origin !== "https://calendly.com" ||
        !e.data?.event
      )
        return;

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
    <main
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-white"
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-[-10%] left-[10%]"
        />
        <FloatingOrb
          color="bg-emerald-100"
          delay={2}
          className="bottom-[10%] right-[10%]"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-24 lg:pt-48 lg:pb-40">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
          >
            <Calendar size={14} className="animate-pulse" />
            <span>Meeting Scheduler</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl"
          >
            Let&apos;s Connect and <br />
            <span className="text-green-600">Grow Together</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-8 max-w-2xl mx-auto text-xl text-slate-500"
          >
            Schedule a session with our team to discuss partnerships, support,
            or how EaziWage can transform your workforce.
          </motion.p>
        </div>

        {/* Meeting Type Toggle */}
        {!isScheduled && (
          <div className="flex justify-center mb-12">
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => handleMeetingTypeChange("user_to_admin")}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  meetingType === "user_to_admin"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                User to Admin
              </button>
              <button
                onClick={() => handleMeetingTypeChange("admin_to_user")}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
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
                className="flex flex-col items-center justify-center py-20 text-center bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-slate-200 shadow-2xl"
              >
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
                  Meeting Scheduled!
                </h2>
                <p className="text-xl text-slate-500 max-w-md mx-auto mb-12">
                  We&apos;ve sent a confirmation email to you. We look forward
                  to our conversation.
                </p>
                <button
                  onClick={() => setIsScheduled(false)}
                  className="px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-2xl flex items-center gap-3"
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
                className="overflow-hidden rounded-[3rem] border border-slate-200 bg-white/40 backdrop-blur-2xl shadow-2xl"
              >
                {/* Loading shimmer shown until script fires onReady */}
                {!scriptReady && (
                  <div className="flex items-center justify-center h-[700px]">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Loading scheduler...
                      </p>
                    </div>
                  </div>
                )}

                {/* Calendly mounts here via initInlineWidget */}
                <div
                  ref={embedRef}
                  className={`w-full h-[700px] transition-opacity duration-300 ${
                    scriptReady ? "opacity-100" : "opacity-0 absolute"
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8">
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
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/*
        strategy="afterInteractive" ensures the DOM is ready before Calendly
        script runs. onReady fires once the script has fully executed,
        at which point we call initInlineWidget safely.
      */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
    </main>
  );
}