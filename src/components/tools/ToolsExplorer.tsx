"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { trackSiteEvent } from "@/lib/analytics";
import { SiteLocale, pickByLocale } from "@/lib/i18n";
import { ToolItem } from "@/types";

interface ToolsExplorerProps {
  tools: ToolItem[];
  locale: SiteLocale;
  initialQuery?: string;
}

export function ToolsExplorer({ tools, locale, initialQuery = "" }: ToolsExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const deferredQuery = useDeferredValue(query);
  const categories = [pickByLocale(locale, "All", "Todas"), ...Array.from(new Set(tools.map((tool) => tool.category))).sort()];
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === pickByLocale(locale, "All", "Todas") || tool.category === selectedCategory;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery) ||
      tool.bestFor.some((item) => item.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesQuery;
  });

  return (
    <section id="explorar-herramientas" className="blog-reveal blog-reveal-delay-1 deferred-section mt-8 scroll-mt-28 sm:mt-10">
      <div className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Filter tools", "Filtrar herramientas")}</p>
            <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">{pickByLocale(locale, "Find the tool you need quickly.", "Encuentra rapido la utilidad que necesitas.")}</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-(--muted)">
            {pickByLocale(locale, "The explorer reduces noise per card so you can decide at a glance.", "El explorador reduce ruido por ficha para que puedas decidir con una sola mirada.")}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <label className="block">
            <span className="sr-only">{pickByLocale(locale, "Search tools", "Buscar herramientas")}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                trackSiteEvent("tools_search_changed", { query: event.target.value });
              }}
              placeholder={pickByLocale(locale, "Search by name, description, or best use", "Buscar por nombre, descripcion o mejor uso")}
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
                    trackSiteEvent("tools_filter_selected", { category });
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
        </div>

        <p className="mt-4 text-sm text-(--muted)">{filteredTools.length} {pickByLocale(locale, filteredTools.length === 1 ? "tool" : "tools", filteredTools.length === 1 ? "herramienta" : "herramientas")}</p>

        {filteredTools.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTools.map((tool) => (
              <article id={tool.slug} key={tool.slug} className="blog-card-premium surface-card scroll-mt-28 flex h-full flex-col rounded-[1.65rem] px-4.5 py-4.5 hover:border-(--accent) sm:px-5 sm:py-5">
                <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-xs sm:tracking-[0.18em]">
                  <span>{tool.category}</span>
                  <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                  <span>{tool.intentLabel}</span>
                </div>
                <h3 className="home-tool-title mt-3 text-[1.05rem] font-semibold text-(--ink) sm:text-[1.18rem]">{tool.name}</h3>
                <p className="home-tool-excerpt mt-2.5 text-sm leading-6 text-(--muted)">{tool.description}</p>
                <div className="mt-auto flex justify-end pt-4">
                  <Link href={tool.detailHref} onClick={() => trackSiteEvent("tool_launch_clicked", { tool: tool.slug, source: "tools_explorer" })} className="blog-grid-cta">
                    {pickByLocale(locale, "Open", "Abrir")}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-4xl border border-dashed border-(--line) bg-white/50 px-5 py-6 text-center">
            <h3 className="text-xl font-semibold text-(--ink)">{pickByLocale(locale, "No tools match those filters.", "No hay herramientas con esos filtros.")}</h3>
            <p className="mt-3 text-sm leading-7 text-(--muted)">{pickByLocale(locale, "Try another category or describe the need with fewer words.", "Prueba otra categoria o describe la necesidad con menos palabras.")}</p>
          </div>
        )}
      </div>
    </section>
  );
}