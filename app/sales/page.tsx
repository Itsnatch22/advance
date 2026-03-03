"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
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

/* ----------------------------- components ----------------------------- */

const FloatingOrb = ({ color, delay, className }: { color: string; delay: number; className?: string }) => (
  <motion.div
    animate={{
      y: [0, -40, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 10 + Math.random() * 5,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className={`absolute h-125 w-125 rounded-full blur-[120px] opacity-20 ${color} ${className}`}
  />
);

const TiltInfoCard = ({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement | HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  const Content = (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY }}
      className="group relative flex items-center gap-6 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10"
    >
      <motion.div
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([mx, my]) => `radial-gradient(300px circle at ${mx}px ${my}px, rgba(255, 255, 255, 0.1), transparent 80%)`
          ),
        }}
        className="absolute inset-0 pointer-events-none rounded-3xl"
      />
      
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 transition-transform duration-500 group-hover:scale-110 group-hover:bg-white group-hover:text-green-600">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-100/60">{label}</p>
        <p className="text-lg font-bold text-white tracking-tight">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <motion.div style={{ perspective: 1000 }}>
      {href ? (
        <a href={href} className="block">{Content}</a>
      ) : (
        Content
      )}
    </motion.div>
  );
};

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.05 }}
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20"
  >
    <div className="text-3xl font-black tracking-tighter text-white sm:text-4xl">{value}</div>
    <div className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-green-100/60">{label}</div>
    <div className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-500 group-hover:w-full" />
  </motion.div>
);

/* ------------------------------ page ----------------------------- */

export default function SalesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    setErrorMessage("");

    try {
      // reCAPTCHA logic preserved from original
      const recaptchaToken = await new Promise<string>((resolve, reject) => {
        if (typeof window === "undefined" || !(window as any).grecaptcha) {
          reject("reCAPTCHA not loaded");
          return;
        }
        (window as any).grecaptcha.ready(() => {
          (window as any).grecaptcha
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

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        reset();
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || result.message || "Failed to submit request. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
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
        {/* Immersive Green Backdrop */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-green-600" />
          <div className="absolute inset-0 bg-linear-to-br from-green-500 via-green-600 to-emerald-700 sm:[clip-path:polygon(0_0,65%_0,100%_100%,0%_100%)]" />
          <FloatingOrb color="bg-green-300" delay={0} className="top-[-10%] left-[10%]" />
          <FloatingOrb color="bg-emerald-300" delay={2} className="bottom-[-10%] left-[40%]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
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
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-md"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                  Empower Your Workforce
                </motion.div>

                <h1 className="font-serif text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-7xl">
                  Unlock Financial Freedom for <span>Your Employees</span>
                </h1>

                <p className="max-w-xl text-xl leading-relaxed text-green-50/80">
                  With EaziWage&apos;s earned wage access, boost productivity,
                  reduce turnover, and enhance financial wellbeing for your
                  workforce across Africa. Zero interest, instant disbursements.
                </p>
              </div>

              <div className="space-y-4 max-w-md">
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

              <div className="grid grid-cols-3 gap-4 max-w-md">
                <StatCard value="100+" label="Companies" />
                <StatCard value="0%" label="Interest" />
                <StatCard value="Instant" label="Disbursement" />
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative perspective-1000"
            >
              <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/95 p-10 backdrop-blur-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]">
                <div className="mb-10">
                  <h2 className="mb-2 font-serif text-4xl font-bold tracking-tight text-slate-900">
                    Request a Demo
                  </h2>
                  <p className="text-lg text-slate-500">
                    Fill out the form below and our sales team will reach out
                    within 24 hours.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 overflow-hidden rounded-2xl bg-green-50 p-5 text-green-700 border border-green-100"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="shrink-0" />
                        <p className="text-sm font-bold">Thank you! Your request has been submitted successfully.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <input type="text" className="sr-only" {...register("honeypot")} />
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input
                      placeholder="Your name"
                      {...register("name")}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10"
                    />
                    {errors.name && <p className="text-xs font-bold text-red-500 ml-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      {...register("email")}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10"
                    />
                    {errors.email && <p className="text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                    <input
                      placeholder="Your Company"
                      {...register("company")}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10"
                    />
                    {errors.company && <p className="text-xs font-bold text-red-500 ml-1">{errors.company.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your business needs..."
                      {...register("message")}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10"
                    />
                    {errors.message && <p className="text-xs font-bold text-red-500 ml-1">{errors.message.message}</p>}
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
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
