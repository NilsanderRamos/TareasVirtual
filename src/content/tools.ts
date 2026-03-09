import { ToolItem } from "@/types";

export const tools: ToolItem[] = [
  {
    name: "Generador de Resumenes",
    slug: "generador-de-resumenes",
    description:
      "Convierte textos largos en ideas clave para estudiar mas rapido.",
    category: "Estudio",
    href: "/tools#generador-de-resumenes",
    isFeatured: true,
  },
  {
    name: "Organizador de Tareas",
    slug: "organizador-de-tareas",
    description: "Planifica entregas y prioridades semanales en minutos.",
    category: "Productividad",
    href: "/tools#organizador-de-tareas",
    isFeatured: true,
  },
  {
    name: "Corrector de Redaccion",
    slug: "corrector-de-redaccion",
    description:
      "Mejora ortografia y claridad antes de entregar trabajos.",
    category: "Escritura",
    href: "/tools#corrector-de-redaccion",
    isFeatured: true,
  },
  {
    name: "Temporizador Pomodoro",
    slug: "temporizador-pomodoro",
    description: "Gestiona sesiones de enfoque y descansos automaticamente.",
    category: "Productividad",
    href: "/tools#temporizador-pomodoro",
    isFeatured: false,
  },
];
