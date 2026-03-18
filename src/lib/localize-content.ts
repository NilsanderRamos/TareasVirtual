import { SiteLocale } from "@/lib/i18n";
import { translateMany, translateText } from "@/lib/translation";
import { BlogPost, ToolItem } from "@/types";

const EN_TOOL_TRANSLATIONS: Record<string, Omit<ToolItem, "slug" | "href" | "detailHref" | "launchHref" | "isFeatured" | "updatedAt" | "relatedPostSlugs">> = {
  "calculadora-salario-neto-usa": {
    name: "USA Net Salary Calculator",
    description: "Compare two offers and estimate how much you would keep after taxes and deductions with an educational payroll simulation for the United States.",
    category: "Finance",
    intentLabel: "Financial decision",
    decisionStage: "Estimate before accepting or negotiating",
    primaryOutcome: "Compare two offers with estimated monthly and annual net pay",
    bestFor: ["Job offers", "Budgeting", "Compare salaries"],
    keyBenefits: [
      "Helps turn two job offers into a figure that is much more useful for real life.",
      "Lets you compare scenarios by state, pay frequency, bonus, and payroll adjustments that are closer to real take-home pay.",
      "Works as a starting point before reviewing real payroll or tax advice.",
    ],
    quickSteps: [
      "Load two offers side by side with salary, bonus, and pay frequency.",
      "Adjust state, filing status, 401(k), deductions, and extra withholding.",
      "Use the estimated net pay to decide with better judgment.",
    ],
    trustPoints: [
      "The output is an educational estimate, not an official tax calculation or final payroll figure.",
      "Social Security and Medicare follow more stable rules; the federal, state, and local part follows a reasonable approximation but does not replace real payroll.",
      "It is worth checking the result against your actual pay stub or official tools if you are making an important decision.",
    ],
    useCases: [
      "Compare two job offers before replying.",
      "Estimate how much money would actually arrive each month after deductions.",
      "Understand why a paycheck can look lower than gross salary.",
    ],
  },
  "generador-de-resumenes": {
    name: "Summary Generator",
    description: "Turn long texts into key ideas so you can study faster.",
    category: "Study",
    intentLabel: "Immediate application",
    decisionStage: "Discover and synthesize",
    primaryOutcome: "Extract key ideas quickly",
    bestFor: ["Students", "Fast reading", "Prepare reviews"],
    keyBenefits: [
      "Reduces long texts to central ideas in less time.",
      "Makes review easier before an assignment or exam.",
      "Helps detect structure and main arguments.",
    ],
    quickSteps: [
      "Paste the text or define the content you want to summarize.",
      "Identify the key points and sort them by priority.",
      "Turn the result into a short review or action list.",
    ],
    trustPoints: [
      "Designed to speed up reading, not replace comprehension.",
      "It is worth reviewing the final summary before submitting academic work.",
      "It works best when combined with a short verification read.",
    ],
    useCases: [
      "Prepare notes before an exam.",
      "Reduce long articles to essential ideas.",
      "Pull actionable points from documents or briefings.",
    ],
  },
  "organizador-de-tareas": {
    name: "Task Organizer",
    description: "Plan weekly deliveries and priorities in minutes.",
    category: "Productivity",
    intentLabel: "Operational organization",
    decisionStage: "Prioritize and execute",
    primaryOutcome: "Organize work without noise",
    bestFor: ["Freelance", "Study", "Operational work"],
    keyBenefits: [
      "Helps organize priorities without filling the screen with noise.",
      "Lets you distinguish urgent, important, and delegable tasks.",
      "Reduces friction between planning and execution.",
    ],
    quickSteps: [
      "Define deliveries and active tasks for the week.",
      "Sort them by impact and real urgency.",
      "Execute the most important block first and review at the end of the day.",
    ],
    trustPoints: [
      "Works best with a few clear priorities, not endless lists.",
      "Useful for study, remote work, and repeatable operational routines.",
      "It does not replace judgment: it organizes the load, it does not decide for you.",
    ],
    useCases: [
      "Organize academic tasks by deadline.",
      "Plan the week for a freelance project.",
      "Separate deep work from operational errands.",
    ],
  },
  "corrector-de-redaccion": {
    name: "Writing Checker",
    description: "Improve spelling and clarity before submitting work.",
    category: "Writing",
    intentLabel: "Final review",
    decisionStage: "Polish before submitting",
    primaryOutcome: "Improve clarity and correctness",
    bestFor: ["Submissions", "Final correction", "AI-assisted texts"],
    keyBenefits: [
      "Improves readability before publishing, sending, or submitting.",
      "Helps detect ambiguous or unnatural sentences.",
      "Acts as a final layer to reduce avoidable mistakes.",
    ],
    quickSteps: [
      "Paste the final or almost final text.",
      "Review clarity, spelling, and repetitions.",
      "Do one last human pass before sharing it.",
    ],
    trustPoints: [
      "It works best as a final revision, not as a replacement for editorial judgment.",
      "Especially useful in AI-generated or AI-assisted texts.",
      "The final version should sound natural and genuinely yours.",
    ],
    useCases: [
      "Review an assignment before turning it in.",
      "Polish short emails or proposals.",
      "Clean up texts assisted by artificial intelligence.",
    ],
  },
  "temporizador-pomodoro": {
    name: "Pomodoro Timer",
    description: "Manage focus sessions and breaks automatically.",
    category: "Productivity",
    intentLabel: "Immediate focus",
    decisionStage: "Start a work session",
    primaryOutcome: "Sustain attention in blocks",
    bestFor: ["Focus", "Short blocks", "Daily routine"],
    keyBenefits: [
      "Helps start deep work without overthinking duration.",
      "Reduces distraction in long or heavy tasks.",
      "Makes it more visible when it is time to stop and recover energy.",
    ],
    quickSteps: [
      "Choose one specific task for the next block.",
      "Work on a single thing until the cycle ends.",
      "Rest and reassess before the next block.",
    ],
    trustPoints: [
      "It performs better when the task is already defined in advance.",
      "It is not useful if the work list is still unclear or constantly changing.",
      "It is worth combining it with a simple task organizer.",
    ],
    useCases: [
      "Start a study session without distractions.",
      "Break heavy mental work into manageable blocks.",
      "Control breaks during long workdays.",
    ],
  },
};

export async function localizeToolItem(tool: ToolItem, locale: SiteLocale): Promise<ToolItem> {
  if (locale === "es") {
    return tool;
  }

  const staticTranslation = EN_TOOL_TRANSLATIONS[tool.slug];

  if (locale === "en" && staticTranslation) {
    return {
      ...tool,
      ...staticTranslation,
    };
  }

  const [
    name,
    description,
    category,
    intentLabel,
    decisionStage,
    primaryOutcome,
  ] = await translateMany(
    [tool.name, tool.description, tool.category, tool.intentLabel, tool.decisionStage, tool.primaryOutcome],
    locale,
  );

  const [bestFor, keyBenefits, quickSteps, trustPoints, useCases] = await Promise.all([
    translateMany(tool.bestFor, locale),
    translateMany(tool.keyBenefits, locale),
    translateMany(tool.quickSteps, locale),
    translateMany(tool.trustPoints, locale),
    translateMany(tool.useCases, locale),
  ]);

  return {
    ...tool,
    name,
    description,
    category,
    intentLabel,
    decisionStage,
    primaryOutcome,
    bestFor,
    keyBenefits,
    quickSteps,
    trustPoints,
    useCases,
  };
}

export async function localizeToolItems(tools: ToolItem[], locale: SiteLocale) {
  return Promise.all(tools.map((tool) => localizeToolItem(tool, locale)));
}

export async function localizeBlogPost(post: BlogPost, locale: SiteLocale): Promise<BlogPost> {
  if (locale === "es") {
    return post;
  }

  const [title, description, category, author] = await translateMany(
    [post.title, post.description, post.category, post.author],
    locale,
  );

  const [tags, content, introduction, conclusion, keyTakeaways] = await Promise.all([
    translateMany(post.tags, locale),
    translateMany(post.content ?? [], locale),
    translateMany(post.introduction ?? [], locale),
    translateMany(post.conclusion ?? [], locale),
    translateMany(post.keyTakeaways ?? [], locale),
  ]);

  const sections = await Promise.all(
    (post.sections ?? []).map(async (section) => ({
      ...section,
      heading: await translateText(section.heading, locale),
      subheading: section.subheading ? await translateText(section.subheading, locale) : undefined,
      paragraphs: await translateMany(section.paragraphs, locale),
    })),
  );

  const internalLinks = await Promise.all(
    (post.internalLinks ?? []).map(async (link) => ({
      ...link,
      title: await translateText(link.title, locale),
    })),
  );

  const externalReferences = await Promise.all(
    (post.externalReferences ?? []).map(async (reference) => ({
      ...reference,
      title: await translateText(reference.title, locale),
      publisher: await translateText(reference.publisher, locale),
      description: await translateText(reference.description, locale),
    })),
  );

  const referenceImages = await Promise.all(
    (post.referenceImages ?? []).map(async (image) => ({
      ...image,
      alt: await translateText(image.alt, locale),
      caption: await translateText(image.caption, locale),
      label: await translateText(image.label, locale),
      sectionHeading: image.sectionHeading ? await translateText(image.sectionHeading, locale) : undefined,
    })),
  );

  const comparisonTable = await Promise.all(
    (post.comparisonTable ?? []).map(async (item) => ({
      ...item,
      name: await translateText(item.name, locale),
      price: await translateText(item.price, locale),
      keyFeatures: await translateMany(item.keyFeatures, locale),
      verdict: await translateText(item.verdict, locale),
    })),
  );

  const cta = post.cta
    ? {
        ...post.cta,
        title: await translateText(post.cta.title, locale),
        description: await translateText(post.cta.description, locale),
        label: await translateText(post.cta.label, locale),
      }
    : undefined;

  const faq = await Promise.all(
    (post.faq ?? []).map(async (item) => ({
      question: await translateText(item.question, locale),
      answer: await translateText(item.answer, locale),
    })),
  );

  return {
    ...post,
    title,
    description,
    category,
    author,
    tags,
    imageAlt: await translateText(post.imageAlt, locale),
    content,
    introduction,
    sections,
    conclusion,
    keyTakeaways,
    internalLinks,
    externalReferences,
    referenceImages,
    comparisonTable,
    cta,
    faq,
  };
}

export async function localizeBlogPosts(posts: BlogPost[], locale: SiteLocale) {
  return Promise.all(posts.map((post) => localizeBlogPost(post, locale)));
}