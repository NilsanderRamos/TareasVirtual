import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidad",
  description: "Politica de privacidad de TareasVirtual.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Politica de Privacidad</h1>
      <p className="mt-4 text-sm text-gray-500">Ultima actualizacion: 09/03/2026</p>

      <div className="mt-8 space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Informacion que recopilamos</h2>
          <p className="mt-2">
            Podemos recopilar informacion tecnica basica como direccion IP,
            navegador, paginas visitadas y tiempo de permanencia para mejorar la
            experiencia del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. Uso de cookies</h2>
          <p className="mt-2">
            Este sitio puede usar cookies para analitica y para mostrar anuncios
            personalizados o no personalizados a traves de terceros como Google
            AdSense.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Publicidad de terceros</h2>
          <p className="mt-2">
            Los proveedores externos, incluido Google, pueden usar cookies para
            mostrar anuncios segun visitas previas de los usuarios a este y otros
            sitios web.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Derechos del usuario</h2>
          <p className="mt-2">
            Puedes solicitar informacion, actualizacion o eliminacion de datos
            personales escribiendo a nuestro correo de contacto.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Contacto</h2>
          <p className="mt-2">
            Para consultas sobre privacidad, escribe a:{" "}
            <a className="font-medium text-blue-700 hover:underline" href="mailto:hola@tareasvirtual.com">
              hola@tareasvirtual.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
