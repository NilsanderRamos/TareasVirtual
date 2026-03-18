import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { siteConfig } from "@/config/site";
import { blogPosts } from "@/content/blog/posts";
import { getCurrentLocale } from "@/lib/i18n-server";
import { toOpenGraphLocale } from "@/lib/i18n";
import { getBlogPostMeta } from "@/lib/blog";
import { localizeBlogPost } from "@/lib/localize-content";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: BlogPostPageProps,
): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const resolvedParams = await params;
  const post = blogPosts.find((entry) => entry.slug === resolvedParams.slug);

  if (!post) {
    return { title: "Articulo no encontrado" };
  }

  const localizedPost = await localizeBlogPost(post, locale);
  const meta = getBlogPostMeta(localizedPost);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: localizedPost.author }],
    alternates: {
      canonical: `/blog/${localizedPost.slug}`,
    },
    openGraph: {
      type: "article",
      url: `${siteConfig.url}/blog/${localizedPost.slug}`,
      title: meta.title,
      description: meta.description,
      siteName: siteConfig.name,
      locale: toOpenGraphLocale(locale),
      publishedTime: localizedPost.date,
      authors: [localizedPost.author],
      section: localizedPost.category,
      tags: localizedPost.tags,
      images: [
        {
          url: localizedPost.image,
          width: 1200,
          height: 900,
          alt: localizedPost.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [localizedPost.image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = await getCurrentLocale();
  const resolvedParams = await params;
  const post = blogPosts.find((entry) => entry.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const localizedPost = await localizeBlogPost(post, locale);
  const postContent = await BlogPostContent({ post: localizedPost, sourcePost: post, locale });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: localizedPost.title,
    description: localizedPost.description,
    image: [`${siteConfig.url}${localizedPost.image}`],
    datePublished: localizedPost.date,
    dateModified: localizedPost.date,
    author: {
      "@type": "Organization",
      name: localizedPost.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.defaultOgImage}`,
      },
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${localizedPost.slug}`,
    articleSection: localizedPost.category,
    keywords: localizedPost.tags.join(", "),
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {postContent}
    </>
  );
}
