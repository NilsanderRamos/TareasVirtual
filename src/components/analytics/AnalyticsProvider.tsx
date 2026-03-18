"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { COOKIE_CONSENT_UPDATE_EVENT_NAME, readStoredConsentState } from "@/lib/adsense";
import { GA_MEASUREMENT_ID, trackPageView, trackWebVital, updateGoogleConsentMode } from "@/lib/analytics";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useReportWebVitals((metric) => {
    trackWebVital(metric);
  });

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      return;
    }

    const syncConsentMode = () => {
      updateGoogleConsentMode(readStoredConsentState());
    };

    syncConsentMode();
    window.addEventListener(COOKIE_CONSENT_UPDATE_EVENT_NAME, syncConsentMode);

    return () => window.removeEventListener(COOKIE_CONSENT_UPDATE_EVENT_NAME, syncConsentMode);
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      return;
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}