import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { blogPosts } from "@/content/blog/posts";
import { siteConfig } from "@/config/site";
import { estimateBlogPostWordCount } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Archivo editorial con comparativas originales, guias practicas y contenido comercial en espanol para decidir mejor en 2026.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: "Archivo editorial con comparativas originales, guias practicas y contenido comercial en espanol para decidir mejor en 2026.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 900,
        alt: `${siteConfig.name} blog editorial`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description: "Archivo editorial con comparativas originales, guias practicas y contenido comercial en espanol para decidir mejor en 2026.",
    images: [siteConfig.defaultOgImage],
  },
};

export default function BlogPage() {
  const [featuredPost, ...remainingPosts] = blogPosts;
  const editorialSpotlight = remainingPosts.slice(0, 3);
  const categories = Array.from(new Set(blogPosts.map((post) => post.category))).sort();
  const editorialSignals = ["Comparativas originales", "Lectura clara", "Decision util"];
  const compactSignals = [`${blogPosts.length} articulos publicados`, `${categories.length} categorias activas`];
  const readingPrinciples = [
    "Primero una pieza destacada para orientar la decision.",
    "Luego filtros simples para encontrar el resto sin ruido.",
    "Cada tarjeta muestra solo lo necesario para decidir si abrirla.",
  ];
  const archiveNotes = [
    {
      title: "Menos saturacion",
      description: "La portada ya no empuja demasiados mensajes a la vez. Primero orienta, luego deja explorar.",
    },
    {
      title: "Mejor orden visual",
      description: "La jerarquia entre destacado, archivo y rutas siguientes ahora es mucho mas clara.",
    },
    {
      title: "Lectura mas limpia",
      description: "La informacion sigue completa, pero presentada en bloques mas faciles de recorrer en movil y desktop.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <section id="blog-portada" className="surface-card editorial-aurora relative scroll-mt-28 overflow-hidden rounded-4xl px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-white/35 to-transparent" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.12),transparent_24%)]"
        />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_22rem] xl:items-start">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              {editorialSignals.map((signal) => (
                <span
                  key={signal}
                  className="hero-chip rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)"
                >
                  {signal}
                </span>
              ))}
            </div>
            <p className="section-label mt-4 text-xs font-semibold uppercase">Archivo editorial</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-(--ink) sm:text-5xl lg:text-6xl">
              Un blog limpio, claro y curado para leer mejor sin sentirlo cargado.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-(--muted) sm:mt-5 sm:text-xl sm:leading-8">
              Aqui conviven comparativas originales, guias practicas y contenido comercial util para software, finanzas y operaciones digitales. La informacion no desaparece: se organiza mejor para que la lectura respire.
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
                <span key={category} className="hero-chip rounded-full px-3 py-1.5 text-xs font-medium text-(--accent-strong)">
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                href="#archivo-reciente"
                className="inline-flex w-full items-center justify-center rounded-full bg-(--ink) px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-(--accent-strong) sm:w-auto"
              >
                Explorar archivo
              </Link>
              {featuredPost ? (
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex w-full items-center justify-center rounded-full border border-(--line) bg-white/85 px-6 py-3 text-sm font-semibold text-(--ink) transition hover:-translate-y-0.5 hover:border-(--accent) hover:text-(--accent-strong) sm:w-auto"
                >
                  Leer articulo principal
                </Link>
              ) : null}
              <Link href="/tools" className="inline-flex items-center justify-center px-2 py-3 text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
                Ver herramientas
              </Link>
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="rounded-4xl border border-(--line) bg-white/60 p-5 shadow-[0_18px_48px_rgba(20,35,26,0.08)] sm:p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-(--highlight)">Como se lee mejor</p>
              <h2 className="mt-3 text-2xl font-semibold text-(--ink)">Una estructura mas limpia para encontrar antes lo importante.</h2>
              <div className="mt-5 space-y-3">
                {readingPrinciples.map((item, index) => (
                  <div key={item} className="rounded-3xl border border-(--line) bg-white/62 px-4 py-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">Paso {index + 1}</p>
                    <p className="mt-2 text-sm leading-6 text-(--muted)">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {editorialSpotlight.length > 0 ? (
              <div className="rounded-4xl border border-(--line) bg-white/58 p-5 shadow-[0_18px_46px_rgba(20,35,26,0.06)] sm:p-6">
                <p className="section-label text-xs font-semibold uppercase">Lecturas en radar</p>
                <div className="mt-4 grid gap-3">
                  {editorialSpotlight.map((post, index) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="overflow-hidden rounded-3xl border border-(--line) bg-white/62 transition hover:-translate-y-0.5 hover:border-(--accent)">
                      <div className="relative overflow-hidden" style={{ aspectRatio: "2 / 1" }}>
                        <Image
                          src={post.image}
                          alt={post.imageAlt}
                          fill
                          sizes="(max-width: 1280px) 100vw, 24rem"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,35,26,0.02),rgba(20,35,26,0.3))]" />
                      </div>
                      <div className="px-4 py-4">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">Radar {index + 1}</p>
                        <p className="mt-2 text-base font-semibold text-(--ink)">{post.title}</p>
                        <p className="mt-2 text-sm leading-6 text-(--muted)">{post.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {featuredPost ? (
        <section id="articulo-destacado" className="mt-8 grid scroll-mt-28 gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-[minmax(0,1.28fr)_minmax(0,0.72fr)] lg:items-stretch">
          <article className="surface-card relative overflow-hidden rounded-4xl px-5 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-10">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[rgba(217,119,6,0.12)] blur-3xl" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="section-label text-xs font-semibold uppercase">Articulo destacado</p>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-700">
                Seleccion editorial
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--accent-strong) sm:mt-5 sm:text-xs sm:tracking-[0.18em]">
              <span>{featuredPost.category}</span>
              <span className="bg-(--highlight) h-1 w-1 rounded-full" />
              <span>
                {Math.max(1, Math.ceil(estimateBlogPostWordCount(featuredPost) / 220))} min de lectura
              </span>
            </div>
            <h2 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight text-(--ink) sm:mt-5 sm:text-4xl">
              {featuredPost.title}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-(--muted) sm:mt-5 sm:text-lg sm:leading-8">
              {featuredPost.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {featuredPost.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-(--line) bg-white/55 px-3 py-1.5 text-xs font-medium text-(--accent-strong)"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-(--muted) sm:mt-8 sm:gap-4">
              <span className="rounded-full border border-(--line) bg-white/60 px-3 py-2 font-medium text-(--ink) sm:px-4">
                {featuredPost.author}
              </span>
              <span>{new Date(featuredPost.date).toLocaleDateString("es-DO")}</span>
            </div>
            <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
              {archiveNotes.map((item, index) => (
                <div key={item.title} className={index === 0 ? "quality-card rounded-3xl px-4 py-4" : "rounded-3xl border border-(--line) bg-white/60 px-4 py-4"}>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-(--ink)">{item.description}</p>
                </div>
              ))}
            </div>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(15,118,110,0.98),rgba(17,94,89,0.94))] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 sm:mt-8 sm:w-auto"
            >
              Leer articulo destacado
            </Link>
          </article>

          <aside className="space-y-5">
            <section className="editorial-band rounded-4xl px-5 py-6 sm:px-8 sm:py-7">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/72">Bloque curado</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Empieza por una sola pieza fuerte antes de abrir el resto del archivo.</h2>
              <p className="mt-4 text-sm leading-7 text-white/82">
                Asi la portada no se siente como una pared de tarjetas. Primero orienta. Despues deja profundizar.
              </p>
            </section>

            <section className="surface-card rounded-4xl px-5 py-6 sm:px-8 sm:py-7">
              <p className="section-label text-xs font-semibold uppercase">Por que empezar aqui</p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-(--muted)">
                <div className="info-tile rounded-3xl px-4 py-4">
                  Resume bien el tema y te deja decidir si conviene profundizar o no.
                </div>
                <div className="info-tile rounded-3xl px-4 py-4">
                  Mantiene contexto suficiente antes de obligarte a abrir mas piezas.
                </div>
                <div className="rounded-3xl border border-(--line) bg-linear-to-r from-white/75 to-white/55 px-4 py-4 text-(--ink)">
                  Si ya prefieres ejecutar, desde aqui puedes saltar luego a herramientas sin romper el flujo.
                </div>
              </div>
            </section>
          </aside>
        </section>
      ) : null}

      {remainingPosts.length > 0 ? <BlogExplorer posts={remainingPosts} /> : null}

      <section className="mt-8 surface-card rounded-4xl px-5 py-6 sm:mt-10 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label text-xs font-semibold uppercase">Confianza editorial</p>
            <h2 className="mt-3 text-3xl font-semibold text-(--ink) sm:text-4xl">Senales simples para entender el criterio del archivo.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-(--muted)">
            Este cierre resume por que el blog busca verse mas ligero sin perder profundidad ni utilidad.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            "Contenido original actualizado para 2026.",
            "Fuentes y referencias visibles cuando aplican.",
            "Bloques pensados para leer con menos friccion.",
          ].map((item) => (
            <div key={item} className="info-tile rounded-3xl px-4 py-4">
              <p className="text-sm leading-6 text-(--ink)">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {remainingPosts.length > 0 ? (
        <section className="mt-8 action-strip rounded-4xl p-4 sm:mt-10 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">Siguiente paso</p>
              <h3 className="mt-2 text-xl font-semibold text-(--ink)">Si ya tienes claro el problema, pasa a una herramienta.</h3>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/tools#herramientas-destacadas" className="inline-flex items-center justify-center rounded-full bg-(--ink) px-5 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong)">
                Ir a herramientas
              </Link>
              <Link href="/contact" className="text-sm font-semibold text-(--accent-strong) hover:text-(--ink)">
                O pedir ayuda directa
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-4xl border border-dashed border-(--line) bg-white/45 px-5 py-6 text-center sm:mt-10 sm:px-8 sm:py-8">
          <h2 className="text-2xl font-semibold text-(--ink)">El blog todavia no tiene articulos publicados.</h2>
          <p className="mt-3 text-sm leading-7 text-(--muted)">
            La estructura ya esta preparada para mostrar contenidos de forma clara y optimizada en movil cuando se publiquen nuevas entradas.
          </p>
        </section>
      )}
    </div>
  );
}

