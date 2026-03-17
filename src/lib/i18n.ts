export const LOCALE_COOKIE_NAME = "tv-locale";
export const SUPPORTED_LOCALES = ["es", "en"] as const;

export type SiteLocale = (typeof SUPPORTED_LOCALES)[number];

export function normalizeLocale(value?: string | null): SiteLocale | null {
  if (!value) {
    return null;
  }

  const lowered = value.toLowerCase();

  if (lowered.startsWith("en")) {
    return "en";
  }

  if (lowered.startsWith("es")) {
    return "es";
  }

  return null;
}

export function resolveLocaleFromAcceptLanguage(acceptLanguage?: string | null): SiteLocale {
  if (!acceptLanguage) {
    return "es";
  }

  const candidates = acceptLanguage.split(",").map((entry) => entry.split(";")[0]?.trim());

  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate);

    if (locale) {
      return locale;
    }
  }

  return "es";
}

export function toDocumentLanguage(locale: SiteLocale) {
  return locale === "en" ? "en" : "es";
}

export function toOpenGraphLocale(locale: SiteLocale) {
  return locale === "en" ? "en_US" : "es_ES";
}

export function formatLocaleDate(date: string | number | Date, locale: SiteLocale) {
  return new Date(date).toLocaleDateString(locale === "en" ? "en-US" : "es-DO");
}

export function pickByLocale<T>(locale: SiteLocale, englishValue: T, spanishValue: T) {
  return locale === "en" ? englishValue : spanishValue;
}