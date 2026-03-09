import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: "Conoce la mision y enfoque de TareasVirtual.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Sobre nosotros</h1>
      <p className="mt-4 text-lg text-gray-700">
        {siteConfig.name} nace para ayudar a estudiantes y profesionales a
        trabajar con mas claridad, mejores procesos y menos estres.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Mision</h2>
          <p className="mt-2 text-sm text-gray-600">
            Compartir guias practicas y herramientas simples que mejoren el
            rendimiento academico y profesional.
          </p>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Enfoque</h2>
          <p className="mt-2 text-sm text-gray-600">
            Contenido claro, accionable y actualizado, pensado para aplicar en
            el dia a dia sin complejidad innecesaria.
          </p>
        </section>
      </div>
    </div>
  );
}
