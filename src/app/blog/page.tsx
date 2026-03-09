import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/content/blog/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articulos y guias de productividad, estudio y herramientas.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
      <p className="mt-2 text-gray-600">
        Lecturas rapidas para estudiar mejor y organizar tus tareas.
      </p>

      <div className="mt-8 space-y-4">
        {blogPosts.map((post) => (
          <article key={post.slug} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              {post.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">{post.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{post.description}</p>
            <p className="mt-3 text-xs text-gray-500">
              {post.author} · {new Date(post.date).toLocaleDateString("es-DO")}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline"
            >
              Leer articulo
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
