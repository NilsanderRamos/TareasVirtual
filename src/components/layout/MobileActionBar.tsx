"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackSiteEvent } from "@/lib/analytics";

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

function getActionConfig(pathname: string): ActionConfig {
  if (pathname.startsWith("/blog/")) {
    return {
      title: "Siguiente paso",
      primary: { href: "#cta-articulo-contextual", label: "Accion" },
      secondary: { href: "#indice-articulo", label: "Indice" },
    };
  }

  if (pathname === "/blog") {
    return {
      title: "Leer o ejecutar",
      primary: { href: "#articulo-destacado", label: "Destacado" },
      secondary: { href: "/tools#herramientas-destacadas", label: "Usar tool" },
    };
  }

  if (pathname === "/tools") {
    return {
      title: "Resolver rapido",
      primary: { href: "#herramientas-destacadas", label: "Abrir" },
      secondary: { href: "/blog#articulo-destacado", label: "Guia" },
    };
  }

  if (pathname === "/contact") {
    return {
      title: "Ruta corta",
      primary: { href: "mailto:hola@tareasvirtual.com", label: "Escribir", external: true },
      secondary: { href: "/blog#articulo-destacado", label: "Ver guia" },
    };
  }

  return {
    title: "Acceso rapido",
    primary: { href: "/blog#articulo-destacado", label: "Guias" },
    secondary: { href: "/tools#herramientas-destacadas", label: "Tools" },
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

export function MobileActionBar() {
  const pathname = usePathname();
  const config = getActionConfig(pathname);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:hidden">
      <div className="mobile-cta-bar pointer-events-auto mx-auto max-w-6xl rounded-[1.6rem] px-3 py-3">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">{config.title}</p>
          <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-(--muted)">Movil</span>
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