"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Send, CheckCircle2, AlertCircle, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
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

function InfoCard({ 
  icon: Icon, 
  label, 
  value, 
  href 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  href?: string;
}) {
  const content = (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-green-100">{label}</p>
        <p className="text-lg font-medium text-white">{value}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a 
        href={href}
        className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/20"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
      {content}
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm"
    >
      <div className="text-4xl font-bold text-white">{value}</div>
      <div className="mt-2 text-sm text-green-100">{label}</div>
    </motion.div>
  );
}

/* ------------------------------ page ----------------------------- */

export default function SalesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
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
    // Bot detection (honeypot)
    if (data.honeypot) {
      console.log("Bot detected");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage("");

    try {
      // reCAPTCHA v3 token
      const recaptchaToken = await new Promise<string>((resolve, reject) => {
        if (typeof window === "undefined" || !(window as any).grecaptcha) {
          reject("reCAPTCHA not loaded");
          return;
        }
        (window as any).grecaptcha.ready(() => {
          (window as any).grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action: "sales_demo" })
            .then(resolve)
            .catch(reject);
        });
      });

      // Submit with reCAPTCHA token
      const submissionData = { ...data, recaptchaToken };

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        if (result.issues && Array.isArray(result.issues)) {
          const errorMessages = result.issues
            .map((issue: any) => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ');
          setErrorMessage(errorMessages);
        } else {
          setErrorMessage(result.error || result.message || "Failed to submit request. Please try again.");
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage("Network error. Please check your connection and try again.");
      console.error("Submission error:", error);
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
    <div className="relative min-h-screen bg-gray-50 dark:bg-black">

      {/* Decorative gradient background */}
      <div className="fixed inset-0 bg-linear-to-br from-green-600 via-emerald-600 to-green-700 [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)] sm:[clip-path:polygon(0_0,65%_0,100%_100%,0%_100%)]" />
      
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30 [clip-path:polygon(0_0,65%_0,100%_100%,0%_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Sales Info Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center space-y-8"
          >
            {/* Header */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                  Empower Your Team
                </span>
              </motion.div>
              
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                Unlock Financial Freedom for Your Employees
              </h1>
              
              <p className="text-lg text-green-50 md:text-xl">
                With EaziWage&apos;s earned wage access, boost productivity, reduce turnover, and enhance financial wellbeing for your workforce across Africa. Zero interest, instant disbursements.
              </p>
            </div>

            {/* Sales Info */}
            <div className="space-y-4">
              <InfoCard
                icon={Briefcase}
                label="For Businesses"
                value="Seamless Integration"
              />
              <InfoCard
                icon={Phone}
                label="Call Sales"
                value="+254 723 154900"
                href="tel:+254723154900"
              />
              <InfoCard
                icon={MapPin}
                label="Headquarters"
                value="Nairobi, Kenya"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard value="100+" label="Companies" />
              <StatCard value="0%" label="Interest" />
              <StatCard value="Instant" label="Disbursement" />
            </div>
          </motion.div>

          {/* Right: Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl bg-white p-8 shadow-2xl dark:bg-neutral-900 lg:p-10"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Request a Demo
              </h2>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Fill out the form below and our sales team will reach out within 24 hours.
              </p>
            </div>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-medium">
                    Thank you! Your request has been submitted successfully. We&apos;ll get back to you soon.
                  </p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Failed to submit request</p>
                    {errorMessage && (
                      <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot */}
              <input
                type="text"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                className="sr-only"
                {...register("honeypot")}
              />

              {/* Name */}
              <div>
                <label 
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  {...register("name")}
                  className={`w-full rounded-xl border px-4 py-3 transition focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:bg-red-900/10"
                      : "border-neutral-300 bg-white focus:border-green-500 focus:ring-green-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                  } dark:text-white`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label 
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  {...register("email")}
                  className={`w-full rounded-xl border px-4 py-3 transition focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:bg-red-900/10"
                      : "border-neutral-300 bg-white focus:border-green-500 focus:ring-green-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                  } dark:text-white`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Company */}
              <div>
                <label 
                  htmlFor="company"
                  className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Company Name
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="Your Company"
                  {...register("company")}
                  className={`w-full rounded-xl border px-4 py-3 transition focus:outline-none focus:ring-2 ${
                    errors.company
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:bg-red-900/10"
                      : "border-neutral-300 bg-white focus:border-green-500 focus:ring-green-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                  } dark:text-white`}
                />
                {errors.company && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.company.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label 
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us about your business needs..."
                  {...register("message")}
                  className={`w-full rounded-xl border px-4 py-3 transition focus:outline-none focus:ring-2 ${
                    errors.message
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:bg-red-900/10"
                      : "border-neutral-300 bg-white focus:border-green-500 focus:ring-green-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                  } dark:text-white`}
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Request Demo</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}