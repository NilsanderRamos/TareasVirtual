import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY ?? "";
const contactToEmail = process.env.CONTACT_FORM_TO_EMAIL ?? "";
const contactFromEmail = process.env.CONTACT_FORM_FROM_EMAIL ?? "onboarding@resend.dev";

const allowedReasons = new Set(["soporte", "editorial", "colaboracion", "otro"]);

type ContactPayload = {
  name?: string;
  email?: string;
  reason?: string;
  url?: string;
  message?: string;
  website?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeLine(value: string) {
  return value.replace(/\r/g, "").trim();
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;

  const name = normalizeLine(payload.name ?? "");
  const email = normalizeLine(payload.email ?? "");
  const reason = normalizeLine(payload.reason ?? "");
  const url = normalizeLine(payload.url ?? "");
  const message = (payload.message ?? "").trim();
  const website = normalizeLine(payload.website ?? "");

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (name.length < 2) {
    return NextResponse.json({ message: "El nombre no es valido." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "El correo no es valido." }, { status: 400 });
  }

  if (!allowedReasons.has(reason)) {
    return NextResponse.json({ message: "El motivo de contacto no es valido." }, { status: 400 });
  }

  if (url && !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ message: "La URL relacionada no es valida." }, { status: 400 });
  }

  if (message.length < 20) {
    return NextResponse.json({ message: "El mensaje necesita mas contexto." }, { status: 400 });
  }

  if (!resendApiKey || !contactToEmail) {
    return NextResponse.json(
      { message: "El formulario no esta configurado todavia. Usa el correo directo mientras activamos el envio." },
      { status: 503 },
    );
  }

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: email,
      subject: `[Contacto] ${reason} - ${name}`,
      text: [
        `Nombre: ${name}`,
        `Email: ${email}`,
        `Motivo: ${reason}`,
        `URL relacionada: ${url || "No compartida"}`,
        "",
        "Mensaje:",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "No pudimos enviar tu mensaje ahora mismo. Intenta otra vez en unos minutos." },
      { status: 500 },
    );
  }
}