import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { pickByLocale, toOpenGraphLocale } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const title = pickByLocale(locale, "Privacy Policy", "Politica de Privacidad");
  const description = pickByLocale(locale, `${siteConfig.name} privacy policy.`, `Politica de privacidad de ${siteConfig.name}.`);

  return {
    title,
    description,
    alternates: {
      canonical: "/privacy-policy",
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/privacy-policy`,
      siteName: siteConfig.name,
      locale: toOpenGraphLocale(locale),
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 900,
          alt: pickByLocale(locale, `${siteConfig.name} privacy policy`, `${siteConfig.name} politica de privacidad`),
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

export default async function PrivacyPolicyPage() {
  const locale = await getCurrentLocale();
  const dataSources = [
    {
      title: pickByLocale(locale, "Technical logs and request data", "Registros tecnicos y datos de peticion"),
      body: pickByLocale(locale, "When you browse the site, the hosting and security layer may temporarily process IP address, browser, device type, approximate region, referral source, response status, and requested URL for security, availability, and debugging purposes.", "Cuando navegas por el sitio, la capa de hosting y seguridad puede tratar temporalmente direccion IP, navegador, tipo de dispositivo, region aproximada, origen de referencia, estado de respuesta y URL solicitada con fines de seguridad, disponibilidad y depuracion."),
    },
    {
      title: pickByLocale(locale, "Contact requests", "Solicitudes de contacto"),
      body: pickByLocale(locale, "If you use the contact form, we process the name, email address, optional related URL, and message content you submit in order to answer your request and keep a trace of the conversation.", "Si usas el formulario de contacto, tratamos el nombre, el correo, la URL opcional relacionada y el contenido del mensaje para responder tu consulta y mantener trazabilidad de la conversacion."),
    },
    {
      title: pickByLocale(locale, "Measurement and advertising signals", "Senales de medicion y publicidad"),
      body: pickByLocale(locale, "If you grant consent, Google Analytics and Google advertising technologies may process page views, engagement, device/browser signals, advertising identifiers, and aggregated performance metrics. If you deny consent, the site keeps Google Consent Mode in a denied state and ad requests should remain non-personalized.", "Si otorgas consentimiento, Google Analytics y las tecnologias publicitarias de Google pueden tratar vistas de pagina, engagement, senales de dispositivo/navegador, identificadores publicitarios y metricas agregadas de rendimiento. Si rechazas el consentimiento, el sitio mantiene Google Consent Mode en estado denegado y las solicitudes publicitarias deben seguir en modo no personalizado."),
    },
  ];
  const storageRows = [
    {
      name: "tv-cookie-consent",
      type: pickByLocale(locale, "Cookie and local storage", "Cookie y almacenamiento local"),
      purpose: pickByLocale(locale, "Stores whether advertising and measurement consent was granted or denied so the banner is not shown on every page view and Google tags can respect your choice.", "Guarda si el consentimiento para publicidad y medicion fue aceptado o rechazado para no mostrar el banner en cada visita y para que las etiquetas de Google respeten tu eleccion."),
      duration: pickByLocale(locale, "12 months", "12 meses"),
    },
    {
      name: "tareasvirtual-theme",
      type: pickByLocale(locale, "Local storage", "Almacenamiento local"),
      purpose: pickByLocale(locale, "Remembers the selected visual theme mode for future visits.", "Recuerda el modo visual seleccionado para futuras visitas."),
      duration: pickByLocale(locale, "Until manually removed", "Hasta eliminacion manual"),
    },
    {
      name: pickByLocale(locale, "Google Analytics and Google advertising cookies", "Cookies de Google Analytics y publicidad de Google"),
      type: pickByLocale(locale, "Third-party cookies", "Cookies de terceros"),
      purpose: pickByLocale(locale, "Used only when consent applies to measure traffic, attribute visits, limit fraud, and deliver personalized or non-personalized ads depending on your choice.", "Se usan solo cuando aplica el consentimiento para medir trafico, atribuir visitas, limitar fraude y mostrar anuncios personalizados o no personalizados segun tu eleccion."),
      duration: pickByLocale(locale, "Variable according to Google", "Variable segun Google"),
    },
  ];
  const policySections = [
    {
      title: pickByLocale(locale, "1. Information we may collect", "1. Informacion que podemos recopilar"),
      body: pickByLocale(locale, "We may collect technical information such as IP address, browser type, device, approximate location, pages visited, and time on site. If you contact us, we may also receive the information you choose to send, such as your name, email address, related URL, and message.", "Podemos recopilar informacion tecnica como direccion IP, tipo de navegador, dispositivo, ubicacion aproximada, paginas visitadas y tiempo de permanencia. Si nos contactas, tambien podemos recibir la informacion que decidas enviar, como nombre, correo, URL relacionada y mensaje."),
    },
    {
      title: pickByLocale(locale, "2. Cookies and similar technologies", "2. Cookies y tecnologias similares"),
      body: pickByLocale(locale, "This site may use cookies, local storage, and similar technologies for analytics, security, basic functionality, language preferences, and advertising. These technologies may be set by us or by third-party services integrated into the site.", "Este sitio puede usar cookies, almacenamiento local y tecnologias similares para analitica, seguridad, funcionamiento basico, preferencias de idioma y publicidad. Estas tecnologias pueden ser instaladas por nosotros o por servicios de terceros integrados en la web."),
    },
    {
      title: pickByLocale(locale, "3. Google AdSense, analytics, and Consent Mode", "3. Google AdSense, analitica y Consent Mode"),
      body: pickByLocale(locale, "The site uses Google's consent-aware implementation. By default, Google tags run with denied consent signals until you make a choice. If you accept, Google Analytics and Google advertising technologies may use consented storage and personalized advertising signals. If you decline, analytics and ad storage remain denied and advertising requests should stay non-personalized.", "El sitio usa una implementacion de Google sensible al consentimiento. Por defecto, las etiquetas de Google funcionan con senales denegadas hasta que tomas una decision. Si aceptas, Google Analytics y las tecnologias publicitarias de Google pueden usar almacenamiento consentido y senales publicitarias personalizadas. Si rechazas, analytics y ad_storage permanecen denegados y las solicitudes publicitarias deben mantenerse en modo no personalizado."),
    },
    {
      title: pickByLocale(locale, "4. Third-party vendors and opt-out choices", "4. Terceros y opciones de exclusion"),
      body: pickByLocale(locale, "If advertising is active, other third-party vendors or ad networks may also serve ads on this site. Users may manage personalized advertising through Google's Ads Settings and may also learn more about opting out from participating vendors through aboutads.info.", "Si la publicidad esta activa, otros proveedores o redes publicitarias de terceros tambien pueden mostrar anuncios en este sitio. Los usuarios pueden gestionar la publicidad personalizada desde la configuracion de anuncios de Google y tambien conocer mas opciones de exclusion de proveedores participantes mediante aboutads.info."),
    },
    {
      title: pickByLocale(locale, "5. Providers involved", "5. Proveedores implicados"),
      body: pickByLocale(locale, "The main providers involved can include the hosting platform, Google Analytics, Google AdSense, and Resend for contact email delivery. Each provider may process the minimum data needed to deliver its service under its own contractual and legal obligations.", "Los principales proveedores implicados pueden incluir la plataforma de hosting, Google Analytics, Google AdSense y Resend para el envio de correos del formulario de contacto. Cada proveedor puede tratar los datos minimos necesarios para prestar su servicio bajo sus propias obligaciones contractuales y legales."),
    },
    {
      title: pickByLocale(locale, "6. Your rights and controls", "6. Tus derechos y controles"),
      body: pickByLocale(locale, "Depending on your jurisdiction, you may have rights to request access, correction, deletion, restriction, or objection regarding personal data. You may also control cookies through your browser settings and any consent or advertising preference tools made available to you.", "Segun tu jurisdiccion, puedes tener derechos para solicitar acceso, correccion, eliminacion, limitacion u oposicion respecto a datos personales. Tambien puedes controlar cookies desde la configuracion de tu navegador y desde herramientas de consentimiento o preferencias publicitarias que se pongan a tu disposicion."),
    },
    {
      title: pickByLocale(locale, "7. Updates and contact", "7. Actualizaciones y contacto"),
      body: pickByLocale(locale, "We may update this policy to reflect legal, operational, analytics, or advertising changes. For privacy questions or data requests, contact us directly and we will review the case as soon as possible.", "Podemos actualizar esta politica para reflejar cambios legales, operativos, de analitica o de publicidad. Para consultas de privacidad o solicitudes sobre datos, escribenos directamente y revisaremos el caso lo antes posible."),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <section className="mobile-pane rounded-[28px] border border-slate-200 bg-linear-to-br from-white via-slate-50 to-cyan-50 p-5 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">{pickByLocale(locale, "Privacy", "Privacidad")}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {pickByLocale(locale, "Privacy Policy", "Politica de Privacidad")}
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500">{pickByLocale(locale, "Last updated: 03/09/2026", "Ultima actualizacion: 09/03/2026")}</p>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
          {pickByLocale(locale, "This page explains how we handle basic site usage information, how cookies and advertising partners such as Google may be involved, and which controls or contact channels you can use if you need to manage your data or advertising preferences.", "Esta pagina explica como tratamos la informacion basica de uso del sitio, como pueden intervenir cookies y socios publicitarios como Google, y que controles o canales puedes usar si necesitas gestionar tus datos o tus preferencias publicitarias.")}
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100"
          >
            {pickByLocale(locale, "Go to contact", "Ir a contacto")}
          </Link>
          <a
            href="mailto:hola@tareasvirtual.com"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            hola@tareasvirtual.com
          </a>
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {pickByLocale(locale, "Google Ads Settings", "Configuracion de anuncios de Google")}
          </a>
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {pickByLocale(locale, "How Google uses information", "Como usa Google la informacion")}
          </a>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="mobile-pane rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">{pickByLocale(locale, "Data sources", "Fuentes de datos")}</p>
          <div className="mt-4 grid gap-4">
            {dataSources.map((item) => (
              <article key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mobile-pane rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">{pickByLocale(locale, "Cookies and local storage currently used", "Cookies y almacenamiento local usados actualmente")}</p>
          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200">
            <div className="grid grid-cols-1 divide-y divide-slate-200 bg-white">
              {storageRows.map((row) => (
                <article key={row.name} className="grid gap-2 p-4 sm:grid-cols-[1.1fr_1fr_1.5fr_0.8fr] sm:gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500">{pickByLocale(locale, "Name", "Nombre")}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{row.name}</p>
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500">{pickByLocale(locale, "Type", "Tipo")}</p>
                    <p className="mt-1 text-sm text-slate-700">{row.type}</p>
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500">{pickByLocale(locale, "Purpose", "Finalidad")}</p>
                    <p className="mt-1 text-sm leading-7 text-slate-700">{row.purpose}</p>
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500">{pickByLocale(locale, "Duration", "Duracion")}</p>
                    <p className="mt-1 text-sm text-slate-700">{row.duration}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {policySections.map((section, index) => (
          <section
            key={section.title}
            className="mobile-pane rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
            {index === policySections.length - 1 ? (
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
