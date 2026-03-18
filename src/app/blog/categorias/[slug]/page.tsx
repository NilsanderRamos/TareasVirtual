import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { estimateBlogPostWordCount } from "@/lib/blog";
import { getAllBlogHubs, getBlogHubBySlug, getBlogHubPath, getBlogHubPosts, getBlogHubTools, getLocalizedBlogHubCopy } from "@/lib/blog-topics";
import { formatLocaleDate, pickByLocale, toOpenGraphLocale } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";
import { localizeBlogPosts, localizeToolItems } from "@/lib/localize-content";

interface BlogHubPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogHubs().map((hub) => ({ slug: hub.slug }));
}

export async function generateMetadata({ params }: BlogHubPageProps): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const { slug } = await params;
  const hub = getBlogHubBySlug(slug);

  if (!hub) {
    return { title: pickByLocale(locale, "Category not found", "Categoria no encontrada") };
  }

  const copy = getLocalizedBlogHubCopy(hub, locale);
  const canonical = getBlogHubPath(hub.slug);

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${copy.metaTitle} | ${siteConfig.name}`,
      description: copy.metaDescription,
      url: `${siteConfig.url}${canonical}`,
      siteName: siteConfig.name,
      locale: toOpenGraphLocale(locale),
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 900,
          alt: `${copy.name} | ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${copy.metaTitle} | ${siteConfig.name}`,
      description: copy.metaDescription,
      images: [siteConfig.defaultOgImage],
    },
  };
}

export default async function BlogHubPage({ params }: BlogHubPageProps) {
  const locale = await getCurrentLocale();
  const { slug } = await params;
  const hub = getBlogHubBySlug(slug);

  if (!hub) {
    notFound();
  }

  const copy = getLocalizedBlogHubCopy(hub, locale);
  const localizedPosts = await localizeBlogPosts(getBlogHubPosts(hub.slug), locale);
  const localizedTools = await localizeToolItems(getBlogHubTools(hub.slug), locale);
  const [featuredPost, ...remainingPosts] = localizedPosts;
  const spotlightPosts = remainingPosts.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <section className="surface-card editorial-aurora relative overflow-hidden rounded-4xl px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-white/35 to-transparent" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.12),transparent_24%)]"
        />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_22rem] xl:items-start">
          <div className="max-w-4xl">
            <Link href="/blog" className="inline-flex text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
              {pickByLocale(locale, "Back to blog", "Volver al blog")}
            </Link>
            <div className="mt-4 flex flex-wrap gap-2">
              {copy.audienceSignals.map((signal, index) => (
                <span key={signal} className={`hero-chip rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong) ${index > 1 ? "hidden sm:inline-flex" : ""}`}>
                  {signal}
                </span>
              ))}
            </div>
            <p className="section-label mt-4 text-xs font-semibold uppercase">{copy.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-(--ink) sm:text-5xl lg:text-6xl">{copy.name}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-(--muted) sm:text-xl sm:leading-8">{copy.longDescription}</p>
            <div className="mt-6 grid gap-3 text-sm text-(--muted) sm:grid-cols-2">
              <span className="hero-chip rounded-2xl px-4 py-3 text-center text-(--ink)">{localizedPosts.length} {pickByLocale(locale, localizedPosts.length === 1 ? "article in this hub" : "articles in this hub", localizedPosts.length === 1 ? "articulo en este hub" : "articulos en este hub")}</span>
              <span className="hero-chip rounded-2xl px-4 py-3 text-center text-(--ink)">{localizedTools.length} {pickByLocale(locale, localizedTools.length === 1 ? "connected tool" : "connected tools", localizedTools.length === 1 ? "herramienta conectada" : "herramientas conectadas")}</span>
            </div>
          </div>

          <aside className="rounded-4xl border border-(--line) bg-white/58 p-5 shadow-[0_18px_46px_rgba(20,35,26,0.06)] sm:p-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-(--highlight)">{pickByLocale(locale, "Why this hub matters", "Por que importa este hub")}</p>
            <div className="mt-4 space-y-3">
              {copy.benefits.map((benefit) => (
                <div key={benefit.title} className="rounded-3xl border border-(--line) bg-white/62 px-4 py-4">
                  <p className="text-sm font-semibold text-(--ink)">{benefit.title}</p>
                  <p className="mt-2 text-sm leading-6 text-(--muted)">{benefit.description}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {featuredPost ? (
        <section className="deferred-section mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_20rem] lg:gap-6">
          <Link href={`/blog/${featuredPost.slug}`} className="surface-card group overflow-hidden rounded-4xl">
            <div className="relative aspect-16/10 overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                priority
              />
            </div>
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Featured reading", "Lectura destacada")}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong)">
                <span>{featuredPost.category}</span>
                <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                <span>{Math.max(1, Math.ceil(estimateBlogPostWordCount(featuredPost) / 220))} {pickByLocale(locale, "min read", "min de lectura")}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-(--ink) group-hover:text-(--accent-strong) sm:text-3xl">{featuredPost.title}</h2>
              <p className="mt-4 text-sm leading-7 text-(--muted)">{featuredPost.description}</p>
              <p className="mt-5 text-sm font-semibold text-(--accent-strong)">{pickByLocale(locale, "Read hub anchor article", "Leer articulo ancla del hub")}</p>
            </div>
          </Link>

          <div className="surface-card rounded-4xl px-5 py-6 sm:px-6 sm:py-7">
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Next routes", "Siguientes rutas")}</p>
            <div className="mt-4 space-y-3">
              {spotlightPosts.length > 0 ? spotlightPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-3xl border border-(--line) bg-white/60 px-4 py-4 transition hover:-translate-y-0.5 hover:border-(--accent)">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{post.category}</p>
                  <p className="mt-2 text-base font-semibold text-(--ink)">{post.title}</p>
                  <p className="mt-2 text-sm leading-6 text-(--muted)">{formatLocaleDate(post.date, locale)}</p>
                </Link>
              )) : (
                <div className="rounded-3xl border border-(--line) bg-white/60 px-4 py-4 text-sm leading-6 text-(--muted)">
                  {pickByLocale(locale, "This hub is ready to grow with more articles in the same cluster.", "Este hub esta listo para crecer con mas articulos dentro del mismo cluster.")}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {localizedTools.length > 0 ? (
        <section className="deferred-section mt-8 surface-card rounded-4xl px-5 py-6 sm:mt-10 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Connected tools", "Herramientas conectadas")}</p>
              <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">{pickByLocale(locale, "Move from reading to execution without leaving the topic.", "Pasa de la lectura a la ejecucion sin salir del tema.")}</h2>
            </div>
            <Link href="/tools" className="text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
              {pickByLocale(locale, "See all tools", "Ver todas las herramientas")}
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {localizedTools.map((tool) => (
              <Link key={tool.slug} href={tool.detailHref} className="rounded-3xl border border-(--line) bg-white/60 px-5 py-5 transition hover:-translate-y-1 hover:border-(--accent)">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{tool.intentLabel}</p>
                <h3 className="mt-3 text-xl font-semibold text-(--ink)">{tool.name}</h3>
                <p className="mt-3 text-sm leading-7 text-(--muted)">{tool.description}</p>
                <p className="mt-4 text-sm leading-6 text-(--ink)">{tool.primaryOutcome}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {remainingPosts.length > 0 ? (
        <section className="deferred-section mt-8 surface-card rounded-4xl px-5 py-6 sm:mt-10 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Hub archive", "Archivo del hub")}</p>
              <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">{pickByLocale(locale, "More articles inside the same strategic area.", "Mas articulos dentro de la misma area estrategica.")}</h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
              {pickByLocale(locale, "Return to the full archive", "Volver al archivo completo")}
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {remainingPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-3xl border border-(--line) bg-white/60 px-5 py-5 transition hover:-translate-y-1 hover:border-(--accent)">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{post.category}</p>
                <h3 className="mt-3 text-xl font-semibold text-(--ink)">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-(--muted)">{post.description}</p>
                <p className="mt-4 text-xs text-(--muted)">{post.author} · {formatLocaleDate(post.date, locale)}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}