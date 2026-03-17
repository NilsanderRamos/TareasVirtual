import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terminos de Uso",
  description: "Terminos y condiciones de uso de TareasVirtual.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: `Terminos de Uso | ${siteConfig.name}`,
    description: "Terminos y condiciones de uso de TareasVirtual.",
    url: `${siteConfig.url}/terms`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 900,
        alt: `${siteConfig.name} terminos de uso`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Terminos de Uso | ${siteConfig.name}`,
    description: "Terminos y condiciones de uso de TareasVirtual.",
    images: [siteConfig.defaultOgImage],
  },
};

export default function TermsPage() {
  const termsSections = [
    {
      title: "1. Aceptacion de los terminos",
      body: "Al acceder y usar este sitio, aceptas estos terminos y condiciones.",
    },
    {
      title: "2. Uso del contenido",
      body:
        "El contenido se ofrece con fines informativos y educativos. No se permite su reproduccion total o parcial con fines comerciales sin autorizacion previa.",
    },
    {
      title: "3. Limitacion de responsabilidad",
      body:
        "TareasVirtual no garantiza resultados especificos derivados del uso de las herramientas o guias publicadas.",
    },
    {
      title: "4. Enlaces externos",
      body:
        "Este sitio puede incluir enlaces a servicios de terceros. No somos responsables de su contenido ni de sus politicas.",
    },
    {
      title: "5. Modificaciones",
      body:
        "Podemos actualizar estos terminos en cualquier momento. Los cambios se publicaran en esta misma pagina.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <section className="mobile-pane rounded-[28px] border border-slate-200 bg-linear-to-br from-white via-slate-50 to-amber-50 p-5 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Legal</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Terminos de Uso
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500">Ultima actualizacion: 09/03/2026</p>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
          Aqui resumimos las condiciones basicas de uso del sitio, el alcance del
          contenido y los limites de responsabilidad para que esta informacion sea
          facil de revisar tambien desde movil.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/privacy-policy"
            className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
          >
            Ver privacidad
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Ir a contacto
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {termsSections.map((section) => (
          <section
            key={section.title}
            className="mobile-pane rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
          </section>
        ))}
      </section>
    </div>
  );
}
