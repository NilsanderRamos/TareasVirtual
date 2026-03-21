"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { trackSiteEvent } from "@/lib/analytics";
import { estimateBlogPostWordCount } from "@/lib/blog";
import { formatLocaleDate, SiteLocale, pickByLocale } from "@/lib/i18n";
import { BlogPost } from "@/types";

interface BlogExplorerProps {
  posts: BlogPost[];
  locale: SiteLocale;
  initialQuery?: string;
}

function getCategoryPreviewClass(post: BlogPost) {
  const category = post.category.toLowerCase();

  if (category.includes("software") || category.includes("ecommerce")) {
    return "from-emerald-500/18 via-white/10 to-teal-500/10";
  }

  if (category.includes("finanzas")) {
    return "from-amber-500/18 via-white/10 to-emerald-500/10";
  }

  if (category.includes("productividad") || category.includes("aprendizaje")) {
    return "from-sky-500/16 via-white/10 to-emerald-500/10";
  }

  return "from-slate-500/12 via-white/10 to-emerald-500/10";
}

export function BlogExplorer({ posts, locale, initialQuery = "" }: BlogExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const deferredQuery = useDeferredValue(query);
  const allCategoryLabel = pickByLocale(locale, "All", "Todas");
  const categories = [allCategoryLabel, ...Array.from(new Set(posts.map((post) => post.category))).sort()];
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === allCategoryLabel || post.category === selectedCategory;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.description.toLowerCase().includes(normalizedQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesQuery;
  });

  return (
    <section id="archivo-reciente" className="blog-reveal blog-reveal-delay-1 deferred-section mt-5 scroll-mt-28 sm:mt-6">
      <div className="surface-card blog-archive-shell rounded-4xl px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Latest articles", "Articulos recientes")}</p>
            <h2 className="mt-3 text-2xl font-semibold text-(--ink) sm:text-3xl">{pickByLocale(locale, "Browse the latest posts fast.", "Explora rapido los ultimos articulos.")}</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-(--muted)">
            {pickByLocale(locale, "Visual cards with less noise so category, headline, and click path are clear from the first glance.", "Tarjetas visuales con menos ruido para que categoria, titular y clic queden claros desde el primer vistazo.")}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = category === selectedCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    trackSiteEvent("blog_filter_selected", { category });
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    active
                      ? "bg-(--solid-bg) text-(--solid-fg)"
                      : "border border-(--line) bg-white/70 text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)"
                  }`}
                >
                  {category}
                </button>
              );
            })}
        </div>

        <p className="mt-4 text-sm text-(--muted)">{filteredPosts.length} {pickByLocale(locale, filteredPosts.length === 1 ? "result" : "results", filteredPosts.length === 1 ? "resultado" : "resultados")}</p>

        {filteredPosts.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => {
              return (
              <article key={post.slug} className="group surface-card blog-grid-card flex h-full flex-col overflow-hidden rounded-[1.15rem]">
                <Link href={`/blog/${post.slug}`} className={`blog-grid-media relative block overflow-hidden bg-linear-to-br ${getCategoryPreviewClass(post)} min-h-48`}>
                  <div className="absolute inset-0">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,35,26,0.02),rgba(20,35,26,0.26))]" />
                </Link>
                <div className="blog-grid-body flex h-full flex-col px-4 py-3.5 sm:px-4.5 sm:py-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="blog-grid-pill">{post.category}</span>
                  </div>
                  <h3 className="blog-card-title mt-3 text-[0.93rem] font-semibold leading-tight text-(--ink) sm:text-[1.02rem]">{post.title}</h3>
                  <p className="blog-card-excerpt mt-2 text-sm leading-6 text-(--muted)">{post.description}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <div className="flex flex-wrap items-center gap-3 text-[0.72rem] text-(--muted)">
                      <span>{formatLocaleDate(post.date, locale)}</span>
                      <span className="h-1 w-1 rounded-full bg-(--line)" />
                      <span>{Math.max(1, Math.ceil(estimateBlogPostWordCount(post) / 220))} {pickByLocale(locale, "min read", "min")}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      onClick={() => trackSiteEvent("blog_result_clicked", { slug: post.slug, category: post.category })}
                      className="blog-grid-cta"
                    >
                      {pickByLocale(locale, "Read", "Leer")}
                    </Link>
                  </div>
                </div>
              </article>
            )})}
          </div>
        ) : (
          <div className="mt-6 rounded-4xl border border-dashed border-(--line) bg-white/50 px-5 py-6 text-center">
            <h3 className="text-xl font-semibold text-(--ink)">{pickByLocale(locale, "No matches for those filters.", "No hay coincidencias con esos filtros.")}</h3>
            <p className="mt-3 text-sm leading-7 text-(--muted)">{pickByLocale(locale, "Try another category or a shorter search.", "Prueba otra categoria o una busqueda mas corta.")}</p>
          </div>
        )}
      </div>
    </section>
  );
}