"use client";

import { FormEvent, useState } from "react";
import { trackSiteEvent } from "@/lib/analytics";
import { SiteLocale, pickByLocale } from "@/lib/i18n";

type ContactReason = "soporte" | "editorial" | "colaboracion" | "otro";

type FormState = {
  name: string;
  email: string;
  reason: ContactReason;
  url: string;
  message: string;
  website: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  reason: "soporte",
  url: "",
  message: "",
  website: "",
};

function getReasonOptions(locale: SiteLocale): Array<{ value: ContactReason; label: string }> {
  return [
    { value: "soporte", label: pickByLocale(locale, "Site support", "Soporte del sitio") },
    { value: "editorial", label: pickByLocale(locale, "Editorial inquiry", "Consulta editorial") },
    { value: "colaboracion", label: pickByLocale(locale, "Collaboration", "Colaboracion") },
    { value: "otro", label: pickByLocale(locale, "Other", "Otro") },
  ];
}

function validateForm(values: FormState, locale: SiteLocale) {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (values.name.trim().length < 2) {
    errors.name = pickByLocale(locale, "Write your name or a valid reference.", "Escribe tu nombre o una referencia valida.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = pickByLocale(locale, "Write a valid email address.", "Escribe un correo valido.");
  }

  if (values.message.trim().length < 20) {
    errors.message = pickByLocale(locale, "Explain your message with a bit more context.", "Explica tu mensaje con un poco mas de contexto.");
  }

  if (values.url && !/^https?:\/\//i.test(values.url.trim())) {
    errors.url = pickByLocale(locale, "If you share a link, start it with http:// or https://.", "Si compartes un enlace, empieza con http:// o https://.");
  }

  return errors;
}

export function ContactForm({ locale }: { locale: SiteLocale }) {
  const reasonOptions = getReasonOptions(locale);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form, locale);
    setErrors(nextErrors);
    setStatus({ type: "idle", message: "" });

    if (Object.keys(nextErrors).length > 0) {
      trackSiteEvent("contact_form_validation_failed", {
        reason: form.reason,
        error_count: Object.keys(nextErrors).length,
      });
      return;
    }

    setIsSubmitting(true);
    trackSiteEvent("contact_form_submit", { reason: form.reason });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? pickByLocale(locale, "We could not send your message right now.", "No pudimos enviar tu mensaje ahora mismo."));
      }

      const submittedReason = form.reason;
      setForm(initialState);
      setErrors({});
      setStatus({
        type: "success",
        message: pickByLocale(locale, "Your message was sent. If follow-up is needed, we will reply by email.", "Tu mensaje fue enviado. Si hace falta seguimiento, te responderemos por correo."),
      });
      trackSiteEvent("contact_form_success", { reason: submittedReason });
    } catch (error) {
      const message = error instanceof Error ? error.message : pickByLocale(locale, "We could not send your message right now.", "No pudimos enviar tu mensaje ahora mismo.");
      setStatus({ type: "error", message });
      trackSiteEvent("contact_form_error", { reason: form.reason, message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="contact-form-shell rounded-4xl p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--line) pb-5">
        <div className="max-w-2xl">
          <p className="section-label text-xs font-semibold uppercase">{pickByLocale(locale, "Contact form", "Formulario de contacto")}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-(--ink) sm:text-[2rem]">{pickByLocale(locale, "Tell us exactly what you need.", "Cuéntanos exactamente que necesitas.")}</h2>
          <p className="mt-2 text-sm leading-7 text-(--muted)">
            {pickByLocale(locale, "Share the right context and we will reply by email. If a URL is involved, add it so we can review the case faster.", "Comparte el contexto justo y te responderemos por correo. Si hay una URL implicada, agregala para revisar el caso mas rapido.")}
          </p>
        </div>
        <div className="rounded-3xl border border-(--line) bg-white/66 px-4 py-3 text-sm text-(--muted) shadow-[0_18px_40px_-34px_rgba(15,23,42,0.18)]">
          <p className="font-semibold text-(--ink)">{pickByLocale(locale, "Typical reply", "Respuesta habitual")}</p>
          <p className="mt-1 leading-6">{pickByLocale(locale, "24 to 48 business hours", "24 a 48 horas habiles")}</p>
        </div>
      </div>

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="contact-field grid gap-2 rounded-3xl px-4 py-4 text-sm font-medium text-(--ink)">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{pickByLocale(locale, "Name", "Nombre")}</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="contact-input rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-(--muted)"
              placeholder={pickByLocale(locale, "Your name or reference", "Tu nombre o referencia")}
              autoComplete="name"
            />
            {errors.name ? <span className="text-xs font-medium text-rose-600">{errors.name}</span> : null}
          </label>

          <label className="contact-field grid gap-2 rounded-3xl px-4 py-4 text-sm font-medium text-(--ink)">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{pickByLocale(locale, "Email", "Correo")}</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="contact-input rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-(--muted)"
              placeholder={pickByLocale(locale, "you@email.com", "tu@correo.com")}
              autoComplete="email"
            />
            {errors.email ? <span className="text-xs font-medium text-rose-600">{errors.email}</span> : null}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
          <label className="contact-field grid gap-2 rounded-3xl px-4 py-4 text-sm font-medium text-(--ink)">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{pickByLocale(locale, "Reason", "Motivo")}</span>
            <select
              value={form.reason}
              onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value as ContactReason }))}
              className="contact-input rounded-2xl px-4 py-3 text-sm outline-none"
            >
              {reasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="contact-field grid gap-2 rounded-3xl px-4 py-4 text-sm font-medium text-(--ink)">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{pickByLocale(locale, "Related URL", "URL relacionada")}</span>
            <input
              type="url"
              value={form.url}
              onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
              className="contact-input rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-(--muted)"
              placeholder="https://tareasvirtual.com/..."
              autoComplete="url"
            />
            {errors.url ? <span className="text-xs font-medium text-rose-600">{errors.url}</span> : null}
          </label>
        </div>

        <label className="hidden" aria-hidden="true">
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
          />
        </label>

        <label className="contact-field grid gap-2 rounded-[28px] px-4 py-4 text-sm font-medium text-(--ink)">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{pickByLocale(locale, "Message", "Mensaje")}</span>
          <textarea
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            className="contact-input min-h-40 rounded-3xl px-4 py-3 text-sm leading-7 outline-none placeholder:text-(--muted)"
            placeholder={pickByLocale(locale, "Describe your case, goal, or proposal. If there is an error, explain where it happens and what you expected.", "Describe tu caso, objetivo o propuesta. Si hay un error, indica donde ocurre y que esperabas que pasara.")}
          />
          {errors.message ? <span className="text-xs font-medium text-rose-600">{errors.message}</span> : null}
        </label>

        <div className="flex flex-col gap-4 rounded-3xl border border-(--line) bg-white/62 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            {status.type !== "idle" ? (
              <p className={status.type === "success" ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-rose-600"}>
                {status.message}
              </p>
            ) : (
              <p className="text-sm leading-6 text-(--muted)">{pickByLocale(locale, "If you prefer manual email, you can also write directly to hola@tareasvirtual.com.", "Si prefieres correo manual, tambien puedes escribir directo a hola@tareasvirtual.com.")}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-w-40 items-center justify-center rounded-full bg-(--solid-bg) px-5 py-3 text-sm font-semibold text-(--solid-fg) transition hover:-translate-y-0.5 hover:bg-(--solid-bg-hover) disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? pickByLocale(locale, "Sending...", "Enviando...") : pickByLocale(locale, "Send message", "Enviar mensaje")}
          </button>
        </div>
      </form>
    </section>
  );
}