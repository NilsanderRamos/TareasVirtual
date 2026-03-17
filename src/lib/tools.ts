import { blogPosts } from "@/content/blog/posts";
import { tools } from "@/content/tools";
import { BlogPost, ToolItem } from "@/types";

export function normalizeToolValue(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug) ?? null;
}

export function getRelatedPostsForTool(tool: ToolItem): BlogPost[] {
  const relatedSlugSet = new Set(tool.relatedPostSlugs);

  const relatedBySlug = blogPosts.filter((post) => relatedSlugSet.has(post.slug));

  if (relatedBySlug.length > 0) {
    return relatedBySlug;
  }

  return blogPosts
    .filter((post) => normalizeToolValue(post.category) === normalizeToolValue(tool.category))
    .slice(0, 2);
}

export function getSimilarTools(tool: ToolItem): ToolItem[] {
  return tools
    .filter((entry) => entry.slug !== tool.slug)
    .map((entry) => {
      let score = 0;

      if (entry.category === tool.category) {
        score += 4;
      }

      if (entry.decisionStage === tool.decisionStage) {
        score += 3;
      }

      if (entry.intentLabel === tool.intentLabel) {
        score += 2;
      }

      const sharedBestFor = entry.bestFor.filter((item) => tool.bestFor.includes(item)).length;
      score += sharedBestFor;

      if (entry.isFeatured) {
        score += 1;
      }

      return { entry, score };
    })
    .sort((leftTool, rightTool) => {
      return rightTool.score - leftTool.score || Number(rightTool.entry.isFeatured) - Number(leftTool.entry.isFeatured);
    })
    .map(({ entry }) => entry)
    .slice(0, 3);
}

export function getToolRelationReason(tool: ToolItem, candidate: ToolItem) {
  if (candidate.category === tool.category) {
    return `Misma categoria: ${candidate.category}`;
  }

  if (candidate.decisionStage === tool.decisionStage) {
    return `Misma etapa: ${candidate.decisionStage}`;
  }

  const sharedBestFor = candidate.bestFor.find((item) => tool.bestFor.includes(item));

  if (sharedBestFor) {
    return `Encaja tambien con ${sharedBestFor.toLowerCase()}`;
  }

  return `Complementa ${tool.name.toLowerCase()} en otro punto del flujo`;
}