import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/config/site";
import { pickByLocale, toOpenGraphLocale } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const title = pickByLocale(locale, "Contact", "Contacto");
  const description = pickByLocale(locale, "Contact channels for questions, support, or collaborations.", "Canales de contacto para dudas, soporte o colaboraciones.");

  return {
    title,
    description,
    alternates: {
      canonical: "/contact",
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/contact`,
      siteName: siteConfig.name,
      locale: toOpenGraphLocale(locale),
      type: "website",
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 900,
          alt: pickByLocale(locale, `${siteConfig.name} contact`, `${siteConfig.name} contacto`),
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

export default async function ContactPage() {
  const locale = await getCurrentLocale();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <section className="contact-reveal">
        <ContactForm locale={locale} />
      </section>
    </div>
  );
}
