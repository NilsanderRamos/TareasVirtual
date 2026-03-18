import { NextResponse } from "next/server";
import { Resend } from "resend";
import { LOCALE_COOKIE_NAME, normalizeLocale, resolveLocaleFromAcceptLanguage, SiteLocale } from "@/lib/i18n";

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

function getLocaleFromRequest(request: Request): SiteLocale {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieLocale = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${LOCALE_COOKIE_NAME}=`))
    ?.split("=")[1];

  return normalizeLocale(cookieLocale) ?? resolveLocaleFromAcceptLanguage(request.headers.get("accept-language"));
}

function t(locale: SiteLocale, en: string, es: string) {
  return locale === "en" ? en : es;
}

export async function POST(request: Request) {
  const locale = getLocaleFromRequest(request);
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
    return NextResponse.json({ message: t(locale, "The name is not valid.", "El nombre no es valido.") }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: t(locale, "The email is not valid.", "El correo no es valido.") }, { status: 400 });
  }

  if (!allowedReasons.has(reason)) {
    return NextResponse.json({ message: t(locale, "The contact reason is not valid.", "El motivo de contacto no es valido.") }, { status: 400 });
  }

  if (url && !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ message: t(locale, "The related URL is not valid.", "La URL relacionada no es valida.") }, { status: 400 });
  }

  if (message.length < 20) {
    return NextResponse.json({ message: t(locale, "The message needs more context.", "El mensaje necesita mas contexto.") }, { status: 400 });
  }

  if (!resendApiKey || !contactToEmail) {
    return NextResponse.json(
      { message: t(locale, "The form is not configured yet. Use the direct email while we activate sending.", "El formulario no esta configurado todavia. Usa el correo directo mientras activamos el envio.") },
      { status: 503 },
    );
  }

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: email,
      subject: `${t(locale, "[Contact]", "[Contacto]")} ${reason} - ${name}`,
      text: [
        `${t(locale, "Name", "Nombre")}: ${name}`,
        `Email: ${email}`,
        `${t(locale, "Reason", "Motivo")}: ${reason}`,
        `${t(locale, "Related URL", "URL relacionada")}: ${url || t(locale, "Not shared", "No compartida")}`,
        "",
        `${t(locale, "Message", "Mensaje")}:`,
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: t(locale, "We could not send your message right now. Try again in a few minutes.", "No pudimos enviar tu mensaje ahora mismo. Intenta otra vez en unos minutos.") },
      { status: 500 },
    );
  }
}