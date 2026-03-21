import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { AdSenseBootstrap } from "@/components/ads/AdSenseBootstrap";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { CookieConsentManager } from "@/components/ads/CookieConsentManager";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { siteConfig } from "@/config/site";
import { toDocumentLanguage } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";
import { COOKIE_CONSENT_COOKIE_NAME, COOKIE_CONSENT_UPDATE_EVENT_NAME } from "@/lib/adsense";
import { GA_MEASUREMENT_ID, GOOGLE_CONSENT_WAIT_FOR_UPDATE_MS } from "@/lib/analytics";
import "@/styles/global.css";

const themeScript = `
  try {
    const storageKey = "tareasvirtual-theme";
    const savedTheme = window.localStorage.getItem(storageKey);
    const themeMode = savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
    const resolvedTheme = themeMode;

    document.documentElement.dataset.themeMode = themeMode;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  } catch {
    document.documentElement.dataset.themeMode = "light";
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
`;

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 900,
        alt: `${siteConfig.name} portada editorial`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getCurrentLocale();

  return (
    <html lang={toDocumentLanguage(locale)} data-theme="light" data-theme-mode="light" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-script" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;

                function readCookieConsent() {
                  const cookieName = '${COOKIE_CONSENT_COOKIE_NAME}=';
                  const consentCookie = document.cookie
                    .split(';')
                    .map((entry) => entry.trim())
                    .find((entry) => entry.startsWith(cookieName));

                  if (!consentCookie) {
                    return 'pending';
                  }

                  const value = consentCookie.slice(cookieName.length);
                  return value === 'granted' || value === 'denied' ? value : 'pending';
                }

                function getConsentMode(value) {
                  if (value === 'granted') {
                    return {
                      ad_storage: 'granted',
                      analytics_storage: 'granted',
                      ad_user_data: 'granted',
                      ad_personalization: 'granted',
                    };
                  }

                  return {
                    ad_storage: 'denied',
                    analytics_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                  };
                }

                gtag('js', new Date());
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  analytics_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  wait_for_update: ${GOOGLE_CONSENT_WAIT_FOR_UPDATE_MS},
                });

                const initialConsent = readCookieConsent();
                if (initialConsent !== 'pending') {
                  gtag('consent', 'update', getConsentMode(initialConsent));
                }

                window.addEventListener('${COOKIE_CONSENT_UPDATE_EVENT_NAME}', function(event) {
                  const nextConsent = event && event.detail === 'granted' ? 'granted' : 'denied';
                  gtag('consent', 'update', getConsentMode(nextConsent));
                });

                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body className={`${spaceGrotesk.variable} ${fraunces.variable}`}>
        <div className="relative min-h-screen overflow-x-clip">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-[rgba(13,148,136,0.16)] blur-3xl" />
            <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-[rgba(217,119,6,0.14)] blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[rgba(20,83,45,0.12)] blur-3xl" />
          </div>
          <Header locale={locale} />
          <Suspense fallback={null}>
            <AnalyticsProvider />
          </Suspense>
          <AdSenseBootstrap />
          <main className="relative z-10 flex-1 pb-24 md:pb-0">{children}</main>
          <Footer locale={locale} />
          <MobileActionBar locale={locale} />
          <CookieConsentManager locale={locale} />
        </div>
      </body>
    </html>
  );
}

