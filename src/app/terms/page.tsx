import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { pickByLocale, toOpenGraphLocale } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const title = pickByLocale(locale, "Terms of Use", "Terminos de Uso");
  const description = pickByLocale(locale, `${siteConfig.name} terms and conditions of use.`, `Terminos y condiciones de uso de ${siteConfig.name}.`);

  return {
    title,
    description,
    alternates: {
      canonical: "/terms",
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/terms`,
      siteName: siteConfig.name,
      locale: toOpenGraphLocale(locale),
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 900,
          alt: pickByLocale(locale, `${siteConfig.name} terms of use`, `${siteConfig.name} terminos de uso`),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.defaultOgImage],
    },
  };
}

export default async function TermsPage() {
  const locale = await getCurrentLocale();
  const termsSections = [
    {
      title: pickByLocale(locale, "1. Acceptance of the terms", "1. Aceptacion de los terminos"),
      body: pickByLocale(locale, "By accessing and using this site, you accept these terms and conditions.", "Al acceder y usar este sitio, aceptas estos terminos y condiciones."),
    },
    {
      title: pickByLocale(locale, "2. Informational use of content", "2. Uso informativo del contenido"),
      body: pickByLocale(locale, "The site's articles, tools, calculators, and resources are provided for informational and educational purposes. They do not replace legal, tax, payroll, financial, medical, or other professional advice tailored to your case.", "Los articulos, herramientas, calculadoras y recursos del sitio se ofrecen con fines informativos y educativos. No sustituyen asesoria legal, fiscal, laboral, financiera, medica ni otro asesoramiento profesional adaptado a tu caso."),
    },
    {
      title: pickByLocale(locale, "3. Advertising and third-party services", "3. Publicidad y servicios de terceros"),
      body: pickByLocale(locale, "This site may display ads, including ads served by Google AdSense or other third-party vendors, and may link to external websites or services. We do not control the policies, availability, or content of those third-party services.", "Este sitio puede mostrar anuncios, incluidos anuncios servidos por Google AdSense u otros proveedores externos, y puede enlazar a sitios o servicios externos. No controlamos las politicas, la disponibilidad ni el contenido de esos servicios de terceros."),
    },
    {
      title: pickByLocale(locale, "4. Prohibited conduct", "4. Conductas prohibidas"),
      body: pickByLocale(locale, "Users may not misuse the site, interfere with its operation, attempt unauthorized access, send malicious code, scrape protected areas, abuse the contact form, or engage in behavior intended to manipulate advertising, navigation, metrics, or user experience.", "Los usuarios no pueden hacer un uso indebido del sitio, interferir con su funcionamiento, intentar accesos no autorizados, enviar codigo malicioso, extraer contenido de areas protegidas, abusar del formulario de contacto ni realizar conductas destinadas a manipular la publicidad, la navegacion, las metricas o la experiencia de usuario."),
    },
    {
      title: pickByLocale(locale, "5. Ad interaction and policy compliance", "5. Interaccion con anuncios y cumplimiento de politicas"),
      body: pickByLocale(locale, "If advertising is active on the site, users must not generate fraudulent clicks, artificially inflate impressions, use deceptive behavior, or interact with ads in ways that violate publisher or advertising platform policies. The site may restrict access if abusive behavior is detected.", "Si la publicidad esta activa en el sitio, los usuarios no deben generar clics fraudulentos, inflar impresiones de forma artificial, usar conductas enganosas ni interactuar con anuncios de manera contraria a las politicas de publishers o plataformas publicitarias. El sitio puede restringir acceso si detecta comportamientos abusivos."),
    },
    {
      title: pickByLocale(locale, "6. Limitation of liability", "6. Limitacion de responsabilidad"),
      body: pickByLocale(locale, "TareasVirtual does not guarantee uninterrupted availability, error-free operation, or specific results derived from the use of the published content or tools. Use of the site is at your own risk within the limits permitted by applicable law.", "TareasVirtual no garantiza disponibilidad ininterrumpida, funcionamiento libre de errores ni resultados especificos derivados del uso del contenido o de las herramientas publicadas. El uso del sitio se realiza bajo tu propia responsabilidad dentro de los limites permitidos por la ley aplicable."),
    },
    {
      title: pickByLocale(locale, "7. Updates and contact", "7. Modificaciones y contacto"),
      body: pickByLocale(locale, "We may update these terms to reflect legal, editorial, operational, or monetization changes. Updates will be published on this same page. If you need clarification, contact us directly.", "Podemos actualizar estos terminos para reflejar cambios legales, editoriales, operativos o de monetizacion. Las actualizaciones se publicaran en esta misma pagina. Si necesitas aclaracion, contactanos directamente."),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <section className="mobile-pane rounded-[28px] border border-slate-200 bg-linear-to-br from-white via-slate-50 to-amber-50 p-5 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">{pickByLocale(locale, "Legal", "Legal")}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {pickByLocale(locale, "Terms of Use", "Terminos de Uso")}
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500">{pickByLocale(locale, "Last updated: 03/09/2026", "Ultima actualizacion: 09/03/2026")}</p>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
          {pickByLocale(locale, "Here we summarize the basic rules of use of the site, the scope of the content, how advertising and third-party services may appear, and the main limits of liability in a format that is also easy to review on mobile.", "Aqui resumimos las reglas basicas de uso del sitio, el alcance del contenido, como puede aparecer publicidad o servicios de terceros y los principales limites de responsabilidad en un formato facil de revisar tambien desde movil.")}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/privacy-policy"
            className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
          >
            {pickByLocale(locale, "See privacy", "Ver privacidad")}
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {pickByLocale(locale, "Go to contact", "Ir a contacto")}
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {termsSections.map((section) => (
          <section
            key={section.title}
            className="mobile-pane rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
          </section>
        ))}
      </section>
    </div>
  );
}
