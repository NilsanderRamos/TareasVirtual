import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminos de Uso",
  description: "Terminos y condiciones de uso de TareasVirtual.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Terminos de Uso</h1>
      <p className="mt-4 text-sm text-gray-500">Ultima actualizacion: 09/03/2026</p>

      <div className="mt-8 space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Aceptacion de los terminos</h2>
          <p className="mt-2">
            Al acceder y usar este sitio, aceptas estos terminos y condiciones.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. Uso del contenido</h2>
          <p className="mt-2">
            El contenido se ofrece con fines informativos y educativos. No se
            permite su reproduccion total o parcial con fines comerciales sin
            autorizacion previa.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Limitacion de responsabilidad</h2>
          <p className="mt-2">
            TareasVirtual no garantiza resultados especificos derivados del uso
            de las herramientas o guias publicadas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Enlaces externos</h2>
          <p className="mt-2">
            Este sitio puede incluir enlaces a servicios de terceros. No somos
            responsables de su contenido ni de sus politicas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Modificaciones</h2>
          <p className="mt-2">
            Podemos actualizar estos terminos en cualquier momento. Los cambios
            se publicaran en esta misma pagina.
          </p>
        </section>
      </div>
    </div>
  );
}
