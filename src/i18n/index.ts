/**
 * Central i18n registry.
 *
 * Import everything from this file — never import individual
 * language files directly in components.
 */
import en, { type Translations } from "./en";
import ar from "./ar";
import so from "./so";

export type { Translations };

/** Valid language codes. */
export const LANGUAGES = ["en", "ar", "so"] as const;
export type Language = (typeof LANGUAGES)[number];

/** Human-readable labels shown in the language switcher. */
export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  ar: "العربية",
  so: "Soomaali",
};

/** Languages that use RTL text direction. */
export const RTL_LANGUAGES: Language[] = ["ar"];

/** localStorage key used to persist the user's language choice. */
export const LANGUAGE_STORAGE_KEY = "from-code-to-ai-language";

/** Default language when no valid preference is stored. */
export const DEFAULT_LANGUAGE: Language = "en";

/** All translations indexed by language code. */
export const translations: Record<Language, Translations> = { en, ar, so };

/** Returns true if the given string is a valid language code. */
export function isValidLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language);
}

export { en, ar, so };
