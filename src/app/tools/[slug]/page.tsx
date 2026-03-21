import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { ToolWidget } from "@/components/tools/ToolWidgets";
import { tools } from "@/content/tools";
import { siteConfig } from "@/config/site";
import { getCurrentLocale } from "@/lib/i18n-server";
import { formatLocaleDate, pickByLocale, toOpenGraphLocale } from "@/lib/i18n";
import { localizeToolItem } from "@/lib/localize-content";
import { getToolBySlug } from "@/lib/tools";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);
  const locale = await getCurrentLocale();

  if (!tool) {
    return { title: pickByLocale(locale, "Tool not found", "Herramienta no encontrada") };
  }

  const localizedTool = await localizeToolItem(tool, locale);

  return {
    title: localizedTool.name,
    description: localizedTool.description,
    alternates: {
      canonical: localizedTool.detailHref,
    },
    openGraph: {
      title: `${localizedTool.name} | ${siteConfig.name}`,
      description: localizedTool.description,
      url: `${siteConfig.url}${localizedTool.detailHref}`,
      siteName: siteConfig.name,
      type: "website",
      locale: toOpenGraphLocale(locale),
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 900,
          alt: pickByLocale(locale, `${localizedTool.name} on ${siteConfig.name}`, `${localizedTool.name} en ${siteConfig.name}`),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${localizedTool.name} | ${siteConfig.name}`,
      description: localizedTool.description,
      images: [siteConfig.defaultOgImage],
    },
  };
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);
  const locale = await getCurrentLocale();

  if (!tool) {
    notFound();
  }

  const localizedTool = await localizeToolItem(tool, locale);
  const isSalaryCalculator = tool.slug === "calculadora-salario-neto-usa";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      {isSalaryCalculator ? (
        <section className="blog-reveal px-1 py-1 sm:px-0">
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-(--ink) sm:text-5xl lg:text-6xl">{localizedTool.name}</h1>
        </section>
      ) : (
        <section className="blog-reveal surface-card relative overflow-hidden rounded-4xl px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.12),transparent_24%)]" />
          <div className="relative">
            <Link href="/tools" className="inline-flex items-center text-sm font-semibold text-(--accent-strong) hover:text-(--highlight)">
              {pickByLocale(locale, "Back to tools", "Volver a herramientas")}
            </Link>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="hero-chip rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{localizedTool.category}</span>
              <span className="hero-chip rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{pickByLocale(locale, "Updated", "Actualizada")} {formatLocaleDate(localizedTool.updatedAt, locale)}</span>
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-(--ink) sm:text-5xl lg:text-6xl">{localizedTool.name}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-(--muted) sm:text-xl sm:leading-8">{localizedTool.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {localizedTool.bestFor.slice(0, 2).map((item) => (
                <span key={item} className="rounded-full border border-(--line) bg-white/60 px-4 py-2 text-sm font-medium text-(--ink)">
                  {item}
                </span>
              ))}
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-(--ink)">{localizedTool.primaryOutcome}</p>

            <div className="action-strip mt-6 rounded-4xl p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">{pickByLocale(locale, "Direct use", "Uso directo")}</p>
                  <h2 className="mt-2 text-xl font-semibold text-(--ink)">{pickByLocale(locale, "Try it and decide quickly whether it fits your workflow.", "Pruebala y decide rapido si encaja en tu flujo.")}</h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <TrackedLink href="#herramienta-en-uso" eventName="tool_launch_clicked" payload={{ tool: tool.slug, source: "tool_detail_hero" }} className="inline-flex items-center justify-center rounded-full bg-(--solid-bg) px-5 py-3 text-sm font-semibold text-(--solid-fg) hover:bg-(--solid-bg-hover)">
                    {pickByLocale(locale, "Open tool", "Abrir herramienta")}
                  </TrackedLink>
                  <TrackedLink href="/contact" eventName="tool_contact_clicked" payload={{ tool: tool.slug }} className="inline-flex items-center justify-center rounded-full border border-(--line) px-5 py-3 text-sm font-semibold text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)">
                    {pickByLocale(locale, "Ask about it", "Consultar")}
                  </TrackedLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="herramienta-en-uso" className={`blog-reveal blog-reveal-delay-1 ${isSalaryCalculator ? "mt-4" : "mt-8"} scroll-mt-28 surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8 ${isSalaryCalculator ? "border-[rgba(15,118,110,0.16)] bg-[linear-gradient(180deg,rgba(255,252,246,0.94),rgba(255,249,240,0.9))] shadow-[0_26px_70px_rgba(20,35,26,0.1)]" : ""}`}>
        {!isSalaryCalculator ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Tool in action", "Herramienta en uso")}</p>
                <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">{pickByLocale(locale, "Try it here before deciding whether it belongs in your workflow.", "Pruebala aqui antes de decidir si se queda en tu flujo.")}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="hero-chip rounded-full px-3 py-1.5 text-xs font-medium text-(--ink)">{localizedTool.intentLabel}</span>
                <span className="hero-chip rounded-full px-3 py-1.5 text-xs font-medium text-(--ink)">{localizedTool.decisionStage}</span>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-(--muted)">{localizedTool.primaryOutcome}. {pickByLocale(locale, "The interaction is local and presented in a more compact way so the trial does not feel heavy.", "La interaccion es local y esta presentada de forma mas compacta para que la prueba no se sienta pesada.")}</p>
          </>
        ) : null}
        <div className="mt-6">
          <ToolWidget tool={tool} locale={locale} />
        </div>
      </section>

      <AdSlot slotName="tool-detail-inline" locale={locale} className="mt-8 mx-auto w-full max-w-4xl" />
    </div>
  );
}