import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/AdSlot";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { blogPosts } from "@/content/blog/posts";
import { siteConfig } from "@/config/site";
import { pickByLocale, toOpenGraphLocale } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";
import { localizeBlogPosts } from "@/lib/localize-content";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const title = "Blog";
  const description = pickByLocale(locale, "Editorial archive with original comparisons, practical guides, and commercial content to make better decisions in 2026.", "Archivo editorial con comparativas originales, guias practicas y contenido comercial en espanol para decidir mejor en 2026.");

  return {
    title,
    description,
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/blog`,
      siteName: siteConfig.name,
      locale: toOpenGraphLocale(locale),
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 900,
          alt: pickByLocale(locale, `${siteConfig.name} editorial blog`, `${siteConfig.name} blog editorial`),
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

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const locale = await getCurrentLocale();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialQuery = resolvedSearchParams?.q?.trim() ?? "";
  const localizedPosts = await localizeBlogPosts(blogPosts, locale);
  const [, ...remainingPosts] = localizedPosts;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <section id="blog-portada" className="scroll-mt-28">
        <div className="surface-card editorial-aurora relative overflow-hidden rounded-4xl px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
          <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-white/26 to-transparent" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.1),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.06),transparent_20%)]"
          />
          <form action="/blog#archivo-reciente" method="get" className="relative blog-hero-search grid gap-2 rounded-[1.7rem] border border-(--line) bg-white/70 p-2.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-3">
            <label className="block">
              <span className="sr-only">{pickByLocale(locale, "Search blog articles", "Buscar articulos del blog")}</span>
              <input
                type="search"
                name="q"
                defaultValue={initialQuery}
                placeholder={pickByLocale(locale, "Search by topic, title, or keyword", "Buscar por tema, titulo o palabra clave")}
                className="w-full rounded-[1.1rem] border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--accent)"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-(--solid-bg) px-5 py-3 text-sm font-semibold text-(--solid-fg) transition hover:-translate-y-0.5 hover:bg-(--solid-bg-hover)"
            >
              {pickByLocale(locale, "Search articles", "Buscar articulos")}
            </button>
          </form>
        </div>
      </section>

      {remainingPosts.length > 0 ? <BlogExplorer posts={remainingPosts} locale={locale} initialQuery={initialQuery} /> : null}

      <AdSlot slotName="blog-inline" locale={locale} className="mx-auto mt-5 w-full max-w-4xl sm:mt-6" />

      {remainingPosts.length === 0 ? (
        <section className="mt-8 rounded-4xl border border-dashed border-(--line) bg-white/45 px-5 py-6 text-center sm:mt-10 sm:px-8 sm:py-8">
          <h2 className="text-2xl font-semibold text-(--ink)">{pickByLocale(locale, "The blog does not have published articles yet.", "El blog todavia no tiene articulos publicados.")}</h2>
          <p className="mt-3 text-sm leading-7 text-(--muted)">
            {pickByLocale(locale, "The structure is already prepared to show content clearly and in a mobile-optimized way when new posts are published.", "La estructura ya esta preparada para mostrar contenidos de forma clara y optimizada en movil cuando se publiquen nuevas entradas.")}
          </p>
        </section>
      ) : null}
    </div>
  );
}

