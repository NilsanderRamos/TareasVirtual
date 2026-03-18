"use client";

import { openCookieConsentSettings } from "@/lib/adsense";
import { pickByLocale, SiteLocale } from "@/lib/i18n";

export function CookieSettingsButton({ locale }: { locale: SiteLocale }) {
  return (
    <button
      type="button"
      onClick={openCookieConsentSettings}
      className="rounded-2xl border border-white/10 px-3 py-3 text-left text-sm text-[rgba(255,255,255,0.82)] hover:text-white sm:border-0 sm:px-0 sm:py-0"
    >
      {pickByLocale(locale, "Cookie settings", "Preferencias de cookies")}
    </button>
  );
}