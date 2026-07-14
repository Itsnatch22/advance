"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Cookie, X, ChevronLeft, ShieldCheck, BarChart3 } from "lucide-react";
import {
  COOKIE_CONSENT_NAME,
  COOKIE_CONSENT_MAX_AGE,
  DEFAULT_CONSENT,
  type ConsentCategories,
  parseConsentValue,
  serializeConsentValue,
} from "@/lib/consent";

export const OPEN_COOKIE_PREFERENCES_EVENT = "open-cookie-preferences";

type Choice = "accepted" | "rejected" | "customized";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<"banner" | "preferences">("banner");
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const readStoredConsent = (): ConsentCategories | null => {
    if (typeof document === "undefined") return null;
    const cookieMatch = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${COOKIE_CONSENT_NAME}=([^;]*)`)
    );
    const stored =
      cookieMatch?.[1] ?? (typeof window !== "undefined" ? window.localStorage.getItem(COOKIE_CONSENT_NAME) : null);
    return parseConsentValue(stored);
  };

  const persistConsent = (categories: ConsentCategories) => {
    if (typeof document === "undefined") return;
    const value = serializeConsentValue(categories);
    document.cookie = `${COOKIE_CONSENT_NAME}=${value}; path=/; max-age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax`;
    window.localStorage.setItem(COOKIE_CONSENT_NAME, value);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const existing = readStoredConsent();
    if (!existing) {
      setIsVisible(true);
    } else {
      // Re-persist so a legacy plain "accepted"/"rejected" value gets
      // upgraded to the JSON shape without re-prompting the visitor.
      persistConsent(existing);
      setAnalyticsEnabled(existing.analytics);
    }

    const handleReopen = () => {
      const current = readStoredConsent() ?? DEFAULT_CONSENT;
      setAnalyticsEnabled(current.analytics);
      setView("preferences");
      setIsVisible(true);
    };

    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleReopen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleReopen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reportChoice = async (choice: Choice, categories: ConsentCategories) => {
    try {
      await fetch("/api/cookie-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice, categories }),
      });
    } catch (error) {
      console.error("Failed to save cookie consent:", error);
    }
  };

  const applyChoice = (choice: Choice, categories: ConsentCategories) => {
    persistConsent(categories);
    setIsVisible(false);
    setView("banner");
    void reportChoice(choice, categories);
  };

  const handleAcceptAll = () => applyChoice("accepted", { necessary: true, analytics: true });
  const handleRejectAll = () => applyChoice("rejected", { necessary: true, analytics: false });
  const handleSavePreferences = () =>
    applyChoice("customized", { necessary: true, analytics: analyticsEnabled });

  const openPreferences = () => {
    const current = readStoredConsent();
    setAnalyticsEnabled(current?.analytics ?? false);
    setView("preferences");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 z-50 w-[95%] max-w-2xl -translate-x-1/2"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black/80 p-6 backdrop-blur-xl md:p-8">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-green-500/10 blur-3xl" />

            {view === "banner" ? (
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <Cookie className="h-6 w-6" />
                </div>

                <div className="flex-1 space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white md:text-xl">
                      Cookie Preferences
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      We use necessary cookies to run the site, and optional
                      analytics cookies to understand traffic and improve the
                      wage calculator. Choose what you&apos;re comfortable with.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      variant="outline"
                      onClick={openPreferences}
                      className="h-11 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white sm:w-auto"
                    >
                      Manage Preferences
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRejectAll}
                      className="h-11 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white sm:w-28"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={handleAcceptAll}
                      className="h-11 bg-green-600 font-semibold text-white shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:bg-green-500 sm:w-32"
                    >
                      Accept All
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setView("banner")}
                    aria-label="Back"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h3 className="text-lg font-bold text-white md:text-xl">
                    Manage Preferences
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Necessary</p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                          Required for the site to function — session
                          security, locale routing, and remembering this
                          choice. Always on.
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked
                      disabled
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Analytics</p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                          Aggregate site analytics, and lets the wage
                          calculator auto-detect your country from IP.
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={analyticsEnabled}
                      onCheckedChange={setAnalyticsEnabled}
                      className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-zinc-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSavePreferences}
                    className="h-11 bg-green-600 font-semibold text-white shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:bg-green-500"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setIsVisible(false);
                setView("banner");
              }}
              aria-label="Dismiss"
              className="absolute top-4 right-4 text-zinc-500 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
