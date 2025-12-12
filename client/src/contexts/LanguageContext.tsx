import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, translations, Translations } from "@shared/translations";
import { trpc } from "@/lib/trpc";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const { data: settings } = trpc.chess.getSettings.useQuery();
  const updateSettings = trpc.chess.updateSettings.useMutation();

  // Load language from user settings
  useEffect(() => {
    if (settings?.language) {
      setLanguageState(settings.language as Language);
    }
  }, [settings]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    updateSettings.mutate({ language: lang });
  };

  const t = (key: keyof Translations): string => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
