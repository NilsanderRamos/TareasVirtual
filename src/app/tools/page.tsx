import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/AdSlot";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";
import { siteConfig } from "@/config/site";
import { tools } from "@/content/tools";
import { pickByLocale, toOpenGraphLocale } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";
import { localizeToolItems } from "@/lib/localize-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const title = pickByLocale(locale, "Tools", "Herramientas");
  const description = pickByLocale(locale, "A tool collection with a stronger product focus so tasks, decisions, and digital work can move faster.", "Coleccion de herramientas con enfoque mas producto para ejecutar mejor tareas, decisiones y trabajo digital.");

  return {
    title,
    description,
    alternates: {
      canonical: "/tools",
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/tools`,
      siteName: siteConfig.name,
      locale: toOpenGraphLocale(locale),
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: pickByLocale(locale, `${siteConfig.name} tools`, `${siteConfig.name} herramientas`),
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

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const locale = await getCurrentLocale();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialQuery = resolvedSearchParams?.q?.trim() ?? "";
  const localizedTools = await localizeToolItems(tools, locale);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <section id="tools-portada" className="surface-card editorial-aurora relative scroll-mt-28 overflow-hidden rounded-4xl px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
        <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-white/26 to-transparent" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.1),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.06),transparent_20%)]"
        />
        <div className="relative">
          <div className="max-w-4xl">
            <form action="/tools#explorar-herramientas" method="get" className="blog-hero-search grid gap-2 rounded-[1.7rem] border border-(--line) bg-white/70 p-2.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-3">
              <label className="block">
                <span className="sr-only">{pickByLocale(locale, "Search tools", "Buscar herramientas")}</span>
                <input
                  type="search"
                  name="q"
                  defaultValue={initialQuery}
                  placeholder={pickByLocale(locale, "Search by tool, category, or use case", "Buscar por herramienta, categoria o caso de uso")}
                  className="w-full rounded-[1.1rem] border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--accent)"
                />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-(--solid-bg) px-5 py-3 text-sm font-semibold text-(--solid-fg) transition hover:-translate-y-0.5 hover:bg-(--solid-bg-hover)"
              >
                {pickByLocale(locale, "Search tools", "Buscar herramientas")}
              </button>
            </form>
          </div>
        </div>
      </section>

      <ToolsExplorer tools={localizedTools} locale={locale} initialQuery={initialQuery} />

      <AdSlot slotName="tools-inline" locale={locale} className="mx-auto mt-5 w-full max-w-4xl sm:mt-6" />
    </div>
  );
}
