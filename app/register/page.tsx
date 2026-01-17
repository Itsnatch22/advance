"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useRouter } from "next/navigation";

type Role = "employer" | "employee";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("employer");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companySize: "",
    inviteToken: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        role,
        companySize: formData.companySize
          ? parseInt(formData.companySize, 10)
          : undefined,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push(data.redirectTo || "/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
      {/* Background */}
      <div className="fixed inset-0 bg-green-600 sm:[clip-path:polygon(0_0,70%_0,100%_100%,0%_100%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 p-8 md:grid-cols-2">
        {/* Left copy */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center text-white"
        >
          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            Join EaziWage
          </h1>
          <p className="mt-4 text-lg text-green-100">
            Instant wage access for modern teams. Built for employers and
            employees.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-white p-8 shadow-lg"
        >
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Create account
          </h2>

          {/* Role selector */}
          <div className="mb-6 grid grid-cols-2 gap-2">
            {(["employer", "employee"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={clsx(
                  "rounded-lg py-2 font-medium transition",
                  role === r
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {r === "employer" ? "Employer" : "Employee"}
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              name="fullName"
              placeholder="John Doe"
              onChange={handleChange}
              value={formData.fullName}
            />
            <Input
              label="Work email"
              name="email"
              placeholder="name@company.com"
              onChange={handleChange}
              value={formData.email}
            />

            {role === "employer" && (
              <>
                <Input
                  label="Company name"
                  name="companyName"
                  placeholder="Acme Ltd"
                  onChange={handleChange}
                  value={formData.companyName}
                />
                <Input
                  label="Number of employees"
                  name="companySize"
                  placeholder="e.g. 25"
                  type="number"
                  onChange={handleChange}
                  value={formData.companySize}
                />
              </>
            )}

            {role === "employee" && (
              <Input
                label="Invite Token (Optional)"
                name="inviteToken"
                placeholder="Your invite token"
                onChange={handleChange}
                value={formData.inviteToken}
              />
            )}

            <Input
              label="Password"
              name="password"
              type="password"
              onChange={handleChange}
              autoComplete="new-password"
              value={formData.password}
            />
            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              autoComplete="new-password"
              value={formData.confirmPassword}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-green-600 py-2 font-semibold text-white transition hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading
                ? "Creating account..."
                : role === "employer"
                  ? "Create employer account"
                  : "Join as employee"}
            </button>
          </form>

          {/* ... rest of the component */}
          <div className="my-6 flex items-center">
            <div className="h-px flex-grow bg-gray-300" />
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="h-px flex-grow bg-gray-300" />
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50"
          >
            <svg
              className="mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              fill="currentColor"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Sign in with Google
            </span>
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-green-600 hover:underline"
            >
              Log in
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-green-400 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
    </div>
  );
}
