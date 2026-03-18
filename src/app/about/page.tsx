import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { pickByLocale, toOpenGraphLocale } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const title = pickByLocale(locale, "About Us", "Sobre Nosotros");
  const description = pickByLocale(locale, `Learn about the mission and approach behind ${siteConfig.name}.`, "Conoce la mision y enfoque de TareasVirtual.");

  return {
    title,
    description,
    alternates: {
      canonical: "/about",
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/about`,
      siteName: siteConfig.name,
      locale: toOpenGraphLocale(locale),
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: pickByLocale(locale, `About ${siteConfig.name}`, `Sobre ${siteConfig.name}`),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.defaultOgImage],
    },
  };
}

export default async function AboutPage() {
  const locale = await getCurrentLocale();
  const pillars = [
    {
      title: pickByLocale(locale, "Practical clarity", "Claridad practica"),
      description: pickByLocale(locale, "We explain each topic with a simple structure so you can act quickly without losing context.", "Explicamos cada tema con estructura simple para que puedas actuar rapido sin perder contexto."),
    },
    {
      title: pickByLocale(locale, "Daily usefulness", "Utilidad diaria"),
      description: pickByLocale(locale, "We prioritize guides and tools that solve real study, work, and organization tasks.", "Priorizamos guias y herramientas que resuelven tareas reales de estudio, trabajo y organizacion."),
    },
    {
      title: pickByLocale(locale, "Comfortable mobile reading", "Lectura comoda en movil"),
      description: pickByLocale(locale, "Information is organized so it is easy to understand on a small screen without heavy blocks.", "La informacion se ordena para que en pantalla pequena se entienda rapido y sin bloques pesados."),
    },
  ];

  const quickRoutes = [
    { href: "/blog", label: pickByLocale(locale, "Read guides", "Leer guias"), detail: pickByLocale(locale, "Actionable articles to study and work better.", "Articulos accionables para estudiar y trabajar mejor.") },
    { href: "/tools", label: pickByLocale(locale, "Use tools", "Usar herramientas"), detail: pickByLocale(locale, "Quick resources to simplify frequent tasks.", "Recursos rapidos para simplificar tareas frecuentes.") },
    { href: "/contact", label: pickByLocale(locale, "Get in touch", "Contactar"), detail: pickByLocale(locale, "Direct channel for questions, support, or collaborations.", "Canal directo para dudas, soporte o colaboraciones.") },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <section className="mobile-pane overflow-hidden rounded-[28px] border border-slate-200/80 bg-linear-to-br from-white via-slate-50 to-sky-50 p-5 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">{pickByLocale(locale, `About ${siteConfig.name}`, `Sobre ${siteConfig.name}`)}</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {pickByLocale(locale, "A clearer base for studying and working with less friction.", "Una base clara para estudiar y trabajar con menos friccion.")}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
          {pickByLocale(locale, `${siteConfig.name} was built to help students and professionals work with more clarity, better processes, and less stress. The core idea is simple: useful content, clean structure, and an experience that works well on mobile.`, `${siteConfig.name} nace para ayudar a estudiantes y profesionales a trabajar con mas claridad, mejores procesos y menos estres. La idea central es simple: contenido util, estructura limpia y una experiencia que se entienda bien desde el movil.`)}
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {quickRoutes.map((route, index) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-left transition hover:border-sky-300 hover:bg-sky-50/70 sm:min-w-55"
            >
              <p className="text-sm font-semibold text-slate-900">{route.label}</p>
              <p className={`mt-1 text-xs leading-6 text-slate-600 ${index > 1 ? "hidden sm:block" : ""}`}>{route.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="mobile-pane rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {pickByLocale(locale, "How we work", "Como trabajamos")}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {pickByLocale(locale, "Direct, actionable content designed to be used fast.", "Contenido directo, accionable y pensado para usarse rapido.")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {pickByLocale(locale, "We are not trying to fill the site with long text that goes nowhere. Every guide should help you understand what to do, what to avoid, and what the next step is. That applies to articles, tools, and informational pages alike.", "No buscamos llenar el sitio con texto largo sin direccion. Cada guia debe ayudarte a entender que hacer, que evitar y cual es el siguiente paso. Eso aplica tanto a los articulos como a las herramientas y a las paginas informativas.")}
          </p>
        </div>

        <div className="mobile-pane rounded-3xl border border-slate-200 bg-slate-900 p-5 text-slate-50 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
            {pickByLocale(locale, "Goal", "Objetivo")}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{pickByLocale(locale, "Make information understandable immediately.", "Que la informacion se entienda de inmediato.")}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            {pickByLocale(locale, "We reduce noise, improve visual hierarchy, and keep reading comfortable so every page stays useful even in short phone sessions.", "Reducimos ruido, mejoramos la jerarquia visual y mantenemos una lectura comoda para que cada pagina sea util incluso en sesiones cortas desde el telefono.")}
          </p>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {pickByLocale(locale, "Pillars", "Pilares")}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{pickByLocale(locale, "What we prioritize in every publication", "Lo que priorizamos en cada publicacion")}</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <section
              key={pillar.title}
              className={`mobile-pane rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${index === 2 ? "hidden md:block" : ""}`}
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
