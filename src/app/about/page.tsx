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
        <div className="mt-6 mobile-pane rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {pickByLocale(locale, "Mission and approach", "Mision y funcionamiento")}
          </p>
          <h2 className="mt-2 max-w-2xl text-2xl font-semibold text-slate-900">
            {pickByLocale(locale, "Useful content, simple tools, and a short path to action.", "Contenido util, herramientas simples y una ruta corta hacia la accion.")}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            {pickByLocale(locale, `${siteConfig.name} exists to make studying, organizing work, and making digital decisions feel clearer. It works with a simple structure: first understand the problem, then choose the right tool or guide, and finally move into action without unnecessary blocks.`, `${siteConfig.name} existe para hacer que estudiar, organizar trabajo y tomar decisiones digitales se sienta mas claro. Funciona con una estructura simple: primero entender el problema, luego elegir la guia o herramienta correcta y por ultimo pasar a la accion sin bloques innecesarios.`)}
          </p>
          <div className="mt-5">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700"
            >
              {pickByLocale(locale, "View blog", "Ver blog")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
