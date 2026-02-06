"use client";

import { motion } from "framer-motion";
import { FiMail, FiPhone } from "react-icons/fi";
import { BiLocationPlus } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormData } from "@/lib/validations/contact";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
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
    setIsSubmitting(true);
    setSubmitted(true);
    const toastId = toast.loading("Sending your message...");
    if (data.honeypot) {
      console.log("Bot detected! Ignoring submission.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully! We'll contact you soon.", {
          id: toastId,
          duration: 5000,
        });
        reset();
      } else {
        if (result.issues) {
          result.issues.forEach((error: any) => {
            toast.error(`${error.path}: ${error.message}`, {
              id: toastId,
            });
          });
        } else if (result.error) {
          toast.error(result.error, {
            id: toastId,
          });
        } else {
          toast.error("Failed to send message", {
            id: toastId,
          });
        }
      }
    } catch (error) {
      toast.error("Network error. Please try again.", {
        id: toastId,
      });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 dark:bg-black">
      {/* Polygon green background */}
      <div className="fixed inset-0 h-screen w-screen bg-green-600 [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)] sm:[clip-path:polygon(0_0,70%_0,100%_100%,0%_100%)]"></div>

      <div className="relative z-10 mx-auto mt-12 grid w-full max-w-6xl gap-12 p-8 md:grid-cols-2">
        {/* Left text / contact info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center text-white md:pr-8 dark:text-white"
        >
          <h1 className="font-serif text-4xl leading-tight font-bold md:text-5xl">
            Ready to Start with Us?
          </h1>
          <p className="mt-4 text-lg text-green-100 dark:text-white">
            Contact us for any queries about earned wage access, partnerships,
            or support. We&apos;re here to help employers and employees across
            Africa.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3">
              <FiMail className="text-xl text-green-200 dark:text-white" />
              <span>support@eaziwage.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="text-xl text-green-200 dark:text-white" />
              <span>+254 723 154900</span>
            </div>
            <div className="flex items-center space-x-3">
              <BiLocationPlus className="text-2xl text-green-200 dark:text-white" />
              <span>Nairobi, Kenya</span>
            </div>
          </div>

          {/* Stats from your website */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-green-200">Targeted Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">0%</div>
              <div className="text-sm text-green-200">Interest Charges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">Instant</div>
              <div className="text-sm text-green-200">Disbursement</div>
            </div>
          </div>
        </motion.div>

        {/* Right contact form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-green-200">
            Contact Us
          </h2>

          {submitted && (
            <p className="mt-6 text-green-600 dark:text-green-300">
              Thank you for your message! We'll get back to you soon.
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <input
              type="text"
              autoComplete="off"
              tabIndex={-1}
              style={{ display: "none" }}
              {...register("honeypot")}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                required
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
                type="text"
                placeholder="Your name"
                {...register("name")}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400"
                    : "border-green-400 focus:ring-green-500 dark:border-green-600 dark:focus:ring-green-400"
                } dark:bg-gray-800 dark:text-green-100`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                required
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                type="email"
                placeholder="Your email"
                {...register("email")}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400"
                    : "border-green-400 focus:ring-green-500 dark:border-green-600 dark:focus:ring-green-400"
                } dark:bg-gray-800 dark:text-green-100`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <input
                required
                aria-invalid={errors.subject ? "true" : "false"}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                type="text"
                placeholder="What's your subject"
                {...register("subject")}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                  errors.subject
                    ? "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400"
                    : "border-green-400 focus:ring-green-500 dark:border-green-600 dark:focus:ring-green-400"
                } dark:bg-gray-800 dark:text-green-100`}
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                required
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
                rows={4}
                placeholder="Write your message..."
                {...register("message")}
                className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                  errors.message
                    ? "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400"
                    : "border-green-400 focus:ring-green-500 dark:border-green-600 dark:focus:ring-green-400"
                } dark:bg-gray-800 dark:text-green-100`}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 w-full rounded-lg px-4 py-2 font-semibold transition ${
                isSubmitting
                  ? "cursor-not-allowed bg-green-400"
                  : "bg-green-600 hover:bg-green-700"
              } text-white dark:text-black`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
