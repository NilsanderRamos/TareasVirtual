"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { trackSiteEvent } from "@/lib/analytics";
import { ToolItem } from "@/types";

function WidgetFrame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-4xl border border-(--line) bg-linear-to-br from-white/86 via-white/72 to-emerald-50/58 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
      <div className="border-b border-(--line) px-4 py-4 sm:px-6 sm:py-5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-semibold text-(--ink) sm:text-2xl">{title}</h3>
        <p className="mt-2 text-sm leading-6 sm:leading-7 text-(--muted)">{description}</p>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-6">{children}</div>
    </div>
  );
}

function MetricTile({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div className="rounded-3xl border border-(--line) bg-white/72 px-3 py-3 sm:px-4 sm:py-4 shadow-[0_16px_34px_-30px_rgba(15,23,42,0.4)]">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{label}</p>
      <p className="mt-2 text-xl font-semibold text-(--ink) sm:text-2xl">{value}</p>
      <p className="mt-2 text-sm leading-6 text-(--muted)">{hint}</p>
    </div>
  );
}

function readStoredValue<T>(key: string, fallback: T) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function usePersistentState<T>(storageKey: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStoredValue(storageKey, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Ignore storage write failures so the widget remains usable.
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
}

function SummaryWidget() {
  const [input, setInput] = usePersistentState("tool-summary-input", "");
  const [mode, setMode] = usePersistentState<"breve" | "equilibrado" | "detallado">("tool-summary-mode", "equilibrado");
  const summary = useMemo(() => {
    const cleaned = input.replace(/\s+/g, " ").trim();

    if (!cleaned) {
      return [] as string[];
    }

    const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
    const limit = mode === "breve" ? 2 : mode === "equilibrado" ? 4 : 6;

    return sentences.slice(0, limit);
  }, [input, mode]);

  return (
    <WidgetFrame
      eyebrow="Herramienta interactiva"
      title="Resume sin perder el hilo"
      description="Pega un texto, elige profundidad y obtén una versión más fácil de repasar desde el primer intento."
    >
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <label className="text-sm font-semibold text-(--ink)">Texto de entrada</label>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Pega aqui un texto largo para sacar una version mas corta y facil de repasar."
          className="mt-2 min-h-40 w-full rounded-3xl border border-(--line) bg-white/80 px-4 py-4 text-sm leading-6 text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--accent) sm:min-h-52 sm:leading-7"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {(["breve", "equilibrado", "detallado"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                trackSiteEvent("tool_mode_changed", { tool: "generador-de-resumenes", mode: item });
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium ${mode === item ? "bg-(--ink) text-white" : "border border-(--line) bg-white/70 text-(--ink)"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MetricTile label="Modo" value={mode} hint="Cambia la densidad del resultado sin salir de la ficha." />
          <MetricTile label="Caracteres" value={input.length} hint="Sirve para validar rápidamente si ya pegaste suficiente contenido." />
        </div>
      </div>
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">Resumen sugerido</p>
            <p className="mt-1 text-sm text-(--muted)">{summary.length} bloque{summary.length === 1 ? "" : "s"} de lectura</p>
          </div>
          <button
            type="button"
            onClick={() => trackSiteEvent("tool_action_clicked", { tool: "generador-de-resumenes", action: "generate_summary", length: input.length })}
            className="rounded-full bg-(--ink) px-4 py-2 text-sm font-semibold text-white hover:bg-(--accent-strong)"
          >
            Generar
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {summary.length > 0 ? summary.map((sentence, index) => (
            <div key={`${sentence}-${index}`} className="rounded-3xl border border-(--line) bg-white/70 px-4 py-3 text-sm leading-6 text-(--ink)">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">Idea {index + 1}</p>
              <p className="mt-2">{sentence}</p>
            </div>
          )) : (
            <div className="rounded-3xl border border-dashed border-(--line) bg-white/40 px-4 py-5 text-sm leading-6 text-(--muted)">
              El resumen aparecera aqui cuando pegues contenido suficiente para trabajar.
            </div>
          )}
        </div>
      </div>
    </div>
    </WidgetFrame>
  );
}

type TaskItem = { id: number; title: string; priority: "Alta" | "Media" | "Baja"; done: boolean };

function TaskOrganizerWidget() {
  const [title, setTitle] = usePersistentState("tool-task-title", "");
  const [priority, setPriority] = usePersistentState<TaskItem["priority"]>("tool-task-priority", "Media");
  const [tasks, setTasks] = usePersistentState<TaskItem[]>("tool-task-list", []);

  const sortedTasks = [...tasks].sort((leftTask, rightTask) => {
    const priorityOrder = { Alta: 0, Media: 1, Baja: 2 };
    return priorityOrder[leftTask.priority] - priorityOrder[rightTask.priority];
  });

  return (
    <WidgetFrame
      eyebrow="Herramienta interactiva"
      title="Ordena prioridades sin llenar la pantalla"
      description="Agrega tareas, asigna prioridad y usa la lista como una vista rápida para decidir qué hacer primero."
    >
    <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4">
        <label className="text-sm font-semibold text-(--ink)">Nueva tarea</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ejemplo: preparar factura del cliente"
          className="mt-2 w-full rounded-3xl border border-(--line) bg-white/80 px-4 py-3 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--accent)"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {(["Alta", "Media", "Baja"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPriority(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${priority === item ? "bg-(--ink) text-white" : "border border-(--line) bg-white/70 text-(--ink)"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            if (!title.trim()) {
              return;
            }

            setTasks((currentTasks) => [
              ...currentTasks,
              { id: Date.now(), title: title.trim(), priority, done: false },
            ]);
            trackSiteEvent("tool_action_clicked", { tool: "organizador-de-tareas", action: "add_task", priority });
            setTitle("");
          }}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-(--ink) px-5 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong)"
        >
          Agregar tarea
        </button>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MetricTile label="Tareas" value={tasks.length} hint="Cantidad total guardada localmente en esta sesión." />
          <MetricTile label="Prioridad actual" value={priority} hint="Se aplicará a la próxima tarea que agregues." />
        </div>
      </div>
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">Lista ordenada</p>
        <div className="mt-4 grid gap-3">
          {sortedTasks.length > 0 ? sortedTasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => {
                setTasks((currentTasks) => currentTasks.map((entry) => entry.id === task.id ? { ...entry, done: !entry.done } : entry));
                trackSiteEvent("tool_action_clicked", { tool: "organizador-de-tareas", action: "toggle_task", priority: task.priority });
              }}
              className="rounded-3xl border border-(--line) bg-white/70 px-4 py-3 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <p className={`text-sm font-semibold ${task.done ? "text-(--muted) line-through" : "text-(--ink)"}`}>{task.title}</p>
                <span className="hero-chip rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{task.priority}</span>
              </div>
            </button>
          )) : (
            <div className="rounded-3xl border border-dashed border-(--line) bg-white/40 px-4 py-6 text-sm leading-6 text-(--muted)">
              Cuando agregues tareas, apareceran ordenadas para que empieces por lo importante.
            </div>
          )}
        </div>
      </div>
    </div>
    </WidgetFrame>
  );
}

function WritingWidget() {
  const [text, setText] = usePersistentState("tool-writing-text", "");

  const analysis = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const repeatedWords = words.filter((word, index) => words.indexOf(word) !== index);
    const sentences = text.split(/[.!?]+/).filter((item) => item.trim().length > 0);
    const averageWordsPerSentence = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;

    return {
      words: words.length,
      repeated: Array.from(new Set(repeatedWords)).slice(0, 5),
      averageWordsPerSentence,
    };
  }, [text]);

  return (
    <WidgetFrame
      eyebrow="Herramienta interactiva"
      title="Haz una última pasada con más criterio"
      description="Úsala como chequeo rápido de claridad antes de entregar, publicar o enviar un texto importante."
    >
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <label className="text-sm font-semibold text-(--ink)">Texto a revisar</label>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Pega aqui el texto para revisar claridad, longitud y repeticiones."
          className="mt-2 min-h-40 w-full rounded-3xl border border-(--line) bg-white/80 px-4 py-4 text-sm leading-6 text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--accent) sm:min-h-52 sm:leading-7"
        />
      </div>
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">Revision rapida</p>
            <p className="mt-1 text-sm text-(--muted)">Chequeo local para una ultima pasada de claridad.</p>
          </div>
          <button
            type="button"
            onClick={() => trackSiteEvent("tool_action_clicked", { tool: "corrector-de-redaccion", action: "analyze_text", words: analysis.words })}
            className="rounded-full bg-(--ink) px-4 py-2 text-sm font-semibold text-white hover:bg-(--accent-strong)"
          >
            Revisar
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          <MetricTile label="Palabras" value={analysis.words} hint="Te ayuda a medir extensión antes de una última corrección." />
          <MetricTile label="Promedio por frase" value={analysis.averageWordsPerSentence} hint="Un promedio alto suele indicar frases que conviene simplificar." />
          <div className="info-tile rounded-3xl px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">Repeticiones detectadas</p>
            <p className="mt-2 text-sm leading-6 text-(--ink)">{analysis.repeated.length > 0 ? analysis.repeated.join(", ") : "No hay repeticiones evidentes en esta pasada."}</p>
          </div>
        </div>
      </div>
    </div>
    </WidgetFrame>
  );
}

function PomodoroWidget() {
  const [secondsLeft, setSecondsLeft] = usePersistentState("tool-pomodoro-seconds", 25 * 60);
  const [isRunning, setIsRunning] = usePersistentState("tool-pomodoro-running", false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          trackSiteEvent("tool_action_clicked", { tool: "temporizador-pomodoro", action: "session_completed" });
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, setIsRunning, setSecondsLeft]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <WidgetFrame
      eyebrow="Herramienta interactiva"
      title="Entra en foco con menos fricción"
      description="Mantén visible el tiempo, evita decisiones intermedias y usa la sesión como disparador para empezar ya."
    >
    <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4 text-center sm:py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">Sesion actual</p>
        <p className="mt-3 font-(--font-display) text-5xl text-(--ink) sm:text-6xl">{minutes}:{seconds}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsRunning(true);
              trackSiteEvent("tool_action_clicked", { tool: "temporizador-pomodoro", action: "start_timer" });
            }}
            className="rounded-full bg-(--ink) px-4 py-3 text-sm font-semibold text-white hover:bg-(--accent-strong)"
          >
            Iniciar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              trackSiteEvent("tool_action_clicked", { tool: "temporizador-pomodoro", action: "pause_timer" });
            }}
            className="rounded-full border border-(--line) px-4 py-3 text-sm font-semibold text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)"
          >
            Pausar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(25 * 60);
              trackSiteEvent("tool_action_clicked", { tool: "temporizador-pomodoro", action: "reset_timer" });
            }}
            className="rounded-full border border-(--line) px-4 py-3 text-sm font-semibold text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)"
          >
            Reiniciar
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MetricTile label="Estado" value={isRunning ? "Activa" : "Lista"} hint="Así sabes si la sesión sigue corriendo aunque cambies de bloque." />
          <MetricTile label="Minutos" value={Math.ceil(secondsLeft / 60)} hint="El tiempo restante se guarda localmente si recargas la página." />
        </div>
      </div>
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">Guia de uso</p>
        <div className="mt-4 grid gap-3">
          {[
            "Define una sola tarea antes de iniciar el reloj.",
            "Trabaja sin abrir nuevas pestañas ni cambiar de tarea.",
            "Al terminar el bloque, descansa y decide si sigues o cierras.",
          ].map((item, index) => (
            <div key={item} className="rounded-3xl border border-(--line) bg-white/70 px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">Paso {index + 1}</p>
              <p className="mt-2 text-sm leading-6 text-(--ink)">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </WidgetFrame>
  );
}

type SalaryPeriod = "anual" | "mensual" | "quincenal" | "semanal" | "por-hora";
type FilingStatus = "soltero" | "casado" | "cabeza-de-hogar";

interface SalaryComparisonOffer {
  label: string;
  amount: string;
  period: SalaryPeriod;
  stateCode: string;
  filingStatus: FilingStatus;
  dependents: string;
  hoursPerWeek: string;
  annualBonus: string;
  retirementPercent: string;
  pretaxPerPeriod: string;
  postTaxPerPeriod: string;
  extraFederalPerPeriod: string;
  localTaxRate: string;
}

interface SalaryEstimate {
  annualGross: number;
  annualBonus: number;
  annualRetirement: number;
  annualPretax: number;
  annualPostTax: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  socialSecurity: number;
  medicare: number;
  totalTaxes: number;
  netAnnual: number;
  netMonthly: number;
  netPerPeriod: number;
  takeHomeRate: number;
  periods: number;
  stateName: string;
}

const stateTaxRates: Record<string, { name: string; rate: number }> = {
  AZ: { name: "Arizona", rate: 0.025 },
  CA: { name: "California", rate: 0.08 },
  CO: { name: "Colorado", rate: 0.044 },
  CT: { name: "Connecticut", rate: 0.05 },
  DC: { name: "District of Columbia", rate: 0.06 },
  FL: { name: "Florida", rate: 0 },
  GA: { name: "Georgia", rate: 0.0539 },
  IL: { name: "Illinois", rate: 0.0495 },
  MA: { name: "Massachusetts", rate: 0.05 },
  MD: { name: "Maryland", rate: 0.05 },
  MI: { name: "Michigan", rate: 0.0425 },
  MN: { name: "Minnesota", rate: 0.068 },
  NC: { name: "North Carolina", rate: 0.045 },
  NJ: { name: "New Jersey", rate: 0.057 },
  NV: { name: "Nevada", rate: 0 },
  NY: { name: "New York", rate: 0.064 },
  OH: { name: "Ohio", rate: 0.035 },
  OR: { name: "Oregon", rate: 0.075 },
  PA: { name: "Pennsylvania", rate: 0.0307 },
  TN: { name: "Tennessee", rate: 0 },
  TX: { name: "Texas", rate: 0 },
  VA: { name: "Virginia", rate: 0.05 },
  WA: { name: "Washington", rate: 0 },
  WI: { name: "Wisconsin", rate: 0.053 },
  OT: { name: "Otro estado", rate: 0.04 },
};

const filingStandardDeductions: Record<FilingStatus, number> = {
  soltero: 15000,
  casado: 30000,
  "cabeza-de-hogar": 22500,
};

const additionalMedicareThresholds: Record<FilingStatus, number> = {
  soltero: 200000,
  casado: 250000,
  "cabeza-de-hogar": 200000,
};

function getPeriodsPerYear(period: SalaryPeriod) {
  if (period === "mensual") {
    return 12;
  }

  if (period === "quincenal") {
    return 24;
  }

  if (period === "semanal" || period === "por-hora") {
    return 52;
  }

  return 1;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function clampCurrency(value: string) {
  return Math.max(Number(value) || 0, 0);
}

function estimateFederalTax(taxableIncome: number, status: FilingStatus) {
  const brackets = status === "casado"
    ? [
      { upTo: 24000, rate: 0.1 },
      { upTo: 96000, rate: 0.12 },
      { upTo: 206000, rate: 0.22 },
      { upTo: 394000, rate: 0.24 },
      { upTo: 500000, rate: 0.32 },
      { upTo: 752000, rate: 0.35 },
      { upTo: Number.POSITIVE_INFINITY, rate: 0.37 },
    ]
    : status === "cabeza-de-hogar"
      ? [
        { upTo: 17100, rate: 0.1 },
        { upTo: 64800, rate: 0.12 },
        { upTo: 103000, rate: 0.22 },
        { upTo: 197000, rate: 0.24 },
        { upTo: 251000, rate: 0.32 },
        { upTo: 628000, rate: 0.35 },
        { upTo: Number.POSITIVE_INFINITY, rate: 0.37 },
      ]
      : [
        { upTo: 12000, rate: 0.1 },
        { upTo: 48000, rate: 0.12 },
        { upTo: 103000, rate: 0.22 },
        { upTo: 197000, rate: 0.24 },
        { upTo: 250000, rate: 0.32 },
        { upTo: 627000, rate: 0.35 },
        { upTo: Number.POSITIVE_INFINITY, rate: 0.37 },
      ];

  let remaining = Math.max(taxableIncome, 0);
  let previousLimit = 0;
  let total = 0;

  for (const bracket of brackets) {
    if (remaining <= 0) {
      break;
    }

    const taxableAtRate = Math.min(remaining, bracket.upTo - previousLimit);
    total += taxableAtRate * bracket.rate;
    remaining -= taxableAtRate;
    previousLimit = bracket.upTo;
  }

  return total;
}

function createDefaultOffer(label: string, overrides?: Partial<SalaryComparisonOffer>): SalaryComparisonOffer {
  return {
    label,
    amount: "65000",
    period: "anual",
    stateCode: "TX",
    filingStatus: "soltero",
    dependents: "0",
    hoursPerWeek: "40",
    annualBonus: "0",
    retirementPercent: "4",
    pretaxPerPeriod: "180",
    postTaxPerPeriod: "0",
    extraFederalPerPeriod: "0",
    localTaxRate: "0",
    ...overrides,
  };
}

function buildSalaryEstimate(offer: SalaryComparisonOffer): SalaryEstimate {
  const periods = getPeriodsPerYear(offer.period);
  const amount = clampCurrency(offer.amount);
  const hoursPerWeek = clampCurrency(offer.hoursPerWeek);
  const annualBonus = clampCurrency(offer.annualBonus);
  const retirementPercent = Math.min(clampCurrency(offer.retirementPercent), 100) / 100;
  const pretaxPerPeriod = clampCurrency(offer.pretaxPerPeriod);
  const postTaxPerPeriod = clampCurrency(offer.postTaxPerPeriod);
  const extraFederalPerPeriod = clampCurrency(offer.extraFederalPerPeriod);
  const dependents = Math.floor(clampCurrency(offer.dependents));
  const localTaxRate = clampCurrency(offer.localTaxRate) / 100;
  const annualBaseGross = offer.period === "por-hora" ? amount * hoursPerWeek * 52 : amount * periods;
  const annualGross = annualBaseGross + annualBonus;
  const annualRetirement = annualBaseGross * retirementPercent;
  const annualPretaxFixed = pretaxPerPeriod * periods;
  const annualPretax = annualRetirement + annualPretaxFixed;
  const annualPostTax = postTaxPerPeriod * periods;
  const standardDeduction = filingStandardDeductions[offer.filingStatus];
  const federalTaxableIncome = Math.max(annualGross - annualPretax - standardDeduction, 0);
  const dependentCredit = dependents * 2000;
  const federalTax = Math.max(
    estimateFederalTax(federalTaxableIncome, offer.filingStatus) - dependentCredit + extraFederalPerPeriod * periods,
    0,
  );
  const stateTaxableIncome = Math.max(annualGross - annualPretax, 0);
  const stateTax = stateTaxableIncome * (stateTaxRates[offer.stateCode]?.rate ?? stateTaxRates.OT.rate);
  const localTax = stateTaxableIncome * localTaxRate;
  const socialSecurity = Math.min(annualGross, 184500) * 0.062;
  const medicareThreshold = additionalMedicareThresholds[offer.filingStatus];
  const medicare = annualGross * 0.0145 + Math.max(annualGross - medicareThreshold, 0) * 0.009;
  const totalTaxes = federalTax + stateTax + localTax + socialSecurity + medicare;
  const netAnnual = Math.max(annualGross - annualPretax - annualPostTax - totalTaxes, 0);

  return {
    annualGross,
    annualBonus,
    annualRetirement,
    annualPretax,
    annualPostTax,
    federalTax,
    stateTax,
    localTax,
    socialSecurity,
    medicare,
    totalTaxes,
    netAnnual,
    netMonthly: netAnnual / 12,
    netPerPeriod: netAnnual / periods,
    takeHomeRate: annualGross > 0 ? netAnnual / annualGross : 0,
    periods,
    stateName: stateTaxRates[offer.stateCode]?.name ?? stateTaxRates.OT.name,
  };
}

function SalaryOfferForm({
  offer,
  onChange,
  accent,
}: {
  offer: SalaryComparisonOffer;
  onChange: (field: keyof SalaryComparisonOffer, value: string) => void;
  accent: string;
}) {
  return (
    <section className={`rounded-4xl border px-4 py-4 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.42)] ${accent}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{offer.label}</p>
          <h4 className="mt-2 text-xl font-semibold text-(--ink)">Escenario de oferta</h4>
        </div>
        <span className="hero-chip rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{stateTaxRates[offer.stateCode]?.name ?? stateTaxRates.OT.name}</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Ingreso base</span>
          <input
            type="number"
            min="0"
            value={offer.amount}
            onChange={(event) => onChange("amount", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
            placeholder="65000"
          />
        </label>
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Periodicidad</span>
          <select
            value={offer.period}
            onChange={(event) => onChange("period", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
          >
            <option value="anual">Anual</option>
            <option value="mensual">Mensual</option>
            <option value="quincenal">Quincenal</option>
            <option value="semanal">Semanal</option>
            <option value="por-hora">Por hora</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Estado</span>
          <select
            value={offer.stateCode}
            onChange={(event) => onChange("stateCode", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
          >
            {Object.entries(stateTaxRates).map(([code, config]) => (
              <option key={code} value={code}>{config.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Filing status</span>
          <select
            value={offer.filingStatus}
            onChange={(event) => onChange("filingStatus", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
          >
            <option value="soltero">Soltero</option>
            <option value="casado">Casado</option>
            <option value="cabeza-de-hogar">Cabeza de hogar</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offer.period === "por-hora" ? (
          <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Horas / semana</span>
            <input
              type="number"
              min="0"
              value={offer.hoursPerWeek}
              onChange={(event) => onChange("hoursPerWeek", event.target.value)}
              className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
              placeholder="40"
            />
          </label>
        ) : null}
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Dependientes</span>
          <input
            type="number"
            min="0"
            value={offer.dependents}
            onChange={(event) => onChange("dependents", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
            placeholder="0"
          />
        </label>
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Bonus anual</span>
          <input
            type="number"
            min="0"
            value={offer.annualBonus}
            onChange={(event) => onChange("annualBonus", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
            placeholder="0"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">401(k) %</span>
          <input
            type="number"
            min="0"
            max="100"
            value={offer.retirementPercent}
            onChange={(event) => onChange("retirementPercent", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
            placeholder="4"
          />
        </label>
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Pre-tax / periodo</span>
          <input
            type="number"
            min="0"
            value={offer.pretaxPerPeriod}
            onChange={(event) => onChange("pretaxPerPeriod", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
            placeholder="180"
          />
        </label>
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Post-tax / periodo</span>
          <input
            type="number"
            min="0"
            value={offer.postTaxPerPeriod}
            onChange={(event) => onChange("postTaxPerPeriod", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
            placeholder="0"
          />
        </label>
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Federal extra / periodo</span>
          <input
            type="number"
            min="0"
            value={offer.extraFederalPerPeriod}
            onChange={(event) => onChange("extraFederalPerPeriod", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
            placeholder="0"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">Local tax %</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={offer.localTaxRate}
            onChange={(event) => onChange("localTaxRate", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
            placeholder="0"
          />
        </label>
        <div className="rounded-3xl border border-(--line) bg-white/72 px-4 py-4 text-sm leading-6 text-(--muted)">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">Que se aproxima aqui</p>
          <p className="mt-2">Retencion federal progresiva, Social Security, Medicare, state tax, impuesto local opcional y descuentos payroll antes y despues de impuestos.</p>
        </div>
      </div>
    </section>
  );
}

function SalaryCompareRow({
  label,
  left,
  right,
  helper,
}: {
  label: string;
  left: string;
  right: string;
  helper: string;
}) {
  return (
    <div className="grid gap-2 rounded-3xl border border-(--line) bg-white/65 px-4 py-3 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
      <div>
        <p className="text-sm font-semibold text-(--ink)">{label}</p>
        <p className="mt-1 text-sm leading-6 text-(--muted)">{helper}</p>
      </div>
      <div className="rounded-2xl border border-(--line) bg-white/80 px-4 py-2.5 text-sm font-semibold text-(--ink)">{left}</div>
      <div className="rounded-2xl border border-(--line) bg-white/80 px-4 py-2.5 text-sm font-semibold text-(--ink)">{right}</div>
    </div>
  );
}

function SalaryNetWidget() {
  const [offerA, setOfferA] = usePersistentState<SalaryComparisonOffer>(
    "tool-salary-offer-a",
    createDefaultOffer("Oferta A", { amount: "68000", stateCode: "TX", pretaxPerPeriod: "160" }),
  );
  const [offerB, setOfferB] = usePersistentState<SalaryComparisonOffer>(
    "tool-salary-offer-b",
    createDefaultOffer("Oferta B", { amount: "72000", stateCode: "CA", pretaxPerPeriod: "240", annualBonus: "4000" }),
  );

  const resultA = useMemo(() => buildSalaryEstimate(offerA), [offerA]);
  const resultB = useMemo(() => buildSalaryEstimate(offerB), [offerB]);

  const comparison = useMemo(() => {
    const annualDifference = resultA.netAnnual - resultB.netAnnual;
    const monthlyDifference = resultA.netMonthly - resultB.netMonthly;
    const winner = annualDifference === 0 ? null : annualDifference > 0 ? offerA.label : offerB.label;

    return {
      winner,
      annualDifference: Math.abs(annualDifference),
      monthlyDifference: Math.abs(monthlyDifference),
    };
  }, [offerA.label, offerB.label, resultA.netAnnual, resultA.netMonthly, resultB.netAnnual, resultB.netMonthly]);

  const updateOfferA = (field: keyof SalaryComparisonOffer, value: string) => {
    setOfferA((current) => ({ ...current, [field]: value }));
  };

  const updateOfferB = (field: keyof SalaryComparisonOffer, value: string) => {
    setOfferB((current) => ({ ...current, [field]: value }));
  };

  return (
    <WidgetFrame
      eyebrow="Herramienta interactiva"
      title="Compara dos ofertas con una lectura mas cercana al payroll real"
      description="Pon lado a lado dos escenarios de salario y estima neto, impuestos y descuentos payroll antes de tomar una decision laboral."
    >
      <div className="grid gap-4">
        <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
          <div className="grid gap-4 lg:grid-cols-2">
            <SalaryOfferForm offer={offerA} onChange={updateOfferA} accent="border-emerald-200 bg-linear-to-br from-emerald-50/80 to-white/80" />
            <SalaryOfferForm offer={offerB} onChange={updateOfferB} accent="border-amber-200 bg-linear-to-br from-amber-50/80 to-white/80" />
          </div>

          <div className="grid gap-4">
            <div className="rounded-4xl border border-emerald-200 bg-linear-to-br from-emerald-500 to-teal-500 px-4 py-4 text-white shadow-[0_24px_56px_-32px_rgba(16,185,129,0.65)] sm:px-5 sm:py-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/75">Lectura principal</p>
              <p className="mt-3 text-2xl font-semibold sm:text-4xl">
                {comparison.winner ? `${comparison.winner} gana por ${formatCurrency(comparison.monthlyDifference)}/mes` : "Ambas ofertas quedan practicamente empatadas"}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/85">
                {comparison.winner
                  ? `La diferencia anual estimada es de ${formatCurrency(comparison.annualDifference)} despues de federal, state tax, FICA y ajustes payroll.`
                  : "El neto estimado es muy parecido. En este caso conviene mirar beneficios, crecimiento y estabilidad del ingreso."}
              </p>
              <button
                type="button"
                onClick={() => trackSiteEvent("tool_action_clicked", {
                  tool: "calculadora-salario-neto-usa",
                  action: "compare_job_offers",
                  offerAState: offerA.stateCode,
                  offerBState: offerB.stateCode,
                })}
                className="mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
              >
                Registrar comparacion
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Neto mensual A" value={formatCurrency(resultA.netMonthly)} hint={`${offerA.label} en ${resultA.stateName}.`} />
              <MetricTile label="Neto mensual B" value={formatCurrency(resultB.netMonthly)} hint={`${offerB.label} en ${resultB.stateName}.`} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Take-home A" value={formatPercent(resultA.takeHomeRate)} hint="Porcentaje orientativo del bruto que termina disponible." />
              <MetricTile label="Take-home B" value={formatPercent(resultB.takeHomeRate)} hint="Util para comparar ofertas con distinto bonus o deducciones." />
            </div>

            <div className="rounded-4xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-700">Supuestos del modelo</p>
              <p className="mt-2">La herramienta usa tramos federales simplificados, state tax aproximado, cap de Social Security 2026, Additional Medicare y ajustes de payroll comunes como 401(k), deducciones pre-tax y retencion extra.</p>
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-(--line) bg-white/72 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">Comparacion lado a lado</p>
              <h4 className="mt-2 text-xl font-semibold text-(--ink) sm:text-2xl">Lo que realmente cambia entre una oferta y otra</h4>
            </div>
            <div className="grid gap-2 text-sm text-(--muted)">
              <span>{offerA.label}: {formatCurrency(resultA.netAnnual)} netos / ano</span>
              <span>{offerB.label}: {formatCurrency(resultB.netAnnual)} netos / ano</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <SalaryCompareRow label="Neto anual" left={formatCurrency(resultA.netAnnual)} right={formatCurrency(resultB.netAnnual)} helper="La comparacion mas util si ambas ofertas tienen estructuras distintas." />
            <SalaryCompareRow label="Neto mensual" left={formatCurrency(resultA.netMonthly)} right={formatCurrency(resultB.netMonthly)} helper="Ayuda a decidir con presupuesto real y no con salario bruto." />
            <SalaryCompareRow label="Neto por periodo" left={formatCurrency(resultA.netPerPeriod)} right={formatCurrency(resultB.netPerPeriod)} helper="Conviene revisarlo si cambian frecuencia de pago u horas." />
            <SalaryCompareRow label="Impuestos totales" left={formatCurrency(resultA.totalTaxes)} right={formatCurrency(resultB.totalTaxes)} helper="Suma federal, state tax, local tax, Social Security y Medicare." />
            <SalaryCompareRow label="Deducciones pre-tax" left={formatCurrency(resultA.annualPretax)} right={formatCurrency(resultB.annualPretax)} helper="Incluye aporte 401(k) y payroll pre-tax por periodo." />
            <SalaryCompareRow label="Deducciones post-tax" left={formatCurrency(resultA.annualPostTax)} right={formatCurrency(resultB.annualPostTax)} helper="Sirve para reflejar descuentos que reducen cash aunque no bajen la base fiscal." />
            <SalaryCompareRow label="State + local" left={formatCurrency(resultA.stateTax + resultA.localTax)} right={formatCurrency(resultB.stateTax + resultB.localTax)} helper="Aqui suele estar la mayor diferencia cuando comparas mudanza o nuevas plazas." />
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

export function ToolWidget({ tool }: { tool: ToolItem }) {
  if (tool.slug === "calculadora-salario-neto-usa") {
    return <SalaryNetWidget />;
  }

  if (tool.slug === "generador-de-resumenes") {
    return <SummaryWidget />;
  }

  if (tool.slug === "organizador-de-tareas") {
    return <TaskOrganizerWidget />;
  }

  if (tool.slug === "corrector-de-redaccion") {
    return <WritingWidget />;
  }

  return <PomodoroWidget />;
}