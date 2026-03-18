export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";
export const ADSENSE_ENABLED = ADSENSE_CLIENT_ID.length > 0;

export const COOKIE_CONSENT_STORAGE_KEY = "tv-cookie-consent";
export const COOKIE_CONSENT_COOKIE_NAME = "tv-cookie-consent";
export const COOKIE_CONSENT_OPEN_EVENT_NAME = "tv-open-consent";
export const COOKIE_CONSENT_UPDATE_EVENT_NAME = "tv-consent-updated";

export type CookieConsentState = "pending" | "granted" | "denied";

export type AdSlotName =
  | "home-inline"
  | "blog-inline"
  | "blog-post-inline"
  | "tools-inline"
  | "tool-detail-inline";

export const ADSENSE_SLOT_IDS: Record<AdSlotName, string> = {
  "home-inline": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_INLINE ?? "",
  "blog-inline": process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_INLINE ?? "",
  "blog-post-inline": process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_POST_INLINE ?? "",
  "tools-inline": process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOLS_INLINE ?? "",
  "tool-detail-inline": process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_DETAIL_INLINE ?? "",
};

export function normalizeConsentState(value?: string | null): CookieConsentState {
  return value === "granted" || value === "denied" ? value : "pending";
}

function readCookieValue(cookieName: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookieEntry = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${cookieName}=`));

  if (!cookieEntry) {
    return null;
  }

  return cookieEntry.slice(cookieName.length + 1);
}

export function readStoredConsentState() {
  if (typeof window === "undefined") {
    return "pending" as CookieConsentState;
  }

  const storageValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

  if (storageValue) {
    return normalizeConsentState(storageValue);
  }

  return normalizeConsentState(readCookieValue(COOKIE_CONSENT_COOKIE_NAME));
}

export function persistConsentState(value: Exclude<CookieConsentState, "pending">) {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
  document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${value}; path=/; max-age=31536000; samesite=lax`;
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_UPDATE_EVENT_NAME, { detail: value }));
}

export function openCookieConsentSettings() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_EVENT_NAME));
}