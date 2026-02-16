"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

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

function ContactInfo({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
        <Icon className="h-6 w-6 text-white" strokeWidth={2} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-emerald-100">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group flex items-center gap-4 rounded-xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:ring-white/20"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="group flex items-center gap-4 rounded-xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-sm">
      {content}
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-xl bg-white/5 p-6 text-center ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:ring-white/20"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-green-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="relative z-10">
        <div className="text-3xl font-bold text-white sm:text-4xl">{value}</div>
        <div className="mt-2 text-sm font-medium text-emerald-100">{label}</div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-emerald-400 to-green-400 transition-all duration-300 group-hover:w-full"></div>
    </motion.div>
  );
}

/* ------------------------------ page ----------------------------- */

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    if (data.honeypot) {
      console.log("Bot detected");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        reset();
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");

        if (result.issues && Array.isArray(result.issues)) {
          const errorMessages = result.issues
            .map((issue: any) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ");
          setErrorMessage(errorMessages);
        } else {
          setErrorMessage(
            result.error ||
              result.message ||
              "Failed to send message. Please try again."
          );
        }
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-black">
      {/* Enhanced gradient background */}
      <div className="fixed inset-0 bg-linear-to-br from-emerald-600 via-green-600 to-emerald-700 [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)] sm:[clip-path:polygon(0_0,65%_0,100%_100%,0%_100%)]" />

      {/* Enhanced pattern overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA4IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 [clip-path:polygon(0_0,65%_0,100%_100%,0%_100%)]" />

      {/* Ambient glow effects */}
      <div className="fixed top-1/4 left-0 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"></div>
      <div className="fixed right-0 bottom-1/4 h-96 w-96 rounded-full bg-green-400/20 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Enhanced Info Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center space-y-10"
          >
            {/* Header */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-white uppercase ring-1 ring-white/20 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
                  Get in Touch
                </div>
              </motion.div>

              <h1 className="font-serif text-4xl leading-[1.1] font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                Ready to Transform Your Workforce?
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-emerald-50 md:text-lg lg:text-xl">
                Contact us for any queries about earned wage access,
                partnerships, or support. We're here to help employers and
                employees across Africa achieve financial wellbeing.
              </p>
            </div>

            {/* Enhanced Contact Info */}
            <div className="space-y-4">
              <ContactInfo
                icon={Mail}
                label="Email us at"
                value="support@eaziwage.com"
                href="mailto:support@eaziwage.com"
              />
              <ContactInfo
                icon={Phone}
                label="Call us at"
                value="+254 723 154900"
                href="tel:+254723154900"
              />
              <ContactInfo
                icon={MapPin}
                label="Visit us at"
                value="Nairobi, Kenya"
              />
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard value="100+" label="Companies" />
              <StatCard value="0%" label="Interest" />
              <StatCard value="Instant" label="Disbursement" />
            </div>
          </motion.div>

          {/* Right: Enhanced Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Glow effect behind form */}
            <div className="absolute -inset-4 rounded-3xl bg-linear-to-br from-emerald-200/20 via-green-200/10 to-transparent blur-2xl"></div>

            <div className="relative rounded-3xl border border-slate-200/60 bg-white p-8 shadow-2xl ring-1 shadow-slate-900/10 ring-slate-900/5 lg:p-10 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-8">
                <h2 className="mb-2 font-serif text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Send us a Message
                </h2>
                <p className="text-base text-slate-600 dark:text-neutral-400">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>
              </div>

              {/* Enhanced Status Messages */}
              <AnimatePresence mode="wait">
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 ring-1 ring-emerald-500/10 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0"
                      strokeWidth={2}
                    />
                    <p className="text-sm leading-relaxed font-medium">
                      Thank you! Your message has been sent successfully. We'll
                      get back to you soon.
                    </p>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 ring-1 ring-red-500/10 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
                  >
                    <AlertCircle
                      className="mt-0.5 h-5 w-5 shrink-0"
                      strokeWidth={2}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        Failed to send message
                      </p>
                      {errorMessage && (
                        <p className="mt-1 text-xs leading-relaxed text-red-700 dark:text-red-400">
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
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...register("name")}
                    className={`w-full rounded-xl border px-4 py-3.5 text-base transition-all duration-200 focus:ring-2 focus:outline-none ${
                      errors.name
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:bg-red-900/10"
                        : "border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                    } dark:text-white`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    {...register("email")}
                    className={`w-full rounded-xl border px-4 py-3.5 text-base transition-all duration-200 focus:ring-2 focus:outline-none ${
                      errors.email
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:bg-red-900/10"
                        : "border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                    } dark:text-white`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="How can we help you?"
                    {...register("subject")}
                    className={`w-full rounded-xl border px-4 py-3.5 text-base transition-all duration-200 focus:ring-2 focus:outline-none ${
                      errors.subject
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:bg-red-900/10"
                        : "border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                    } dark:text-white`}
                  />
                  {errors.subject && (
                    <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    {...register("message")}
                    className={`w-full rounded-xl border px-4 py-3.5 text-base transition-all duration-200 focus:ring-2 focus:outline-none ${
                      errors.message
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:bg-red-900/10"
                        : "border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800"
                    } dark:text-white`}
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Enhanced Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" strokeWidth={2.5} />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
