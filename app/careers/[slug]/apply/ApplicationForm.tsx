"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Loader2, Upload, X } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  CAREER_APPLICATION_ALLOWED_EXTENSIONS,
  CAREER_APPLICATION_MAX_FILE_SIZE,
  careerApplicationSchema,
  type CareerApplicationPayload,
  validateCareerApplicationFile,
} from "@/lib/validations/career-application";

type ApplicationFormProps = {
  careerSlug: string;
  careerTitle: string;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function ApplicationForm({
  careerSlug,
  careerTitle,
}: ApplicationFormProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
    clearErrors,
  } = useForm<CareerApplicationPayload>({
    resolver: zodResolver(careerApplicationSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      cover_letter: "",
      linkedin_url: "",
      portfolio_url: "",
      consent: true,
    },
  });

  const submitting = status === "submitting";

  const onSubmit: SubmitHandler<CareerApplicationPayload> = async (values) => {
    const selectedResume = resumeFile;
    const fileError = validateCareerApplicationFile(selectedResume);
    if (fileError) {
      setError("root", { message: fileError });
      return;
    }
    if (!selectedResume) {
      setError("root", { message: "Resume is required" });
      return;
    }

    const body = new FormData();
    body.set("full_name", values.full_name);
    body.set("email", values.email);
    body.set("phone", values.phone ?? "");
    body.set("cover_letter", values.cover_letter ?? "");
    body.set("linkedin_url", values.linkedin_url ?? "");
    body.set("portfolio_url", values.portfolio_url ?? "");
    body.set("consent", values.consent ? "true" : "false");
    body.set("resume_file", selectedResume);

    try {
      setStatus("submitting");
      setServerError("");
      clearErrors("root");

      const response = await fetch(`/api/careers/${careerSlug}/applications`, {
        method: "POST",
        body,
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ?? "Application submission failed. Please try again."
        );
      }

      setStatus("success");
      setSuccessMessage(
        result.data?.message ??
          `Thank you for applying for the ${careerTitle} role. We'll review your application and get back to you soon.`
      );
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      reset();
    } catch (error) {
      setStatus("error");
      setServerError(
        error instanceof Error
          ? error.message
          : "An error occurred while submitting your application."
      );
    }
  };

  const onFileChange = (file: File | null) => {
    const fileError = validateCareerApplicationFile(file);
    if (fileError) {
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setError("root", { message: fileError });
      return;
    }

    setResumeFile(file);
    clearErrors("root");
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="mt-1 rounded-full bg-green-100 p-2">
            <Check className="h-6 w-6 text-green-700" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-bold text-green-900">Application submitted</h3>
            <p className="mt-2 text-sm leading-relaxed text-green-800">
              {successMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {serverError || errors.root?.message ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
              strokeWidth={2}
            />
            <span className="text-sm leading-relaxed text-red-800">
              {serverError || errors.root?.message}
            </span>
          </div>
        </div>
      ) : null}

      <FormField
        label="Full name"
        required
        error={errors.full_name?.message}
        inputId="full_name"
      >
        <input
          id="full_name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={Boolean(errors.full_name)}
          aria-describedby={errors.full_name ? "full_name-error" : undefined}
          className={fieldClassName}
          {...register("full_name")}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Email"
          required
          error={errors.email?.message}
          inputId="email"
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClassName}
            {...register("email")}
          />
        </FormField>

        <FormField label="Phone" error={errors.phone?.message} inputId="phone">
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+254 123 456 789"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={fieldClassName}
            {...register("phone")}
          />
        </FormField>
      </div>

      <FileUploadField
        file={resumeFile}
        inputRef={fileInputRef}
        onChange={onFileChange}
        onRemove={() => {
          setResumeFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
      />

      <FormField
        label="Cover letter"
        error={errors.cover_letter?.message}
        inputId="cover_letter"
      >
        <textarea
          id="cover_letter"
          rows={5}
          placeholder="Tell us why you're interested in this role..."
          aria-invalid={Boolean(errors.cover_letter)}
          aria-describedby={
            errors.cover_letter ? "cover_letter-error" : undefined
          }
          className={`${fieldClassName} resize-none`}
          {...register("cover_letter")}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="LinkedIn URL"
          error={errors.linkedin_url?.message}
          inputId="linkedin_url"
        >
          <input
            id="linkedin_url"
            type="url"
            placeholder="https://linkedin.com/in/..."
            aria-invalid={Boolean(errors.linkedin_url)}
            aria-describedby={
              errors.linkedin_url ? "linkedin_url-error" : undefined
            }
            className={fieldClassName}
            {...register("linkedin_url")}
          />
        </FormField>

        <FormField
          label="Portfolio URL"
          error={errors.portfolio_url?.message}
          inputId="portfolio_url"
        >
          <input
            id="portfolio_url"
            type="url"
            placeholder="https://example.com/portfolio"
            aria-invalid={Boolean(errors.portfolio_url)}
            aria-describedby={
              errors.portfolio_url ? "portfolio_url-error" : undefined
            }
            className={fieldClassName}
            {...register("portfolio_url")}
          />
        </FormField>
      </div>

      <ConsentCheckbox
        error={errors.consent?.message}
        register={register("consent")}
      />

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 font-bold text-white shadow-xl shadow-slate-900/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit application"
        )}
      </button>
    </form>
  );
}

const fieldClassName =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition-all duration-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10";

function FormField({
  children,
  error,
  inputId,
  label,
  required = false,
}: {
  children: React.ReactNode;
  error?: string;
  inputId: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-slate-900"
      >
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm font-medium text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FileUploadField({
  file,
  inputRef,
  onChange,
  onRemove,
}: {
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (file: File | null) => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <label
        htmlFor="resume_file"
        className="mb-2 block text-sm font-semibold text-slate-900"
      >
        Resume (PDF or Word) <span aria-hidden="true">*</span>
      </label>
      <p className="mb-3 text-sm leading-relaxed text-slate-500">
        Upload {CAREER_APPLICATION_ALLOWED_EXTENSIONS.join(", ")} files up to{" "}
        {CAREER_APPLICATION_MAX_FILE_SIZE / 1024 / 1024}MB.
      </p>
      {file ? (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-green-200 bg-green-50 p-4">
          <span className="min-w-0 truncate text-sm font-medium text-green-900">
            {file.name}
          </span>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove selected resume"
            className="rounded p-1 text-green-700 transition-colors hover:bg-green-100 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <label
          htmlFor="resume_file"
          className="mt-2 flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 transition-colors focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/10 hover:border-green-500 hover:bg-green-50"
        >
          <Upload className="h-5 w-5 text-slate-400" strokeWidth={1.8} />
          <span className="text-sm font-medium text-slate-600">
            Choose a resume file
          </span>
          <input
            ref={inputRef}
            id="resume_file"
            type="file"
            accept={CAREER_APPLICATION_ALLOWED_EXTENSIONS.join(",")}
            className="sr-only"
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          />
        </label>
      )}
    </div>
  );
}

function ConsentCheckbox({
  error,
  register,
}: {
  error?: string;
  register: ReturnType<
    typeof useForm<CareerApplicationPayload>
  >["register"] extends (name: "consent") => infer R
    ? R
    : never;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-300 text-green-600 focus:ring-green-500"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "consent-error" : undefined}
          {...register}
        />
        <span className="text-sm leading-relaxed text-slate-700">
          I consent to have my application reviewed by the EaziWage team. I
          understand that my data will be stored securely and used only for
          recruitment purposes.
        </span>
      </label>
      {error ? (
        <p
          id="consent-error"
          className="mt-2 text-sm font-medium text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
