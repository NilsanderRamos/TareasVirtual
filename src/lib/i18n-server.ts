import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE_NAME, normalizeLocale, resolveLocaleFromAcceptLanguage, SiteLocale } from "@/lib/i18n";

export async function getCurrentLocale(): Promise<SiteLocale> {
  const cookieStore = await cookies();
  const cookieLocale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);

  if (cookieLocale) {
    return cookieLocale;
  }

  const headerStore = await headers();
  return resolveLocaleFromAcceptLanguage(headerStore.get("accept-language"));
}