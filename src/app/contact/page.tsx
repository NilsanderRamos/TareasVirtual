import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Canales de contacto para dudas, soporte o colaboraciones.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Contacto</h1>
      <p className="mt-2 text-gray-600">
        Si necesitas ayuda o quieres colaborar, escribenos por cualquiera de
        estos medios.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Email</h2>
          <a
            href="mailto:hola@tareasvirtual.com"
            className="mt-2 inline-flex text-sm font-medium text-blue-700 hover:underline"
          >
            hola@tareasvirtual.com
          </a>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Horario</h2>
          <p className="mt-2 text-sm text-gray-600">
            Lunes a viernes, 9:00 AM a 6:00 PM (hora local).
          </p>
        </section>
      </div>
    </div>
  );
}
