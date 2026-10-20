import { getCollection, type CollectionEntry } from "astro:content";
import { isLocale, localePath, tagLabel, type Locale } from "./i18n";

export type Post = CollectionEntry<"posts">;

export const TAG_COLORS: Record<string, string> = {
  teknologi: "#3b82f6",
  personligt: "#22c55e",
  foto: "#eab308",
  övrigt: "#a855f7",
  recensioner: "#f97316",
};

export type TagInfo = {
  name: string;
  label: string;
  slug: string;
  color: string;
};

export function tagSlug(tag: string): string {
  return tag
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function tagColor(tag: string): string {
  return TAG_COLORS[tag] || "#64748b";
}

export function postLocale(post: Post): Locale {
  return isLocale(post.data.lang) ? post.data.lang : "sv";
}

export function postSlug(post: Post): string {
  return post.id.replace(/^(sv|en|es)\//, "");
}

export function postPath(post: Post): string {
  return localePath(postLocale(post), `/posts/${postSlug(post)}/`);
}

export function tagPath(tag: string, locale: Locale = "sv"): string {
  return localePath(locale, `/tags/${tagSlug(tag)}/`);
}

export async function getPosts(locale: Locale = "sv"): Promise<Post[]> {
  const posts = await getCollection("posts");
  return posts
    .filter((post) => postLocale(post) === locale)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection("posts");
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getTags(locale: Locale = "sv"): Promise<TagInfo[]> {
  const posts = await getPosts(locale);
  const names = new Set(posts.flatMap((post) => post.data.tags));

  return [...names]
    .sort((a, b) => a.localeCompare(b, "sv"))
    .map((name) => ({
      name,
      label: tagLabel(name, locale),
      slug: tagSlug(name),
      color: tagColor(name),
    }));
}

export async function getPostsByTag(
  tag: string,
  locale: Locale = "sv",
): Promise<Post[]> {
  const posts = await getPosts(locale);
  return posts.filter((post) => post.data.tags.includes(tag));
}

export function getPostAlternates(
  post: Post,
  allPosts: Post[],
): Partial<Record<Locale, string>> {
  const sourceSlug = post.data.translationOf || postSlug(post);
  const alternates: Partial<Record<Locale, string>> = {};

  for (const candidate of allPosts) {
    if ((candidate.data.translationOf || postSlug(candidate)) === sourceSlug) {
      alternates[postLocale(candidate)] = postPath(candidate);
    }
  }

  return alternates;
}
