"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  Mail,
  User,
  Phone,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

/* ----------------------------- validation ----------------------------- */

const partnerFormSchema = z.object({
  partnerType: z.enum(["banking", "enterprise", "technology"], {
    message: "Please select a partner type",
  }),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Please specify your industry"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  jobTitle: z.string().min(2, "Please enter your job title"),
  companySize: z.enum(["1-50", "51-200", "201-1000", "1001-5000", "5000+"], {
    message: "Please select company size",
  }),
  message: z
    .string()
    .min(20, "Please provide more details (at least 20 characters)"),
});

type PartnerFormData = z.infer<typeof partnerFormSchema>;

/* ----------------------------- components ----------------------------- */

function FormField({
  label,
  error,
  icon: Icon,
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {Icon && <Icon className="h-4 w-4 text-emerald-600" />}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

/* ------------------------------ page ----------------------------- */

export default function PartnerOnboardingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
  });

  const onSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/partners/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-green-50 py-24 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950">
        <div className="mx-auto max-w-2xl px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-white p-12 text-center shadow-2xl dark:bg-neutral-900"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </motion.div>

            <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white">
              Thank you for your interest!
            </h2>

            <p className="mb-8 text-neutral-600 dark:text-neutral-400">
              We've received your partnership application. Our team will review
              it and get back to you within 2-3 business days.
            </p>

            <button
              onClick={() => setIsSuccess(false)}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
            >
              Submit another application
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-green-50 py-24 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-neutral-900 sm:text-5xl dark:text-white">
            Partner with <span className="text-emerald-600">EaziWage</span>
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Join us in revolutionizing financial wellbeing for Africa's
            workforce
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl bg-white p-8 shadow-2xl sm:p-12 dark:bg-neutral-900"
        >
          <div className="space-y-8">
            {/* Partner Type */}
            <FormField
              label="I'm interested in partnering as a"
              error={errors.partnerType?.message}
              icon={Briefcase}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: "banking", label: "Banking Institution" },
                  { value: "enterprise", label: "Enterprise Employer" },
                  { value: "technology", label: "Technology Provider" },
                ].map((type) => (
                  <label
                    key={type.value}
                    className="group relative cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={type.value}
                      {...register("partnerType")}
                      className="peer sr-only"
                    />
                    <div className="rounded-xl border-2 border-neutral-200 bg-white p-4 text-center transition peer-checked:border-emerald-600 peer-checked:bg-emerald-50 hover:border-emerald-300 dark:border-neutral-700 dark:bg-neutral-800 dark:peer-checked:border-emerald-600 dark:peer-checked:bg-emerald-900/20">
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {type.label}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </FormField>

            {/* Company Info */}
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                label="Company Name"
                error={errors.companyName?.message}
                icon={Building2}
              >
                <input
                  type="text"
                  {...register("companyName")}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="Acme Corporation"
                />
              </FormField>

              <FormField label="Industry" error={errors.industry?.message}>
                <input
                  type="text"
                  {...register("industry")}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="E.g., Retail, Banking, Tech"
                />
              </FormField>
            </div>

            {/* Contact Info */}
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                label="Contact Name"
                error={errors.contactName?.message}
                icon={User}
              >
                <input
                  type="text"
                  {...register("contactName")}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="John Doe"
                />
              </FormField>

              <FormField label="Job Title" error={errors.jobTitle?.message}>
                <input
                  type="text"
                  {...register("jobTitle")}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="Head of Partnerships"
                />
              </FormField>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                label="Email Address"
                error={errors.email?.message}
                icon={Mail}
              >
                <input
                  type="email"
                  {...register("email")}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="john@company.com"
                />
              </FormField>

              <FormField
                label="Phone Number"
                error={errors.phone?.message}
                icon={Phone}
              >
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="+254 712 345 678"
                />
              </FormField>
            </div>

            {/* Company Size */}
            <FormField
              label="Company Size (Employees)"
              error={errors.companySize?.message}
            >
              <select
                {...register("companySize")}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="">Select company size</option>
                <option value="1-50">1-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1,000 employees</option>
                <option value="1001-5000">1,001-5,000 employees</option>
                <option value="5000+">5,000+ employees</option>
              </select>
            </FormField>

            {/* Message */}
            <FormField
              label="Tell us about your partnership interest"
              error={errors.message?.message}
            >
              <textarea
                {...register("message")}
                rows={5}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                placeholder="How would you like to partner with EaziWage? What value can we create together?"
              />
            </FormField>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Partnership Application"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
