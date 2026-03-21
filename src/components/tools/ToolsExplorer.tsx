"use client";

import Link from "next/link";
import { trackSiteEvent } from "@/lib/analytics";
import { SiteLocale, pickByLocale } from "@/lib/i18n";
import { ToolItem } from "@/types";

interface ToolsExplorerProps {
  tools: ToolItem[];
  locale: SiteLocale;
  initialQuery?: string;
}

export function ToolsExplorer({ tools, locale, initialQuery = "" }: ToolsExplorerProps) {
  const normalizedQuery = initialQuery.trim().toLowerCase();
  const filteredTools = tools.filter((tool) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery) ||
      tool.bestFor.some((item) => item.toLowerCase().includes(normalizedQuery));

    return matchesQuery;
  });

  return (
    <section id="explorar-herramientas" className="blog-reveal blog-reveal-delay-1 deferred-section mt-8 scroll-mt-28 sm:mt-10">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
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
          ))
        ) : (
          <div className="rounded-4xl border border-dashed border-(--line) bg-white/50 px-5 py-6 text-center md:col-span-2 xl:col-span-3">
            <h3 className="text-xl font-semibold text-(--ink)">{pickByLocale(locale, "No tools match those filters.", "No hay herramientas con esos filtros.")}</h3>
            <p className="mt-3 text-sm leading-7 text-(--muted)">{pickByLocale(locale, "Try another category or describe the need with fewer words.", "Prueba otra categoria o describe la necesidad con menos palabras.")}</p>
          </div>
        )}
      </div>
    </section>
  );
}