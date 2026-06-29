"use client";

import { useState, useEffect } from "react";
import { type Locale, formatCurrency, getCurrencyFromLocale } from "@/lib/currency/currency";

const MOBILE_MONEY: Record<Locale, string> = {
  "en-ke": "M-Pesa",
  "en-tz": "M-Pesa",
  "en-ug": "MTN MoMo",
  "en-rw": "MTN MoMo",
};

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en-ke";
  const lang = navigator.language.toLowerCase();
  const direct: Record<string, Locale> = {
    "en-ke": "en-ke",
    "sw-ke": "en-ke",
    "en-tz": "en-tz",
    "sw-tz": "en-tz",
    "en-ug": "en-ug",
    "en-rw": "en-rw",
    "rw-rw": "en-rw",
    "fr-rw": "en-rw",
  };
  if (direct[lang]) return direct[lang];
  const country = lang.split("-")[1] ?? "";
  if (country === "ke") return "en-ke";
  if (country === "tz") return "en-tz";
  if (country === "ug") return "en-ug";
  if (country === "rw") return "en-rw";
  return "en-ke";
}

export function usePhoneCurrency() {
  const [locale, setLocale] = useState<Locale>("en-ke");

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const currencyInfo = getCurrencyFromLocale(locale);

  function fmt(amountKES: number): string {
    return formatCurrency(amountKES, locale);
  }

  return {
    fmt,
    locale,
    symbol: currencyInfo.symbol,
    code: currencyInfo.code,
    mobileMoney: MOBILE_MONEY[locale],
  };
}
