export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  language: string;
  author: string;
  defaultOgImage: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface BlogSeoMetadata {
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
}

export interface BlogSection {
  heading: string;
  subheading?: string;
  paragraphs: string[];
}

export interface BlogLinkReference {
  title: string;
  href: string;
  type: "tool" | "post";
}

export interface BlogExternalReference {
  title: string;
  href: string;
  publisher: string;
  description: string;
}

export interface BlogReferenceImage {
  src: string;
  alt: string;
  caption: string;
  href: string;
  label: string;
  sectionHeading?: string;
}

export interface BlogComparisonOption {
  name: string;
  price: string;
  keyFeatures: string[];
  verdict: string;
}

export interface BlogCallToAction {
  title: string;
  description: string;
  href: string;
  label: string;
}

export interface BlogEditorialStandards {
  originalityRequired: boolean;
  noEmojis: boolean;
  minWords: number;
  maxWords?: number;
  updatedForYear: number;
  minToolLinks: number;
  minRelatedPostLinks: number;
}

export interface BlogPost {
  title: string;
  description: string;
  date: string;
  slug: string;
  category: string;
  tags: string[];
  image: string;
  imageAlt: string;
  author: string;
  seo?: BlogSeoMetadata;
  content?: string[];
  introduction?: string[];
  sections?: BlogSection[];
  conclusion?: string[];
  keyTakeaways?: string[];
  internalLinks?: BlogLinkReference[];
  externalReferences?: BlogExternalReference[];
  referenceImages?: BlogReferenceImage[];
  comparisonTable?: BlogComparisonOption[];
  cta?: BlogCallToAction;
  standards?: BlogEditorialStandards;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ToolItem {
  name: string;
  slug: string;
  description: string;
  category: string;
  href: string;
  detailHref: string;
  launchHref: string;
  isFeatured: boolean;
  updatedAt: string;
  intentLabel: string;
  decisionStage: string;
  primaryOutcome: string;
  bestFor: string[];
  keyBenefits: string[];
  quickSteps: string[];
  trustPoints: string[];
  useCases: string[];
  relatedPostSlugs: string[];
}
