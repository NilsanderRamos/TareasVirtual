import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { estimateBlogPostWordCount } from "@/lib/blog";
import { formatLocaleDate, pickByLocale, SiteLocale } from "@/lib/i18n";
import { BlogPost } from "@/types";

interface BlogPostContentProps {
  post: BlogPost;
  locale: SiteLocale;
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function BlogPostContent({ post, locale }: BlogPostContentProps) {
  const articleContent = post.content ?? [post.description];
  const introduction = post.introduction ?? [];
  const sections = post.sections ?? [];
  const sectionLinks = sections.map((section) => ({
    heading: section.heading,
    href: `#${slugifyHeading(section.heading)}`,
  }));
  const conclusion = post.conclusion ?? [];
  const readingMinutes = Math.max(1, Math.ceil(estimateBlogPostWordCount(post) / 220));

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <header className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-semibold text-(--accent-strong) transition hover:text-(--highlight)"
        >
          {pickByLocale(locale, "Back to blog", "Volver al blog")}
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">
          <span>{post.category}</span>
          <span className="bg-(--highlight) h-1 w-1 rounded-full" />
          <span>{formatLocaleDate(post.date, locale)}</span>
          <span className="bg-(--highlight) h-1 w-1 rounded-full" />
          <span>{readingMinutes} {pickByLocale(locale, "min read", "min de lectura")}</span>
        </div>
        <h1 className="mt-5 text-[1.9rem] font-semibold leading-tight text-(--ink) sm:text-[2.45rem] sm:leading-[1.04]">
          {post.title}
        </h1>
        <p className="mt-5 max-w-xl text-[0.96rem] leading-7 text-(--muted) sm:text-[1rem] sm:leading-7">
          {post.description}
        </p>
      </header>

      {sectionLinks.length >= 4 ? (
        <section id="indice-articulo" className="mx-auto mt-6 max-w-2xl scroll-mt-28">
          <details className="surface-card overflow-hidden rounded-[1.35rem]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-(--ink) sm:px-5">
              <span>{pickByLocale(locale, "Table of contents", "Indice del articulo")}</span>
              <span aria-hidden="true" className="text-(--muted)">▾</span>
            </summary>
            <div className="border-t border-(--line) px-4 py-3 sm:px-5">
              <div className="grid gap-2">
                {sectionLinks.map((section, index) => (
                  <Link
                    key={section.href}
                    href={section.href}
                    className="rounded-2xl border border-(--line) bg-white/45 px-4 py-3 text-sm leading-6 text-(--ink) transition hover:border-(--accent)"
                  >
                    <span className="mr-2 text-(--accent-strong)">{index + 1}.</span>
                    {section.heading}
                  </Link>
                ))}
              </div>
            </div>
          </details>
        </section>
      ) : null}

      <AdSlot slotName="blog-post-inline" locale={locale} className="mx-auto mt-5 w-full max-w-2xl" />

      <div className="mx-auto mt-6 max-w-2xl space-y-8 sm:space-y-10">
        {introduction.length > 0 ? (
          <section className="space-y-5 text-[1.02rem] leading-8 text-(--muted) sm:text-[1.06rem]">
            {introduction.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ) : null}

        {sections.length > 0 ? (
          <div className="space-y-8 sm:space-y-10">
            {sections.map((section) => {
              return (
                <div key={section.heading} className="space-y-6">
                  <section id={slugifyHeading(section.heading)} className="scroll-mt-28">
                    <h2 className="text-2xl font-semibold text-(--ink) sm:text-[2rem]">
                      {section.heading}
                    </h2>
                    {section.subheading ? (
                      <h3 className="mt-4 text-lg font-semibold text-(--accent-strong)">
                        {section.subheading}
                      </h3>
                    ) : null}
                    <div className="mt-4 space-y-5 text-[1.02rem] leading-8 text-(--muted) sm:text-[1.06rem]">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                </div>
              );
            })}
          </div>
        ) : (
          <section className="space-y-5 text-[1.02rem] leading-8 text-(--muted) sm:text-[1.06rem]">
            {articleContent.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        )}

          {conclusion.length > 0 ? (
            <section className="space-y-5 text-[1.02rem] leading-8 text-(--muted) sm:text-[1.06rem]">
              <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Closing", "Cierre")}</p>
              <h2 className="text-2xl font-semibold text-(--ink) sm:text-[2rem]">Conclusion</h2>
              <div className="space-y-5">
                {conclusion.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ) : null}

          {post.externalReferences && post.externalReferences.length > 0 ? (
            <section className="surface-card rounded-[1.35rem] px-5 py-5 sm:px-6 sm:py-6">
              <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Sources", "Fuentes")}</p>
              <h2 className="mt-2 text-2xl font-semibold text-(--ink)">{pickByLocale(locale, "References", "Referencias")}</h2>
              <div className="mt-5 grid gap-3 lg:grid-cols-2">
                {post.externalReferences.map((reference) => (
                  <a
                    key={reference.href}
                    href={reference.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-full flex-col rounded-[1.25rem] border border-(--line) bg-white/60 px-4 py-4 transition hover:border-[rgba(15,118,110,0.28)] hover:bg-[rgba(15,118,110,0.08)]"
                  >
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">
                      {pickByLocale(locale, "Reference", "Referencia")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-(--muted)">{reference.description}</p>
                    <div className="mt-auto flex justify-end pt-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-(--solid-bg) px-4 py-2 text-sm font-semibold text-(--solid-fg)">
                        {pickByLocale(locale, "Open reference", "Abrir referencia")}
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ) : null}

        </div>
    </article>
  );
}