import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Spanish",
};

const CONTENT_DIR = path.join(process.cwd(), "src/content/posts");
const SOURCE_DIR = path.join(CONTENT_DIR, "sv");

export type SourcePost = {
  slug: string;
  file: string;
  raw: string;
  body: string;
  data: Record<string, unknown>;
  hash: string;
};

export type Translation = {
  file: string;
  raw: string;
  body: string;
  data: Record<string, unknown>;
};

export function getSourcePosts(): SourcePost[] {
  return fs
    .readdirSync(SOURCE_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const fullPath = path.join(SOURCE_DIR, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const parsed = matter(raw);

      return {
        slug: path.basename(file, ".md"),
        file: fullPath,
        raw,
        body: parsed.content,
        data: parsed.data as Record<string, unknown>,
        hash: crypto.createHash("sha256").update(raw).digest("hex"),
      };
    });
}

export function readTranslation(
  locale: Locale,
  slug: string,
): Translation | null {
  const file = path.join(CONTENT_DIR, locale, `${slug}.md`);
  if (!fs.existsSync(file)) {
    return null;
  }

  const raw = fs.readFileSync(file, "utf8");
  const parsed = matter(raw);

  return {
    file,
    raw,
    body: parsed.content,
    data: parsed.data as Record<string, unknown>,
  };
}

export function isCurrent(
  source: SourcePost,
  translation: Translation,
  locale: Locale,
): boolean {
  return (
    translation.data.translationOf === source.slug &&
    translation.data.sourceHash === source.hash &&
    translation.data.lang === locale
  );
}

export function writeTranslation(
  source: SourcePost,
  locale: Locale,
  translated: { title: string; description: string; body: string },
  model: string,
) {
  const frontmatter: Record<string, unknown> = {
    title: translated.title,
    date: source.data.date,
    lang: locale,
    description: translated.description,
    tags: source.data.tags ?? [],
    translationOf: source.slug,
    sourceHash: source.hash,
    aiTranslated: true,
    translationModel: model,
    translatedAt: new Date().toISOString(),
  };

  for (const key of [
    "tmdb_id",
    "tmdb_type",
    "review_score",
    "hardcover_id",
  ]) {
    if (source.data[key] !== undefined) {
      frontmatter[key] = source.data[key];
    }
  }

  const file = path.join(CONTENT_DIR, locale, `${source.slug}.md`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, matter.stringify(translated.body, frontmatter));
  return file;
}

export function protectMarkdown(body: string): {
  protectedBody: string;
  restore: (translated: string) => string;
} {
  const protectedValues: string[] = [];

  const store = (value: string): string => {
    const token = `[[${protectedValues.length}]]`;
    protectedValues.push(value);
    return token;
  };

  let text = body;
  text = text.replace(/<lite-youtube\b[^>]*><\/lite-youtube>/gi, store);
  text = text.replace(/<svg\b[\s\S]*?<\/svg>/gi, store);
  text = text.replace(
    /(!\[[^\]]*\]\()([^)]+)(\))/g,
    (_match, prefix: string, url: string, suffix: string) =>
      `${prefix}${store(url)}${suffix}`,
  );
  text = text.replace(/https?:\/\/[^\s<>)]+/g, store);
  text = text.replace(/<[^>]+>/g, store);

  return {
    protectedBody: text,
    restore(translated: string): string {
      let restored = translated;

      protectedValues.forEach((value, index) => {
        const token = `[[${index}]]`;
        if (!restored.includes(token)) {
          throw new Error(`Översättningen tappade platshållaren ${token}.`);
        }
        restored = restored.replaceAll(token, value);
      });

      return restored;
    },
  };
}
