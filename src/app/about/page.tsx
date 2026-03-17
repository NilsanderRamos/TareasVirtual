import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: "Conoce la mision y enfoque de TareasVirtual.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Sobre Nosotros | TareasVirtual",
    description: "Conoce la mision y enfoque de TareasVirtual.",
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Sobre TareasVirtual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre Nosotros | TareasVirtual",
    description: "Conoce la mision y enfoque de TareasVirtual.",
    images: [siteConfig.defaultOgImage],
  },
};

export default function AboutPage() {
  const pillars = [
    {
      title: "Claridad practica",
      description:
        "Explicamos cada tema con estructura simple para que puedas actuar rapido sin perder contexto.",
    },
    {
      title: "Utilidad diaria",
      description:
        "Priorizamos guias y herramientas que resuelven tareas reales de estudio, trabajo y organizacion.",
    },
    {
      title: "Lectura comoda en movil",
      description:
        "La informacion se ordena para que en pantalla pequena se entienda rapido y sin bloques pesados.",
    },
  ];

  const quickRoutes = [
    { href: "/blog", label: "Leer guias", detail: "Articulos accionables para estudiar y trabajar mejor." },
    { href: "/tools", label: "Usar herramientas", detail: "Recursos rapidos para simplificar tareas frecuentes." },
    { href: "/contact", label: "Contactar", detail: "Canal directo para dudas, soporte o colaboraciones." },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <section className="mobile-pane overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-5 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Sobre {siteConfig.name}
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Una base clara para estudiar y trabajar con menos friccion.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
          {siteConfig.name} nace para ayudar a estudiantes y profesionales a
          trabajar con mas claridad, mejores procesos y menos estres. La idea
          central es simple: contenido util, estructura limpia y una experiencia
          que se entienda bien desde el movil.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {quickRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-left transition hover:border-sky-300 hover:bg-sky-50/70 sm:min-w-[220px]"
            >
              <p className="text-sm font-semibold text-slate-900">{route.label}</p>
              <p className="mt-1 text-xs leading-6 text-slate-600">{route.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="mobile-pane rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Como trabajamos
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Contenido directo, accionable y pensado para usarse rapido.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            No buscamos llenar el sitio con texto largo sin direccion. Cada guia
            debe ayudarte a entender que hacer, que evitar y cual es el siguiente
            paso. Eso aplica tanto a los articulos como a las herramientas y a las
            paginas informativas.
          </p>
        </div>

        <div className="mobile-pane rounded-[24px] border border-slate-200 bg-slate-900 p-5 text-slate-50 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
            Objetivo
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Que la informacion se entienda de inmediato.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Reducimos ruido, mejoramos la jerarquia visual y mantenemos una lectura
            comoda para que cada pagina sea util incluso en sesiones cortas desde
            el telefono.
          </p>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Pilares
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Lo que priorizamos en cada publicacion</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <section
              key={pillar.title}
              className="mobile-pane rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-sky-700">0{index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{pillar.description}</p>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
