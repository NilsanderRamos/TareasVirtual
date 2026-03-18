"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { pickByLocale, SiteLocale } from "@/lib/i18n";
import {
  ADSENSE_ENABLED,
  COOKIE_CONSENT_OPEN_EVENT_NAME,
  COOKIE_CONSENT_UPDATE_EVENT_NAME,
  CookieConsentState,
  persistConsentState,
  readStoredConsentState,
} from "@/lib/adsense";

function subscribeToConsentChanges(onStoreChange: () => void) {
  window.addEventListener(COOKIE_CONSENT_UPDATE_EVENT_NAME, onStoreChange);

  return () => window.removeEventListener(COOKIE_CONSENT_UPDATE_EVENT_NAME, onStoreChange);
}

export function CookieConsentManager({ locale }: { locale: SiteLocale }) {
  const consent = useSyncExternalStore(
    subscribeToConsentChanges,
    readStoredConsentState,
    () => "pending" as CookieConsentState,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (!ADSENSE_ENABLED) {
      return;
    }

    const handleOpen = () => setIsSettingsOpen(true);
    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT_NAME, handleOpen);

    return () => window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT_NAME, handleOpen);
  }, []);

  const isOpen = ADSENSE_ENABLED && (consent === "pending" || isSettingsOpen);

  if (!isOpen) {
    return null;
  }

  const currentModeText =
    consent === "granted"
      ? pickByLocale(locale, "Personalized ads enabled", "Anuncios personalizados activados")
      : consent === "denied"
        ? pickByLocale(locale, "Non-personalized ads only", "Solo anuncios no personalizados")
        : pickByLocale(locale, "Choose your advertising preference", "Elige tu preferencia publicitaria");

  return (
    <div className="fixed inset-x-4 bottom-24 z-70 md:bottom-5">
      <div className="consent-shell mx-auto max-w-3xl rounded-[1.8rem] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="section-label text-[0.72rem] font-semibold uppercase tracking-[0.18em]">
              {pickByLocale(locale, "Privacy and cookies", "Privacidad y cookies")}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-(--ink)">
              {pickByLocale(locale, "Choose how advertising cookies may be used.", "Elige como pueden usarse las cookies publicitarias.")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-(--muted)">
              {pickByLocale(
                locale,
                "We use cookies and similar technologies for site operation, analytics, language preferences, and advertising. If you accept, ads may use personalized signals. If you decline, the site keeps only essential behavior and future ads should be requested in non-personalized mode.",
                "Usamos cookies y tecnologias similares para funcionamiento del sitio, analitica, preferencias de idioma y publicidad. Si aceptas, los anuncios pueden usar senales personalizadas. Si rechazas, el sitio mantiene solo el comportamiento esencial y la publicidad futura debe solicitarse en modo no personalizado.",
              )}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full border border-(--line) bg-white/70 px-3 py-1.5 font-medium text-(--ink)">{currentModeText}</span>
              <Link href="/privacy-policy" className="font-semibold text-(--accent-strong) hover:text-(--ink)">
                {pickByLocale(locale, "Review privacy policy", "Revisar politica de privacidad")}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:max-w-sm lg:justify-end">
            <button
              type="button"
              onClick={() => {
                persistConsentState("granted");
                setIsSettingsOpen(false);
              }}
              className="inline-flex items-center justify-center rounded-full bg-(--ink) px-5 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong)"
            >
              {pickByLocale(locale, "Accept personalized ads", "Aceptar anuncios personalizados")}
            </button>
            <button
              type="button"
              onClick={() => {
                persistConsentState("denied");
                setIsSettingsOpen(false);
              }}
              className="inline-flex items-center justify-center rounded-full border border-(--line) bg-white/78 px-5 py-3 text-sm font-semibold text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)"
            >
              {pickByLocale(locale, "Only essential and non-personalized", "Solo esencial y no personalizado")}
            </button>
            {consent !== "pending" ? (
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="inline-flex items-center justify-center text-sm font-semibold text-(--accent-strong) hover:text-(--ink)"
              >
                {pickByLocale(locale, "Close", "Cerrar")}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
