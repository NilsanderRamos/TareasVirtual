import { CookieConsentState } from "@/lib/adsense";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;
export type WebVitalMetric = {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: "good" | "needs-improvement" | "poor";
  navigationType?: string;
};

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const GOOGLE_CONSENT_WAIT_FOR_UPDATE_MS = 500;

type GoogleConsentValue = "granted" | "denied";

export type GoogleConsentMode = {
  ad_storage: GoogleConsentValue;
  analytics_storage: GoogleConsentValue;
  ad_user_data: GoogleConsentValue;
  ad_personalization: GoogleConsentValue;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function getGoogleConsentMode(consent: CookieConsentState): GoogleConsentMode {
  if (consent === "granted") {
    return {
      ad_storage: "granted",
      analytics_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    };
  }

  return {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
}

export function updateGoogleConsentMode(consent: CookieConsentState) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("consent", "update", getGoogleConsentMode(consent));
}

export function trackSiteEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: eventName,
    ...normalizedPayload,
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, normalizedPayload);
  }

  window.dispatchEvent(new CustomEvent("tareasvirtual:analytics", {
    detail: {
      eventName,
      payload: normalizedPayload,
    },
  }));
}

export function trackPageView(url: string) {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function trackWebVital(metric: WebVitalMetric) {
  if (typeof window === "undefined") {
    return;
  }

  const value = metric.name === "CLS" ? Math.round(metric.value * 1000) : Math.round(metric.value);
  const delta = metric.name === "CLS" ? Math.round(metric.delta * 1000) : Math.round(metric.delta);

  trackSiteEvent("web_vital", {
    metric_id: metric.id,
    metric_name: metric.name,
    metric_value: value,
    metric_delta: delta,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
  });

  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", metric.name, {
    value,
    metric_id: metric.id,
    metric_value: value,
    metric_delta: delta,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
    non_interaction: true,
  });
}