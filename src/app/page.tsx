import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { blogPosts } from "@/content/blog/posts";
import { siteConfig } from "@/config/site";
import { tools } from "@/content/tools";
import { formatLocaleDate, pickByLocale, toOpenGraphLocale } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";
import { estimateBlogPostWordCount } from "@/lib/blog";
import { localizeBlogPosts, localizeToolItems } from "@/lib/localize-content";

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
  const featuredTools = localizedTools.filter((tool) => tool.isFeatured).slice(0, 4);
  const salaryTool = localizedTools.find((tool) => tool.slug === "calculadora-salario-neto-usa") ?? featuredTools[0] ?? null;
  const latestPost = localizedBlogPosts[0] ?? null;
  const recentPosts = latestPost ? localizedBlogPosts.slice(1, 4) : [];
  const routeSteps = [
    {
      title: pickByLocale(locale, "Clarify the decision", "Aclara la decision"),
      description: pickByLocale(locale, "Start with a guide or comparison to understand the problem better before acting.", "Empieza por una guia o comparativa para entender mejor el problema antes de actuar."),
      href: latestPost ? `/blog/${latestPost.slug}` : "/blog",
    },
    {
      title: pickByLocale(locale, "Move into action", "Pasa a la accion"),
      description: pickByLocale(locale, "Once the need is clear, open a tool and act without wasting time.", "Cuando la necesidad ya esta clara, entra en una herramienta y ejecuta sin perder tiempo."),
      href: "/tools",
    },
    {
      title: pickByLocale(locale, "Unblock a question", "Desbloquea una duda"),
      description: pickByLocale(locale, "If your case does not fit a guide or tool completely, open contact and continue through a direct route.", "Si tu caso no encaja del todo en una guia o herramienta, abre contacto y sigue por una via directa."),
      href: "/contact",
    },
  ];

  const categories = Array.from(new Set(blogPosts.map((post) => post.category)))
    .map((category) => ({
      name: category,
      count: blogPosts.filter((post) => post.category === category).length,
    }))
    .sort((leftCategory, rightCategory) => rightCategory.count - leftCategory.count || leftCategory.name.localeCompare(rightCategory.name));

  const highIntentTopics = [
    pickByLocale(locale, "Business software", "Software empresarial"),
    pickByLocale(locale, "Study productivity", "Productividad de estudio"),
    pickByLocale(locale, "High-intent tools", "Herramientas con alta intencion de compra"),
  ];

  const audienceSignals = [
    pickByLocale(locale, "Study", "Estudio"),
    pickByLocale(locale, "Remote work", "Trabajo remoto"),
    "Freelance",
    pickByLocale(locale, "Digital business", "Negocio digital"),
  ];
  const trustSignals = [
    `${localizedBlogPosts.length} ${pickByLocale(locale, "published guides", "guias publicadas")}`,
    `${localizedTools.length} ${pickByLocale(locale, "tools ready", "herramientas listas")}`,
    `${categories.length} ${pickByLocale(locale, "active topics", "temas activos")}`,
  ];
  const editorialPrinciples = [
    {
      title: pickByLocale(locale, "Original content", "Contenido propio"),
      description: pickByLocale(locale, "Every text is written from scratch with a clear intention: help people decide better, not repeat what is already circulating on other sites.", "Cada texto se redacta desde cero con una intencion clara: ayudar a decidir mejor, no repetir lo que ya circula en otras webs."),
    },
    {
      title: pickByLocale(locale, "Utility before filler", "Utilidad antes que relleno"),
      description: pickByLocale(locale, "Guides and tools are built to solve a real action: compare, calculate, understand, or execute without noise.", "Las guias y herramientas se construyen para resolver una accion real: comparar, calcular, entender o ejecutar sin ruido."),
    },
    {
      title: pickByLocale(locale, "Better mobile reading", "Mejor lectura en movil"),
      description: pickByLocale(locale, "The structure prioritizes short blocks, clear hierarchy, and clear routes so the experience works well on small screens.", "La estructura prioriza bloques cortos, jerarquia limpia y rutas claras para que la experiencia funcione bien en pantalla pequena."),
    },
  ];
  const qualitySignals = [
    pickByLocale(locale, "Original writing with a distinct editorial tone", "Redaccion original y tono editorial propio"),
    pickByLocale(locale, "Updated for 2026 and real-world cases", "Actualizacion pensada para 2026 y casos reales"),
    pickByLocale(locale, "Free tools connected to the guides", "Herramientas gratuitas conectadas con las guias"),
  ];
  const solutionRoutes = [
    pickByLocale(locale, "Read a comparison before buying or hiring.", "Leer una comparativa antes de comprar o contratar."),
    pickByLocale(locale, "Use a free tool to turn a decision into numbers or actions.", "Usar una herramienta gratuita para bajar una decision a numeros o acciones."),
    pickByLocale(locale, "Use contact when the case needs more direct guidance.", "Entrar por contacto cuando el caso necesita orientacion mas directa."),
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-8 sm:gap-12 sm:pt-12 lg:gap-16">
      <section id="inicio-destacado" className="grid scroll-mt-28 items-stretch gap-5 lg:grid-cols-[1.16fr_0.84fr] lg:gap-6">
        <div className="surface-card editorial-aurora relative overflow-hidden rounded-4xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="soft-grid absolute inset-0 opacity-35" />
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white/40 to-transparent" />
          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              {audienceSignals.map((signal, index) => (
                <span
                  key={signal}
                  className={`hero-chip rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong) ${
                    index > 1 ? "hidden sm:inline-flex" : ""
                  }`}
                >
                  {signal}
                </span>
              ))}
              <span className="hero-chip hidden rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong) sm:inline-flex">
                {pickByLocale(locale, "Original and updated", "Original y actualizado")}
              </span>
            </div>
            <p className="section-label text-[0.72rem] font-semibold uppercase tracking-[0.18em] sm:text-xs">
              {pickByLocale(locale, "Editorial platform and tools in your language", "Plataforma editorial y herramientas en espanol")}
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-none text-(--ink) sm:text-5xl lg:text-6xl">
              {pickByLocale(locale, "A clearer, more useful website with authentic content that actually helps you decide.", "Una web mas clara, mas util y con contenido autentico que si ayuda a decidir.")}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-(--muted) sm:text-lg sm:leading-8">
              {pickByLocale(locale, "TareasVirtual brings together original comparisons, free tools, and a visual experience designed to make reading, choosing, and acting feel cleaner from the first block.", "TareasVirtual une comparativas propias, herramientas gratuitas y una experiencia visual pensada para que leer, elegir y actuar se sienta mas limpio desde el primer bloque.")}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                href="/tools"
                className="inline-flex w-full items-center justify-center rounded-full bg-(--ink) px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-(--accent-strong) sm:w-auto"
              >
                {pickByLocale(locale, "Try tools", "Probar herramientas")}
              </Link>
              <Link
                href="/blog"
                className="inline-flex w-full items-center justify-center rounded-full border border-(--line) bg-white/85 px-6 py-3 text-sm font-semibold text-(--ink) transition hover:-translate-y-0.5 hover:border-(--accent) hover:text-(--accent-strong) sm:w-auto"
              >
                {pickByLocale(locale, "Read guides", "Leer guias")}
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-2 py-3 text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
                {pickByLocale(locale, "Need guidance", "Necesitas orientacion")}
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
              {trustSignals.map((item) => (
                <span
                  key={item}
                  className="rounded-2xl border border-(--line) bg-white/60 px-4 py-3 text-center text-sm font-medium text-(--ink)"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
              {qualitySignals.map((item, index) => (
                <div
                  key={item}
                  className={`${
                    index === 2 ? "hidden sm:block " : ""
                  }${index === 0 ? "quality-card rounded-3xl px-4 py-4" : "rounded-3xl border border-(--line) bg-white/58 px-4 py-4"}`}
                >
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{pickByLocale(locale, "Principle", "Criterio")} {index + 1}</p>
                  <p className="mt-2 text-sm leading-6 text-(--ink)">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-5 lg:gap-6">
          {salaryTool ? (
            <Link
              href={salaryTool.detailHref}
              className="surface-card group relative overflow-hidden rounded-4xl p-5 transition hover:-translate-y-1 sm:p-6"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[rgba(16,185,129,0.16)] blur-2xl" />
              <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Tool worth opening first", "Herramienta que vale la pena abrir primero")}</p>
              <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{salaryTool.intentLabel}</p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-(--ink) group-hover:text-(--accent-strong) sm:text-3xl">
                {salaryTool.name}
              </h2>
              <p className="mt-4 text-sm leading-7 text-(--muted)">{salaryTool.description}</p>
              <div className="mt-5 grid gap-2">
                {salaryTool.bestFor.slice(0, 3).map((item) => (
                  <div key={item} className="rounded-2xl border border-(--line) bg-white/62 px-4 py-3 text-sm font-medium text-(--ink)">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm font-semibold text-(--accent-strong)">{pickByLocale(locale, "Open interactive detail", "Abrir ficha interactiva")}</p>
            </Link>
          ) : null}

          {latestPost ? (
            <Link
              href={`/blog/${latestPost.slug}`}
              className="surface-card group rounded-4xl p-5 transition hover:-translate-y-1 sm:p-6"
            >
              <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Featured article", "Articulo destacado")}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-xs sm:tracking-[0.18em]">
                <span>{latestPost.category}</span>
                <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                <span>{Math.max(1, Math.ceil(estimateBlogPostWordCount(latestPost) / 220))} {pickByLocale(locale, "min", "min")}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold leading-tight text-(--ink) group-hover:text-(--accent-strong) sm:text-3xl">
                {latestPost.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-(--muted)">{latestPost.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {latestPost.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={tag}
                    className={`rounded-full border border-(--line) bg-white/55 px-3 py-1.5 text-xs font-medium text-(--accent-strong) ${
                      index > 1 ? "hidden sm:inline-flex" : ""
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-sm font-semibold text-(--accent-strong)">{pickByLocale(locale, "Read full comparison", "Leer comparativa completa")}</p>
            </Link>
          ) : (
            <div className="surface-card rounded-4xl p-5 sm:p-6">
              <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Featured article", "Articulo destacado")}</p>
              <h2 className="mt-4 text-2xl font-semibold text-(--ink)">{pickByLocale(locale, "The editorial highlight will appear here.", "La portada editorial estara disponible aqui.")}</h2>
              <p className="mt-3 text-sm leading-7 text-(--muted)">
                {pickByLocale(locale, "When you publish the first article, this section will show the most relevant content without breaking the mobile experience.", "Cuando publiques el primer articulo, esta seccion mostrara el contenido mas relevante sin romper la experiencia en movil.")}
              </p>
            </div>
          )}

          <div className="surface-card hidden rounded-4xl p-5 lg:block lg:p-6">
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Priority topics", "Temas prioritarios")}</p>
            <h2 className="mt-3 text-2xl font-semibold text-(--ink)">{pickByLocale(locale, "Start with what drives real decisions.", "Empieza por lo que mueve decisiones reales.")}</h2>
            <p className="mt-3 text-sm leading-7 text-(--muted)">
              {pickByLocale(locale, "The home page is focused on topics where a good comparison or a well-resolved tool truly saves time.", "La portada esta enfocada en temas donde una buena comparativa o una herramienta bien resuelta ahorra tiempo de verdad.")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {highIntentTopics.map((topic) => (
                <span key={topic} className="hero-chip rounded-full px-3 py-1.5 text-xs font-medium text-(--ink)">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6">
        <div className="rounded-4xl bg-[rgba(255,255,255,0.58)] p-5 ring-1 ring-(--line) sm:p-6">
          <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Editorial direction", "Direccion editorial")}</p>
          <h2 className="mt-4 text-3xl font-semibold text-(--ink) sm:text-4xl">
            {pickByLocale(locale, "A stronger visual design, but built on a serious editorial base.", "Diseño mas bonito, pero con una base editorial seria.")}
          </h2>
          <p className="mt-4 text-sm leading-7 text-(--muted) sm:mt-5 sm:text-base sm:leading-8">
            {pickByLocale(locale, "The visual improvement is not decoration for its own sake. The idea is to make each block breathe better, read with less friction, and clarify why the site is worth staying on.", "La mejora visual no busca decorar por decorar. La idea es hacer que cada bloque respire mejor, se lea con menos friccion y deje mas claro por que vale la pena quedarse en la web.")}
          </p>
          <div className="mt-6 grid gap-3">
            {solutionRoutes.map((route, index) => (
              <div key={route} className="rounded-3xl border border-(--line) bg-white/62 px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{pickByLocale(locale, "Route", "Ruta")} {index + 1}</p>
                <p className="mt-2 text-sm leading-6 text-(--ink)">{route}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {editorialPrinciples.map((item) => (
            <article
              key={item.title}
              className="surface-card rounded-[1.75rem] p-5 transition hover:-translate-y-1 sm:p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">{pickByLocale(locale, "Editorial quality", "Calidad editorial")}</p>
              <h3 className="mt-3 text-xl font-semibold text-(--ink) sm:text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-(--muted)">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <AdSlot slotName="home-inline" locale={locale} className="mx-auto w-full max-w-4xl" />

      <section className="grid gap-5 lg:grid-cols-[1.06fr_0.94fr] lg:gap-6">
        <div className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
          <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Active topics", "Temas activos")}</p>
          <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">{pickByLocale(locale, "The site is becoming stronger because the content has focus.", "La web se esta volviendo mas solida porque el contenido tiene foco.")}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-(--muted) sm:text-base sm:leading-8">
            {pickByLocale(locale, "Instead of spreading out, the homepage now shows the categories that already have real weight in the project and can grow with useful, authentic content.", "En lugar de dispersarse, la portada deja ver mejor las categorias que ya tienen peso real dentro del proyecto y que pueden crecer con contenido util y autentico.")}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                  {pickByLocale(locale, `Guides and comparisons with a clear focus on ${category.name.toLowerCase()}.`, `Guias y comparativas con enfoque claro sobre ${category.name.toLowerCase()}.`)}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="editorial-band rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/72">{pickByLocale(locale, "Site promise", "Promesa de la web")}</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold text-white sm:text-4xl">{pickByLocale(locale, "Beautiful on the outside, but genuinely useful underneath.", "Bonita por fuera, pero valiosa por dentro.")}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/82 sm:text-base sm:leading-8">
            {pickByLocale(locale, "The goal is not to look like a generic tools homepage. It is to build an experience with its own personality, better reading rhythm, and pieces that truly help.", "El objetivo no es parecer una portada generica de herramientas. Es construir una experiencia con personalidad propia, mejor lectura y piezas que realmente sirvan.")}
          </p>
          <div className="mt-6 grid gap-3">
            {[
              pickByLocale(locale, "Clearer copy across home, blog, and tools.", "Textos mas claros en portada, blog y herramientas."),
              pickByLocale(locale, "Better visual order to guide the user.", "Mejor orden visual para guiar al usuario."),
              pickByLocale(locale, "More trust through useful and direct content.", "Mas confianza con contenido util y directo."),
            ].map((item, index) => (
              <div key={item} className="rounded-3xl border border-white/14 bg-white/10 px-4 py-4 text-sm leading-6 text-white/86">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/65">{pickByLocale(locale, "Improvement", "Mejora")} {index + 1}</span>
                <p className="mt-2">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ruta-recomendada" className="surface-card scroll-mt-28 rounded-4xl px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "How to use the homepage", "Como usar la portada")}</p>
            <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">{pickByLocale(locale, "After the first click, this is the most useful flow.", "Despues del primer clic, este es el flujo mas util.")}</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-(--muted)">
            {pickByLocale(locale, "The hero already lets you choose between guides, tools, or guidance. The idea here is different: turn that first choice into a useful sequence without noise.", "El hero ya te deja elegir entre guias, herramientas u orientacion. Aqui la idea es otra: convertir esa primera eleccion en una secuencia util y sin ruido.")}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {routeSteps.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.75rem] border border-(--line) bg-white/60 px-5 py-5 transition hover:-translate-y-1 hover:border-(--accent) sm:px-6 sm:py-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">{pickByLocale(locale, "Step", "Paso")} {index + 1}</p>
              <h3 className="mt-3 text-xl font-semibold text-(--ink)">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-(--muted)">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="ultimos-articulos" className="surface-card scroll-mt-28 rounded-4xl px-5 py-6 sm:px-8 sm:py-9">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Latest articles", "Ultimos articulos")}</p>
            <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">{pickByLocale(locale, "The blog is organized to scan quickly and enter where it matters.", "El blog esta organizado para escanear rapido y entrar donde importa.")}</h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
            {pickByLocale(locale, "Go to the full blog", "Ir al blog completo")}
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          {latestPost ? (
            <Link
              href={`/blog/${latestPost.slug}`}
              className="group rounded-[1.75rem] border border-(--line) bg-[rgba(255,255,255,0.58)] p-5 transition hover:-translate-y-1 hover:border-(--accent) sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-xs sm:tracking-[0.18em]">
                <span>{latestPost.category}</span>
                <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                <span>{Math.max(1, Math.ceil(estimateBlogPostWordCount(latestPost) / 220))} {pickByLocale(locale, "min read", "min de lectura")}</span>
              </div>
              <h3 className="mt-4 max-w-3xl text-xl font-semibold leading-tight text-(--ink) group-hover:text-(--accent-strong) sm:text-3xl">
                {latestPost.title}
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-(--muted) sm:text-base sm:leading-8">
                {latestPost.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {latestPost.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-(--line) bg-white/55 px-3 py-1.5 text-xs font-medium text-(--accent-strong)"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-(--muted)">
                <span className="rounded-full border border-(--line) bg-white/60 px-4 py-2 font-medium text-(--ink)">
                  {latestPost.author}
                </span>
                <span>{formatLocaleDate(latestPost.date, locale)}</span>
              </div>
            </Link>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-(--line) bg-white/40 p-5 sm:p-6">
              <h3 className="text-2xl font-semibold text-(--ink)">{pickByLocale(locale, "There are no published articles yet.", "Aun no hay articulos publicados.")}</h3>
              <p className="mt-3 text-sm leading-7 text-(--muted)">
                {pickByLocale(locale, "This section is ready to stay organized on mobile and desktop as soon as the blog has content.", "Esta seccion esta preparada para mantenerse ordenada en movil y escritorio en cuanto el blog tenga contenido.")}
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-[1.75rem] border border-(--line) bg-white/58 p-5 transition hover:-translate-y-1 hover:border-(--accent) sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:text-xs sm:tracking-[0.18em]">
                  <span>{post.category}</span>
                  <span className="bg-(--highlight) h-1 w-1 rounded-full" />
                  <span>{Math.max(1, Math.ceil(estimateBlogPostWordCount(post) / 220))} {pickByLocale(locale, "min", "min")}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-tight text-(--ink) group-hover:text-(--accent-strong) sm:text-2xl">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-(--muted)">{post.description}</p>
                <p className="mt-4 text-xs text-(--muted)">
                  {post.author} · {formatLocaleDate(post.date, locale)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="herramientas-destacadas-home" className="rounded-4xl border border-(--line) bg-[rgba(255,255,255,0.5)] px-5 py-6 scroll-mt-28 sm:px-8 sm:py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Featured tools", "Herramientas destacadas")}</p>
            <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">{pickByLocale(locale, "Resources with stronger visual presence and real utility.", "Recursos con mejor presencia visual y utilidad real.")}</h2>
          </div>
          <Link href="/tools" className="text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
            {pickByLocale(locale, "View all", "Ver todas")}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.detailHref}
              className="group rounded-[1.75rem] border border-(--line) bg-(--surface-strong) p-5 shadow-[0_12px_30px_rgba(20,35,26,0.05)] transition hover:-translate-y-1 hover:border-(--accent) sm:p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">
                {tool.category}
              </p>
              <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{tool.intentLabel}</p>
              <h3 className="mt-3 text-xl font-semibold text-(--ink) group-hover:text-(--accent-strong) sm:text-2xl">
                {tool.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-(--muted)">{tool.description}</p>
              <p className="mt-3 text-sm leading-6 text-(--ink)">{tool.primaryOutcome}</p>
              <p className="mt-5 text-sm font-semibold text-(--ink)">{pickByLocale(locale, "View full detail", "Ver ficha completa")}</p>
            </Link>
          ))}
        </div>

        <div className="action-strip mt-6 rounded-4xl p-4 sm:mt-8 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">{pickByLocale(locale, "Recommended next step", "Siguiente paso recomendado")}</p>
              <h3 className="mt-2 text-xl font-semibold text-(--ink)">{pickByLocale(locale, "Read a guide and then act with the right tool.", "Lee una guia y luego ejecuta con la herramienta adecuada.")}</h3>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/blog#archivo-reciente" className="inline-flex items-center justify-center rounded-full bg-(--ink) px-5 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong)">
                {pickByLocale(locale, "Go to blog", "Ir al blog")}
              </Link>
              <Link href="/tools#herramientas-destacadas" className="inline-flex items-center justify-center rounded-full border border-(--line) px-5 py-3 text-sm font-semibold text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)">
                {pickByLocale(locale, "See tools", "Ver herramientas")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
