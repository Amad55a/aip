import { cookies } from "next/headers";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  isValidLanguage,
} from "@/i18n";

export async function getServerLanguage() {
  const cookieStore = await cookies();
  const language = cookieStore.get(LANGUAGE_STORAGE_KEY)?.value;
  return isValidLanguage(language) ? language : DEFAULT_LANGUAGE;
}
