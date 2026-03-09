import type { Metadata } from "next";
import { tools } from "@/content/tools";

export const metadata: Metadata = {
  title: "Herramientas",
  description: "Coleccion de herramientas para estudiar y trabajar mejor.",
};

export default function ToolsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Herramientas</h1>
      <p className="mt-2 text-gray-600">
        Recursos para resumir, planificar y mejorar tus entregas.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <article
            id={tool.slug}
            key={tool.slug}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              {tool.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">{tool.name}</h2>
            <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
