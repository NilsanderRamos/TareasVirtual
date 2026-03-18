import { blogPosts } from "@/content/blog/posts";
import { tools } from "@/content/tools";
import { pickByLocale, SiteLocale } from "@/lib/i18n";
import { BlogPost } from "@/types";

type LocalizedText = {
  en: string;
  es: string;
};

type LocalizedBenefit = {
  title: LocalizedText;
  description: LocalizedText;
};

export type BlogHubSlug = "finanzas" | "productividad" | "ia" | "ecommerce";

export interface BlogHubDefinition {
  slug: BlogHubSlug;
  name: LocalizedText;
  eyebrow: LocalizedText;
  description: LocalizedText;
  longDescription: LocalizedText;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  categoryMatchers: string[];
  tagMatchers: string[];
  featuredPostSlug: string;
  priorityPostSlugs?: string[];
  featuredToolSlugs: string[];
  audienceSignals: LocalizedText[];
  benefits: LocalizedBenefit[];
}

export interface RelatedBlogPostMatch {
  post: BlogPost;
  score: number;
  sharedTags: string[];
  sharedHubSlugs: BlogHubSlug[];
  sameCategory: boolean;
}

function t(locale: SiteLocale, value: LocalizedText) {
  return pickByLocale(locale, value.en, value.es);
}

export function normalizeBlogValue(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const BLOG_HUBS: BlogHubDefinition[] = [
  {
    slug: "finanzas",
    name: { en: "Finance", es: "Finanzas" },
    eyebrow: { en: "Financial guides", es: "Guias financieras" },
    description: {
      en: "Salary, payroll, taxes, invoicing, and practical money decisions for Spanish-speaking professionals.",
      es: "Salarios, payroll, impuestos, facturacion y decisiones practicas de dinero para profesionales hispanohablantes.",
    },
    longDescription: {
      en: "This hub brings together guides that help turn gross numbers into real decisions: net salary, freelancer taxes, invoicing, and finance-adjacent software choices.",
      es: "Este hub reune guias para convertir cifras brutas en decisiones reales: salario neto, impuestos freelance, facturacion y decisiones de software ligadas a finanzas.",
    },
    metaTitle: { en: "Finance Guides and Tools", es: "Guias y Herramientas de Finanzas" },
    metaDescription: {
      en: "Explore finance guides and tools about net salary, payroll deductions, freelancer taxes, and invoicing workflows.",
      es: "Explora guias y herramientas de finanzas sobre salario neto, deducciones payroll, impuestos freelance y flujos de facturacion.",
    },
    categoryMatchers: ["finanzas"],
    tagMatchers: ["salario", "paycheck", "nomina", "impuestos", "factura", "freelancer"],
    featuredPostSlug: "calcular-salario-neto-estados-unidos-2026",
    priorityPostSlugs: ["impuestos-freelancer-estados-unidos-2026", "crear-factura-profesional-2026"],
    featuredToolSlugs: ["calculadora-salario-neto-usa", "organizador-de-tareas"],
    audienceSignals: [
      { en: "Payroll clarity", es: "Claridad de payroll" },
      { en: "Freelance taxes", es: "Impuestos freelance" },
      { en: "Cash flow decisions", es: "Decisiones de flujo de caja" },
    ],
    benefits: [
      {
        title: { en: "Real numbers first", es: "Primero numeros reales" },
        description: {
          en: "These guides reduce the gap between gross figures and the money that actually reaches your account.",
          es: "Estas guias reducen la distancia entre cifras brutas y el dinero que realmente llega a tu cuenta.",
        },
      },
      {
        title: { en: "Operational context", es: "Contexto operativo" },
        description: {
          en: "The hub connects salary, invoicing, and tax decisions with the practical steps that follow them.",
          es: "El hub conecta salario, facturacion e impuestos con los pasos practicos que vienen despues.",
        },
      },
      {
        title: { en: "Useful tools", es: "Herramientas utiles" },
        description: {
          en: "The main tools help you compare offers and organize the next action without leaving the editorial flow.",
          es: "Las herramientas principales te ayudan a comparar ofertas y ordenar el siguiente paso sin salir del flujo editorial.",
        },
      },
    ],
  },
  {
    slug: "productividad",
    name: { en: "Productivity", es: "Productividad" },
    eyebrow: { en: "Execution and focus", es: "Ejecucion y foco" },
    description: {
      en: "Practical planning, study organization, and execution systems that reduce friction across the week.",
      es: "Planificacion practica, organizacion de estudio y sistemas de ejecucion para reducir friccion durante la semana.",
    },
    longDescription: {
      en: "This hub focuses on planning, weekly organization, reading efficiency, and lighter workflows that work especially well on mobile.",
      es: "Este hub se centra en planificacion, organizacion semanal, eficiencia de lectura y flujos ligeros que funcionan bien tambien en movil.",
    },
    metaTitle: { en: "Productivity Guides and Tools", es: "Guias y Herramientas de Productividad" },
    metaDescription: {
      en: "Find productivity guides and tools for organizing study, focusing in blocks, summarizing faster, and executing with less noise.",
      es: "Encuentra guias y herramientas de productividad para organizar estudio, enfocarte por bloques, resumir mas rapido y ejecutar con menos ruido.",
    },
    categoryMatchers: ["productividad", "aprendizaje"],
    tagMatchers: ["productividad", "estudio", "resumen", "planificacion", "pomodoro"],
    featuredPostSlug: "organizar-semana-estudio-30-minutos",
    priorityPostSlugs: ["5-tecnicas-resumir-mejor"],
    featuredToolSlugs: ["organizador-de-tareas", "temporizador-pomodoro", "generador-de-resumenes"],
    audienceSignals: [
      { en: "Weekly planning", es: "Planificacion semanal" },
      { en: "Fast study", es: "Estudio rapido" },
      { en: "Deep work blocks", es: "Bloques de enfoque" },
    ],
    benefits: [
      {
        title: { en: "Less overload", es: "Menos saturacion" },
        description: {
          en: "The hub organizes planning and execution content around actions you can apply on the same day.",
          es: "El hub organiza contenido de planificacion y ejecucion alrededor de acciones que puedes aplicar el mismo dia.",
        },
      },
      {
        title: { en: "Study to action", es: "Del estudio a la accion" },
        description: {
          en: "Guides and tools are connected so a reading session can turn into a concrete next step quickly.",
          es: "Las guias y herramientas estan conectadas para que una lectura se convierta rapido en un siguiente paso concreto.",
        },
      },
      {
        title: { en: "Mobile-first rhythm", es: "Ritmo mobile-first" },
        description: {
          en: "The structure keeps information scannable on smaller screens without losing depth.",
          es: "La estructura mantiene la informacion escaneable en pantallas pequenas sin perder profundidad.",
        },
      },
    ],
  },
  {
    slug: "ia",
    name: { en: "AI", es: "IA" },
    eyebrow: { en: "AI with judgment", es: "IA con criterio" },
    description: {
      en: "A focused cluster on how to use AI for tasks, writing, and study without losing clarity or editorial control.",
      es: "Un cluster enfocado en como usar IA para tareas, redaccion y estudio sin perder claridad ni control editorial.",
    },
    longDescription: {
      en: "This hub prioritizes AI use cases that improve real output: faster drafts, cleaner writing, and more efficient study workflows with human review still in control.",
      es: "Este hub prioriza casos de uso de IA que mejoran resultados reales: borradores mas rapidos, redaccion mas limpia y flujos de estudio mas eficientes, manteniendo el control humano.",
    },
    metaTitle: { en: "AI Guides and Tools", es: "Guias y Herramientas de IA" },
    metaDescription: {
      en: "Explore AI guides and tools for tasks, writing checks, faster summaries, and practical workflows with better judgment.",
      es: "Explora guias y herramientas de IA para tareas, revision de redaccion, resumenes mas rapidos y flujos practicos con mejor criterio.",
    },
    categoryMatchers: ["tecnologia"],
    tagMatchers: ["inteligencia artificial", "ia para", "productividad con ia", "usar ia"],
    featuredPostSlug: "guia-ia-para-tareas",
    priorityPostSlugs: ["5-tecnicas-resumir-mejor", "organizar-semana-estudio-30-minutos"],
    featuredToolSlugs: ["corrector-de-redaccion", "generador-de-resumenes", "organizador-de-tareas"],
    audienceSignals: [
      { en: "Better prompts", es: "Mejores prompts" },
      { en: "Human review", es: "Revision humana" },
      { en: "Workflow support", es: "Apoyo al flujo" },
    ],
    benefits: [
      {
        title: { en: "Useful, not generic", es: "Util, no generica" },
        description: {
          en: "The focus is on AI that improves a workflow instead of producing vague text for the sake of it.",
          es: "El foco esta en IA que mejora un flujo de trabajo en lugar de producir texto vago por producirlo.",
        },
      },
      {
        title: { en: "Safer outputs", es: "Resultados mas seguros" },
        description: {
          en: "The content emphasizes verification, rewriting, and judgment before anything gets published or submitted.",
          es: "El contenido enfatiza verificacion, reescritura y criterio antes de publicar o entregar nada.",
        },
      },
      {
        title: { en: "Connected tools", es: "Herramientas conectadas" },
        description: {
          en: "Writing and summarization tools are linked directly to the editorial guidance that explains when to trust them and when not to.",
          es: "Las herramientas de redaccion y resumen se conectan directamente con la guia editorial que explica cuando fiarte de ellas y cuando no.",
        },
      },
    ],
  },
  {
    slug: "ecommerce",
    name: { en: "Ecommerce", es: "Ecommerce" },
    eyebrow: { en: "Store launch and platforms", es: "Lanzamiento y plataformas" },
    description: {
      en: "Content for launching, structuring, and comparing online-store operations with fewer expensive mistakes.",
      es: "Contenido para lanzar, estructurar y comparar operaciones de tienda online con menos errores caros.",
    },
    longDescription: {
      en: "This hub collects launch checklists, platform comparisons, and software decisions that matter before you invest in traffic or operations.",
      es: "Este hub recoge checklists de lanzamiento, comparativas de plataformas y decisiones de software que importan antes de invertir en trafico u operacion.",
    },
    metaTitle: { en: "Ecommerce Guides and Tools", es: "Guias y Herramientas de Ecommerce" },
    metaDescription: {
      en: "Review ecommerce guides about store launches, platform comparisons, invoicing tools, and software decisions for online operations.",
      es: "Revisa guias de ecommerce sobre lanzamientos de tienda, comparativas de plataformas, herramientas de facturacion y decisiones de software para operaciones online.",
    },
    categoryMatchers: ["ecommerce"],
    tagMatchers: ["tienda online", "ecommerce", "checkout", "plataformas", "facturacion electronica"],
    featuredPostSlug: "checklist-lanzar-tienda-online-2026",
    priorityPostSlugs: ["mejores-plataformas-crear-tienda-online-2026", "mejor-software-facturacion-electronica-2026"],
    featuredToolSlugs: ["organizador-de-tareas", "corrector-de-redaccion"],
    audienceSignals: [
      { en: "Launch checklists", es: "Checklists de lanzamiento" },
      { en: "Platform comparisons", es: "Comparativas de plataformas" },
      { en: "Operational trust", es: "Confianza operativa" },
    ],
    benefits: [
      {
        title: { en: "Launch with fewer gaps", es: "Lanzar con menos huecos" },
        description: {
          en: "The hub concentrates pre-launch checks that prevent expensive operational mistakes.",
          es: "El hub concentra revisiones previas al lanzamiento que evitan errores operativos costosos.",
        },
      },
      {
        title: { en: "Compare before paying", es: "Comparar antes de pagar" },
        description: {
          en: "It helps evaluate platforms and software before committing budget or migration time.",
          es: "Ayuda a evaluar plataformas y software antes de comprometer presupuesto o tiempo de migracion.",
        },
      },
      {
        title: { en: "Operational next steps", es: "Siguientes pasos operativos" },
        description: {
          en: "The linked routes make it easier to move from reading to execution inside the same topic cluster.",
          es: "Las rutas enlazadas facilitan pasar de la lectura a la ejecucion dentro del mismo cluster tematico.",
        },
      },
    ],
  },
];

function matchesText(normalizedValue: string, candidates: string[]) {
  return candidates.some((candidate) => normalizedValue.includes(normalizeBlogValue(candidate)));
}

function postMatchesHub(post: BlogPost, hub: BlogHubDefinition) {
  const normalizedCategory = normalizeBlogValue(post.category);
  const normalizedTags = post.tags.map((tag) => normalizeBlogValue(tag));
  const categoryMatch = hub.categoryMatchers.some((candidate) => normalizedCategory === normalizeBlogValue(candidate));
  const tagMatch = normalizedTags.some((tag) => matchesText(tag, hub.tagMatchers));
  const priorityMatch = [hub.featuredPostSlug, ...(hub.priorityPostSlugs ?? [])].includes(post.slug);

  return categoryMatch || tagMatch || priorityMatch;
}

export function getAllBlogHubs() {
  return BLOG_HUBS;
}

export function getBlogHubBySlug(slug: string) {
  return BLOG_HUBS.find((hub) => hub.slug === slug) ?? null;
}

export function getBlogHubPath(slug: BlogHubSlug) {
  return `/blog/categorias/${slug}`;
}

export function getBlogHubPosts(hubSlug: BlogHubSlug, posts = blogPosts) {
  const hub = getBlogHubBySlug(hubSlug);

  if (!hub) {
    return [];
  }

  const priorityOrder = [hub.featuredPostSlug, ...(hub.priorityPostSlugs ?? [])];

  return posts
    .filter((post) => postMatchesHub(post, hub))
    .sort((leftPost, rightPost) => {
      const leftPriority = priorityOrder.indexOf(leftPost.slug);
      const rightPriority = priorityOrder.indexOf(rightPost.slug);

      if (leftPriority !== rightPriority) {
        const normalizedLeftPriority = leftPriority === -1 ? Number.MAX_SAFE_INTEGER : leftPriority;
        const normalizedRightPriority = rightPriority === -1 ? Number.MAX_SAFE_INTEGER : rightPriority;
        return normalizedLeftPriority - normalizedRightPriority;
      }

      return rightPost.date.localeCompare(leftPost.date);
    });
}

export function getBlogHubTools(hubSlug: BlogHubSlug, toolItems = tools) {
  const hub = getBlogHubBySlug(hubSlug);

  if (!hub) {
    return [];
  }

  const order = new Map(hub.featuredToolSlugs.map((slug, index) => [slug, index]));

  return toolItems
    .filter((tool) => order.has(tool.slug))
    .sort((leftTool, rightTool) => (order.get(leftTool.slug) ?? 99) - (order.get(rightTool.slug) ?? 99));
}

export function getBlogHubsForPost(post: BlogPost) {
  return BLOG_HUBS.filter((hub) => postMatchesHub(post, hub));
}

export function getPrimaryBlogHubForPost(post: BlogPost) {
  return getBlogHubsForPost(post)[0] ?? null;
}

export function getRelatedBlogPosts(sourcePost: BlogPost, posts = blogPosts, limit = 3): RelatedBlogPostMatch[] {
  const sourceTagSet = new Set(sourcePost.tags.map((tag) => normalizeBlogValue(tag)));
  const sourceHubSlugs = new Set(getBlogHubsForPost(sourcePost).map((hub) => hub.slug));

  return posts
    .filter((candidate) => candidate.slug !== sourcePost.slug)
    .map((candidate) => {
      const sameCategory = normalizeBlogValue(candidate.category) === normalizeBlogValue(sourcePost.category);
      const sharedTags = candidate.tags.filter((tag) => sourceTagSet.has(normalizeBlogValue(tag)));
      const candidateHubSlugs = getBlogHubsForPost(candidate).map((hub) => hub.slug);
      const sharedHubSlugs = candidateHubSlugs.filter((slug) => sourceHubSlugs.has(slug));
      const directlyLinked = sourcePost.internalLinks?.some((link) => link.href.endsWith(`/${candidate.slug}`)) ? 1 : 0;

      let score = sharedTags.length * 5;

      if (sameCategory) {
        score += 8;
      }

      if (sharedHubSlugs.length > 0) {
        score += sharedHubSlugs.length * 4;
      }

      score += directlyLinked * 2;

      return {
        post: candidate,
        score,
        sharedTags,
        sharedHubSlugs,
        sameCategory,
      };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((leftCandidate, rightCandidate) => {
      return rightCandidate.score - leftCandidate.score || rightCandidate.post.date.localeCompare(leftCandidate.post.date);
    })
    .slice(0, limit);
}

export function getRelatedBlogPostReason(match: RelatedBlogPostMatch, locale: SiteLocale) {
  if (match.sameCategory && match.sharedTags.length > 0) {
    return pickByLocale(
      locale,
      `Same category and also connected to ${match.sharedTags[0].toLowerCase()}.`,
      `Misma categoria y ademas conectada con ${match.sharedTags[0].toLowerCase()}.`,
    );
  }

  if (match.sameCategory) {
    return pickByLocale(locale, "Same editorial category.", "Misma categoria editorial.");
  }

  if (match.sharedTags.length > 0) {
    return pickByLocale(
      locale,
      `It overlaps with ${match.sharedTags[0].toLowerCase()} and adjacent search intent.`,
      `Se cruza con ${match.sharedTags[0].toLowerCase()} y con una intencion de busqueda cercana.`,
    );
  }

  if (match.sharedHubSlugs.length > 0) {
    const firstHub = getBlogHubBySlug(match.sharedHubSlugs[0]);

    return pickByLocale(
      locale,
      `Part of the ${firstHub ? t(locale, firstHub.name) : "same"} strategic hub.`,
      `Forma parte del hub estrategico de ${firstHub ? t(locale, firstHub.name).toLowerCase() : "la misma area"}.`,
    );
  }

  return pickByLocale(locale, "Relevant next reading.", "Siguiente lectura relevante.");
}

export function getLocalizedBlogHubCopy(hub: BlogHubDefinition, locale: SiteLocale) {
  return {
    name: t(locale, hub.name),
    eyebrow: t(locale, hub.eyebrow),
    description: t(locale, hub.description),
    longDescription: t(locale, hub.longDescription),
    metaTitle: t(locale, hub.metaTitle),
    metaDescription: t(locale, hub.metaDescription),
    audienceSignals: hub.audienceSignals.map((item) => t(locale, item)),
    benefits: hub.benefits.map((item) => ({
      title: t(locale, item.title),
      description: t(locale, item.description),
    })),
  };
}