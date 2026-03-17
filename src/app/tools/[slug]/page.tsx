import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { ToolWidget } from "@/components/tools/ToolWidgets";
import { tools } from "@/content/tools";
import { siteConfig } from "@/config/site";
import { getCurrentLocale } from "@/lib/i18n-server";
import { formatLocaleDate, pickByLocale, toOpenGraphLocale } from "@/lib/i18n";
import { localizeBlogPosts, localizeToolItem, localizeToolItems } from "@/lib/localize-content";
import { getRelatedPostsForTool, getSimilarTools, getToolBySlug, getToolRelationReason } from "@/lib/tools";

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
  const relatedPosts = await localizeBlogPosts(getRelatedPostsForTool(tool), locale);
  const similarTools = await localizeToolItems(getSimilarTools(tool), locale);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
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
                <TrackedLink href={tool.launchHref} eventName="tool_launch_clicked" payload={{ tool: tool.slug, source: "tool_detail_hero" }} className="inline-flex items-center justify-center rounded-full bg-(--ink) px-5 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong)">
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

      <section className="blog-reveal blog-reveal-delay-1 mt-8 surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
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
        <div className="mt-6">
          <ToolWidget tool={tool} locale={locale} />
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-6">
        <div className="space-y-5">
          <section className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Key benefits", "Beneficios clave")}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {localizedTool.keyBenefits.map((benefit) => (
                <div key={benefit} className="info-tile rounded-3xl px-4 py-4">
                  <p className="text-sm leading-6 text-(--ink)">{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "How to use it", "Como usarla")}</p>
            <h2 className="mt-3 text-2xl font-semibold text-(--ink) sm:text-3xl">{pickByLocale(locale, "A simple path to start without friction.", "Ruta simple para empezar sin friccion.")}</h2>
            <div className="mt-5 grid gap-3">
              {localizedTool.quickSteps.map((step, index) => (
                <div key={step} className="rounded-3xl border border-(--line) bg-white/55 px-4 py-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{pickByLocale(locale, "Step", "Paso")} {index + 1}</p>
                  <p className="mt-2 text-sm leading-6 text-(--ink)">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Use cases", "Casos de uso")}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {localizedTool.useCases.map((useCase) => (
                <div key={useCase} className="rounded-3xl border border-(--line) bg-white/55 px-4 py-4">
                  <p className="text-sm leading-6 text-(--ink)">{useCase}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Trust and context", "Confianza y criterio")}</p>
            <h2 className="mt-3 text-2xl font-semibold text-(--ink)">{pickByLocale(locale, "What is worth knowing before using it", "Que conviene saber antes de usarla")}</h2>
            <div className="mt-5 grid gap-3">
              {localizedTool.trustPoints.map((point) => (
                <div key={point} className="info-tile rounded-3xl px-4 py-4">
                  <p className="text-sm leading-6 text-(--ink)">{point}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-(--line) pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{pickByLocale(locale, "Best for", "Mejor para")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {localizedTool.bestFor.slice(0, 4).map((item) => (
                  <span key={item} className="hero-chip rounded-full px-3 py-1.5 text-xs font-medium text-(--ink)">{item}</span>
                ))}
              </div>
            </div>
          </section>

          {relatedPosts.length > 0 ? (
            <section className="blog-reveal blog-reveal-delay-2 surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
              <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Related guides", "Guias relacionadas")}</p>
              <div className="mt-5 grid gap-3">
                {relatedPosts.map((post) => (
                  <TrackedLink key={post.slug} href={`/blog/${post.slug}`} eventName="related_post_clicked" payload={{ tool: tool.slug, post: post.slug }} className="blog-card-premium rounded-3xl border border-(--line) bg-white/60 px-4 py-4 hover:border-(--accent)">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{post.category}</p>
                    <p className="mt-2 text-base font-semibold text-(--ink)">{post.title}</p>
                    <p className="mt-2 text-sm leading-6 text-(--muted)">{post.description}</p>
                    <p className="mt-4 text-sm font-semibold text-(--accent-strong)">{pickByLocale(locale, "Read guide", "Leer guia")}</p>
                  </TrackedLink>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </section>

      {similarTools.length > 0 ? (
        <section className="mt-8 surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Related tools", "Herramientas relacionadas")}</p>
              <h2 className="mt-3 text-3xl font-semibold text-(--ink)">{pickByLocale(locale, "If this one does not fit, try another nearby route.", "Si esta no encaja, prueba otra ruta cercana.")}</h2>
            </div>
            <Link href="/tools#explorar-herramientas" className="text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
              {pickByLocale(locale, "Back to catalog", "Volver al catalogo")}
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {similarTools.map((entry) => (
              <article key={entry.slug} className="blog-card-premium rounded-[1.75rem] border border-(--line) bg-white/55 p-5 hover:border-(--accent) sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">{entry.category}</p>
                <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{entry.intentLabel}</p>
                <h3 className="mt-3 text-xl font-semibold text-(--ink)">{entry.name}</h3>
                <p className="mt-3 text-sm leading-7 text-(--muted)">{getToolRelationReason(tool, entry, locale)}</p>
                <div className="mt-5 flex flex-col gap-3">
                  <TrackedLink href={entry.detailHref} eventName="similar_tool_clicked" payload={{ tool: tool.slug, target: entry.slug, source: "tool_detail" }} className="inline-flex items-center justify-center rounded-full bg-(--ink) px-4 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong)">
                    {pickByLocale(locale, "View details", "Ver ficha")}
                  </TrackedLink>
                  <TrackedLink href={entry.launchHref} eventName="similar_tool_launch_clicked" payload={{ tool: tool.slug, target: entry.slug, source: "tool_detail" }} className="inline-flex items-center justify-center rounded-full border border-(--line) px-4 py-3 text-sm font-semibold text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)">
                    {pickByLocale(locale, "Open from collection", "Abrir desde la coleccion")}
                  </TrackedLink>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}