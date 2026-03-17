import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/content/blog/posts";
import { tools } from "@/content/tools";
import { estimateBlogPostWordCount } from "@/lib/blog";
import { BlogPost, BlogReferenceImage } from "@/types";

interface BlogPostContentProps {
  post: BlogPost;
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildInlineReferenceImageMap(sections: BlogPost["sections"] = [], referenceImages: BlogReferenceImage[]) {
  const inlineImageMap = new Map<number, BlogReferenceImage[]>();
  const sectionCount = sections.length;
  const imageCount = referenceImages.length;

  if (sectionCount === 0 || imageCount === 0) {
    return inlineImageMap;
  }

  const assignedImageIndexes = new Set<number>();

  referenceImages.forEach((image, imageIndex) => {
    if (!image.sectionHeading) {
      return;
    }

    const targetSectionIndex = sections.findIndex(
      (section) => section.heading === image.sectionHeading,
    );

    if (targetSectionIndex === -1) {
      return;
    }

    const existingImages = inlineImageMap.get(targetSectionIndex) ?? [];
    existingImages.push(image);
    inlineImageMap.set(targetSectionIndex, existingImages);
    assignedImageIndexes.add(imageIndex);
  });

  const remainingImageIndexes = referenceImages
    .map((_, index) => index)
    .filter((index) => !assignedImageIndexes.has(index));

  for (const imageIndex of remainingImageIndexes) {
    let targetSectionIndex = Math.round(((imageIndex + 1) * (sectionCount + 1)) / (imageCount + 1)) - 1;
    targetSectionIndex = Math.max(0, Math.min(sectionCount - 1, targetSectionIndex));

    while ((inlineImageMap.get(targetSectionIndex)?.length ?? 0) > 0 && targetSectionIndex < sectionCount - 1) {
      targetSectionIndex += 1;
    }

    while ((inlineImageMap.get(targetSectionIndex)?.length ?? 0) > 0 && targetSectionIndex > 0) {
      targetSectionIndex -= 1;
    }

    const existingImages = inlineImageMap.get(targetSectionIndex) ?? [];
    existingImages.push(referenceImages[imageIndex]);
    inlineImageMap.set(targetSectionIndex, existingImages);
  }

  return inlineImageMap;
}

function normalizeTaxonomyValue(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getSuggestedToolsForCategory(category: string) {
  const toolMap: Record<string, string[]> = {
    aprendizaje: ["generador-de-resumenes", "corrector-de-redaccion"],
    productividad: ["organizador-de-tareas", "temporizador-pomodoro"],
    tecnologia: ["corrector-de-redaccion", "organizador-de-tareas"],
    finanzas: ["calculadora-salario-neto-usa", "organizador-de-tareas"],
    ecommerce: ["organizador-de-tareas", "corrector-de-redaccion"],
    "software empresarial": ["organizador-de-tareas", "corrector-de-redaccion"],
  };
  const categoryKey = normalizeTaxonomyValue(category);
  const selectedSlugs = toolMap[categoryKey] ?? ["organizador-de-tareas"];

  return selectedSlugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool));
}

function getArticleConversionPlan(post: BlogPost, relatedPosts: BlogPost[], suggestedTools: ReturnType<typeof getSuggestedToolsForCategory>) {
  const categoryKey = normalizeTaxonomyValue(post.category);
  const primaryRelatedPost = relatedPosts[0] ?? null;
  const primaryTool = suggestedTools[0] ?? null;

  if (categoryKey === "finanzas") {
    return {
      eyebrow: "Decision financiera",
      title: "Convierte el analisis en una accion concreta y ordenada.",
      description: "Despues de revisar numeros o criterios fiscales, suele convenir seguir con una comparativa relacionada o dejar claro el siguiente paso operativo.",
      primaryAction: primaryRelatedPost
        ? { href: `/blog/${primaryRelatedPost.slug}`, label: "Seguir con otra guia financiera", detail: primaryRelatedPost.title }
        : { href: "/blog#archivo-reciente", label: "Ver mas guias", detail: "Encuentra otras comparativas del blog." },
      secondaryAction: primaryTool
        ? { href: primaryTool.href, label: "Organizar el siguiente paso", detail: primaryTool.name }
        : { href: "/contact", label: "Pedir orientacion", detail: "Abre contacto si necesitas una recomendacion directa." },
    };
  }

  if (categoryKey === "aprendizaje" || categoryKey === "productividad") {
    return {
      eyebrow: "Aplicacion inmediata",
      title: "Lleva esta idea a ejecucion mientras la tienes fresca.",
      description: "En contenido de estudio o productividad, el mejor siguiente paso suele ser aplicar una herramienta concreta o reforzar la lectura con una guia complementaria.",
      primaryAction: primaryTool
        ? { href: primaryTool.href, label: "Usar herramienta recomendada", detail: primaryTool.name }
        : { href: "/tools#herramientas-destacadas", label: "Abrir herramientas", detail: "Ve al bloque principal de utilidades." },
      secondaryAction: primaryRelatedPost
        ? { href: `/blog/${primaryRelatedPost.slug}`, label: "Leer guia relacionada", detail: primaryRelatedPost.title }
        : { href: "/blog#archivo-reciente", label: "Ver mas articulos", detail: "Sigue explorando el archivo reciente." },
    };
  }

  if (categoryKey === "tecnologia" || categoryKey === "ecommerce" || categoryKey === "software empresarial") {
    return {
      eyebrow: "Comparar y decidir",
      title: "Sigue con una ruta de evaluacion mas corta y util.",
      description: "En temas de tecnologia o software conviene contrastar una guia cercana y, si ya tienes criterio suficiente, pasar a una accion mas practica o resolver dudas puntuales.",
      primaryAction: primaryRelatedPost
        ? { href: `/blog/${primaryRelatedPost.slug}`, label: "Comparar otra guia", detail: primaryRelatedPost.title }
        : { href: "/blog#archivo-reciente", label: "Ver mas comparativas", detail: "Sigue navegando el archivo del blog." },
      secondaryAction: { href: "/contact", label: "Resolver una duda", detail: "Usa contacto si necesitas una recomendacion mas directa." },
    };
  }

  return {
    eyebrow: "Siguiente paso",
    title: "Mantén el impulso con una accion corta y clara.",
    description: "El objetivo es no cerrar la lectura sin una salida concreta: otra guia, una herramienta o una conversacion directa.",
    primaryAction: primaryRelatedPost
      ? { href: `/blog/${primaryRelatedPost.slug}`, label: "Leer contenido relacionado", detail: primaryRelatedPost.title }
      : { href: "/blog#archivo-reciente", label: "Seguir leyendo", detail: "Explora mas articulos del archivo." },
    secondaryAction: primaryTool
      ? { href: primaryTool.href, label: "Ir a una herramienta", detail: primaryTool.name }
      : { href: "/contact", label: "Ir a contacto", detail: "Abre una via directa para seguir." },
  };
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const articleContent = post.content ?? [post.description];
  const introduction = post.introduction ?? [];
  const sections = post.sections ?? [];
  const referenceImages = post.referenceImages ?? [];
  const sectionLinks = sections.map((section) => ({
    heading: section.heading,
    href: `#${slugifyHeading(section.heading)}`,
  }));
  const conclusion = post.conclusion ?? [];
  const keyTakeaways =
    post.keyTakeaways ?? [
      "Define un objetivo claro antes de comenzar.",
      "Evita multitarea y trabaja por bloques cortos.",
      "Convierte ideas clave en acciones concretas.",
    ];
  const heroTakeaways = keyTakeaways.slice(0, 3);
  const readingMinutes = Math.max(1, Math.ceil(estimateBlogPostWordCount(post) / 220));
  const inlineReferenceImageMap = buildInlineReferenceImageMap(sections, referenceImages);
  const mobileSectionLinks = sectionLinks.slice(0, 6);
  const relatedPosts = blogPosts
    .filter((entry) => entry.slug !== post.slug && entry.category === post.category)
    .slice(0, 2);
  const suggestedTools = getSuggestedToolsForCategory(post.category).slice(0, 2);
  const conversionPlan = getArticleConversionPlan(post, relatedPosts, suggestedTools);
  const primaryToolForNextStep = suggestedTools[0] ?? null;
  const showSalaryCalculatorBoost = post.slug === "calcular-salario-neto-estados-unidos-2026" && primaryToolForNextStep?.slug === "calculadora-salario-neto-usa";

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <div className="blog-reveal surface-card relative overflow-hidden rounded-4xl px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.12),transparent_24%)]"
        />
        <div className="relative">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-(--accent-strong) transition hover:text-(--highlight)"
          >
            Volver al blog
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-(--accent-strong) sm:mt-8 sm:text-xs sm:tracking-[0.22em]">
            <span>{post.category}</span>
            <span className="bg-(--highlight) h-1 w-1 rounded-full" />
            <span>{readingMinutes} min de lectura</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl leading-tight font-semibold text-(--ink) sm:mt-5 sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-(--muted) sm:mt-5 sm:text-xl sm:leading-8">
            {post.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-(--muted) sm:mt-8 sm:gap-4">
            <span className="rounded-full border border-(--line) bg-white/60 px-3 py-2 font-medium text-(--ink) sm:px-4">
              {post.author}
            </span>
            <span>{new Date(post.date).toLocaleDateString("es-DO")}</span>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {heroTakeaways.map((item, index) => (
                <div
                  key={item}
                  className={index === 0 ? "rounded-3xl border border-(--line) bg-[rgba(15,118,110,0.09)] p-4 sm:p-5" : "rounded-3xl border border-(--line) bg-white/65 p-4 sm:p-5"}
                >
                  <p className="section-label text-[0.7rem] font-semibold uppercase">Punto clave {index + 1}</p>
                  <p className="mt-3 text-base leading-7 text-(--ink)">{item}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-(--line) bg-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <div className="relative aspect-4/3">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 22rem"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="border-t border-(--line) px-4 py-4 sm:px-5">
                <p className="section-label text-[0.7rem] font-semibold uppercase">Portada editorial</p>
                <p className="mt-2 text-sm leading-6 text-(--muted)">{post.imageAlt}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {sectionLinks.length > 0 ? (
                    <Link href="#indice-articulo" className="text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
                      Ir al indice
                    </Link>
                  ) : null}
                  <Link href={conversionPlan.primaryAction.href} className="text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
                    {conversionPlan.primaryAction.label}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="indice-articulo" className="scroll-mt-28" />
      <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="space-y-8">
          {(heroTakeaways.length > 0 || mobileSectionLinks.length > 0) ? (
            <section className="blog-reveal blog-reveal-delay-1 surface-card rounded-[1.75rem] px-5 py-6 lg:hidden">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-label text-xs font-semibold uppercase">Guia rapida</p>
                  <h2 className="mt-2 text-lg font-semibold text-(--ink)">Indice del articulo</h2>
                </div>
              </div>

              {mobileSectionLinks.length > 0 ? (
                <div className="mt-4">
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {mobileSectionLinks.map((section, index) => (
                      <Link
                        key={section.href}
                        href={section.href}
                        className="article-index-link rounded-2xl px-4 py-3 text-sm font-medium leading-6 text-(--ink) transition"
                      >
                        <span className="flex items-start gap-3">
                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(15,118,110,0.12)] text-[0.72rem] font-semibold text-(--accent-strong)">
                            {index + 1}
                          </span>
                          <span>{section.heading}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {introduction.length > 0 ? (
            <section className="surface-card rounded-[1.75rem] px-5 py-6 sm:px-8 sm:py-7">
              <p className="section-label text-xs font-semibold uppercase">Introduccion</p>
              <div className="mt-4 space-y-4 text-base leading-7 text-(--muted) sm:space-y-5 sm:text-[1.02rem] sm:leading-8">
                {introduction.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ) : null}

          {showSalaryCalculatorBoost ? (
            <section className="overflow-hidden rounded-[1.75rem] border border-emerald-200 bg-[linear-gradient(135deg,rgba(16,185,129,0.96),rgba(13,148,136,0.92))] px-5 py-6 text-white shadow-[0_24px_56px_-32px_rgba(16,185,129,0.55)] sm:px-8 sm:py-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/70">Antes de seguir leyendo</p>
                  <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Baja dos ofertas a un neto real antes de contestar una entrevista.</h2>
                  <p className="mt-4 text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
                    La calculadora te deja comparar salario, estado, bonus, 401(k), deducciones payroll y retencion extra sin salir del flujo de esta guia.
                  </p>
                </div>
                <div className="grid gap-3 sm:min-w-72">
                  <Link
                    href={primaryToolForNextStep.href}
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
                  >
                    Comparar 2 ofertas ahora
                  </Link>
                  <Link
                    href="#cta-articulo-contextual"
                    className="inline-flex items-center justify-center rounded-full border border-white/28 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
                  >
                    Ver siguiente paso recomendado
                  </Link>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  "Compara dos estados lado a lado y evita decidir solo con bruto anual.",
                  "Ajusta bonus, deducciones payroll y retencion extra para acercarte mas al paycheck.",
                  "Usa neto anual, mensual y por periodo para negociar con mas criterio.",
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-white/18 bg-white/10 px-4 py-4 text-sm leading-6 text-white/88">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {sections.length > 0 ? (
            <div className="space-y-8">
              {sections.map((section, index) => {
                const inlineImages = inlineReferenceImageMap.get(index) ?? [];

                return (
                  <div key={section.heading} className="space-y-8">
                    <section
                      id={slugifyHeading(section.heading)}
                      className="surface-card scroll-mt-28 rounded-[1.75rem] px-5 py-6 sm:px-8 sm:py-7"
                    >
                      <div className="flex flex-wrap items-start gap-3 sm:items-center">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(15,118,110,0.12)] text-sm font-semibold text-(--accent-strong)">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="section-label text-[0.7rem] font-semibold uppercase">Seccion clave</p>
                          <h2 className="mt-1 text-xl font-semibold text-(--ink) sm:text-3xl">
                            {section.heading}
                          </h2>
                        </div>
                      </div>
                      {section.subheading ? (
                        <h3 className="mt-4 text-base font-semibold text-(--accent-strong) sm:mt-5 sm:text-xl">
                          {section.subheading}
                        </h3>
                      ) : null}
                      <div className="mt-4 space-y-4 text-base leading-7 text-(--muted) sm:mt-5 sm:space-y-5 sm:text-[1.02rem] sm:leading-8">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </section>

                    {inlineImages.map((inlineImage) => (
                      <a
                        key={`${inlineImage.src}-${inlineImage.sectionHeading ?? inlineImage.label}`}
                        href={inlineImage.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group surface-card block overflow-hidden rounded-[1.75rem] transition hover:border-[rgba(15,118,110,0.28)]"
                      >
                        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
                          <div className="relative aspect-16/10 min-h-56 overflow-hidden sm:min-h-64 lg:aspect-auto lg:min-h-88">
                            <Image
                              src={inlineImage.src}
                              alt={inlineImage.alt}
                              fill
                              sizes="(max-width: 1024px) 100vw, 60vw"
                              className="object-cover transition duration-500 group-hover:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.16)_100%)]" />
                          </div>
                          <div className="flex flex-col justify-between border-t border-(--line) px-5 py-5 sm:px-6 lg:border-t-0 lg:border-l lg:py-6">
                            <div>
                              <p className="section-label text-[0.7rem] font-semibold uppercase">Referencia visual integrada</p>
                              <h3 className="mt-3 text-xl font-semibold text-(--ink) sm:text-2xl">
                                {inlineImage.caption}
                              </h3>
                              <p className="mt-3 text-sm leading-7 text-(--muted) sm:text-base sm:leading-8">
                                {inlineImage.alt}
                              </p>
                            </div>
                            <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-(--line) pt-4">
                              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">
                                {inlineImage.label}
                              </span>
                              <span className="text-sm font-semibold text-(--ink)">Abrir referencia</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <section className="surface-card rounded-[1.75rem] px-5 py-6 sm:px-8 sm:py-7">
              <div className="space-y-4 text-base leading-7 text-(--muted) sm:space-y-5 sm:text-[1.02rem] sm:leading-8">
                {articleContent.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {post.comparisonTable && post.comparisonTable.length > 0 ? (
            <section className="surface-card overflow-hidden rounded-[1.75rem]">
              <div className="border-b border-(--line) px-5 py-5 sm:px-8">
                <p className="section-label text-xs font-semibold uppercase">Comparativa</p>
                <h2 className="mt-2 text-2xl font-semibold text-(--ink)">Tabla comparativa</h2>
              </div>
              <div className="space-y-4 p-5 sm:hidden">
                {post.comparisonTable.map((item) => (
                  <article key={item.name} className="rounded-3xl border border-(--line) bg-white/55 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-(--ink)">{item.name}</h3>
                        <p className="mt-1 text-sm leading-6 text-(--muted)">{item.price}</p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-(--muted)">
                      {item.keyFeatures.map((feature) => (
                        <li key={feature} className="flex gap-2">
                          <span className="bg-(--highlight) mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 rounded-2xl bg-[rgba(15,118,110,0.08)] px-4 py-3 text-sm leading-6 text-(--ink)">
                      {item.verdict}
                    </div>
                  </article>
                ))}
              </div>
              <div className="hidden overflow-x-auto sm:block">
                <table className="min-w-176 text-left text-sm text-(--muted)">
                  <thead className="bg-[rgba(255,255,255,0.55)] text-[0.7rem] uppercase tracking-[0.18em] text-(--accent-strong)">
                    <tr>
                      <th className="px-6 py-4 font-semibold sm:px-8">Opcion</th>
                      <th className="px-6 py-4 font-semibold">Precio</th>
                      <th className="px-6 py-4 font-semibold">Funciones clave</th>
                      <th className="px-6 py-4 font-semibold sm:px-8">Veredicto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {post.comparisonTable.map((item, index) => (
                      <tr
                        key={item.name}
                        className={index % 2 === 0 ? "bg-white/45" : "bg-[rgba(255,250,242,0.7)]"}
                      >
                        <td className="px-6 py-5 align-top font-semibold text-(--ink) sm:px-8">
                          {item.name}
                        </td>
                        <td className="px-6 py-5 align-top">{item.price}</td>
                        <td className="px-6 py-5 align-top">
                          <ul className="space-y-2">
                            {item.keyFeatures.map((feature) => (
                              <li key={feature} className="flex gap-2">
                                <span className="bg-(--highlight) mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-6 py-5 align-top sm:px-8">{item.verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {conclusion.length > 0 ? (
            <section className="surface-card rounded-[1.75rem] px-5 py-6 sm:px-8 sm:py-7">
              <p className="section-label text-xs font-semibold uppercase">Cierre</p>
              <h2 className="mt-2 text-2xl font-semibold text-(--ink) sm:text-3xl">Conclusion</h2>
              <div className="mt-4 space-y-4 text-base leading-7 text-(--muted) sm:mt-5 sm:space-y-5 sm:text-[1.02rem] sm:leading-8">
                {conclusion.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ) : null}

          {post.cta ? (
            <section className="overflow-hidden rounded-[1.75rem] border border-[rgba(15,118,110,0.2)] bg-[linear-gradient(135deg,rgba(15,118,110,0.95),rgba(17,94,89,0.92))] px-5 py-7 text-white shadow-[0_18px_50px_rgba(15,118,110,0.22)] sm:px-8 sm:py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {post.cta.title}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
                {post.cta.description}
              </p>
              <Link
                href={post.cta.href}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-(--accent-strong) transition hover:bg-[rgba(255,250,242,0.96)] sm:w-auto"
              >
                {post.cta.label}
              </Link>
            </section>
          ) : null}

          <section id="cta-articulo-contextual" className="blog-reveal blog-reveal-delay-2 action-strip scroll-mt-28 rounded-[1.75rem] px-5 py-6 sm:px-8 sm:py-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="section-label text-xs font-semibold uppercase">{conversionPlan.eyebrow}</p>
                <h2 className="mt-3 text-2xl font-semibold text-(--ink) sm:text-3xl">{conversionPlan.title}</h2>
                <p className="mt-4 text-sm leading-7 text-(--muted) sm:text-base sm:leading-8">{conversionPlan.description}</p>
              </div>
              <span className="hero-chip w-fit rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">
                {post.category}
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
              <Link href={conversionPlan.primaryAction.href} className="rounded-3xl border border-emerald-200 bg-linear-to-br from-white to-emerald-50 px-5 py-5 shadow-[0_18px_40px_-32px_rgba(16,185,129,0.55)] transition hover:-translate-y-0.5 hover:border-emerald-300">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">Accion principal</p>
                <p className="mt-2 text-lg font-semibold text-(--ink)">{conversionPlan.primaryAction.label}</p>
                <p className="mt-2 text-sm leading-6 text-(--muted)">{conversionPlan.primaryAction.detail}</p>
              </Link>
              <Link href={conversionPlan.secondaryAction.href} className="article-index-link rounded-3xl px-4 py-4 transition">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">Alternativa</p>
                <p className="mt-2 text-base font-semibold text-(--ink)">{conversionPlan.secondaryAction.label}</p>
                <p className="mt-2 text-sm leading-6 text-(--muted)">{conversionPlan.secondaryAction.detail}</p>
              </Link>
            </div>

            {suggestedTools.length > 0 ? (
              <div className="mt-5 border-t border-(--line) pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">Herramientas que encajan con este tema</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {suggestedTools.map((tool) => (
                    <Link key={tool.slug} href={tool.href} className="blog-card-premium rounded-3xl border border-(--line) bg-white/60 px-4 py-4 hover:border-(--accent)">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{tool.intentLabel}</p>
                      <p className="text-sm font-semibold text-(--ink)">{tool.name}</p>
                      <p className="mt-2 text-sm leading-6 text-(--muted)">{tool.primaryOutcome}</p>
                      <p className="mt-4 text-sm font-semibold text-(--accent-strong)">Abrir herramienta</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          {post.externalReferences && post.externalReferences.length > 0 ? (
            <section className="surface-card rounded-[1.75rem] px-5 py-6 sm:px-8 sm:py-7">
              <p className="section-label text-xs font-semibold uppercase">Fuentes</p>
              <h2 className="mt-2 text-2xl font-semibold text-(--ink)">Hyperlinks de referencia</h2>
              <div className="mt-5 grid gap-3 lg:grid-cols-2">
                {post.externalReferences.map((reference) => (
                  <a
                    key={reference.href}
                    href={reference.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[1.25rem] border border-(--line) bg-white/60 px-4 py-4 transition hover:border-[rgba(15,118,110,0.28)] hover:bg-[rgba(15,118,110,0.08)]"
                  >
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">
                      {reference.publisher}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-(--ink)">{reference.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-(--muted)">{reference.description}</p>
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          {post.referenceImages && post.referenceImages.length > 0 ? (
            <section className="surface-card rounded-[1.75rem] px-5 py-6 sm:px-8 sm:py-7">
              <p className="section-label text-xs font-semibold uppercase">Apoyo visual</p>
              <h2 className="mt-2 text-2xl font-semibold text-(--ink)">Imagenes de referencia</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {post.referenceImages.map((image) => (
                  <a
                    key={`${image.src}-${image.href}`}
                    href={image.href}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-[1.35rem] border border-(--line) bg-white/65 transition hover:border-[rgba(15,118,110,0.28)] hover:bg-[rgba(15,118,110,0.08)]"
                  >
                    <div className="relative aspect-16/10">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="px-4 py-4 sm:px-5">
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">
                        {image.label}
                      </p>
                      <p className="mt-2 text-base font-semibold text-(--ink)">{image.caption}</p>
                      <p className="mt-2 text-sm leading-6 text-(--muted)">{image.alt}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          {post.internalLinks && post.internalLinks.length > 0 ? (
            <section className="surface-card rounded-[1.75rem] px-5 py-6 sm:px-8 sm:py-7">
              <p className="section-label text-xs font-semibold uppercase">Continuar leyendo</p>
              <h2 className="mt-2 text-2xl font-semibold text-(--ink)">Enlaces recomendados</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {post.internalLinks.map((link) => (
                  <Link
                    key={`${link.type}-${link.href}`}
                    href={link.href}
                    className={link.type === "tool"
                      ? "rounded-[1.25rem] border border-emerald-200 bg-linear-to-br from-emerald-50 to-white px-4 py-4 text-sm leading-6 font-medium text-(--ink) transition hover:border-emerald-300 hover:-translate-y-0.5"
                      : "rounded-[1.25rem] border border-(--line) bg-white/60 px-4 py-4 text-sm leading-6 font-medium text-(--ink) transition hover:border-[rgba(15,118,110,0.28)] hover:bg-[rgba(15,118,110,0.08)]"}
                  >
                    <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">
                      {link.type === "tool" ? "Herramienta" : "Articulo"}
                    </span>
                    <span className="mt-2 block">{link.title}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {post.faq && post.faq.length > 0 ? (
            <section className="surface-card rounded-[1.75rem] px-5 py-6 sm:px-8 sm:py-7">
              <p className="section-label text-xs font-semibold uppercase">FAQ</p>
              <h2 className="mt-2 text-2xl font-semibold text-(--ink)">Preguntas frecuentes</h2>
              <div className="mt-5 space-y-4">
                {post.faq.map((item) => (
                  <div key={item.question} className="rounded-[1.25rem] border border-(--line) bg-white/50 p-4 sm:p-5">
                    <h3 className="text-base font-semibold text-(--ink) sm:text-lg">{item.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-(--muted) sm:text-base sm:leading-8">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="surface-card rounded-[1.75rem] px-5 py-5 sm:px-8 sm:py-6">
            <p className="section-label text-xs font-semibold uppercase">Etiquetas</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-(--line) bg-white/55 px-3 py-1.5 text-xs font-medium text-(--accent-strong)"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden space-y-6 lg:sticky lg:top-24 lg:block">
          <section className="surface-card rounded-3xl px-5 py-6">
            <p className="section-label text-xs font-semibold uppercase">Resumen rapido</p>
            <h2 className="mt-2 text-xl font-semibold text-(--ink)">Puntos clave</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-(--muted)">
              {keyTakeaways.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="bg-(--highlight) mt-2 h-2 w-2 shrink-0 rounded-full" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {sectionLinks.length > 0 ? (
            <section className="blog-reveal blog-reveal-delay-1 surface-card rounded-3xl px-5 py-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-label text-xs font-semibold uppercase">Navegacion</p>
                  <h2 className="mt-2 text-xl font-semibold text-(--ink)">Indice del articulo</h2>
                </div>
                <span className="hero-chip rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">
                  Desktop
                </span>
              </div>
              <div className="mt-4 grid gap-2">
                {sectionLinks.map((section, index) => (
                  <Link
                    key={section.href}
                    href={section.href}
                    className="article-index-link block rounded-2xl px-3 py-3 text-sm leading-6 text-(--muted) transition hover:text-(--ink)"
                  >
                    <span className="flex items-start gap-3">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(15,118,110,0.12)] text-[0.72rem] font-semibold text-(--accent-strong)">
                        {index + 1}
                      </span>
                      <span>{section.heading}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}