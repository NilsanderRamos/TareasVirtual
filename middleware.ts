import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALE_COOKIE_NAME, normalizeLocale, resolveLocaleFromAcceptLanguage } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const existingLocale = normalizeLocale(request.cookies.get(LOCALE_COOKIE_NAME)?.value);
  const browserLocale = resolveLocaleFromAcceptLanguage(request.headers.get("accept-language"));
  const locale = existingLocale ?? browserLocale;
  const response = NextResponse.next();

  if (request.cookies.get(LOCALE_COOKIE_NAME)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};