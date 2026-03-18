import type { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog/posts";
import { siteConfig } from "@/config/site";
import { getAllBlogHubs, getBlogHubPath } from "@/lib/blog-topics";

const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/tools",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/blog" || route === "/tools" ? 0.9 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const hubEntries: MetadataRoute.Sitemap = getAllBlogHubs().map((hub) => ({
    url: `${siteConfig.url}${getBlogHubPath(hub.slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticEntries, ...blogEntries, ...hubEntries];
}