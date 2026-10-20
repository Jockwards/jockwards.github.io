import "dotenv/config";
import { GoogleGenAI, Type } from "@google/genai";
import {
  getSourcePosts,
  isCurrent,
  LOCALE_NAMES,
  LOCALES,
  protectMarkdown,
  readTranslation,
  writeTranslation,
  type Locale,
  type SourcePost,
} from "./translation-utils";

const args = process.argv.slice(2);
const force = args.includes("--force");
const slug = readFlag("--slug");
const localeFlag = readFlag("--locale");
const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash-lite";
const apiKey = process.env.GEMINI_API_KEY;

const locales = localeFlag
  ? localeFlag.split(",").map((value) => value.trim()) as Locale[]
  : LOCALES;

for (const locale of locales) {
  if (!LOCALES.includes(locale)) {
    fail(`Okänd locale "${locale}". Använd en eller es.`);
  }
}

if (!apiKey) {
  fail(
    "GEMINI_API_KEY saknas. Lägg till en nyckel i .env innan du kör npm run translate.",
  );
}

const ai = new GoogleGenAI({ apiKey });
const sources = getSourcePosts().filter((source) => !slug || source.slug === slug);

if (sources.length === 0) {
  fail(
    slug
      ? `Hittade ingen källpost med slug "${slug}".`
      : "Inga källposter hittades.",
  );
}

let translatedCount = 0;
let skippedCount = 0;

for (const source of sources) {
  for (const locale of locales) {
    const existing = readTranslation(locale, source.slug);

    if (existing && !force && isCurrent(source, existing, locale)) {
      skippedCount += 1;
      continue;
    }

    console.log(`Översätter ${source.slug} till ${LOCALE_NAMES[locale]}...`);

    try {
      const result = await translatePost(source, locale);
      const file = writeTranslation(source, locale, result.translated, result.model);
      console.log(`  Skrev ${file}`);
      translatedCount += 1;
    } catch (error) {
      console.error(`  Misslyckades: ${error instanceof Error ? error.message : error}`);
      process.exitCode = 1;
    }
  }
}

console.log(`\nKlart: ${translatedCount} översättning(ar) skrivna, ${skippedCount} redan aktuella.`);

async function translatePost(source: SourcePost, locale: Locale) {
  const protectedBody = protectMarkdown(source.body);
  const sourceTitle = stringValue(source.data.title);
  const sourceDescription = stringValue(source.data.description);

  const prompt = `You are translating a personal Swedish technology and culture blog into ${LOCALE_NAMES[locale]}.

Translate the title, description, and body naturally. Keep the author's informal, personal tone. Preserve proper names, film and book titles, Markdown formatting, URLs, image paths, and HTML exactly. Do not add explanations or new content.

The body contains placeholders like [[0]], [[1]], etc. These represent URLs, images, and HTML that must not be changed. Keep every placeholder exactly as written, including the brackets, and do not renumber them.

Return only JSON with these string fields:
- title: the translated title
- description: the translated description (empty if the source description is empty)
- body: the translated Markdown body

SOURCE TITLE:
${sourceTitle}

SOURCE DESCRIPTION:
${sourceDescription || "(empty)"}

SOURCE BODY:
${protectedBody.protectedBody}`;

  const models = [...new Set([model, fallbackModel])];
  let lastError: unknown;

  for (const candidateModel of models) {
    try {
      const response = await ai.models.generateContent({
        model: candidateModel,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              body: { type: Type.STRING },
            },
            required: ["title", "description", "body"],
          },
          temperature: 0.2,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Modellen returnerade inget svar.");
      }

      const parsed = JSON.parse(text) as {
        title?: unknown;
        description?: unknown;
        body?: unknown;
      };

      if (
        typeof parsed.title !== "string" ||
        typeof parsed.description !== "string" ||
        typeof parsed.body !== "string"
      ) {
        throw new Error("Modellen returnerade ogiltig JSON.");
      }

      return {
        model: candidateModel,
        translated: {
          title: parsed.title.trim(),
          description: parsed.description.trim(),
          body: protectedBody.restore(parsed.body),
        },
      };
    } catch (error) {
      lastError = error;
      if (candidateModel !== models.at(-1)) {
        console.warn(
          `  Modellen ${candidateModel} misslyckades, provar ${models.at(-1)}...`,
        );
      }
    }
  }

  throw lastError;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readFlag(name: string): string | undefined {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
