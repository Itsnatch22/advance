"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { z } from "zod";
import {
  Building2,
  Mail,
  User,
  Phone,
  Briefcase,
  CheckCircle2,
} from "lucide-react";



const partnerFormSchema = z.object({
  partnerType: z.enum(["banking", "enterprise", "technology", "investor", "suppliers", "others"], {
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
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {Icon && <Icon className="h-4 w-4 text-emerald-700" />}
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}



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
      const response = await fetch("/api/partners/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-white px-4 py-16 text-slate-900 sm:px-6 sm:py-20 dark:bg-neutral-950 dark:text-white">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/40"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </motion.div>

            <h2 className="mb-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              Thank you for your interest!
            </h2>

            <p className="mb-7 text-base leading-relaxed text-slate-600 dark:text-slate-400">
              We've received your partnership application. Our team will review
              it and get back to you within 2-3 business days.
            </p>

            <button
              onClick={() => setIsSuccess(false)}
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              Submit another application
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-16 text-slate-900 sm:px-6 sm:py-20 dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto max-w-5xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 max-w-3xl"
        >
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase">
            Partner application
          </p>
          <h1 className="font-serif text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Partner with <span className="text-emerald-700">EaziWage</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
            Join us in revolutionizing financial wellbeing for Africa's
            workforce
          </p>
        </motion.div>

        
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-9 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="space-y-6">
            
            <FormField
              label="I'm interested in partnering as a"
              error={errors.partnerType?.message}
              icon={Briefcase}
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { value: "banking", label: "Banking Institution" },
                  { value: "enterprise", label: "Enterprise Employer" },
                  { value: "technology", label: "Technology Provider" },
                  { value: "investor", label: "Investor" },
                  { value: "suppliers", label: "Suppliers" },
                  { value: "others", label: "Others" },
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
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center transition-colors peer-checked:border-emerald-700 peer-checked:bg-emerald-50 hover:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-600/20 dark:border-neutral-700 dark:bg-neutral-800 dark:peer-checked:border-emerald-600 dark:peer-checked:bg-emerald-900/20">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {type.label}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </FormField>

            
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Company Name"
                error={errors.companyName?.message}
                icon={Building2}
              >
                <input
                  type="text"
                  {...register("companyName")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="Your company name"
                />
              </FormField>

              <FormField label="Industry" error={errors.industry?.message}>
                <input
                  type="text"
                  {...register("industry")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="E.g., Retail, Banking, Tech"
                />
              </FormField>
            </div>

            
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Contact Name"
                error={errors.contactName?.message}
                icon={User}
              >
                <input
                  type="text"
                  {...register("contactName")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="Your name"
                />
              </FormField>

              <FormField label="Job Title" error={errors.jobTitle?.message}>
                <input
                  type="text"
                  {...register("jobTitle")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="Head of Partnerships"
                />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Email Address"
                error={errors.email?.message}
                icon={Mail}
              >
                <input
                  type="email"
                  {...register("email")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="you@company.com"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  placeholder="+254 712 345 678"
                />
              </FormField>
            </div>

            
            <FormField
              label="Company Size (Employees)"
              error={errors.companySize?.message}
            >
              <select
                {...register("companySize")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="">Select company size</option>
                <option value="1-50">1-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1,000 employees</option>
                <option value="1001-5000">1,001-5,000 employees</option>
                <option value="5000+">5,000+ employees</option>
              </select>
            </FormField>

            
            <FormField
              label="Tell us about your partnership interest"
              error={errors.message?.message}
            >
              <textarea
                {...register("message")}
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                placeholder="How would you like to partner with EaziWage? What value can we create together?"
              />
            </FormField>

            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-50"
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
