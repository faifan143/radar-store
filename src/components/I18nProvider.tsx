// components/I18nProvider.tsx
"use client";
import { I18nextProvider } from "react-i18next";
import { useEffect } from "react";
import i18n from "../i18n";
import { useI18nStore } from "@/stores";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useI18nStore();

  useEffect(() => {
    // Initialize i18n with stored language
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  useEffect(() => {
    // Listen for language changes and update store
    const handleLanguageChange = (lng: string) => {
      if (lng !== language) {
        setLanguage(lng);
      }
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [language, setLanguage]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
