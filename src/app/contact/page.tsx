import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/config/site";

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

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <section className="contact-reveal mobile-pane rounded-[28px] border border-slate-200 bg-linear-to-br from-white via-emerald-50/50 to-sky-50 p-5 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Contacto</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Escribenos sin rodeos.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
              Si necesitas ayuda con el sitio, tienes una duda puntual o quieres colaborar con {siteConfig.name}, aqui tienes la via directa.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6">
              <span className="hero-chip">Soporte del sitio</span>
              <span className="hero-chip">Consultas editoriales</span>
              <span className="hero-chip">Colaboraciones</span>
            </div>
          </div>

          <aside className="surface-card rounded-[26px] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">Respuesta habitual</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-(--ink)">24 a 48 horas habiles</p>
            <p className="mt-3 text-sm leading-7 text-(--muted)">Comparte contexto y, si aplica, la URL relacionada para acelerar la respuesta.</p>
          </aside>
        </div>
      </section>

      <section className="contact-reveal contact-reveal-delay-1 mt-6">
        <ContactForm />
      </section>

      <section className="contact-reveal contact-reveal-delay-2 mt-6">
        <section className="mobile-pane rounded-[28px] border border-emerald-200 bg-linear-to-br from-emerald-500 via-emerald-400 to-sky-400 p-5 text-slate-950 shadow-[0_22px_60px_-30px_rgba(16,185,129,0.7)] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-950/70">Contacto rapido</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Si ya lo tienes claro, escribe directo.</h2>
          <p className="mt-3 text-sm leading-7 text-emerald-950/85">
            Para soporte, sugerencias o propuestas alineadas con la audiencia de {siteConfig.name}, este sigue siendo el canal principal.
          </p>
          <a
            href="mailto:hola@tareasvirtual.com?subject=Consulta%20desde%20TareasVirtual"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Abrir correo
          </a>
        </section>
      </section>
    </div>
  );
}
