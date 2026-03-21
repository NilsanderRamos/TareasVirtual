"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/config/navigation";
import { LOCALE_COOKIE_NAME, SiteLocale, pickByLocale } from "@/lib/i18n";

type ThemeMode = "light" | "dark";
type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "tareasvirtual-theme";

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode;
}

function applyThemeToDocument(mode: ThemeMode, resolvedTheme: ResolvedTheme) {
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
}

function getThemeSnapshot() {
  if (typeof document === "undefined") {
    return "light:light";
  }

  const themeMode = document.documentElement.dataset.themeMode === "dark"
    ? "dark"
    : "light";
  const resolvedTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";

  return `${themeMode}:${resolvedTheme}`;
}

function subscribeToTheme(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("themechange", onStoreChange);
  return () => {
    window.removeEventListener("themechange", onStoreChange);
  };
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function ThemeIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M10 2.75a.75.75 0 0 1 .75.75v.85a.75.75 0 0 1-1.5 0V3.5a.75.75 0 0 1 .75-.75Zm0 12.9a.75.75 0 0 1 .75.75v.1a.75.75 0 0 1-1.5 0v-.1a.75.75 0 0 1 .75-.75Zm6.25-6.4a.75.75 0 0 1 0 1.5h-.85a.75.75 0 0 1 0-1.5h.85Zm-11.65 0a.75.75 0 0 1 0 1.5h-.85a.75.75 0 0 1 0-1.5h.85Zm8.203-4.017a.75.75 0 0 1 1.06 0l.6.601a.75.75 0 0 1-1.06 1.06l-.6-.6a.75.75 0 0 1 0-1.061ZM5.738 12.262a.75.75 0 0 1 1.06 0l.6.6a.75.75 0 1 1-1.06 1.06l-.6-.6a.75.75 0 0 1 0-1.06Zm8.66 1.06a.75.75 0 0 1-1.06 0l-.6-.6a.75.75 0 1 1 1.06-1.06l.6.6a.75.75 0 0 1 0 1.06ZM5.738 6.294a.75.75 0 0 1 0-1.06l.6-.601a.75.75 0 1 1 1.06 1.06l-.6.601a.75.75 0 0 1-1.06 0ZM10 6.25A3.75 3.75 0 1 1 10 13.75 3.75 3.75 0 0 1 10 6.25Zm0 1.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="4.75" />
      <path strokeLinecap="round" d="m12 12 4.25 4.25" />
    </svg>
  );
}

function LanguageSwitcher({ locale, onSelect }: { locale: SiteLocale; onSelect: (nextLocale: SiteLocale) => void }) {
  const options: SiteLocale[] = ["es", "en"];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-(--line) bg-white/85 p-1">
      {options.map((option) => {
        const active = option === locale;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-full px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition ${
              active ? "bg-(--solid-bg) text-(--solid-fg)" : "text-(--muted) hover:text-(--ink)"
            }`}
            aria-pressed={active}
            aria-label={option === "en" ? "Switch language to English" : "Cambiar idioma a espanol"}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function Header({ locale }: { locale: SiteLocale }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const themeSnapshot = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light:light");
  const [themeMode] = themeSnapshot.split(":") as [ThemeMode, ResolvedTheme];

  function updateTheme(nextThemeMode: ThemeMode) {
    const nextResolvedTheme = resolveTheme(nextThemeMode);

    applyThemeToDocument(nextThemeMode, nextResolvedTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextThemeMode);
    window.dispatchEvent(new Event("themechange"));
  }

  function toggleTheme() {
    updateTheme(themeMode === "dark" ? "light" : "dark");
  }

  function updateLocale(nextLocale: SiteLocale) {
    if (nextLocale === locale) {
      return;
    }

    document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  const themeButtonLabel =
    pickByLocale(locale, `Switch to ${themeMode === "dark" ? "light" : "dark"} mode`, `Cambiar a modo ${themeMode === "dark" ? "claro" : "oscuro"}`);

  const navItems = mainNav.map((item) => ({
    ...item,
    label:
      item.href === "/blog"
          ? "Blog"
          : item.href === "/tools"
            ? pickByLocale(locale, "Tools", "Herramientas")
            : item.href === "/about"
              ? pickByLocale(locale, "About", "About")
            : pickByLocale(locale, "Contact", "Contacto"),
  }));

  return (
    <>
      <header className="sticky top-0 z-50 px-4 pt-3 sm:pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="surface-card relative rounded-[1.85rem] px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--solid-bg) text-sm font-bold text-(--solid-fg) shadow-lg shadow-black/10 sm:h-11 sm:w-11">
                    TV
                  </span>
                  <span className="min-w-0">
                    <span className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-(--accent-strong) sm:block">
                      {pickByLocale(locale, "Useful editorial platform", "Plataforma editorial util")}
                    </span>
                    <span className="block truncate text-base font-semibold text-(--ink) sm:text-lg">
                      {siteConfig.name}
                    </span>
                  </span>
                </Link>
              </div>

              <nav className="nav-shell hidden items-center gap-1 rounded-full p-1 md:flex">
                {navItems.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-(--solid-bg) text-(--solid-fg) shadow-[0_10px_24px_rgba(20,35,26,0.18)]"
                          : "text-(--muted) hover:bg-[rgba(20,35,26,0.06)] hover:text-(--ink)"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/blog#blog-portada"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-(--line) bg-white/80 text-(--muted) hover:-translate-y-0.5 hover:border-(--accent) hover:text-(--accent-strong)"
                  aria-label={pickByLocale(locale, "Search articles", "Buscar articulos")}
                  title={pickByLocale(locale, "Search articles", "Buscar articulos")}
                >
                  <SearchIcon />
                </Link>

                <LanguageSwitcher locale={locale} onSelect={updateLocale} />

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="theme-switch inline-flex h-11 w-11 items-center justify-center rounded-full border border-(--line) bg-white/80 text-(--ink) hover:-translate-y-0.5 hover:border-(--accent) hover:text-(--accent-strong)"
                  aria-label={themeButtonLabel}
                  title={themeButtonLabel}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(15,118,110,0.12)] text-(--accent-strong)">
                    <ThemeIcon />
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-(--line) bg-white md:hidden"
                aria-label={isMenuOpen ? pickByLocale(locale, "Close menu", "Cerrar menu") : pickByLocale(locale, "Open menu", "Abrir menu")}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-nav"
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span
                    className={`absolute block h-0.5 w-5 rounded-full bg-(--ink) ${
                      isMenuOpen ? "rotate-45" : "-translate-y-1.5"
                    }`}
                  />
                  <span
                    className={`absolute block h-0.5 w-5 rounded-full bg-(--ink) ${
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`absolute block h-0.5 w-5 rounded-full bg-(--ink) ${
                      isMenuOpen ? "-rotate-45" : "translate-y-1.5"
                    }`}
                  />
                </span>
              </button>
            </div>

            {isMenuOpen ? (
              <nav id="mobile-nav" className="mobile-sheet relative z-10 mt-4 rounded-[1.7rem] p-3 md:hidden">
                <div className="rounded-[1.35rem] border border-(--line) bg-[rgba(15,118,110,0.08)] px-4 py-4">
                  <p className="section-label text-[0.7rem] font-semibold uppercase">{pickByLocale(locale, "Quick navigation", "Navegacion rapida")}</p>
                  <p className="mt-2 text-sm leading-6 text-(--muted)">
                    {pickByLocale(locale, "Jump to the right section without losing context or crowding the mobile screen.", "Accede a la seccion correcta sin perder el contexto en movil ni saturar la pantalla.")}
                  </p>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <div className="rounded-[1.35rem] border border-(--line) bg-white/90 px-4 py-3.5">
                    <span className="block text-sm font-semibold text-(--ink)">{pickByLocale(locale, "Language", "Idioma")}</span>
                    <div className="mt-3">
                      <LanguageSwitcher locale={locale} onSelect={updateLocale} />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="theme-switch flex items-center justify-between rounded-[1.35rem] border border-(--line) bg-white/90 px-4 py-3.5 text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)"
                    aria-label={themeButtonLabel}
                    title={themeButtonLabel}
                  >
                    <span>
                      <span className="block text-sm font-semibold">{pickByLocale(locale, "Theme", "Tema")}</span>
                      <span className="mt-1 block text-xs text-(--muted)">
                        {themeMode === "system"
                          ? pickByLocale(locale, "Automatic", "Automatico")
                          : themeMode === "dark"
                            ? pickByLocale(locale, "Dark", "Oscuro")
                            : pickByLocale(locale, "Light", "Claro")}
                      </span>
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(15,118,110,0.12)] text-(--accent-strong)">
                      <ThemeIcon />
                    </span>
                  </button>

                  {navItems.map((item) => {
                    const active = isActivePath(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-[1.35rem] px-4 py-3.5 text-sm transition ${
                          active
                            ? "bg-(--solid-bg) text-(--solid-fg)"
                            : "bg-white/75 text-(--muted) hover:border-(--accent) hover:text-(--ink)"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="block font-semibold">{item.label}</span>
                        <span className={`mt-1 block text-xs ${active ? "text-white/70" : "text-(--muted)"}`}>
                          {item.href === "/blog"
                              ? pickByLocale(locale, "Original guides and comparisons", "Guias propias y comparativas")
                              : item.href === "/tools"
                                ? pickByLocale(locale, "Resources to take action", "Recursos para ejecutar")
                                : item.href === "/about"
                                  ? pickByLocale(locale, "What the project is and how it works", "Que es el proyecto y como funciona")
                                : pickByLocale(locale, "Direct contact channel", "Canal directo")}
                        </span>
                      </Link>
                    );
                  })}

                  <Link
                    href="/contact"
                    className="rounded-[1.35rem] border border-(--line) bg-white px-4 py-3.5 text-sm font-semibold text-(--ink)"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {pickByLocale(locale, "Contact us", "Hablemos")}
                  </Link>
                </div>
              </nav>
            ) : null}
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <button
          type="button"
          aria-label={pickByLocale(locale, "Close menu", "Cerrar menu")}
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 top-[5.35rem] z-40 bg-[rgba(7,17,22,0.16)] backdrop-blur-[1px] md:hidden"
        />
      ) : null}
    </>
  );
}

