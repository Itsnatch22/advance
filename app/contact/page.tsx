"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { useParallax } from "@/hooks/use-parallax";

/* ----------------------------- validation ----------------------------- */

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  honeypot: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

/* ----------------------------- components ----------------------------- */

const TiltContactCard = ({
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
  const {
    rotateX,
    rotateY,
    spotlightBackground,
    handleMouseMove,
    handleMouseLeave,
  } = useParallax();

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

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 transition-transform duration-500 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white">
        <Icon className="h-6 w-6" strokeWidth={2} />
      </div>

      <div className="relative z-10">
        <p className="text-xs font-black tracking-[0.2em] text-green-600/60 uppercase">
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
    <div className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">{value}</div>
    <div className="mt-1 text-[10px] font-black tracking-[0.2em] text-green-600/60 uppercase">
      {label}
    </div>
    <div className="absolute bottom-0 left-0 h-1 w-0 bg-green-600 transition-all duration-500 group-hover:w-full" />
  </motion.div>
);

/* ------------------------------ page ----------------------------- */

export default function ContactPage() {
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
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    if (data.honeypot) return;
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    <main className="relative min-h-screen bg-white text-slate-900">
      {/* Immersive Background - consistent with other pages */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-[-10%] left-[10%]"
        />
        <FloatingOrb
          color="bg-emerald-100"
          delay={2}
          className="top-[30%] right-[5%]"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
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
                Get in Touch
              </motion.div>

              <h1 className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-7xl">
                Ready to Transform Your <span>Workforce?</span>
              </h1>

              <p className="max-w-xl text-xl leading-relaxed text-slate-500">
                Contact us for any queries about earned wage access,
                partnerships, or support. We&apos;re here to help employers and
                employees across Africa achieve financial wellbeing.
              </p>
            </div>

            <div className="max-w-md space-y-4">
              <TiltContactCard
                icon={Mail}
                label="Email us at"
                value="support@eaziwage.com"
                href="mailto:support@eaziwage.com"
              />
              <TiltContactCard
                icon={Phone}
                label="Call us at"
                value="+254 723 154900"
                href="tel:+254723154900"
              />
              <TiltContactCard
                icon={MapPin}
                label="Visit us at"
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
            className="perspective-1000 relative"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/95 p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] backdrop-blur-2xl">
              <div className="mb-10">
                <h2 className="mb-2 font-serif text-4xl font-bold tracking-tight text-slate-900">
                  Send us a Message
                </h2>
                <p className="text-lg text-slate-500">
                  Fill out the form below and we&apos;ll get back to you within
                  24 hours.
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
                        Thank you! Your message has been sent successfully.
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
                  <label htmlFor="contact-name" className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    placeholder="Your name..."
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
                  <label htmlFor="contact-email" className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Your email..."
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
                  <label htmlFor="contact-subject" className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    placeholder="Your subject..."
                    {...register("subject")}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-base transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:outline-none"
                  />
                  {errors.subject && (
                    <p className="ml-1 text-xs font-bold text-red-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Your message..."
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
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
