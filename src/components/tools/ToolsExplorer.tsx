"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { trackSiteEvent } from "@/lib/analytics";
import { ToolItem } from "@/types";

interface ToolsExplorerProps {
  tools: ToolItem[];
}

function getOpenReason(tool: ToolItem) {
  const firstBestFor = tool.bestFor[0];

  if (firstBestFor) {
    return `Buena entrada si vienes con una necesidad de ${firstBestFor.toLowerCase()}.`;
  }

  return "Te deja validar rapido si encaja en tu flujo antes de comprometerte.";
}

export function ToolsExplorer({ tools }: ToolsExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const deferredQuery = useDeferredValue(query);
  const categories = ["Todas", ...Array.from(new Set(tools.map((tool) => tool.category))).sort()];
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === "Todas" || tool.category === selectedCategory;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery) ||
      tool.bestFor.some((item) => item.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesQuery;
  });

  return (
    <section id="explorar-herramientas" className="blog-reveal blog-reveal-delay-1 mt-8 scroll-mt-28 sm:mt-10">
      <div className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">Filtrar herramientas</p>
            <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">Encuentra rapido la utilidad que necesitas.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-(--muted)">
            El explorador reduce ruido por ficha para que puedas decidir con una sola mirada.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <label className="block">
            <span className="sr-only">Buscar herramientas</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                trackSiteEvent("tools_search_changed", { query: event.target.value });
              }}
              placeholder="Buscar por nombre, descripcion o mejor uso"
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

        <p className="mt-4 text-sm text-(--muted)">{filteredTools.length} herramienta{filteredTools.length === 1 ? "" : "s"}</p>

        {filteredTools.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTools.map((tool) => (
              <article key={tool.slug} className="blog-card-premium surface-card flex h-full flex-col rounded-4xl px-5 py-5 hover:border-(--accent) sm:px-6 sm:py-6">
                <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-xs sm:tracking-[0.18em]">
                  <span>{tool.category}</span>
                  <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                  <span>{new Date(tool.updatedAt).toLocaleDateString("es-DO")}</span>
                </div>
                <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{tool.intentLabel}</p>
                <h3 className="mt-3 text-xl font-semibold text-(--ink) sm:text-2xl">{tool.name}</h3>
                <p className="mt-3 text-sm leading-7 text-(--muted)">{tool.description}</p>
                <p className="mt-3 text-sm leading-6 text-(--ink)">{getOpenReason(tool)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tool.bestFor.slice(0, 2).map((item) => (
                    <span key={item} className="rounded-full border border-(--line) bg-white/55 px-3 py-1.5 text-xs font-medium text-(--accent-strong)">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-5 sm:pt-6">
                  <Link href={tool.detailHref} onClick={() => trackSiteEvent("tool_detail_clicked", { tool: tool.slug, source: "tools_explorer" })} className="inline-flex items-center text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
                    Ver ficha
                  </Link>
                  <Link href={tool.launchHref} onClick={() => trackSiteEvent("tool_launch_clicked", { tool: tool.slug, source: "tools_explorer" })} className="inline-flex items-center text-sm font-semibold text-(--ink) hover:text-(--accent-strong)">
                    Abrir
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-4xl border border-dashed border-(--line) bg-white/50 px-5 py-6 text-center">
            <h3 className="text-xl font-semibold text-(--ink)">No hay herramientas con esos filtros.</h3>
            <p className="mt-3 text-sm leading-7 text-(--muted)">Prueba otra categoria o describe la necesidad con menos palabras.</p>
          </div>
        )}
      </div>
    </section>
  );
}