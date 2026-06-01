"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Script from "next/script";

/* ----------------------------- validation ----------------------------- */

const salesSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(3, "Company name must be at least 3 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  honeypot: z.string().optional(),
});

type SalesFormData = z.infer<typeof salesSchema>;

import { useParallax } from "@/hooks/use-parallax";

const TiltInfoCard = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) => {
  const { rotateX, rotateY, spotlightBackground, handleMouseMove, handleMouseLeave } = useParallax();

  const Content = (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY }}
      className="group relative flex items-center gap-6 rounded-3xl border border-slate-200/60 bg-white/40 p-6 backdrop-blur-xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10"
    >
      <motion.div
        style={{
          background: spotlightBackground,
        }}
        className="pointer-events-none absolute inset-0 rounded-3xl"
      />

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 transition-transform duration-500 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-black tracking-[0.2em] text-green-600/60 uppercase">
          {label}
        </p>
        <p className="text-lg font-bold tracking-tight text-slate-900">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <motion.div style={{ perspective: 1000 }}>
      {href ? (
        <a href={href} className="block">
          {Content}
        </a>
      ) : (
        Content
      )}
    </motion.div>
  );
};

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.05 }}
    className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/40 p-6 text-center backdrop-blur-xl transition-all duration-300 hover:border-slate-300/60 hover:bg-white/60"
  >
    <div className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl" dangerouslySetInnerHTML={{ __html: value }} />
    <div className="mt-1 text-[10px] font-black tracking-[0.2em] text-green-600/60 uppercase">
      {label}
    </div>
    <div className="absolute bottom-0 left-0 h-1 w-0 bg-green-600 transition-all duration-500 group-hover:w-full" />
  </motion.div>
);

/* ------------------------------ page ----------------------------- */

export default function SalesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const [employerCount, setEmployerCount] = useState<number | null>(null);

    useEffect(() => {
      fetch("/api/contact")
        .then(r => r.json())
        .then(d => setEmployerCount(d.count))
        .catch(() => {});
    }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SalesFormData>({
    resolver: zodResolver(salesSchema),
  });

  const onSubmit = async (data: SalesFormData) => {
    if (data.honeypot) return;
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // reCAPTCHA logic preserved from original
      const recaptchaToken = await new Promise<string>((resolve, reject) => {
        const windowWithRecaptcha = window as unknown as {
          grecaptcha: {
            ready: (cb: () => void) => void;
            execute: (siteKey: string, options: { action: string }) => Promise<string>;
          };
        };
        if (typeof window === "undefined" || !windowWithRecaptcha.grecaptcha) {
          reject("reCAPTCHA not loaded");
          return;
        }
        windowWithRecaptcha.grecaptcha.ready(() => {
          windowWithRecaptcha.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
              action: "sales_demo",
            })
            .then(resolve)
            .catch(reject);
        });
      });

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />
      <main className="relative min-h-screen overflow-hidden bg-white">
        {/* Simple Background - consistent with other pages */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-0 right-[-10%] h-200 w-200 rounded-full bg-green-50/50 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] h-150 w-150 rounded-full bg-emerald-50/50 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-40">
          <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
            {/* Left Side: Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
                  Empower Your Workforce
                </motion.div>

                <h1 className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-7xl">
                  Unlock Financial Freedom for <span>Your Employees</span>
                </h1>

                <p className="max-w-xl text-xl leading-relaxed text-slate-500">
                  With EaziWage&apos;s earned wage access, boost productivity,
                  reduce turnover, and enhance financial wellbeing for your
                  workforce across Africa. Zero interest, instant disbursements.
                </p>
              </div>

              <div className="max-w-md space-y-4">
                <TiltInfoCard
                  icon={Briefcase}
                  label="For Businesses"
                  value="Seamless Integration"
                />
                <TiltInfoCard
                  icon={Phone}
                  label="Call Sales"
                  value="+254 723 154900"
                  href="tel:+254723154900"
                />
                <TiltInfoCard
                  icon={MapPin}
                  label="Headquarters"
                  value="Nairobi, Kenya"
                />
              </div>

              <div className="grid max-w-md grid-cols-3 gap-4">
                <StatCard value={`${employerCount ?? "..."}+`} label="Companies" />
                <StatCard value="0%" label="Interest" />
                <StatCard value="24/7" label="Instant Disbursement" />
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8 rounded-[3rem] bg-white/40 p-12 backdrop-blur-3xl shadow-2xl lg:p-16"
            >
              <div className="space-y-6">
                <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  Get Your Custom <span className="text-green-600">Demo</span>
                </h2>
                <p className="text-xl leading-relaxed text-slate-500">
                  Response within 24 hours.
                </p>
              </div>

                <AnimatePresence mode="wait">
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 overflow-hidden rounded-2xl border border-green-100 bg-green-50 p-5 text-green-700"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="shrink-0" />
                        <p className="text-sm font-bold">
                          Thank you! Your request has been submitted
                          successfully.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <input
                    type="text"
                    className="sr-only"
                    {...register("honeypot")}
                  />

                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                      Full Name
                    </label>
                    <input
                      placeholder="Your name"
                      {...register("name")}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:outline-none"
                    />
                    {errors.name && (
                      <p className="ml-1 text-xs font-bold text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      {...register("email")}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:outline-none"
                    />
                    {errors.email && (
                      <p className="ml-1 text-xs font-bold text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                      Company Name
                    </label>
                    <input
                      placeholder="Your Company"
                      {...register("company")}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:outline-none"
                    />
                    {errors.company && (
                      <p className="ml-1 text-xs font-bold text-red-500">
                        {errors.company.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your business needs..."
                      {...register("message")}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:outline-none"
                    />
                    {errors.message && (
                      <p className="ml-1 text-xs font-bold text-red-500">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 text-lg font-bold text-white shadow-2xl transition-all hover:bg-green-600 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Request Demo</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
      </main>
    </>
  );
}
