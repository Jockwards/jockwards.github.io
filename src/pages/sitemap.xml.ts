import type { APIRoute } from "astro";
import { LOCALES, localePath } from "../lib/i18n";
import { getPosts, getTags, postSlug } from "../lib/posts";
import { site } from "../lib/site";

type SitemapEntry = {
  path: string;
  lastmod?: Date;
};

export const GET: APIRoute = async (context) => {
  const base = (context.site ?? new URL(site.url)).toString().replace(/\/$/, "");
  const entries: SitemapEntry[] = [];

  for (const locale of LOCALES) {
    const posts = await getPosts(locale);
    const tags = await getTags(locale);
    const latestPostDate = posts[0]?.data.date;

    entries.push(
      { path: localePath(locale, "/"), lastmod: latestPostDate },
      { path: localePath(locale, "/pages/blog/"), lastmod: latestPostDate },
      { path: localePath(locale, "/pages/reading-list/") },
      ...posts.map((post) => ({
        path: localePath(locale, `/posts/${postSlug(post)}/`),
        lastmod: post.data.date,
      })),
      ...tags.map((tag) => {
        const tagPosts = posts.filter((post) =>
          post.data.tags.includes(tag.name),
        );
        return {
          path: localePath(locale, `/tags/${tag.slug}/`),
          lastmod: tagPosts[0]?.data.date,
        };
      }),
    );
  }

  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod
        ? `\n    <lastmod>${entry.lastmod.toISOString().split("T")[0]}</lastmod>`
        : "";
      return `  <url>\n    <loc>${escapeXml(`${base}${entry.path}`)}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
