import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/config/site";
import { pickByLocale } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Canales de contacto para dudas, soporte o colaboraciones.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contacto | ${siteConfig.name}`,
    description: "Canales de contacto para dudas, soporte o colaboraciones.",
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 900,
        alt: `${siteConfig.name} contacto`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Contacto | ${siteConfig.name}`,
    description: "Canales de contacto para dudas, soporte o colaboraciones.",
    images: [siteConfig.defaultOgImage],
  },
};

export default async function ContactPage() {
  const locale = await getCurrentLocale();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <section className="contact-reveal mobile-pane rounded-[28px] border border-slate-200 bg-linear-to-br from-white via-emerald-50/50 to-sky-50 p-5 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">{pickByLocale(locale, "Contact", "Contacto")}</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {pickByLocale(locale, "Write to us directly.", "Escribenos sin rodeos.")}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
              {pickByLocale(locale, `If you need help with the site, have a specific question, or want to collaborate with ${siteConfig.name}, this is the direct route.`, `Si necesitas ayuda con el sitio, tienes una duda puntual o quieres colaborar con ${siteConfig.name}, aqui tienes la via directa.`)}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6">
              {[
                "Soporte del sitio",
                "Consultas editoriales",
                "Colaboraciones",
              ].map((item, index) => (
                <span key={item} className={`hero-chip ${index > 1 ? "hidden sm:inline-flex" : ""}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <aside className="surface-card rounded-[26px] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">{pickByLocale(locale, "Typical reply", "Respuesta habitual")}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-(--ink)">{pickByLocale(locale, "24 to 48 business hours", "24 a 48 horas habiles")}</p>
            <p className="mt-3 text-sm leading-7 text-(--muted)">{pickByLocale(locale, "Share context and, if relevant, the related URL so we can reply faster.", "Comparte contexto y, si aplica, la URL relacionada para acelerar la respuesta.")}</p>
            <div className="mt-4 grid gap-2 sm:hidden">
              <div className="rounded-2xl border border-(--line) bg-white/70 px-4 py-3 text-sm text-(--ink)">{pickByLocale(locale, "The more specific the message, the better the reply.", "Cuanto mas concreto el mensaje, mejor la respuesta.")}</div>
              <div className="rounded-2xl border border-(--line) bg-white/70 px-4 py-3 text-sm text-(--ink)">{pickByLocale(locale, "If a page is involved, share the link.", "Si hay una pagina implicada, comparte el enlace.")}</div>
            </div>
          </aside>
        </div>
      </section>

      <section className="contact-reveal contact-reveal-delay-1 mt-6">
        <ContactForm locale={locale} />
      </section>

      <section className="contact-reveal contact-reveal-delay-2 mt-6">
        <section className="mobile-pane rounded-[28px] border border-emerald-200 bg-linear-to-br from-emerald-500 via-emerald-400 to-sky-400 p-5 text-slate-950 shadow-[0_22px_60px_-30px_rgba(16,185,129,0.7)] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-950/70">{pickByLocale(locale, "Quick contact", "Contacto rapido")}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">{pickByLocale(locale, "If you already know what you need, write directly.", "Si ya lo tienes claro, escribe directo.")}</h2>
          <p className="mt-3 text-sm leading-7 text-emerald-950/85">
            {pickByLocale(locale, `For support, suggestions, or proposals aligned with the ${siteConfig.name} audience, this is still the main channel.`, `Para soporte, sugerencias o propuestas alineadas con la audiencia de ${siteConfig.name}, este sigue siendo el canal principal.`)}
          </p>
          <a
            href="mailto:hola@tareasvirtual.com?subject=Consulta%20desde%20TareasVirtual"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            {pickByLocale(locale, "Open email", "Abrir correo")}
          </a>
        </section>
      </section>
    </div>
  );
}
