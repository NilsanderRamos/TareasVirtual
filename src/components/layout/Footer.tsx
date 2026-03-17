import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SiteLocale, pickByLocale } from "@/lib/i18n";

export function Footer({ locale }: { locale: SiteLocale }) {
  const currentYear = new Date().getFullYear();
  const footerShortcuts = [
    {
      href: "/blog",
      title: pickByLocale(locale, "Explore the blog", "Explora el blog"),
      description: pickByLocale(locale, "Original guides and comparisons to decide what to read, use, or hire next.", "Guias y comparativas originales para resolver mejor que leer, usar o contratar."),
    },
    {
      href: "/tools",
      title: pickByLocale(locale, "Open a tool", "Abre una herramienta"),
      description: pickByLocale(locale, "Free resources to move from idea to action faster with less friction.", "Recursos gratuitos para pasar mas rapido de idea a ejecucion con menos friccion."),
    },
    {
      href: "/contact",
      title: pickByLocale(locale, "Get in touch", "Habla con nosotros"),
      description: pickByLocale(locale, "Direct channel for questions, suggestions, or future site improvements.", "Canal directo para dudas, sugerencias o futuras mejoras del sitio."),
    },
  ];

  return (
    <footer className="px-4 pb-6 pt-12 sm:pt-16">
      <div className="mx-auto max-w-6xl rounded-4xl border border-(--line) bg-(--ink) px-5 py-8 text-white shadow-[0_20px_80px_rgba(20,35,26,0.2)] sm:px-8 sm:py-10">
        <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-6">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/60">{pickByLocale(locale, "Clear next step", "Cierre con direccion clara")}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{pickByLocale(locale, "The interface also supports the next step at the end of every page.", "La interfaz tambien acompana el siguiente paso al final de cada pagina.")}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
              {pickByLocale(locale, "Instead of ending abruptly, the footer keeps orientation, quick access, and enough context to continue browsing on mobile or desktop.", "En lugar de cerrar en seco, el footer mantiene orientacion, acceso rapido y contexto suficiente para seguir navegando desde movil o escritorio.")}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {footerShortcuts.map((shortcut, index) => (
              <Link key={shortcut.href} href={shortcut.href} className="footer-cta-card rounded-[1.6rem] px-4 py-4 transition hover:-translate-y-0.5 hover:border-white/20">
                <p className="text-sm font-semibold text-white">{shortcut.title}</p>
                <p className={`mt-2 text-sm leading-6 text-white/68 ${index > 1 ? "hidden sm:block" : ""}`}>{shortcut.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[1.6rem] border border-white/10 bg-white/5 px-4 py-5 sm:hidden">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/60">{pickByLocale(locale, "Quick finish", "Cierre rapido")}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{pickByLocale(locale, "Everything stays organized so you can continue on mobile.", "Todo queda ordenado para seguir desde movil.")}</h3>
          <p className="mt-3 text-sm leading-7 text-white/72">
            {pickByLocale(locale, "Blog, tools, and contact stay visible in clear blocks so you do not lose the thread at the end of each page.", "Blog, herramientas y contacto quedan visibles en bloques claros para no perder el hilo al final de cada pagina.")}
          </p>
        </div>

        <div className="mt-8 grid gap-6 border-t border-white/10 pt-8 sm:mt-10 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr] lg:gap-10">
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
