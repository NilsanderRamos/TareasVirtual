import Link from "next/link";
import { blogPosts } from "@/content/blog/posts";
import { tools } from "@/content/tools";

export default function HomePage() {
  const featuredTools = tools.filter((tool) => tool.isFeatured).slice(0, 3);

  const categories = Array.from(
    new Set(blogPosts.map((post) => post.category)),
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12">
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Plataforma de productividad academica
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Aprende mas rapido con guias y herramientas practicas
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          En TareasVirtual reunimos recursos claros para estudiar mejor,
          organizarte y entregar tareas con mas confianza.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Ver articulos
          </Link>
          <Link
            href="/tools"
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Explorar herramientas
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Categorias del blog</h2>
          <Link href="/blog" className="text-sm font-medium text-blue-700 hover:underline">
            Ver todo
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category}
              href="/blog"
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
              <p className="mt-2 text-sm text-gray-600">
                Articulos y guias practicas sobre {category.toLowerCase()}.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Herramientas destacadas</h2>
          <Link href="/tools" className="text-sm font-medium text-blue-700 hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredTools.map((tool) => (
            <article
              key={tool.slug}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                {tool.category}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">{tool.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
