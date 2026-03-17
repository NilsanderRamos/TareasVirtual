import { SiteLocale } from "@/lib/i18n";
import { translateMany, translateText } from "@/lib/translation";
import { BlogPost, ToolItem } from "@/types";

export async function localizeToolItem(tool: ToolItem, locale: SiteLocale): Promise<ToolItem> {
  if (locale === "es") {
    return tool;
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