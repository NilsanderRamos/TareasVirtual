"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { trackSiteEvent } from "@/lib/analytics";
import { pickByLocale, SiteLocale } from "@/lib/i18n";
import { ToolItem } from "@/types";

function t(locale: SiteLocale, en: string, es: string) {
  return pickByLocale(locale, en, es);
}

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

function SummaryWidget({ locale }: { locale: SiteLocale }) {
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
      eyebrow={t(locale, "Interactive tool", "Herramienta interactiva")}
      title={t(locale, "Summarize without losing the thread", "Resume sin perder el hilo")}
      description={t(locale, "Paste a text, choose the depth, and get a version that is easier to review on the first pass.", "Pega un texto, elige profundidad y obten una version mas facil de repasar desde el primer intento.")}
    >
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <label className="text-sm font-semibold text-(--ink)">{t(locale, "Input text", "Texto de entrada")}</label>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t(locale, "Paste a long text here to create a shorter version that is easier to review.", "Pega aqui un texto largo para sacar una version mas corta y facil de repasar.")}
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
              {item === "breve" ? t(locale, "brief", "breve") : item === "equilibrado" ? t(locale, "balanced", "equilibrado") : t(locale, "detailed", "detallado")}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MetricTile label={t(locale, "Mode", "Modo")} value={mode === "breve" ? t(locale, "brief", "breve") : mode === "equilibrado" ? t(locale, "balanced", "equilibrado") : t(locale, "detailed", "detallado")} hint={t(locale, "Change the density of the result without leaving the page.", "Cambia la densidad del resultado sin salir de la ficha.")} />
          <MetricTile label={t(locale, "Characters", "Caracteres")} value={input.length} hint={t(locale, "Useful to quickly confirm whether you already pasted enough content.", "Sirve para validar rapidamente si ya pegaste suficiente contenido.")} />
        </div>
      </div>
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">{t(locale, "Suggested summary", "Resumen sugerido")}</p>
            <p className="mt-1 text-sm text-(--muted)">{summary.length} {t(locale, summary.length === 1 ? "reading block" : "reading blocks", summary.length === 1 ? "bloque de lectura" : "bloques de lectura")}</p>
          </div>
          <button
            type="button"
            onClick={() => trackSiteEvent("tool_action_clicked", { tool: "generador-de-resumenes", action: "generate_summary", length: input.length })}
            className="rounded-full bg-(--ink) px-4 py-2 text-sm font-semibold text-white hover:bg-(--accent-strong)"
          >
            {t(locale, "Generate", "Generar")}
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {summary.length > 0 ? summary.map((sentence, index) => (
            <div key={`${sentence}-${index}`} className="rounded-3xl border border-(--line) bg-white/70 px-4 py-3 text-sm leading-6 text-(--ink)">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{t(locale, "Idea", "Idea")} {index + 1}</p>
              <p className="mt-2">{sentence}</p>
            </div>
          )) : (
            <div className="rounded-3xl border border-dashed border-(--line) bg-white/40 px-4 py-5 text-sm leading-6 text-(--muted)">
              {t(locale, "The summary will appear here when you paste enough content to work with.", "El resumen aparecera aqui cuando pegues contenido suficiente para trabajar.")}
            </div>
          )}
        </div>
      </div>
    </div>
    </WidgetFrame>
  );
}

type TaskItem = { id: number; title: string; priority: "Alta" | "Media" | "Baja"; done: boolean };

function TaskOrganizerWidget({ locale }: { locale: SiteLocale }) {
  const [title, setTitle] = usePersistentState("tool-task-title", "");
  const [priority, setPriority] = usePersistentState<TaskItem["priority"]>("tool-task-priority", "Media");
  const [tasks, setTasks] = usePersistentState<TaskItem[]>("tool-task-list", []);

  const sortedTasks = [...tasks].sort((leftTask, rightTask) => {
    const priorityOrder = { Alta: 0, Media: 1, Baja: 2 };
    return priorityOrder[leftTask.priority] - priorityOrder[rightTask.priority];
  });

  return (
    <WidgetFrame
      eyebrow={t(locale, "Interactive tool", "Herramienta interactiva")}
      title={t(locale, "Sort priorities without crowding the screen", "Ordena prioridades sin llenar la pantalla")}
      description={t(locale, "Add tasks, assign priority, and use the list as a quick view to decide what to do first.", "Agrega tareas, asigna prioridad y usa la lista como una vista rapida para decidir que hacer primero.")}
    >
    <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4">
        <label className="text-sm font-semibold text-(--ink)">{t(locale, "New task", "Nueva tarea")}</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t(locale, "Example: prepare the client invoice", "Ejemplo: preparar factura del cliente")}
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
              {item === "Alta" ? t(locale, "High", "Alta") : item === "Media" ? t(locale, "Medium", "Media") : t(locale, "Low", "Baja")}
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
          {t(locale, "Add task", "Agregar tarea")}
        </button>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MetricTile label={t(locale, "Tasks", "Tareas")} value={tasks.length} hint={t(locale, "Total amount saved locally in this session.", "Cantidad total guardada localmente en esta sesion.")} />
          <MetricTile label={t(locale, "Current priority", "Prioridad actual")} value={priority === "Alta" ? t(locale, "High", "Alta") : priority === "Media" ? t(locale, "Medium", "Media") : t(locale, "Low", "Baja")} hint={t(locale, "It will apply to the next task you add.", "Se aplicara a la proxima tarea que agregues.")} />
        </div>
      </div>
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">{t(locale, "Sorted list", "Lista ordenada")}</p>
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
                <span className="hero-chip rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{task.priority === "Alta" ? t(locale, "High", "Alta") : task.priority === "Media" ? t(locale, "Medium", "Media") : t(locale, "Low", "Baja")}</span>
              </div>
            </button>
          )) : (
            <div className="rounded-3xl border border-dashed border-(--line) bg-white/40 px-4 py-6 text-sm leading-6 text-(--muted)">
              {t(locale, "When you add tasks, they will appear sorted so you can start with what matters most.", "Cuando agregues tareas, apareceran ordenadas para que empieces por lo importante.")}
            </div>
          )}
        </div>
      </div>
    </div>
    </WidgetFrame>
  );
}

function WritingWidget({ locale }: { locale: SiteLocale }) {
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
      eyebrow={t(locale, "Interactive tool", "Herramienta interactiva")}
      title={t(locale, "Do one last pass with more judgment", "Haz una ultima pasada con mas criterio")}
      description={t(locale, "Use it as a quick clarity check before delivering, publishing, or sending an important text.", "Usala como chequeo rapido de claridad antes de entregar, publicar o enviar un texto importante.")}
    >
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <label className="text-sm font-semibold text-(--ink)">{t(locale, "Text to review", "Texto a revisar")}</label>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t(locale, "Paste the text here to review clarity, length, and repetitions.", "Pega aqui el texto para revisar claridad, longitud y repeticiones.")}
          className="mt-2 min-h-40 w-full rounded-3xl border border-(--line) bg-white/80 px-4 py-4 text-sm leading-6 text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--accent) sm:min-h-52 sm:leading-7"
        />
      </div>
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">{t(locale, "Quick review", "Revision rapida")}</p>
            <p className="mt-1 text-sm text-(--muted)">{t(locale, "Local check for one final clarity pass.", "Chequeo local para una ultima pasada de claridad.")}</p>
          </div>
          <button
            type="button"
            onClick={() => trackSiteEvent("tool_action_clicked", { tool: "corrector-de-redaccion", action: "analyze_text", words: analysis.words })}
            className="rounded-full bg-(--ink) px-4 py-2 text-sm font-semibold text-white hover:bg-(--accent-strong)"
          >
            {t(locale, "Review", "Revisar")}
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          <MetricTile label={t(locale, "Words", "Palabras")} value={analysis.words} hint={t(locale, "Helps you measure length before a final correction.", "Te ayuda a medir extension antes de una ultima correccion.")} />
          <MetricTile label={t(locale, "Average per sentence", "Promedio por frase")} value={analysis.averageWordsPerSentence} hint={t(locale, "A high average usually signals sentences worth simplifying.", "Un promedio alto suele indicar frases que conviene simplificar.")} />
          <div className="info-tile rounded-3xl px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{t(locale, "Detected repetitions", "Repeticiones detectadas")}</p>
            <p className="mt-2 text-sm leading-6 text-(--ink)">{analysis.repeated.length > 0 ? analysis.repeated.join(", ") : t(locale, "There are no obvious repetitions in this pass.", "No hay repeticiones evidentes en esta pasada.")}</p>
          </div>
        </div>
      </div>
    </div>
    </WidgetFrame>
  );
}

function PomodoroWidget({ locale }: { locale: SiteLocale }) {
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
      eyebrow={t(locale, "Interactive tool", "Herramienta interactiva")}
      title={t(locale, "Get into focus with less friction", "Entra en foco con menos friccion")}
      description={t(locale, "Keep the time visible, avoid mid-session decisions, and use the block as a trigger to start now.", "Manten visible el tiempo, evita decisiones intermedias y usa la sesion como disparador para empezar ya.")}
    >
    <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4 text-center sm:py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">{t(locale, "Current session", "Sesion actual")}</p>
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
            {t(locale, "Start", "Iniciar")}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              trackSiteEvent("tool_action_clicked", { tool: "temporizador-pomodoro", action: "pause_timer" });
            }}
            className="rounded-full border border-(--line) px-4 py-3 text-sm font-semibold text-(--ink) hover:border-(--accent) hover:text-(--accent-strong)"
          >
            {t(locale, "Pause", "Pausar")}
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
            {t(locale, "Reset", "Reiniciar")}
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MetricTile label={t(locale, "Status", "Estado")} value={isRunning ? t(locale, "Running", "Activa") : t(locale, "Ready", "Lista")} hint={t(locale, "This tells you whether the session is still running even if you switch sections.", "Asi sabes si la sesion sigue corriendo aunque cambies de bloque.")} />
          <MetricTile label={t(locale, "Minutes", "Minutos")} value={Math.ceil(secondsLeft / 60)} hint={t(locale, "Remaining time is stored locally if you reload the page.", "El tiempo restante se guarda localmente si recargas la pagina.")} />
        </div>
      </div>
      <div className="rounded-4xl border border-(--line) bg-white/65 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--highlight)">{t(locale, "How to use it", "Guia de uso")}</p>
        <div className="mt-4 grid gap-3">
          {[
            t(locale, "Define a single task before starting the timer.", "Define una sola tarea antes de iniciar el reloj."),
            t(locale, "Work without opening new tabs or switching tasks.", "Trabaja sin abrir nuevas pestañas ni cambiar de tarea."),
            t(locale, "When the block ends, rest and decide whether to continue or stop.", "Al terminar el bloque, descansa y decide si sigues o cierras."),
          ].map((item, index) => (
            <div key={item} className="rounded-3xl border border-(--line) bg-white/70 px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{t(locale, "Step", "Paso")} {index + 1}</p>
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
  locale,
}: {
  offer: SalaryComparisonOffer;
  onChange: (field: keyof SalaryComparisonOffer, value: string) => void;
  accent: string;
  locale: SiteLocale;
}) {
  return (
    <section className={`rounded-4xl border px-4 py-4 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.42)] ${accent}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{offer.label}</p>
          <h4 className="mt-2 text-xl font-semibold text-(--ink)">{t(locale, "Offer scenario", "Escenario de oferta")}</h4>
        </div>
        <span className="hero-chip rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--accent-strong)">{stateTaxRates[offer.stateCode]?.name ?? stateTaxRates.OT.name}</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{t(locale, "Base income", "Ingreso base")}</span>
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
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{t(locale, "Pay frequency", "Periodicidad")}</span>
          <select
            value={offer.period}
            onChange={(event) => onChange("period", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
          >
            <option value="anual">{t(locale, "Annual", "Anual")}</option>
            <option value="mensual">{t(locale, "Monthly", "Mensual")}</option>
            <option value="quincenal">{t(locale, "Biweekly", "Quincenal")}</option>
            <option value="semanal">{t(locale, "Weekly", "Semanal")}</option>
            <option value="por-hora">{t(locale, "Hourly", "Por hora")}</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{t(locale, "State", "Estado")}</span>
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
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{t(locale, "Filing status", "Filing status")}</span>
          <select
            value={offer.filingStatus}
            onChange={(event) => onChange("filingStatus", event.target.value)}
            className="rounded-2xl border border-(--line) bg-white px-4 py-3 text-sm text-(--ink) outline-none focus:border-(--accent)"
          >
            <option value="soltero">{t(locale, "Single", "Soltero")}</option>
            <option value="casado">{t(locale, "Married filing jointly", "Casado")}</option>
            <option value="cabeza-de-hogar">{t(locale, "Head of household", "Cabeza de hogar")}</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offer.period === "por-hora" ? (
          <label className="grid gap-2 rounded-3xl border border-(--line) bg-white/80 px-4 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{t(locale, "Hours / week", "Horas / semana")}</span>
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
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{t(locale, "Dependents", "Dependientes")}</span>
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
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{t(locale, "Annual bonus", "Bonus anual")}</span>
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
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{t(locale, "Pre-tax / period", "Pre-tax / periodo")}</span>
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
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{t(locale, "Post-tax / period", "Post-tax / periodo")}</span>
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
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{t(locale, "Extra federal / period", "Federal extra / periodo")}</span>
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
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">{t(locale, "Local tax %", "Local tax %")}</span>
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
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{t(locale, "What is estimated here", "Que se aproxima aqui")}</p>
          <p className="mt-2">{t(locale, "Progressive federal withholding, Social Security, Medicare, approximate state tax, optional local tax, and payroll deductions before and after taxes.", "Retencion federal progresiva, Social Security, Medicare, state tax, impuesto local opcional y descuentos payroll antes y despues de impuestos.")}</p>
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

function SalaryNetWidget({ locale }: { locale: SiteLocale }) {
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
      eyebrow={t(locale, "Interactive tool", "Herramienta interactiva")}
      title={t(locale, "Compare two offers with a view closer to real payroll", "Compara dos ofertas con una lectura mas cercana al payroll real")}
      description={t(locale, "Put two salary scenarios side by side and estimate net pay, taxes, and payroll deductions before making a job decision.", "Pon lado a lado dos escenarios de salario y estima neto, impuestos y descuentos payroll antes de tomar una decision laboral.")}
    >
      <div className="grid gap-4">
        <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
          <div className="grid gap-4 lg:grid-cols-2">
            <SalaryOfferForm offer={offerA} onChange={updateOfferA} accent="border-emerald-200 bg-linear-to-br from-emerald-50/80 to-white/80" locale={locale} />
            <SalaryOfferForm offer={offerB} onChange={updateOfferB} accent="border-amber-200 bg-linear-to-br from-amber-50/80 to-white/80" locale={locale} />
          </div>

          <div className="grid gap-4">
            <div className="rounded-4xl border border-emerald-200 bg-linear-to-br from-emerald-500 to-teal-500 px-4 py-4 text-white shadow-[0_24px_56px_-32px_rgba(16,185,129,0.65)] sm:px-5 sm:py-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/75">{t(locale, "Primary readout", "Lectura principal")}</p>
              <p className="mt-3 text-2xl font-semibold sm:text-4xl">
                {comparison.winner ? t(locale, `${comparison.winner} wins by ${formatCurrency(comparison.monthlyDifference)}/month`, `${comparison.winner} gana por ${formatCurrency(comparison.monthlyDifference)}/mes`) : t(locale, "Both offers are practically tied", "Ambas ofertas quedan practicamente empatadas")}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/85">
                {comparison.winner
                  ? t(locale, `The estimated annual difference is ${formatCurrency(comparison.annualDifference)} after federal, state tax, FICA, and payroll adjustments.`, `La diferencia anual estimada es de ${formatCurrency(comparison.annualDifference)} despues de federal, state tax, FICA y ajustes payroll.`)
                  : t(locale, "Estimated net pay is very similar. In this case, it makes more sense to compare benefits, growth, and income stability.", "El neto estimado es muy parecido. En este caso conviene mirar beneficios, crecimiento y estabilidad del ingreso.")}
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
                {t(locale, "Save comparison", "Registrar comparacion")}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label={t(locale, "Monthly net A", "Neto mensual A")} value={formatCurrency(resultA.netMonthly)} hint={`${offerA.label} ${t(locale, "in", "en")} ${resultA.stateName}.`} />
              <MetricTile label={t(locale, "Monthly net B", "Neto mensual B")} value={formatCurrency(resultB.netMonthly)} hint={`${offerB.label} ${t(locale, "in", "en")} ${resultB.stateName}.`} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Take-home A" value={formatPercent(resultA.takeHomeRate)} hint={t(locale, "Approximate share of gross pay that ends up available.", "Porcentaje orientativo del bruto que termina disponible.")} />
              <MetricTile label="Take-home B" value={formatPercent(resultB.takeHomeRate)} hint={t(locale, "Useful for comparing offers with different bonuses or deductions.", "Util para comparar ofertas con distinto bonus o deducciones.")} />
            </div>

            <div className="rounded-4xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-700">{t(locale, "Model assumptions", "Supuestos del modelo")}</p>
              <p className="mt-2">{t(locale, "The tool uses simplified federal brackets, approximate state tax, the 2026 Social Security cap, Additional Medicare, and common payroll adjustments like 401(k), pre-tax deductions, and extra withholding.", "La herramienta usa tramos federales simplificados, state tax aproximado, cap de Social Security 2026, Additional Medicare y ajustes de payroll comunes como 401(k), deducciones pre-tax y retencion extra.")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-(--line) bg-white/72 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-(--highlight)">{t(locale, "Side-by-side comparison", "Comparacion lado a lado")}</p>
              <h4 className="mt-2 text-xl font-semibold text-(--ink) sm:text-2xl">{t(locale, "What actually changes from one offer to another", "Lo que realmente cambia entre una oferta y otra")}</h4>
            </div>
            <div className="grid gap-2 text-sm text-(--muted)">
              <span>{offerA.label}: {formatCurrency(resultA.netAnnual)} {t(locale, "net / year", "netos / ano")}</span>
              <span>{offerB.label}: {formatCurrency(resultB.netAnnual)} {t(locale, "net / year", "netos / ano")}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <SalaryCompareRow label={t(locale, "Annual net", "Neto anual")} left={formatCurrency(resultA.netAnnual)} right={formatCurrency(resultB.netAnnual)} helper={t(locale, "The most useful comparison when the offers have different structures.", "La comparacion mas util si ambas ofertas tienen estructuras distintas.")} />
            <SalaryCompareRow label={t(locale, "Monthly net", "Neto mensual")} left={formatCurrency(resultA.netMonthly)} right={formatCurrency(resultB.netMonthly)} helper={t(locale, "Helps you decide using a real budget instead of gross salary.", "Ayuda a decidir con presupuesto real y no con salario bruto.")} />
            <SalaryCompareRow label={t(locale, "Net per period", "Neto por periodo")} left={formatCurrency(resultA.netPerPeriod)} right={formatCurrency(resultB.netPerPeriod)} helper={t(locale, "Worth checking if pay frequency or hours change.", "Conviene revisarlo si cambian frecuencia de pago u horas.")} />
            <SalaryCompareRow label={t(locale, "Total taxes", "Impuestos totales")} left={formatCurrency(resultA.totalTaxes)} right={formatCurrency(resultB.totalTaxes)} helper={t(locale, "Adds federal, state tax, local tax, Social Security, and Medicare.", "Suma federal, state tax, local tax, Social Security y Medicare.")} />
            <SalaryCompareRow label={t(locale, "Pre-tax deductions", "Deducciones pre-tax")} left={formatCurrency(resultA.annualPretax)} right={formatCurrency(resultB.annualPretax)} helper={t(locale, "Includes 401(k) contributions and pre-tax payroll deductions per period.", "Incluye aporte 401(k) y payroll pre-tax por periodo.")} />
            <SalaryCompareRow label={t(locale, "Post-tax deductions", "Deducciones post-tax")} left={formatCurrency(resultA.annualPostTax)} right={formatCurrency(resultB.annualPostTax)} helper={t(locale, "Useful for reflecting discounts that reduce cash even if they do not lower taxable income.", "Sirve para reflejar descuentos que reducen cash aunque no bajen la base fiscal.")} />
            <SalaryCompareRow label="State + local" left={formatCurrency(resultA.stateTax + resultA.localTax)} right={formatCurrency(resultB.stateTax + resultB.localTax)} helper={t(locale, "This is often where the largest difference appears when you compare a move or a new location.", "Aqui suele estar la mayor diferencia cuando comparas mudanza o nuevas plazas.")} />
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

export function ToolWidget({ tool, locale = "es" }: { tool: ToolItem; locale?: SiteLocale }) {
  if (tool.slug === "calculadora-salario-neto-usa") {
    return <SalaryNetWidget locale={locale} />;
  }

  if (tool.slug === "generador-de-resumenes") {
    return <SummaryWidget locale={locale} />;
  }

  if (tool.slug === "organizador-de-tareas") {
    return <TaskOrganizerWidget locale={locale} />;
  }

  if (tool.slug === "corrector-de-redaccion") {
    return <WritingWidget locale={locale} />;
  }

  return <PomodoroWidget locale={locale} />;
}