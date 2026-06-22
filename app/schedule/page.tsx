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
import FloatingOrb from "@/components/shared/FloatingOrb";

const CALENDLY_LINKS = {
  user_to_admin: "https://calendly.com/eaziwage/meeting",
  partner_onboarding: "https://calendly.com/eaziwage/partners",
  sales_demo: "https://calendly.com/eaziwage/sales",
} as const;

type MeetingType = keyof typeof CALENDLY_LINKS;

export default function SchedulePage() {
  const [meetingType, setMeetingType] = useState<MeetingType>("user_to_admin");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [calendlyError, setCalendlyError] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scriptReady || !embedRef.current || isScheduled) return;

    embedRef.current.innerHTML = "";

    const initWidget = (retries = 10) => {
      if (!embedRef.current) return;

      try {
        const windowWithCalendly = window as unknown as {
          Calendly?: {
            initInlineWidget: (options: {
              url: string;
              parentElement: HTMLElement;
              prefill: Record<string, unknown>;
              utm: Record<string, unknown>;
            }) => void;
          };
        };

        if (!windowWithCalendly.Calendly) {
          if (retries > 0) {
            setTimeout(() => initWidget(retries - 1), 800);
            return;
          }

          console.warn("Calendly failed to initialize after all retries");
          setCalendlyError(true);
          return;
        }

        windowWithCalendly.Calendly.initInlineWidget({
          url: CALENDLY_LINKS[meetingType],
          parentElement: embedRef.current,
          prefill: {},
          utm: {},
        });
        setCalendlyError(false);
      } catch (error) {
        console.error("Calendly initialization failed:", error);
        setCalendlyError(true);
      }
    };

    initWidget();

    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event === "calendly.event_scheduled") {
        handleMeetingScheduled(e.data.payload);
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
  }, [meetingType, scriptReady, isScheduled]);

  const handleMeetingScheduled = async (payload: {
    invitee?: { email?: string };
    event?: { uuid?: string; start_time?: string };
  }) => {
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

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-white">
        {/* Background Elements */}
        <div className="pointer-events-none fixed inset-0">
          <FloatingOrb
            color="bg-green-100"
            delay={0}
            className="-top-24 -right-24"
          />
          <FloatingOrb
            color="bg-emerald-100"
            delay={2}
            className="-bottom-24 -left-24"
          />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-40">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-40 lg:col-span-5"
            >
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book a Session</span>
                </motion.div>

                <h1 className="font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
                  Let&apos;s <span className="text-green-600">Connect</span>.
                </h1>

                <p className="text-xl leading-relaxed text-slate-500">
                  Whether you&apos;re an employer looking to modernize your
                  payroll or a potential partner, we&apos;re here to help.
                  Select a meeting type to get started.
                </p>

                <div className="grid gap-4 sm:grid-cols-1">
                  {[
                    {
                      id: "user_to_admin",
                      label: "General Inquiry",
                      icon: Users,
                      desc: "General questions about EaziWage",
                    },
                    {
                      id: "sales_demo",
                      label: "Sales Demo",
                      icon: ShieldCheck,
                      desc: "For employers looking for a custom walkthrough",
                    },
                    {
                      id: "partner_onboarding",
                      label: "Partner Onboarding",
                      icon: Clock,
                      desc: "For potential financial or tech partners",
                    },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setMeetingType(type.id as MeetingType)}
                      className={`group relative flex items-start gap-4 rounded-3xl border p-6 text-left transition-all duration-300 ${
                        meetingType === type.id
                          ? "border-green-500 bg-green-50/50 shadow-lg shadow-green-500/10"
                          : "border-slate-200 bg-white/40 hover:border-green-500/50 hover:bg-white/60"
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 ${
                          meetingType === type.id
                            ? "bg-green-600 text-white"
                            : "bg-slate-100 text-slate-400 group-hover:bg-green-100 group-hover:text-green-600"
                        }`}
                      >
                        <type.icon className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3
                          className={`font-bold transition-colors ${meetingType === type.id ? "text-green-900" : "text-slate-900"}`}
                        >
                          {type.label}
                        </h3>
                        <p className="text-sm text-slate-500">{type.desc}</p>
                      </div>
                      {meetingType === type.id && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute top-6 right-6"
                        >
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Content: Calendly Embed */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div className="relative rounded-[3rem] border border-slate-200 bg-white/40 p-2 shadow-2xl backdrop-blur-3xl">
                <AnimatePresence mode="wait">
                  {isScheduled ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex min-h-150 flex-col items-center justify-center p-12 text-center"
                    >
                      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle2 className="h-12 w-12" />
                      </div>
                      <h2 className="mb-4 font-serif text-4xl font-bold text-slate-900">
                        Meeting Confirmed!
                      </h2>
                      <p className="mb-8 text-xl text-slate-500">
                        We&apos;ve sent a calendar invitation to your email. We
                        look forward to speaking with you.
                      </p>
                      <button
                        onClick={() => setIsScheduled(false)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white transition-all hover:bg-green-600"
                      >
                        Schedule Another
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="embed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative min-h-150 w-full overflow-hidden rounded-[2.5rem] bg-white"
                    >
                      {(!scriptReady || calendlyError) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
                          {calendlyError ? (
                            <>
                              <p className="mb-4 text-slate-500">
                                Failed to load the scheduler.
                              </p>
                              <button
                                onClick={() => window.location.reload()}
                                className="text-sm font-bold text-green-600 hover:underline"
                              >
                                Try Refreshing
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
                              <p className="text-slate-400">
                                Loading scheduler...
                              </p>
                            </>
                          )}
                        </div>
                      )}
                      <div
                        ref={embedRef}
                        className="calendly-inline-widget h-full w-full"
                        style={{ minHeight: "600px" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="mt-8 text-center text-sm text-slate-400">
                Secure scheduling powered by{" "}
                <span className="font-bold text-slate-600">Calendly</span>
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <link
        rel="stylesheet"
        href="https://assets.calendly.com/assets/external/widget.css"
      />
      {/* FIX 3: onLoad + 300ms buffer instead of onReady — gives Calendly time to attach to window */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={() => {
          setTimeout(() => {
            setScriptReady(true);
            setCalendlyError(false);
          }, 300);
        }}
        onError={() => {
          console.error("Failed to load Calendly script");
          setCalendlyError(true);
        }}
      />
    </>
  );
}
