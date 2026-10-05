"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  type Language,
  type Translations,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  RTL_LANGUAGES,
  isValidLanguage,
  translations,
} from "@/i18n";

/* ─── Context shape ─────────────────────────────────────────────── */
interface LanguageContextValue {
  /** Currently active language code. */
  language: Language;
  /** Change the active language and persist it for client and server rendering. */
  setLanguage: (lang: Language) => void;
  /** Resolve a dot-notation key to a translated string. */
  t: (key: string) => string;
  /** True when the current language uses RTL text direction. */
  isRTL: boolean;
  /** Raw translation object for the current language. */
  strings: Translations;
}

/* ─── Context ───────────────────────────────────────────────────── */
export const LanguageContext = createContext<LanguageContextValue | null>(null);

/* ─── Helpers ───────────────────────────────────────────────────── */

/**
 * Walk a nested object by dot-notation path.
 * Returns the value if it is a string, otherwise undefined.
 */
function resolvePath(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

/**
 * Translate a dot-notation key with fallback chain:
 *   selected language → English → key itself
 */
function translate(lang: Language, key: string): string {
  return (
    resolvePath(translations[lang], key) ??
    resolvePath(translations[DEFAULT_LANGUAGE], key) ??
    key
  );
}

/** Apply lang + dir attributes to <html> element. */
function applyDocumentAttributes(lang: Language) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? "rtl" : "ltr";
}

function persistLanguage(lang: Language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // The cookie still allows server-rendered content to use the selected language.
  }
  try {
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`;
  } catch {
    // The in-memory language remains active for this session.
  }
}

/* ─── Provider ──────────────────────────────────────────────────── */
export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  // On mount: restore persisted language from localStorage.
  useEffect(() => {
    try {
      const stored =
        document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith(`${LANGUAGE_STORAGE_KEY}=`))
          ?.split("=")[1] ??
        localStorage.getItem(LANGUAGE_STORAGE_KEY) ??
        localStorage.getItem("language");
      if (isValidLanguage(stored)) {
        const documentLanguage = document.documentElement.lang;
        setLanguageState(stored);
        applyDocumentAttributes(stored);
        persistLanguage(stored);
        if (documentLanguage !== stored) router.refresh();
      } else {
        // Ensure default attributes are applied
        applyDocumentAttributes(initialLanguage);
      }
    } catch {
      // localStorage unavailable (private browsing, etc.)
      applyDocumentAttributes(initialLanguage);
    }

    try {
      const savedTheme =
        localStorage.getItem("from-code-to-ai-theme") ??
        localStorage.getItem("theme");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } catch {
      document.documentElement.classList.remove("dark");
    }
  }, [initialLanguage, router]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    applyDocumentAttributes(lang);
    persistLanguage(lang);
    router.refresh();
  }, [router]);

  const t = useCallback(
    (key: string): string => translate(language, key),
    [language]
  );

  const isRTL = RTL_LANGUAGES.includes(language);
  const strings = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, strings }}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ─── Hook ──────────────────────────────────────────────────────── */
/**
 * Access the language context.
 * Must be used inside a <LanguageProvider>.
 */
export function useLanguageContext(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguageContext must be used inside <LanguageProvider>");
  }
  return ctx;
}
