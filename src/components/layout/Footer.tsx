import Link from "next/link";
  import { siteConfig } from "@/config/site";


  export function Footer() {
    const currentYear = new Date().getFullYear();


    return (
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {siteConfig.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {siteConfig.description}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Contenido
              </h3>
              <nav className="mt-2 flex flex-col gap-2">
                <Link href="/blog"
                  className="text-sm text-gray-600
                  hover:text-gray-900">Blog</Link>
                <Link href="/tools"
                  className="text-sm text-gray-600
                  hover:text-gray-900">Herramientas</Link>
              </nav>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Legal
              </h3>
              <nav className="mt-2 flex flex-col gap-2">
                <Link href="/privacy-policy"
                  className="text-sm text-gray-600
                  hover:text-gray-900">Politica de Privacidad</Link>
                <Link href="/terms"
                  className="text-sm text-gray-600
                  hover:text-gray-900">Terminos de Uso</Link>
              </nav>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8
            text-center text-sm text-gray-500">
            {currentYear} {siteConfig.name}. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    );
  }
