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

/* ---------------- validation ---------------- */

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20),
  honeypot: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

/* ---------------- UI atoms ---------------- */

function GlowOrb({ className }: { className: string }) {
  return (
    <motion.div
      animate={{ y: [0, -30, 0] }}
      transition={{ duration: 10, repeat: Infinity }}
      className={`absolute blur-3xl opacity-30 ${className}`}
    />
  );
}

function InputField({
  id,
  label,
  register,
  error,
  ...props
}: any) {
  return (
    <div className="relative">
      <label className="mb-2 block text-sm text-neutral-400">{label}</label>

      <input
        id={id}
        {...register}
        {...props}
        className="peer w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-xl outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
      />

      <motion.div
        layoutId="input-focus"
        className="pointer-events-none absolute inset-0 rounded-xl border border-emerald-400 opacity-0 peer-focus:opacity-100"
      />

      {error && (
        <p className="mt-2 text-xs text-red-400">{error.message}</p>
      )}
    </div>
  );
}

/* ---------------- page ---------------- */

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] =
    useState<"idle" | "success" | "error">("idle");

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

    await new Promise((r) => setTimeout(r, 1500));

    setSubmitStatus("success");
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* 🌌 ambient lighting */}
      <GlowOrb className="left-[-10%] top-[-10%] h-125 w-125 bg-emerald-500" />
      <GlowOrb className="right-[-10%] bottom-[-10%] h-125 w-125 bg-green-400" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 grid gap-16 lg:grid-cols-2">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <h1 className="text-5xl font-bold leading-tight">
            Let’s build financial freedom.
          </h1>

          <p className="text-lg text-neutral-400 max-w-xl">
            Partnerships, integrations, support — our team replies fast and
            ships faster.
          </p>

          <div className="space-y-4">
            {[Mail, Phone, MapPin].map((Icon, i) => (
              <motion.div
                whileHover={{ x: 8 }}
                key={i}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <Icon className="text-emerald-400" />
                <span className="text-neutral-300">
                  Contact channel
                </span>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6">
            {["100+", "0%", "Instant"].map((stat) => (
              <motion.div
                whileHover={{ y: -6 }}
                key={stat}
                className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl"
              >
                <div className="text-3xl font-bold text-emerald-400">
                  {stat}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-500/20 to-green-400/10 blur-xl" />

          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-2xl">

            <h2 className="text-3xl font-bold mb-6">
              Send a message
            </h2>

            <AnimatePresence>
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-3 text-emerald-400"
                >
                  <CheckCircle2 /> Message sent.
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <InputField
                label="Full Name"
                id="name"
                register={register("name")}
                error={errors.name}
              />

              <InputField
                label="Email"
                id="email"
                register={register("email")}
                error={errors.email}
              />

              <InputField
                label="Subject"
                id="subject"
                register={register("subject")}
                error={errors.subject}
              />

              <div>
                <textarea
                  rows={5}
                  placeholder="Your message"
                  {...register("message")}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 font-semibold text-black"
              >
                {isSubmitting ? "Sending…" : <>Send Message <Send size={18} /></>}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
