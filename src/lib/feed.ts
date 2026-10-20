import rss from "@astrojs/rss";
import { LOCALE_META, type Locale } from "./i18n";
import { getPosts, postPath } from "./posts";

export async function createFeed(
  locale: Locale,
  siteUrl: string | URL,
): Promise<Response> {
  const posts = await getPosts(locale);
  const meta = LOCALE_META[locale];

  return rss({
    title: meta.siteTitle,
    description: meta.siteDescription,
    site: siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || post.data.title,
      link: postPath(post),
    })),
    customData: `<language>${meta.htmlLang}</language>`,
  });
}
