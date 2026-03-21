import Link from "next/link";
import { CookieSettingsButton } from "@/components/ads/CookieSettingsButton";
import { siteConfig } from "@/config/site";
import { SiteLocale, pickByLocale } from "@/lib/i18n";

export function Footer({ locale }: { locale: SiteLocale }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-4 pb-6 pt-12 sm:pt-16">
      <div className="mx-auto max-w-6xl rounded-4xl border border-(--line) bg-(--solid-bg) px-5 py-8 text-(--solid-fg) shadow-[0_20px_80px_rgba(20,35,26,0.2)] sm:px-8 sm:py-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr] lg:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(255,255,255,0.65)]">
              {pickByLocale(locale, "Editorial platform", "Plataforma editorial")}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{siteConfig.name}</h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-[rgba(255,255,255,0.72)]">
              {pickByLocale(locale, "Original guides, useful tools, and resources built to work with more clarity, better processes, and less digital noise.", "Guias originales, herramientas utiles y recursos pensados para trabajar con mas criterio, organizar mejor procesos y tomar decisiones digitales con menos ruido.")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.72)]">
              {pickByLocale(locale, "Explore", "Explora")}
            </h4>
            <nav className="mt-4 grid gap-2 text-sm text-[rgba(255,255,255,0.82)]">
              <Link href="/blog" className="rounded-2xl border border-white/10 px-3 py-3 hover:text-white sm:border-0 sm:px-0 sm:py-0">
                Blog
              </Link>
              <Link href="/tools" className="rounded-2xl border border-white/10 px-3 py-3 hover:text-white sm:border-0 sm:px-0 sm:py-0">
                {pickByLocale(locale, "Tools", "Herramientas")}
              </Link>
              <Link href="/about" className="rounded-2xl border border-white/10 px-3 py-3 hover:text-white sm:border-0 sm:px-0 sm:py-0">
                {pickByLocale(locale, "About us", "Sobre nosotros")}
              </Link>
              <Link href="/contact" className="rounded-2xl border border-white/10 px-3 py-3 hover:text-white sm:border-0 sm:px-0 sm:py-0">
                {pickByLocale(locale, "Contact", "Contacto")}
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.72)]">
              {pickByLocale(locale, "Legal", "Legal")}
            </h4>
            <nav className="mt-4 grid gap-2 text-sm text-[rgba(255,255,255,0.82)]">
              <Link href="/privacy-policy" className="rounded-2xl border border-white/10 px-3 py-3 hover:text-white sm:border-0 sm:px-0 sm:py-0">
                {pickByLocale(locale, "Privacy Policy", "Politica de Privacidad")}
              </Link>
              <Link href="/terms" className="rounded-2xl border border-white/10 px-3 py-3 hover:text-white sm:border-0 sm:px-0 sm:py-0">
                {pickByLocale(locale, "Terms of Use", "Terminos de Uso")}
              </Link>
              <CookieSettingsButton locale={locale} />
            </nav>
          </div>

          <div className="hidden sm:block">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.72)]">
              {pickByLocale(locale, "Approach", "Enfoque")}
            </h4>
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[rgba(255,255,255,0.78)]">
              {pickByLocale(locale, "Authentic content, thoughtful SEO, and practical tools to grow a site with real organic traffic and a stronger identity.", "Contenido autentico, SEO bien planteado y herramientas practicas para hacer crecer un sitio con trafico organico real y una identidad mas fuerte.")}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-[rgba(255,255,255,0.6)] sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <p>{currentYear} {siteConfig.name}. {pickByLocale(locale, "All rights reserved.", "Todos los derechos reservados.")}</p>
          <p>{siteConfig.url}</p>
        </div>
      </div>
    </footer>
  );
}
