import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage, { metadata as homeMetadata } from "@/app/page";
import AboutPage, { metadata as aboutMetadata } from "@/app/about/page";
import ContactPage, { metadata as contactMetadata } from "@/app/contact/page";
import ToolsPage, { metadata as toolsMetadata } from "@/app/tools/page";
import { metadata as blogMetadata } from "@/app/blog/page";
import BlogPostPage, {
  generateMetadata as generateBlogPostMetadata,
  generateStaticParams,
} from "@/app/blog/[slug]/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog/posts";

test("homepage renders core editorial content", () => {
  const markup = renderToStaticMarkup(HomePage());
  assert.match(markup, /TareasVirtual/i);
  assert.match(markup, /Ver articulos/i);
});

test("about, contact and tools pages render without crashing", () => {
  const aboutMarkup = renderToStaticMarkup(AboutPage());
  const contactMarkup = renderToStaticMarkup(ContactPage());
  const toolsMarkup = renderToStaticMarkup(ToolsPage());

  assert.match(aboutMarkup, /Sobre nosotros/i);
  assert.match(contactMarkup, /Contacto/i);
  assert.match(toolsMarkup, /Herramientas/i);
});

test("core page metadata exposes canonical URLs", () => {
  assert.equal(homeMetadata.alternates?.canonical, "/");
  assert.equal(aboutMetadata.alternates?.canonical, "/about");
  assert.equal(contactMetadata.alternates?.canonical, "/contact");
  assert.equal(toolsMetadata.alternates?.canonical, "/tools");
  assert.equal(blogMetadata.alternates?.canonical, "/blog");
});

test("blog static params cover all posts", async () => {
  const params = await generateStaticParams();
  assert.equal(params.length, blogPosts.length);
  assert.deepEqual(params[0], { slug: blogPosts[0].slug });
});

test("blog post metadata includes canonical and article open graph", async () => {
  const post = blogPosts[0];
  const metadata = await generateBlogPostMetadata({
    params: Promise.resolve({ slug: post.slug }),
  });

  assert.equal(metadata.alternates?.canonical, `/blog/${post.slug}`);
  assert.equal(metadata.openGraph?.type, "article");
  assert.equal(metadata.twitter?.card, "summary_large_image");
});

test("blog post page renders an existing article", async () => {
  const page = await BlogPostPage({
    params: Promise.resolve({ slug: blogPosts[0].slug }),
  });
  const markup = renderToStaticMarkup(page);

  assert.match(markup, new RegExp(blogPosts[0].title, "i"));
});

test("robots and sitemap expose crawlable routes", () => {
  const robotsConfig = robots();
  const sitemapEntries = sitemap();

  assert.equal(robotsConfig.host, "https://tareasvirtual.com");
  assert.match(String(robotsConfig.sitemap), /sitemap\.xml$/);
  assert.ok(sitemapEntries.some((entry) => entry.url === "https://tareasvirtual.com"));
  assert.ok(sitemapEntries.some((entry) => entry.url === "https://tareasvirtual.com/blog"));
  assert.ok(sitemapEntries.some((entry) => entry.url.includes("/blog/")));
});