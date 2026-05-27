"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { Locale } from '@/lib/currency/currency';

interface CurrencyContextType {
  locale: Locale;
}

const CurrencyContext = createContext<CurrencyContextType>({ locale: 'en-ke' });

export function CurrencyProvider({ locale, children }: { locale: string; children: ReactNode }) {
  // Validate locale
  const validLocale = (['en-ke', 'en-tz', 'en-ug', 'en-rw'].includes(locale) ? locale : 'en-ke') as Locale;
  return (
    <CurrencyContext.Provider value={{ locale: validLocale }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
