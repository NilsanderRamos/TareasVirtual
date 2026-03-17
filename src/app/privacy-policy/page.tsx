import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Politica de Privacidad",
  description: "Politica de privacidad de TareasVirtual.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: `Politica de Privacidad | ${siteConfig.name}`,
    description: "Politica de privacidad de TareasVirtual.",
    url: `${siteConfig.url}/privacy-policy`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 900,
        alt: `${siteConfig.name} politica de privacidad`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Politica de Privacidad | ${siteConfig.name}`,
    description: "Politica de privacidad de TareasVirtual.",
    images: [siteConfig.defaultOgImage],
  },
};

export default function PrivacyPolicyPage() {
  const policySections = [
    {
      title: "1. Informacion que recopilamos",
      body:
        "Podemos recopilar informacion tecnica basica como direccion IP, navegador, paginas visitadas y tiempo de permanencia para mejorar la experiencia del sitio.",
    },
    {
      title: "2. Uso de cookies",
      body:
        "Este sitio puede usar cookies para analitica y para mostrar anuncios personalizados o no personalizados a traves de terceros como Google AdSense.",
    },
    {
      title: "3. Publicidad de terceros",
      body:
        "Los proveedores externos, incluido Google, pueden usar cookies para mostrar anuncios segun visitas previas de los usuarios a este y otros sitios web.",
    },
    {
      title: "4. Derechos del usuario",
      body:
        "Puedes solicitar informacion, actualizacion o eliminacion de datos personales escribiendo a nuestro correo de contacto.",
    },
    {
      title: "5. Contacto",
      body:
        "Para consultas sobre privacidad, puedes escribirnos directamente y revisaremos tu caso a la mayor brevedad posible.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <section className="mobile-pane rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-cyan-50 p-5 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Privacidad</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Politica de Privacidad
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500">Ultima actualizacion: 09/03/2026</p>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
          Esta pagina resume como tratamos la informacion basica de uso del sitio,
          como pueden intervenir cookies o terceros y que canal puedes usar si
          necesitas revisar o solicitar cambios sobre tus datos.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100"
          >
            Ir a contacto
          </Link>
          <a
            href="mailto:hola@tareasvirtual.com"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            hola@tareasvirtual.com
          </a>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {policySections.map((section) => (
          <section
            key={section.title}
            className="mobile-pane rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
            {section.title === "5. Contacto" ? (
              <a
                className="mt-4 inline-flex text-sm font-semibold text-cyan-700 hover:underline"
                href="mailto:hola@tareasvirtual.com"
              >
                hola@tareasvirtual.com
              </a>
            ) : null}
          </section>
        ))}
      </section>
    </div>
  );
}
