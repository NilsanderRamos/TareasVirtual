"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT_ID, ADSENSE_ENABLED, ADSENSE_SLOT_IDS, AdSlotName, COOKIE_CONSENT_UPDATE_EVENT_NAME, readStoredConsentState } from "@/lib/adsense";
import { pickByLocale, SiteLocale } from "@/lib/i18n";

declare global {
  interface Window {
    adsbygoogle?: Array<unknown> & { requestNonPersonalizedAds?: number };
  }
}

interface AdSlotProps {
  slotName: AdSlotName;
  locale: SiteLocale;
  className?: string;
}

export function AdSlot({ slotName, locale, className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const slotId = ADSENSE_SLOT_IDS[slotName];

  useEffect(() => {
    if (!ADSENSE_ENABLED || !slotId || !adRef.current) {
      return;
    }

    const tryRenderAd = () => {
      const consent = readStoredConsentState();

      if (consent === "pending" || !adRef.current || adRef.current.dataset.tvAdInitialized === "true") {
        return;
      }

      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.requestNonPersonalizedAds = consent === "denied" ? 1 : 0;
        window.adsbygoogle.push({});
        adRef.current.dataset.tvAdInitialized = "true";
      } catch {
        adRef.current.dataset.tvAdInitialized = "false";
      }
    };

    tryRenderAd();
    window.addEventListener(COOKIE_CONSENT_UPDATE_EVENT_NAME, tryRenderAd);

    return () => window.removeEventListener(COOKIE_CONSENT_UPDATE_EVENT_NAME, tryRenderAd);
  }, [slotId]);

  if (!ADSENSE_ENABLED || !slotId) {
    return null;
  }

  return (
    <section className={`ad-slot-shell ${className}`.trim()} aria-label={pickByLocale(locale, "Advertisement block", "Bloque publicitario")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">{pickByLocale(locale, "Advertisement", "Publicidad")}</p>
          <p className="mt-1 text-sm leading-6 text-(--muted)">{pickByLocale(locale, "This space is reserved for clearly separated ads and is kept away from navigation or primary actions.", "Este espacio queda reservado para anuncios claramente separados y alejados de la navegacion o de las acciones primarias.")}</p>
        </div>
      </div>
      <div className="ad-slot-frame mt-4 rounded-3xl px-3 py-3 sm:px-4 sm:py-4">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </section>
  );
}