import type { Metadata } from "next";
import Link from "next/link";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";
import { siteConfig } from "@/config/site";
import { blogPosts } from "@/content/blog/posts";
import { tools } from "@/content/tools";

const toolSupportConfig: Record<string, { postSlug: string; eyebrow: string; helper: string }> = {
  "generador-de-resumenes": {
    postSlug: "5-tecnicas-resumir-mejor",
    eyebrow: "Apoyo para estudio",
    helper: "Ideal si quieres reforzar el resumen con una guia practica antes o despues de usar la herramienta.",
  },
  "organizador-de-tareas": {
    postSlug: "organizar-semana-estudio-30-minutos",
    eyebrow: "Apoyo para planificacion",
    helper: "Encaja bien cuando necesitas convertir prioridades en una semana mas clara y manejable.",
  },
  "corrector-de-redaccion": {
    postSlug: "guia-ia-para-tareas",
    eyebrow: "Apoyo para escritura",
    helper: "Util si quieres mejorar claridad y revisar como apoyarte en IA sin perder criterio.",
  },
  "temporizador-pomodoro": {
    postSlug: "organizar-semana-estudio-30-minutos",
    eyebrow: "Apoyo para foco",
    helper: "Complementa bien una rutina corta de estudio o trabajo con bloques de tiempo definidos.",
  },
  "calculadora-salario-neto-usa": {
    postSlug: "calcular-salario-neto-estados-unidos-2026",
    eyebrow: "Apoyo para finanzas",
    helper: "Encaja muy bien cuando necesitas entender un salario bruto antes de tomar una decision laboral o de presupuesto.",
  },
};

function getToolSupport(toolSlug: string) {
  const config = toolSupportConfig[toolSlug];

  if (!config) {
    return null;
  }

  const relatedPost = blogPosts.find((post) => post.slug === config.postSlug);

  if (!relatedPost) {
    return null;
  }

  return {
    eyebrow: config.eyebrow,
    helper: config.helper,
    href: `/blog/${relatedPost.slug}`,
    title: relatedPost.title,
  };
}

export const metadata: Metadata = {
  title: "Herramientas",
  description: "Coleccion de herramientas con enfoque mas producto para ejecutar mejor tareas, decisiones y trabajo digital.",
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Herramientas | TareasVirtual",
    description: "Coleccion de herramientas con enfoque mas producto para ejecutar mejor tareas, decisiones y trabajo digital.",
    url: `${siteConfig.url}/tools`,
    siteName: siteConfig.name,
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Herramientas TareasVirtual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Herramientas | TareasVirtual",
    description: "Coleccion de herramientas con enfoque mas producto para ejecutar mejor tareas, decisiones y trabajo digital.",
    images: [siteConfig.defaultOgImage],
  },
};

export default function ToolsPage() {
  const featuredTools = tools.filter((tool) => tool.isFeatured);
  const additionalTools = tools.filter((tool) => !tool.isFeatured);
  const flagshipTool = featuredTools[0] ?? null;
  const categories = Array.from(new Set(tools.map((tool) => tool.category)))
    .map((category) => ({
      name: category,
      count: tools.filter((tool) => tool.category === category).length,
    }))
    .sort((leftCategory, rightCategory) => rightCategory.count - leftCategory.count || leftCategory.name.localeCompare(rightCategory.name));
  const taskSignals = ["Decision", "Planificacion", "Ejecucion"];
  const authoritySignals = [
    "Cada ficha deja claro para que sirve y cuando conviene abrirla.",
    "Las herramientas siguen conectadas con guias relacionadas.",
    "La coleccion prioriza lectura limpia tambien en movil.",
  ];
  const compactSignals = [`${tools.length} herramientas listas`, `${categories.length} categorias activas`];
  const productSignals = [
    {
      title: "Primero orienta",
      description: "La portada destaca una ruta clara antes de mostrar el resto de la coleccion.",
    },
    {
      title: "Luego deja filtrar",
      description: "El explorador queda para cuando ya sabes la tarea o categoria que buscas.",
    },
    {
      title: "Y despues ejecutar",
      description: "Las fichas y widgets evitan explicaciones repetidas para que llegues antes al uso real.",
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
              {taskSignals.map((signal) => (
                <span
                  key={signal}
                  className="hero-chip rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)"
                >
                  {signal}
                </span>
              ))}
            </div>
            <p className="section-label mt-4 text-xs font-semibold uppercase">Herramientas TareasVirtual</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-(--ink) sm:text-5xl lg:text-6xl">
              Una zona de herramientas mas limpia para abrir la utilidad correcta sin sentir saturacion.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-(--muted) sm:mt-5 sm:text-xl sm:leading-8">
              Esta coleccion ahora se presenta con menos ruido visual, mejor jerarquia y una ruta mas corta entre descubrir, validar y usar.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-(--muted) sm:mt-8">
              {compactSignals.map((signal) => (
                <span key={signal} className="hero-chip rounded-full px-3 py-2 text-(--ink) sm:px-4">
                  {signal}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {categories.slice(0, 4).map((category) => (
                <span key={category.name} className="hero-chip rounded-full px-3 py-1.5 text-xs font-medium text-(--accent-strong)">
                  {category.name}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                href="#explorar-herramientas"
                className="inline-flex w-full items-center justify-center rounded-full bg-(--ink) px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-(--accent-strong) sm:w-auto"
              >
                Explorar herramientas
              </Link>
              {flagshipTool ? (
                <Link
                  href={`#${flagshipTool.slug}`}
                  className="inline-flex w-full items-center justify-center rounded-full border border-(--line) bg-white/85 px-6 py-3 text-sm font-semibold text-(--ink) transition hover:-translate-y-0.5 hover:border-(--accent) hover:text-(--accent-strong) sm:w-auto"
                >
                  Ver herramienta principal
                </Link>
              ) : null}
              <Link href="/contact" className="inline-flex items-center justify-center px-2 py-3 text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
                Necesitas orientacion
              </Link>
            </div>
          </div>

          <aside className="grid gap-4">
            {flagshipTool ? (
              <Link href={flagshipTool.detailHref} className="surface-card group rounded-4xl p-5 transition hover:-translate-y-1 sm:p-6">
                <p className="section-label text-xs font-semibold uppercase">Herramienta principal</p>
                <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{flagshipTool.intentLabel}</p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight text-(--ink) group-hover:text-(--accent-strong)">{flagshipTool.name}</h2>
                <p className="mt-4 text-sm leading-7 text-(--muted)">{flagshipTool.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {flagshipTool.bestFor.slice(0, 2).map((item) => (
                    <span key={item} className="rounded-full border border-(--line) bg-white/62 px-3 py-1.5 text-xs font-medium text-(--accent-strong)">{item}</span>
                  ))}
                </div>
              </Link>
            ) : null}

            <div className="rounded-4xl border border-(--line) bg-white/58 p-5 shadow-[0_18px_46px_rgba(20,35,26,0.06)] sm:p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-(--highlight)">Como se usa mejor</p>
              <div className="mt-4 space-y-3">
                {productSignals.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-(--line) bg-white/62 px-4 py-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-(--muted)">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <ToolsExplorer tools={tools} />

      <section id="herramientas-destacadas" className="mt-8 grid scroll-mt-28 gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-10">
          <p className="section-label text-xs font-semibold uppercase">Herramientas destacadas</p>
          <h2 className="mt-3 text-2xl font-semibold text-(--ink) sm:text-4xl">
            Las herramientas principales ahora se leen mas rapido y con menos friccion.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-(--muted) sm:text-base sm:leading-8">
            Esta seleccion concentra las mejores puertas de entrada. Cada ficha deja claro el resultado principal y el siguiente paso sin llenar la vista de capas innecesarias.
          </p>

          <div className="mt-6 grid gap-4">
            {featuredTools.map((tool) => (
              (() => {
                const support = getToolSupport(tool.slug);

                return (
                  <article
                    id={tool.slug}
                    key={tool.slug}
                    className="blog-card-premium rounded-[1.75rem] border border-(--line) bg-white/55 p-5 hover:border-(--accent) sm:p-6"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-xs sm:tracking-[0.18em]">
                      <span>{tool.category}</span>
                      <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                      <span>Destacada</span>
                    </div>
                    <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{tool.intentLabel}</p>
                    <h3 className="mt-3 text-xl font-semibold text-(--ink) sm:text-2xl">{tool.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-(--muted)">{tool.description}</p>
                    <p className="mt-3 text-sm leading-6 text-(--ink)">{tool.primaryOutcome}</p>
                    <p className="mt-3 text-sm leading-6 text-(--ink)">
                      {tool.bestFor[0] ? `Buena entrada si vienes con una necesidad de ${tool.bestFor[0].toLowerCase()}.` : tool.primaryOutcome}
                    </p>

                    {support ? (
                      <div className="action-card mt-4 rounded-3xl px-4 py-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{support.eyebrow}</p>
                        <p className="mt-2 text-sm leading-6 text-(--ink)">{support.helper}</p>
                        <Link href={support.href} className="mt-3 inline-flex text-sm font-semibold text-(--accent-strong) hover:text-(--highlight)">
                          Leer guia relacionada
                        </Link>
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Link href={tool.detailHref} className="inline-flex w-full items-center justify-center rounded-full bg-(--ink) px-4 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong) sm:w-auto">
                        Ver ficha completa
                      </Link>
                      <Link
                        href={tool.launchHref}
                        className="inline-flex w-full items-center justify-center rounded-full border border-(--line) px-4 py-3 text-sm font-semibold text-(--accent-strong) transition hover:border-(--accent) hover:text-(--highlight) sm:w-auto sm:rounded-none sm:border-0 sm:px-0 sm:py-0"
                      >
                        Abrir herramienta
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
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/72">Modo producto</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">La pagina presenta mejor la utilidad antes de pedir clic.</h2>
            <p className="mt-3 text-sm leading-7 text-white/82">
              Eso hace que herramientas como la calculadora salarial, el organizador o el corrector se perciban mas claras y no como simples demos dentro de un grid.
            </p>
          </section>

          <section className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-7">
            <p className="section-label text-xs font-semibold uppercase">Como orientarte</p>
            <h2 className="mt-3 text-2xl font-semibold text-(--ink)">Empieza por la herramienta que ya responde tu tarea.</h2>
            <p className="mt-3 text-sm leading-7 text-(--muted)">
              Si una destacada encaja contigo, casi siempre vale mas abrirla que seguir recorriendo toda la coleccion.
            </p>
          </section>

          <section className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-7">
            <p className="section-label text-xs font-semibold uppercase">Categorias</p>
            <h2 className="mt-3 text-2xl font-semibold text-(--ink)">Como se organiza esta coleccion</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {categories.slice(0, 4).map((category) => (
                <div key={category.name} className="info-tile rounded-3xl px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">
                    {category.count} herramienta{category.count > 1 ? "s" : ""}
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
            <p className="section-label text-xs font-semibold uppercase">Confianza y criterio</p>
            <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">La coleccion esta pensada para decidir y actuar mejor.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-(--muted)">
            Estas senales ayudan a entender que no es solo una lista: cada herramienta tiene contexto, ficha propia y una ruta relacionada para seguir explorando.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {authoritySignals.map((item) => (
            <div key={item} className="info-tile rounded-3xl px-4 py-4">
              <p className="text-sm leading-6 text-(--ink)">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {additionalTools.length > 0 ? (
        <section id="mas-recursos" className="mt-8 surface-card scroll-mt-28 rounded-4xl px-5 py-6 sm:mt-10 sm:px-8 sm:py-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label text-xs font-semibold uppercase">Mas recursos</p>
              <h2 className="mt-3 text-3xl font-semibold text-(--ink)">Otras herramientas disponibles</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-(--muted)">
              Recursos complementarios organizados con la misma lectura ligera de toda la seccion.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {additionalTools.map((tool) => (
              (() => {
                const support = getToolSupport(tool.slug);

                return (
                  <article
                    id={tool.slug}
                    key={tool.slug}
                    className="blog-card-premium rounded-[1.75rem] border border-(--line) bg-white/55 p-5 hover:border-(--accent) sm:p-6"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-xs sm:tracking-[0.18em]">
                      <span>{tool.category}</span>
                      <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                      <span>Recurso</span>
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
                          Leer guia relacionada
                        </Link>
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Link href={tool.detailHref} className="inline-flex w-full items-center justify-center rounded-full bg-(--ink) px-4 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong) sm:w-auto">
                        Ver ficha completa
                      </Link>
                      <Link
                        href={tool.launchHref}
                        className="inline-flex w-full items-center justify-center rounded-full border border-(--line) px-4 py-3 text-sm font-semibold text-(--accent-strong) transition hover:border-(--accent) hover:text-(--highlight) sm:w-auto sm:rounded-none sm:border-0 sm:px-0 sm:py-0"
                      >
                        Abrir herramienta
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
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">Siguiente paso</p>
                <h3 className="mt-2 text-xl font-semibold text-(--ink)">Si necesitas contexto antes de usar, entra al blog. Si no, abre la utilidad y ejecuta.</h3>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/blog#articulo-destacado" className="inline-flex items-center justify-center rounded-full bg-(--ink) px-5 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong)">
                  Leer una guia
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-(--line) px-5 py-3 text-sm font-semibold text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)">
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
