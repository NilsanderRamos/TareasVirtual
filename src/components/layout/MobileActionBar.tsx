"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackSiteEvent } from "@/lib/analytics";
import { SiteLocale, pickByLocale } from "@/lib/i18n";

type ActionItem = {
  href: string;
  label: string;
  external?: boolean;
};

type ActionConfig = {
  title: string;
  primary: ActionItem;
  secondary: ActionItem;
};

function getActionConfig(pathname: string, locale: SiteLocale): ActionConfig {
  if (pathname.startsWith("/blog/")) {
    return {
      title: pickByLocale(locale, "Next step", "Siguiente paso"),
      primary: { href: "#cta-articulo-contextual", label: pickByLocale(locale, "See action", "Ver accion") },
      secondary: { href: "#indice-articulo", label: pickByLocale(locale, "Index", "Indice") },
    };
  }

  if (pathname === "/blog") {
    return {
      title: pickByLocale(locale, "Read or act", "Leer o ejecutar"),
      primary: { href: "#articulo-destacado", label: pickByLocale(locale, "Featured", "Destacado") },
      secondary: { href: "/tools#herramientas-destacadas", label: pickByLocale(locale, "Tools", "Herramientas") },
    };
  }

  if (pathname === "/tools") {
    return {
      title: pickByLocale(locale, "Solve quickly", "Resolver rapido"),
      primary: { href: "#herramientas-destacadas", label: pickByLocale(locale, "Open tool", "Abrir herramienta") },
      secondary: { href: "/blog#articulo-destacado", label: pickByLocale(locale, "Read guide", "Leer guia") },
    };
  }

  if (pathname === "/contact") {
    return {
      title: pickByLocale(locale, "Quick route", "Ruta corta"),
      primary: { href: "mailto:hola@tareasvirtual.com", label: pickByLocale(locale, "Write", "Escribir"), external: true },
      secondary: { href: "/blog#articulo-destacado", label: pickByLocale(locale, "See guide", "Ver guia") },
    };
  }

  return {
    title: pickByLocale(locale, "Quick access", "Acceso rapido"),
    primary: { href: "/blog#articulo-destacado", label: pickByLocale(locale, "See guides", "Ver guias") },
    secondary: { href: "/tools#herramientas-destacadas", label: pickByLocale(locale, "Tools", "Herramientas") },
  };
}

function ActionLink({ item, className }: { item: ActionItem; className: string }) {
  if (item.external) {
    return (
      <a
        href={item.href}
        className={className}
        onClick={() => trackSiteEvent("mobile_bar_clicked", { href: item.href, label: item.label })}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      onClick={() => trackSiteEvent("mobile_bar_clicked", { href: item.href, label: item.label })}
    >
      {item.label}
    </Link>
  );
}

export function MobileActionBar({ locale }: { locale: SiteLocale }) {
  const pathname = usePathname();
  const config = getActionConfig(pathname, locale);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:hidden">
      <div className="mobile-cta-bar pointer-events-auto mx-auto max-w-6xl rounded-[1.6rem] px-3 py-3">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">{config.title}</p>
          <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-(--muted)">{pickByLocale(locale, "Mobile", "Movil")}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ActionLink
            item={config.primary}
            className="mobile-cta-button-primary inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold"
          />
          <ActionLink
            item={config.secondary}
            className="mobile-cta-button-secondary inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold"
          />
        </div>
      </div>
    </div>
  );
}