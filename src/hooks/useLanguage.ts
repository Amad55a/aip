/**
 * useLanguage — the ONE reusable hook for language across the entire app.
 *
 * Usage:
 *   const { language, setLanguage, t, isRTL } = useLanguage();
 *
 * Must be rendered inside <LanguageProvider> (already in root layout).
 */
export { useLanguageContext as useLanguage } from "@/context/LanguageProvider";
export type { Language } from "@/i18n";
