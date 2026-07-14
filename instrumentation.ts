/**
 * Runs once when the Next.js server boots (see
 * https://nextjs.org/docs/app/guides/instrumentation). Fails the process
 * immediately on a misconfigured environment instead of letting it surface
 * later as a runtime 500 the first time some unrelated route happens to
 * touch the missing variable.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("./env");
    validateEnv();
  }
}
