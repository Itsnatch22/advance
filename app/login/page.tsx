"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Role = "employer" | "employee";

export default function LoginPage() {
  const [role, setRole] = useState<Role>("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
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
      <div className="fixed inset-0 h-screen w-screen bg-green-600 [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)] sm:[clip-path:polygon(0_0,70%_0,100%_100%,0%_100%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 p-8 md:grid-cols-2">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center text-white md:pr-8"
        >
          <h1 className="mt-12 font-serif text-4xl font-bold md:text-5xl">
            Welcome Back to EaziWage
          </h1>

          <p className="mt-4 text-lg text-green-100">
            {role === "employee"
              ? "Access your earned wages instantly."
              : "Manage employees, payroll and advances."}
          </p>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 rounded-2xl bg-white p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900">Log In</h2>

          {/* ROLE SELECTOR */}
          <div className="mt-6 flex gap-2 rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setRole("employee")}
              className={`w-full rounded-md py-2 text-sm font-medium transition ${
                role === "employee"
                  ? "bg-white text-green-600 shadow"
                  : "text-gray-500"
              }`}
            >
              Employee
            </button>

            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`w-full rounded-md py-2 text-sm font-medium transition ${
                role === "employer"
                  ? "bg-white text-green-600 shadow"
                  : "text-gray-500"
              }`}
            >
              Employer
            </button>
          </div>

          {/* FORM */}
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            {/* Hidden role hook for backend */}
            <input type="hidden" name="role" value={role} />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work Email
              </label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-green-400 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                className="mt-1 w-full rounded-lg border border-green-400 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading
                ? "Logging in..."
                : `Log In as ${role === "employee" ? "Employee" : "Employer"}`}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-6 flex items-center">
            <div className="h-px flex-grow bg-gray-300" />
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="h-px flex-grow bg-gray-300" />
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50"
          >
            <span className="text-sm font-medium text-gray-700">
              Continue with Google
            </span>
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-green-600 hover:underline"
            >
              Sign up
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
