import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/content/blog/posts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: BlogPostPageProps,
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogPosts.find((entry) => entry.slug === resolvedParams.slug);

  if (!post) {
    return { title: "Articulo no encontrado" };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = blogPosts.find((entry) => entry.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link href="/blog" className="text-sm font-medium text-blue-700 hover:underline">
        Volver al blog
      </Link>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-blue-700">
        {post.category}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">{post.title}</h1>
      <p className="mt-3 text-sm text-gray-500">
        {post.author} · {new Date(post.date).toLocaleDateString("es-DO")}
      </p>
      <p className="mt-6 text-lg leading-8 text-gray-700">{post.description}</p>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Resumen rapido</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
          <li>Define un objetivo claro antes de comenzar cada sesion.</li>
          <li>Bloquea tiempos cortos de enfoque y evita multitarea.</li>
          <li>Convierte ideas clave en una lista de acciones concretas.</li>
        </ul>
      </section>
    </article>
  );
}
