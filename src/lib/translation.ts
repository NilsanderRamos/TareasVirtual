import { SiteLocale } from "@/lib/i18n";

type TranslationCache = Map<string, string>;

declare global {
  var __tvTranslationCache__: TranslationCache | undefined;
}

const translationCache = globalThis.__tvTranslationCache__ ?? new Map<string, string>();

if (!globalThis.__tvTranslationCache__) {
  globalThis.__tvTranslationCache__ = translationCache;
}

function buildCacheKey(targetLocale: SiteLocale, text: string) {
  return `${targetLocale}:${text}`;
}

async function requestTranslation(text: string, targetLocale: SiteLocale) {
  const endpoint = new URL("https://api.mymemory.translated.net/get");
  endpoint.searchParams.set("q", text);
  endpoint.searchParams.set("langpair", `es|${targetLocale}`);

  const response = await fetch(endpoint, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(`Translation request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    responseData?: { translatedText?: string };
  };

  return payload.responseData?.translatedText?.trim() || text;
}

export async function translateText(text: string, targetLocale: SiteLocale) {
  if (targetLocale === "es" || text.trim().length === 0) {
    return text;
  }

  const cacheKey = buildCacheKey(targetLocale, text);
  const cachedValue = translationCache.get(cacheKey);

  if (cachedValue) {
    return cachedValue;
  }

  try {
    const translatedText = await requestTranslation(text, targetLocale);
    translationCache.set(cacheKey, translatedText);
    return translatedText;
  } catch {
    translationCache.set(cacheKey, text);
    return text;
  }
}

export async function translateMany(texts: string[], targetLocale: SiteLocale) {
  return Promise.all(texts.map((text) => translateText(text, targetLocale)));
}