"use client";

import { FormEvent, useState } from "react";
import { trackSiteEvent } from "@/lib/analytics";

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

const reasonOptions: Array<{ value: ContactReason; label: string }> = [
  { value: "soporte", label: "Soporte del sitio" },
  { value: "editorial", label: "Consulta editorial" },
  { value: "colaboracion", label: "Colaboracion" },
  { value: "otro", label: "Otro" },
];

function validateForm(values: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (values.name.trim().length < 2) {
    errors.name = "Escribe tu nombre o una referencia valida.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Escribe un correo valido.";
  }

  if (values.message.trim().length < 20) {
    errors.message = "Explica tu mensaje con un poco mas de contexto.";
  }

  if (values.url && !/^https?:\/\//i.test(values.url.trim())) {
    errors.url = "Si compartes un enlace, empieza con http:// o https://.";
  }

  return errors;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form);
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
        throw new Error(payload.message ?? "No pudimos enviar tu mensaje ahora mismo.");
      }

      const submittedReason = form.reason;
      setForm(initialState);
      setErrors({});
      setStatus({
        type: "success",
        message: "Tu mensaje fue enviado. Si hace falta seguimiento, te responderemos por correo.",
      });
      trackSiteEvent("contact_form_success", { reason: submittedReason });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos enviar tu mensaje ahora mismo.";
      setStatus({ type: "error", message });
      trackSiteEvent("contact_form_error", { reason: form.reason, message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="surface-card rounded-[30px] p-5 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.45)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--line) pb-5">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--accent-strong)">Formulario de contacto</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-(--ink) sm:text-[2rem]">Deja tu mensaje.</h2>
          <p className="mt-2 text-sm leading-7 text-(--muted)">
            Comparte el contexto justo y te responderemos por correo. Si hay una URL implicada, agregala para revisar el caso mas rapido.
          </p>
        </div>
        <div className="rounded-3xl border border-emerald-200/80 bg-linear-to-br from-emerald-50 to-sky-50 px-4 py-3 text-sm text-slate-700 shadow-[0_18px_40px_-34px_rgba(16,185,129,0.8)] dark:border-white/10 dark:from-white/5 dark:to-white/0 dark:text-slate-200">
          <p className="font-semibold text-(--ink)">Respuesta habitual</p>
          <p className="mt-1 leading-6">24 a 48 horas habiles</p>
        </div>
      </div>

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/78 px-4 py-4 text-sm font-medium text-(--ink) shadow-[0_18px_40px_-34px_rgba(15,23,42,0.6)] backdrop-blur-sm dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Nombre</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-emerald-50/40 dark:bg-slate-950/20 dark:text-white dark:focus:bg-white/8"
              placeholder="Tu nombre o referencia"
              autoComplete="name"
            />
            {errors.name ? <span className="text-xs font-medium text-rose-600">{errors.name}</span> : null}
          </label>

          <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/78 px-4 py-4 text-sm font-medium text-(--ink) shadow-[0_18px_40px_-34px_rgba(15,23,42,0.6)] backdrop-blur-sm dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Correo</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-emerald-50/40 dark:bg-slate-950/20 dark:text-white dark:focus:bg-white/8"
              placeholder="tu@correo.com"
              autoComplete="email"
            />
            {errors.email ? <span className="text-xs font-medium text-rose-600">{errors.email}</span> : null}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
          <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/78 px-4 py-4 text-sm font-medium text-(--ink) shadow-[0_18px_40px_-34px_rgba(15,23,42,0.6)] backdrop-blur-sm dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Motivo</span>
            <select
              value={form.reason}
              onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value as ContactReason }))}
              className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-emerald-50/40 dark:bg-slate-950/20 dark:text-white dark:focus:bg-white/8"
            >
              {reasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/78 px-4 py-4 text-sm font-medium text-(--ink) shadow-[0_18px_40px_-34px_rgba(15,23,42,0.6)] backdrop-blur-sm dark:bg-white/5">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">URL relacionada</span>
            <input
              type="url"
              value={form.url}
              onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
              className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-emerald-50/40 dark:bg-slate-950/20 dark:text-white dark:focus:bg-white/8"
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

        <label className="grid gap-2 rounded-[28px] border border-(--line) bg-white/78 px-4 py-4 text-sm font-medium text-(--ink) shadow-[0_18px_40px_-34px_rgba(15,23,42,0.6)] backdrop-blur-sm dark:bg-white/5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Mensaje</span>
          <textarea
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            className="min-h-40 rounded-3xl border border-(--line) bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-emerald-50/40 dark:bg-slate-950/20 dark:text-white dark:focus:bg-white/8"
            placeholder="Describe tu caso, objetivo o propuesta. Si hay un error, indica donde ocurre y que esperabas que pasara."
          />
          {errors.message ? <span className="text-xs font-medium text-rose-600">{errors.message}</span> : null}
        </label>

        <div className="flex flex-col gap-4 rounded-3xl border border-(--line) bg-linear-to-r from-slate-50 to-emerald-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:from-white/5 dark:to-white/0">
          <div className="max-w-xl">
            {status.type !== "idle" ? (
              <p className={status.type === "success" ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-rose-600"}>
                {status.message}
              </p>
            ) : (
              <p className="text-sm leading-6 text-(--muted)">Si prefieres correo manual, tambien puedes escribir directo a hola@tareasvirtual.com.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-w-40 items-center justify-center rounded-full border border-emerald-300 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-900 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:hover:border-emerald-400 dark:hover:bg-emerald-600"
          >
            {isSubmitting ? "Enviando..." : "Enviar mensaje"}
          </button>
        </div>
      </form>
    </section>
  );
}