"use client";

import { useEffect } from "react";
import {
  ADSENSE_CLIENT_ID,
  ADSENSE_ENABLED,
  COOKIE_CONSENT_UPDATE_EVENT_NAME,
  readStoredConsentState,
} from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: Array<unknown> & { requestNonPersonalizedAds?: number };
  }
}

const SCRIPT_ID = "tv-adsense-script";
function syncAdSenseScript() {
  const consent = readStoredConsentState();

  if (!ADSENSE_ENABLED || consent === "pending") {
    return;
  }

  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.requestNonPersonalizedAds = consent === "denied" ? 1 : 0;

  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
  document.head.appendChild(script);
}

export function AdSenseBootstrap() {
  useEffect(() => {
    if (!ADSENSE_ENABLED) {
      return;
    }

    syncAdSenseScript();
    window.addEventListener(COOKIE_CONSENT_UPDATE_EVENT_NAME, syncAdSenseScript);

    return () => window.removeEventListener(COOKIE_CONSENT_UPDATE_EVENT_NAME, syncAdSenseScript);
  }, []);

  return null;
}