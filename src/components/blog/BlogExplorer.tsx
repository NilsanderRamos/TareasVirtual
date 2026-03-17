"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { trackSiteEvent } from "@/lib/analytics";
import { estimateBlogPostWordCount } from "@/lib/blog";
import { SiteLocale, pickByLocale } from "@/lib/i18n";
import { BlogPost } from "@/types";

interface BlogExplorerProps {
  posts: BlogPost[];
  locale: SiteLocale;
}

function getIntentLabel(post: BlogPost) {
  const category = post.category.toLowerCase();

  if (category.includes("software") || category.includes("ecommerce")) {
    return "Para comparar opciones";
  }

  if (category.includes("productividad") || category.includes("aprendizaje")) {
    return "Para aplicar hoy";
  }

  if (category.includes("finanzas")) {
    return "Para decidir con numeros";
  }

  return "Para aclarar la decision";
}

function getOpenReason(post: BlogPost) {
  const firstTag = post.tags[0];

  if (firstTag) {
    return `Ideal si vienes buscando ${firstTag.toLowerCase()}.`;
  }

  return "Te da contexto suficiente antes de seguir comparando.";
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

export function BlogExplorer({ posts, locale }: BlogExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const deferredQuery = useDeferredValue(query);
  const categories = [pickByLocale(locale, "All", "Todas"), ...Array.from(new Set(posts.map((post) => post.category))).sort()];
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === pickByLocale(locale, "All", "Todas") || post.category === selectedCategory;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.description.toLowerCase().includes(normalizedQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesQuery;
  });

  return (
    <section id="archivo-reciente" className="blog-reveal blog-reveal-delay-1 mt-8 scroll-mt-28 sm:mt-10">
      <div className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">Explorar archivo</p>
            <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">{pickByLocale(locale, "Find what you want to read quickly.", "Encuentra rapido lo que quieres leer.")}</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-(--muted)">
            {pickByLocale(locale, "The explorer now shows less noise per card and lets you decide at a glance.", "El explorador ahora muestra menos ruido por tarjeta y te deja decidir con una sola mirada.")}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <label className="block">
            <span className="sr-only">{pickByLocale(locale, "Search articles", "Buscar articulos")}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                trackSiteEvent("blog_search_changed", { query: event.target.value });
              }}
              placeholder={pickByLocale(locale, "Search by title, description, or tag", "Buscar por titulo, descripcion o etiqueta")}
              className="w-full rounded-3xl border border-(--line) bg-white/75 px-4 py-3 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--accent)"
            />
          </label>
          <div className="flex flex-wrap gap-2">
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
                      ? "bg-(--ink) text-white"
                      : "border border-(--line) bg-white/70 text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-sm text-(--muted)">{filteredPosts.length} {pickByLocale(locale, filteredPosts.length === 1 ? "result" : "results", filteredPosts.length === 1 ? "resultado" : "resultados")}</p>

        {filteredPosts.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <article key={post.slug} className="group blog-card-premium surface-card flex h-full flex-col rounded-4xl px-5 py-5 hover:border-(--accent) sm:px-6 sm:py-6">
                <div className={`relative mb-4 overflow-hidden rounded-3xl border border-(--line) bg-linear-to-br ${getCategoryPreviewClass(post)}`}>
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,35,26,0.02),rgba(20,35,26,0.26))]" />
                    <div className="absolute left-3 top-3 rounded-full border border-white/25 bg-white/85 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-[0.68rem] sm:tracking-[0.16em]">
                      {post.category}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-xs sm:tracking-[0.18em]">
                  <span>{Math.max(1, Math.ceil(estimateBlogPostWordCount(post) / 220))} min</span>
                  <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                  <span>{post.author}</span>
                </div>
                <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">
                  {getIntentLabel(post)}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-tight text-(--ink) sm:mt-4 sm:text-2xl">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-(--muted) sm:mt-4">{post.description}</p>
                <p className="mt-4 text-sm leading-6 text-(--ink)">{getOpenReason(post)}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full border border-(--line) bg-white/55 px-3 py-1.5 text-xs font-medium text-(--accent-strong)">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex flex-col items-start gap-2 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-6">
                  <p className="text-xs text-(--muted)">{new Date(post.date).toLocaleDateString("es-DO")}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    onClick={() => trackSiteEvent("blog_result_clicked", { slug: post.slug, category: post.category })}
                    className="inline-flex items-center justify-center text-sm font-semibold text-(--accent-strong) transition hover:text-(--ink)"
                  >
                    {pickByLocale(locale, "Read article", "Leer articulo")}
                  </Link>
                </div>
              </article>
            ))}
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