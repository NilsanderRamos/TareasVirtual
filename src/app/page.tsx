import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { blogPosts } from "@/content/blog/posts";
import { siteConfig } from "@/config/site";
import { tools } from "@/content/tools";
import { pickByLocale, toOpenGraphLocale } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";
import { estimateBlogPostWordCount } from "@/lib/blog";
import { localizeBlogPosts, localizeToolItems } from "@/lib/localize-content";

function ToolGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 6.5a4 4 0 0 0-5.18 5.17L4.6 16.4a1.4 1.4 0 0 0 0 1.98l1.02 1.02a1.4 1.4 0 0 0 1.98 0l4.72-4.72A4 4 0 0 0 17.5 9.5l-2.34 1.02-2.68-2.68L14.5 6.5Z" />
    </svg>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const title = pickByLocale(locale, "Home", "Inicio");
  const description = pickByLocale(locale, "Free online tools and editorial guides for productivity, study, AI, and digital decisions with better judgment.", "Herramientas online gratuitas y guias editoriales en espanol para productividad, estudio, IA y decisiones digitales con criterio.");

  return {
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: siteConfig.name,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: toOpenGraphLocale(locale),
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 900,
          alt: pickByLocale(locale, `${siteConfig.name} homepage`, `${siteConfig.name} portada principal`),
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

export default async function HomePage() {
  const locale = await getCurrentLocale();
  const localizedBlogPosts = await localizeBlogPosts(blogPosts, locale);
  const localizedTools = await localizeToolItems(tools, locale);
  const featuredTools = localizedTools.filter((tool) => tool.isFeatured).slice(0, 5);
  const recentPosts = localizedBlogPosts.slice(0, 4);

  const categories = Array.from(new Set(blogPosts.map((post) => post.category)))
    .map((category) => ({
      name: category,
      count: blogPosts.filter((post) => post.category === category).length,
    }))
    .sort((leftCategory, rightCategory) => rightCategory.count - leftCategory.count || leftCategory.name.localeCompare(rightCategory.name))
    .slice(0, 4);

  const heroStats = [
    {
      value: `${localizedBlogPosts.length}+`,
      label: pickByLocale(locale, "Practical guides", "Guias practicas"),
    },
    {
      value: `${localizedTools.length}+`,
      label: pickByLocale(locale, "Ready tools", "Herramientas listas"),
    },
  ];
  const heroPrimaryCtas = [
    {
      href: "/blog",
      label: pickByLocale(locale, "Read the blog", "Ir al blog"),
      variant: "primary",
    },
    {
      href: "/tools",
      label: pickByLocale(locale, "Free tools", "Herramientas gratis"),
      variant: "secondary",
    },
  ] as const;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-8 sm:gap-12 sm:pt-12 lg:gap-16">
      <section id="inicio-destacado" className="scroll-mt-28">
        <div className="surface-card editorial-aurora hero-shell relative overflow-hidden rounded-4xl px-5 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-9">
          <div className="soft-grid absolute inset-0 opacity-18" />
          <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/34 to-transparent" />
          <div className="relative z-10 max-w-3xl">
              <p className="section-label text-[0.68rem] font-semibold uppercase tracking-[0.18em] sm:text-[0.72rem]">
                {pickByLocale(locale, "Tools and guides that get to the point", "Herramientas y guias que van al punto")}
              </p>
              <h1 className="mt-3 text-[2.3rem] font-semibold leading-[0.95] text-(--ink) sm:text-[3.5rem] lg:text-[4.45rem]">
                {pickByLocale(locale, "Useful tools and practical guides without visual noise.", "Herramientas utiles y guias practicas sin ruido visual.")}
              </h1>
              <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-(--muted) sm:text-[1.08rem] sm:leading-8">
                {pickByLocale(locale, "Read clearly, open a tool quickly, and reach the useful part faster.", "Lee claro, abre una herramienta rapido y llega antes a la parte util.")}
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6">
                {heroPrimaryCtas.map((cta) => (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className={`hero-cta min-w-40 ${cta.variant === "primary" ? "hero-cta-primary" : "hero-cta-secondary"}`}
                  >
                    {cta.label}
                  </Link>
                ))}
              </div>
          </div>

          <div className="relative z-10 mt-5 grid max-w-xl gap-2 sm:mt-6 sm:grid-cols-2">
            {heroStats.map((item) => (
              <div key={item.label} className="hero-stat-card rounded-3xl px-4 py-3.5 sm:px-4.5">
                <p className="text-xl font-semibold leading-none text-(--ink) sm:text-[1.7rem]">{item.value}</p>
                <p className="mt-1.5 text-xs leading-5 text-(--muted) sm:text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdSlot slotName="home-inline" locale={locale} className="mx-auto w-full max-w-4xl" />

      <section id="ultimos-articulos" className="surface-card scroll-mt-28 rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Latest articles", "Ultimos articulos")}</p>
            <h2 className="home-section-title mt-2.5 text-2xl font-semibold text-(--ink) sm:text-[2rem]">{pickByLocale(locale, "Fresh content to read without noise.", "Contenido reciente para leer sin ruido.")}</h2>
          </div>
          <p className="home-section-copy max-w-xl text-sm leading-6 text-(--muted)">
            {pickByLocale(locale, "A shorter list with clear cards so the first scan already tells you where to click.", "Una lista corta con tarjetas claras para que el primer vistazo ya te diga donde entrar.")}
          </p>
        </div>

        {recentPosts.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[1.75rem] border border-(--line) bg-white/58 transition hover:-translate-y-1 hover:border-(--accent)"
              >
                <div className="relative aspect-16/10 overflow-hidden border-b border-(--line)">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-xs sm:tracking-[0.18em]">
                    <span>{post.category}</span>
                    <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                    <span>{Math.max(1, Math.ceil(estimateBlogPostWordCount(post) / 220))} {pickByLocale(locale, "min", "min")}</span>
                  </div>
                  <h3 className="home-article-title mt-3 text-lg font-semibold leading-tight text-(--ink) group-hover:text-(--accent-strong) sm:text-[1.35rem]">
                    {post.title}
                  </h3>
                  <p className="home-article-excerpt mt-2.5 text-sm leading-6 text-(--muted)">{post.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs text-(--muted)">{post.author}</p>
                    <span className="blog-grid-cta">{pickByLocale(locale, "Read", "Leer")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-(--line) bg-white/40 p-5 sm:p-6">
            <h3 className="text-2xl font-semibold text-(--ink)">{pickByLocale(locale, "There are no published articles yet.", "Aun no hay articulos publicados.")}</h3>
            <p className="mt-3 text-sm leading-7 text-(--muted)">
              {pickByLocale(locale, "This section will show the latest content in a cleaner layout as soon as articles are available.", "Esta seccion mostrara el contenido reciente con un diseño mas limpio en cuanto haya articulos disponibles.")}
            </p>
          </div>
        )}
      </section>

      <section id="categorias-destacadas" className="surface-card scroll-mt-28 rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Explore by category", "Explora por categoria")}</p>
            <h2 className="home-section-title mt-2.5 text-2xl font-semibold text-(--ink) sm:text-[2rem]">{pickByLocale(locale, "Enter through the sections with more weight.", "Entra por las secciones con mas peso.")}</h2>
          </div>
          <p className="home-section-copy max-w-xl text-sm leading-6 text-(--muted)">
            {pickByLocale(locale, "Fewer categories, clearer entry points, and enough context to choose quickly.", "Menos categorias, entradas mas claras y contexto suficiente para elegir rapido.")}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href="/blog"
              className="rounded-[1.75rem] border border-(--line) bg-white/58 p-5 transition hover:-translate-y-1 hover:border-(--accent) sm:p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">
                {category.count} {pickByLocale(locale, category.count > 1 ? "articles" : "article", category.count > 1 ? "articulos" : "articulo")}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-(--ink) sm:text-2xl">{category.name}</h3>
              <p className="mt-3 text-sm leading-7 text-(--muted)">
                {pickByLocale(locale, `Guides and comparisons focused on ${category.name.toLowerCase()}.`, `Guias y comparativas centradas en ${category.name.toLowerCase()}.`)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="herramientas-destacadas-home" className="rounded-4xl border border-(--line) bg-[rgba(255,255,255,0.5)] px-5 py-6 scroll-mt-28 sm:px-8 sm:py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Featured tools", "Herramientas destacadas")}</p>
            <h2 className="home-section-title mt-2.5 text-2xl font-semibold text-(--ink) sm:text-[2rem]">{pickByLocale(locale, "Tools", "Herramientas")}</h2>
          </div>
          <Link href="/tools" className="text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
            {pickByLocale(locale, "View all", "Ver todas")}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {featuredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.detailHref}
              className="home-tool-card group flex h-full flex-col rounded-[1.55rem] border border-(--line) bg-(--surface-strong) p-4.5 shadow-[0_12px_30px_rgba(20,35,26,0.05)] transition hover:-translate-y-1 hover:border-(--accent) sm:p-5"
            >
              <div className="home-tool-icon flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(15,118,110,0.1)] text-(--accent-strong)">
                <ToolGlyph />
              </div>
              <h3 className="home-tool-title mt-3.5 text-[1.02rem] font-semibold leading-tight text-(--ink) group-hover:text-(--accent-strong) sm:text-[1.12rem]">
                {tool.name}
              </h3>
              <p className="home-tool-excerpt mt-2.5 text-sm leading-6 text-(--muted)">{tool.description}</p>
              <div className="mt-auto flex justify-end pt-4">
                <span className="home-tool-cta inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
                  {pickByLocale(locale, "Enter", "Entrar")}
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
