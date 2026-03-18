import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";
import { siteConfig } from "@/config/site";
import { blogPosts } from "@/content/blog/posts";
import { tools } from "@/content/tools";
import { pickByLocale, SiteLocale, toOpenGraphLocale } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";
import { localizeBlogPosts, localizeToolItems } from "@/lib/localize-content";

type LocalizedCopy = {
  en: string;
  es: string;
};

type ToolSupportConfig = {
  postSlug: string;
  eyebrow: LocalizedCopy;
  helper: LocalizedCopy;
};

const toolSupportConfig: Record<string, ToolSupportConfig> = {
  "generador-de-resumenes": {
    postSlug: "5-tecnicas-resumir-mejor",
    eyebrow: { en: "Study support", es: "Apoyo para estudio" },
    helper: {
      en: "Ideal if you want to reinforce your summary with a practical guide before or after using the tool.",
      es: "Ideal si quieres reforzar el resumen con una guia practica antes o despues de usar la herramienta.",
    },
  },
  "organizador-de-tareas": {
    postSlug: "organizar-semana-estudio-30-minutos",
    eyebrow: { en: "Planning support", es: "Apoyo para planificacion" },
    helper: {
      en: "A strong fit when you need to turn priorities into a clearer and more manageable week.",
      es: "Encaja bien cuando necesitas convertir prioridades en una semana mas clara y manejable.",
    },
  },
  "corrector-de-redaccion": {
    postSlug: "guia-ia-para-tareas",
    eyebrow: { en: "Writing support", es: "Apoyo para escritura" },
    helper: {
      en: "Useful if you want to improve clarity and review how to use AI without losing judgment.",
      es: "Util si quieres mejorar claridad y revisar como apoyarte en IA sin perder criterio.",
    },
  },
  "temporizador-pomodoro": {
    postSlug: "organizar-semana-estudio-30-minutos",
    eyebrow: { en: "Focus support", es: "Apoyo para foco" },
    helper: {
      en: "It complements a short study or work routine well with defined time blocks.",
      es: "Complementa bien una rutina corta de estudio o trabajo con bloques de tiempo definidos.",
    },
  },
  "calculadora-salario-neto-usa": {
    postSlug: "calcular-salario-neto-estados-unidos-2026",
    eyebrow: { en: "Finance support", es: "Apoyo para finanzas" },
    helper: {
      en: "A strong fit when you need to understand gross salary before making a work or budget decision.",
      es: "Encaja muy bien cuando necesitas entender un salario bruto antes de tomar una decision laboral o de presupuesto.",
    },
  },
};

function getLocalizedCopy(locale: SiteLocale, copy: LocalizedCopy) {
  return pickByLocale(locale, copy.en, copy.es);
}

function getToolSupport(toolSlug: string, locale: SiteLocale, localizedPosts = blogPosts) {
  const config = toolSupportConfig[toolSlug];

  if (!config) {
    return null;
  }

  const relatedPost = localizedPosts.find((post) => post.slug === config.postSlug);

  if (!relatedPost) {
    return null;
  }

  return {
    eyebrow: getLocalizedCopy(locale, config.eyebrow),
    helper: getLocalizedCopy(locale, config.helper),
    href: `/blog/${relatedPost.slug}`,
    title: relatedPost.title,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const title = pickByLocale(locale, "Tools", "Herramientas");
  const description = pickByLocale(locale, "A tool collection with a stronger product focus so tasks, decisions, and digital work can move faster.", "Coleccion de herramientas con enfoque mas producto para ejecutar mejor tareas, decisiones y trabajo digital.");

  return {
    title,
    description,
    alternates: {
      canonical: "/tools",
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/tools`,
      siteName: siteConfig.name,
      locale: toOpenGraphLocale(locale),
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: pickByLocale(locale, `${siteConfig.name} tools`, `${siteConfig.name} herramientas`),
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

export default async function ToolsPage() {
  const locale = await getCurrentLocale();
  const localizedTools = await localizeToolItems(tools, locale);
  const localizedPosts = await localizeBlogPosts(blogPosts, locale);
  const featuredTools = localizedTools.filter((tool) => tool.isFeatured);
  const additionalTools = localizedTools.filter((tool) => !tool.isFeatured);
  const flagshipTool = featuredTools[0] ?? null;
  const categories = Array.from(new Set(localizedTools.map((tool) => tool.category)))
    .map((category) => ({
      name: category,
      count: localizedTools.filter((tool) => tool.category === category).length,
    }))
    .sort((leftCategory, rightCategory) => rightCategory.count - leftCategory.count || leftCategory.name.localeCompare(rightCategory.name));
  const taskSignals = [pickByLocale(locale, "Decision", "Decision"), pickByLocale(locale, "Planning", "Planificacion"), pickByLocale(locale, "Execution", "Ejecucion")];
  const authoritySignals = [
    pickByLocale(locale, "Each detail page makes clear what it is for and when it is worth opening.", "Cada ficha deja claro para que sirve y cuando conviene abrirla."),
    pickByLocale(locale, "The tools remain connected to related guides.", "Las herramientas siguen conectadas con guias relacionadas."),
    pickByLocale(locale, "The collection prioritizes clean reading on mobile too.", "La coleccion prioriza lectura limpia tambien en movil."),
  ];
  const compactSignals = [`${localizedTools.length} ${pickByLocale(locale, "tools ready", "herramientas listas")}`, `${categories.length} ${pickByLocale(locale, "active categories", "categorias activas")}`];
  const productSignals = [
    {
      title: pickByLocale(locale, "Orient first", "Primero orienta"),
      description: pickByLocale(locale, "The landing area highlights a clear route before showing the rest of the collection.", "La portada destaca una ruta clara antes de mostrar el resto de la coleccion."),
    },
    {
      title: pickByLocale(locale, "Then lets you filter", "Luego deja filtrar"),
      description: pickByLocale(locale, "The explorer is there for when you already know the task or category you want.", "El explorador queda para cuando ya sabes la tarea o categoria que buscas."),
    },
    {
      title: pickByLocale(locale, "Then execute", "Y despues ejecutar"),
      description: pickByLocale(locale, "Detail pages and widgets avoid repeated explanations so you reach real use sooner.", "Las fichas y widgets evitan explicaciones repetidas para que llegues antes al uso real."),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <section id="tools-portada" className="surface-card editorial-aurora relative scroll-mt-28 overflow-hidden rounded-4xl px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-white/35 to-transparent" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.12),transparent_24%)]"
        />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_22rem] xl:items-start">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              {taskSignals.map((signal, index) => (
                <span
                  key={signal}
                  className={`hero-chip rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong) ${
                    index > 1 ? "hidden sm:inline-flex" : ""
                  }`}
                >
                  {signal}
                </span>
              ))}
            </div>
            <p className="section-label mt-4 text-xs font-semibold uppercase">{pickByLocale(locale, "TareasVirtual tools", "Herramientas TareasVirtual")}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-(--ink) sm:text-5xl lg:text-6xl">
              {pickByLocale(locale, "A cleaner tools area to open the right utility without feeling overloaded.", "Una zona de herramientas mas limpia para abrir la utilidad correcta sin sentir saturacion.")}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-(--muted) sm:mt-5 sm:text-xl sm:leading-8">
              {pickByLocale(locale, "This collection now presents itself with less visual noise, better hierarchy, and a shorter route between discovering, validating, and using.", "Esta coleccion ahora se presenta con menos ruido visual, mejor jerarquia y una ruta mas corta entre descubrir, validar y usar.")}
            </p>

            <div className="mt-6 grid gap-3 text-sm text-(--muted) sm:mt-8 sm:grid-cols-2">
              {compactSignals.map((signal) => (
                <span key={signal} className="hero-chip rounded-2xl px-4 py-3 text-center text-(--ink) sm:px-4 sm:py-2">
                  {signal}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {categories.slice(0, 4).map((category, index) => (
                <span
                  key={category.name}
                  className={`hero-chip rounded-full px-3 py-1.5 text-xs font-medium text-(--accent-strong) ${
                    index > 1 ? "hidden sm:inline-flex" : ""
                  }`}
                >
                  {category.name}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                href="#explorar-herramientas"
                className="inline-flex w-full items-center justify-center rounded-full bg-(--ink) px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-(--accent-strong) sm:w-auto"
              >
                {pickByLocale(locale, "Explore tools", "Explorar herramientas")}
              </Link>
              {flagshipTool ? (
                <Link
                  href={`#${flagshipTool.slug}`}
                  className="inline-flex w-full items-center justify-center rounded-full border border-(--line) bg-white/85 px-6 py-3 text-sm font-semibold text-(--ink) transition hover:-translate-y-0.5 hover:border-(--accent) hover:text-(--accent-strong) sm:w-auto"
                >
                  {pickByLocale(locale, "See main tool", "Ver herramienta principal")}
                </Link>
              ) : null}
              <Link href="/contact" className="inline-flex items-center justify-center px-2 py-3 text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
                {pickByLocale(locale, "Need guidance", "Necesitas orientacion")}
              </Link>
            </div>
          </div>

          <aside className="grid gap-4">
            {flagshipTool ? (
              <Link href={flagshipTool.detailHref} className="surface-card group rounded-4xl p-5 transition hover:-translate-y-1 sm:p-6">
                <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Main tool", "Herramienta principal")}</p>
                <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{flagshipTool.intentLabel}</p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight text-(--ink) group-hover:text-(--accent-strong)">{flagshipTool.name}</h2>
                <p className="mt-4 text-sm leading-7 text-(--muted)">{flagshipTool.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {flagshipTool.bestFor.slice(0, 2).map((item, index) => (
                    <span key={item} className={`rounded-full border border-(--line) bg-white/62 px-3 py-1.5 text-xs font-medium text-(--accent-strong) ${index > 0 ? "hidden sm:inline-flex" : ""}`}>{item}</span>
                  ))}
                </div>
              </Link>
            ) : null}

            <div className="rounded-4xl border border-(--line) bg-white/58 p-5 shadow-[0_18px_46px_rgba(20,35,26,0.06)] sm:p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-(--highlight)">{pickByLocale(locale, "How to use it better", "Como se usa mejor")}</p>
              <div className="mt-4 space-y-3">
                {productSignals.map((item, index) => (
                  <div key={item.title} className={`rounded-3xl border border-(--line) bg-white/62 px-4 py-4 ${index === 2 ? "hidden sm:block" : ""}`}>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-(--muted)">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <ToolsExplorer tools={localizedTools} locale={locale} />

      <AdSlot slotName="tools-inline" locale={locale} className="mx-auto w-full max-w-4xl" />

      <section id="herramientas-destacadas" className="mt-8 grid scroll-mt-28 gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-10">
          <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Featured tools", "Herramientas destacadas")}</p>
          <h2 className="mt-3 text-2xl font-semibold text-(--ink) sm:text-4xl">
            {pickByLocale(locale, "The main tools are now easier to scan and use with less friction.", "Las herramientas principales ahora se leen mas rapido y con menos friccion.")}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-(--muted) sm:text-base sm:leading-8">
            {pickByLocale(locale, "This selection concentrates the best entry points. Each detail page makes the main outcome and next step clear without filling the view with unnecessary layers.", "Esta seleccion concentra las mejores puertas de entrada. Cada ficha deja claro el resultado principal y el siguiente paso sin llenar la vista de capas innecesarias.")}
          </p>

          <div className="mt-6 grid gap-4">
            {featuredTools.map((tool) => (
              (() => {
                const support = getToolSupport(tool.slug, locale, localizedPosts);

                return (
                  <article
                    id={tool.slug}
                    key={tool.slug}
                    className="blog-card-premium rounded-[1.75rem] border border-(--line) bg-white/55 p-5 hover:border-(--accent) sm:p-6"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-xs sm:tracking-[0.18em]">
                      <span>{tool.category}</span>
                      <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                      <span>{pickByLocale(locale, "Featured", "Destacada")}</span>
                    </div>
                    <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{tool.intentLabel}</p>
                    <h3 className="mt-3 text-xl font-semibold text-(--ink) sm:text-2xl">{tool.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-(--muted)">{tool.description}</p>
                    <p className="mt-3 text-sm leading-6 text-(--ink)">{tool.primaryOutcome}</p>
                    <p className="mt-3 text-sm leading-6 text-(--ink)">
                      {tool.bestFor[0] ? pickByLocale(locale, `A good entry point if you come in with a need around ${tool.bestFor[0].toLowerCase()}.`, `Buena entrada si vienes con una necesidad de ${tool.bestFor[0].toLowerCase()}.`) : tool.primaryOutcome}
                    </p>

                    {support ? (
                      <div className="action-card mt-4 rounded-3xl px-4 py-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{support.eyebrow}</p>
                        <p className="mt-2 text-sm leading-6 text-(--ink)">{support.helper}</p>
                        <Link href={support.href} className="mt-3 inline-flex text-sm font-semibold text-(--accent-strong) hover:text-(--highlight)">
                          {pickByLocale(locale, "Read related guide", "Leer guia relacionada")}
                        </Link>
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Link href={tool.detailHref} className="inline-flex w-full items-center justify-center rounded-full bg-(--ink) px-4 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong) sm:w-auto">
                        {pickByLocale(locale, "View full detail", "Ver ficha completa")}
                      </Link>
                      <Link
                        href={tool.launchHref}
                        className="inline-flex w-full items-center justify-center rounded-full border border-(--line) px-4 py-3 text-sm font-semibold text-(--accent-strong) transition hover:border-(--accent) hover:text-(--highlight) sm:w-auto sm:rounded-none sm:border-0 sm:px-0 sm:py-0"
                      >
                        {pickByLocale(locale, "Open tool", "Abrir herramienta")}
                      </Link>
                    </div>
                  </article>
                );
              })()
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <section className="editorial-band rounded-4xl px-5 py-6 sm:px-8 sm:py-7">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/72">{pickByLocale(locale, "Product mode", "Modo producto")}</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{pickByLocale(locale, "The page presents the utility better before asking for a click.", "La pagina presenta mejor la utilidad antes de pedir clic.")}</h2>
            <p className="mt-3 text-sm leading-7 text-white/82">
              {pickByLocale(locale, "That makes tools like the salary calculator, organizer, or writing checker feel clearer instead of like simple demos inside a grid.", "Eso hace que herramientas como la calculadora salarial, el organizador o el corrector se perciban mas claras y no como simples demos dentro de un grid.")}
            </p>
          </section>

          <section className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-7">
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "How to orient yourself", "Como orientarte")}</p>
            <h2 className="mt-3 text-2xl font-semibold text-(--ink)">{pickByLocale(locale, "Start with the tool that already matches your task.", "Empieza por la herramienta que ya responde tu tarea.")}</h2>
            <p className="mt-3 text-sm leading-7 text-(--muted)">
              {pickByLocale(locale, "If one featured tool fits you, it is usually more valuable to open it than to keep scanning the whole collection.", "Si una destacada encaja contigo, casi siempre vale mas abrirla que seguir recorriendo toda la coleccion.")}
            </p>
          </section>

          <section className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-7">
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Categories", "Categorias")}</p>
            <h2 className="mt-3 text-2xl font-semibold text-(--ink)">{pickByLocale(locale, "How this collection is organized", "Como se organiza esta coleccion")}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {categories.slice(0, 4).map((category) => (
                <div key={category.name} className="info-tile rounded-3xl px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">
                    {category.count} {pickByLocale(locale, category.count > 1 ? "tools" : "tool", category.count > 1 ? "herramientas" : "herramienta")}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-(--ink)">{category.name}</p>
                </div>
              ))}
            </div>
          </section>

        </aside>
      </section>

      <section className="mt-8 surface-card rounded-4xl px-5 py-6 sm:mt-10 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Trust and context", "Confianza y criterio")}</p>
            <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">{pickByLocale(locale, "The collection is built to help you decide and act better.", "La coleccion esta pensada para decidir y actuar mejor.")}</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-(--muted)">
            {pickByLocale(locale, "These signals help show that this is not just a list: each tool has context, its own detail page, and a related route to keep exploring.", "Estas senales ayudan a entender que no es solo una lista: cada herramienta tiene contexto, ficha propia y una ruta relacionada para seguir explorando.")}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
              {authoritySignals.map((item, index) => (
            <div key={item} className={`info-tile rounded-3xl px-4 py-4 ${index === 2 ? "hidden md:block" : ""}`}>
              <p className="text-sm leading-6 text-(--ink)">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {additionalTools.length > 0 ? (
        <section id="mas-recursos" className="mt-8 surface-card scroll-mt-28 rounded-4xl px-5 py-6 sm:mt-10 sm:px-8 sm:py-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "More resources", "Mas recursos")}</p>
              <h2 className="mt-3 text-3xl font-semibold text-(--ink)">{pickByLocale(locale, "Other available tools", "Otras herramientas disponibles")}</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-(--muted)">
              {pickByLocale(locale, "Complementary resources organized with the same light reading style as the rest of the section.", "Recursos complementarios organizados con la misma lectura ligera de toda la seccion.")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {additionalTools.map((tool) => (
              (() => {
                const support = getToolSupport(tool.slug, locale, localizedPosts);

                return (
                  <article
                    id={tool.slug}
                    key={tool.slug}
                    className="blog-card-premium rounded-[1.75rem] border border-(--line) bg-white/55 p-5 hover:border-(--accent) sm:p-6"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-xs sm:tracking-[0.18em]">
                      <span>{tool.category}</span>
                      <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                      <span>{pickByLocale(locale, "Resource", "Recurso")}</span>
                    </div>
                    <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{tool.intentLabel}</p>
                    <h3 className="mt-3 text-xl font-semibold text-(--ink)">{tool.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-(--muted)">{tool.description}</p>
                    <p className="mt-3 text-sm leading-6 text-(--ink)">{tool.primaryOutcome}</p>

                    {support ? (
                      <div className="action-card mt-4 rounded-3xl px-4 py-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{support.eyebrow}</p>
                        <p className="mt-2 text-sm leading-6 text-(--ink)">{support.helper}</p>
                        <Link href={support.href} className="mt-3 inline-flex text-sm font-semibold text-(--accent-strong) hover:text-(--highlight)">
                          {pickByLocale(locale, "Read related guide", "Leer guia relacionada")}
                        </Link>
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Link href={tool.detailHref} className="inline-flex w-full items-center justify-center rounded-full bg-(--ink) px-4 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong) sm:w-auto">
                        {pickByLocale(locale, "View full detail", "Ver ficha completa")}
                      </Link>
                      <Link
                        href={tool.launchHref}
                        className="inline-flex w-full items-center justify-center rounded-full border border-(--line) px-4 py-3 text-sm font-semibold text-(--accent-strong) transition hover:border-(--accent) hover:text-(--highlight) sm:w-auto sm:rounded-none sm:border-0 sm:px-0 sm:py-0"
                      >
                        {pickByLocale(locale, "Open tool", "Abrir herramienta")}
                      </Link>
                    </div>
                  </article>
                );
              })()
            ))}
          </div>

          <div className="action-strip mt-6 rounded-4xl p-4 sm:mt-8 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">{pickByLocale(locale, "Next step", "Siguiente paso")}</p>
                <h3 className="mt-2 text-xl font-semibold text-(--ink)">{pickByLocale(locale, "If you need context before using a tool, go to the blog. If not, open the utility and act.", "Si necesitas contexto antes de usar, entra al blog. Si no, abre la utilidad y ejecuta.")}</h3>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/blog#articulo-destacado" className="inline-flex items-center justify-center rounded-full bg-(--ink) px-5 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong)">
                  {pickByLocale(locale, "Read a guide", "Leer una guia")}
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-(--line) px-5 py-3 text-sm font-semibold text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)">
                  {pickByLocale(locale, "Contact", "Contacto")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
