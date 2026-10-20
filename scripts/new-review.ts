import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { stringifyFrontmatter } from "./frontmatter";
import { getHardcoverData, searchHardcover } from "../src/lib/hardcover";
import { getTmdbData, searchTmdb } from "../src/lib/tmdb";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts/sv");
const args = process.argv.slice(2);

type MediaType = "movie" | "tv" | "book";

const rl = readline.createInterface({ input: stdin, output: stdout });

try {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`Användning:
  npm run new:review -- [titel] --type movie|tv|book [--id 123] [--rating 8] [--tags recensioner,teknologi]

Exempel:
  npm run new:review -- "Dune" --type movie
  npm run new:review -- --type book --id 369692`);
    process.exit(0);
  }

  const type = await resolveMediaType();
  const id = readFlag("--id");
  const ratingFlag = readFlag("--rating");
  const tagsFlag = readFlag("--tags");
  const titleArg = positionalArgs().join(" ").trim();

  if (type === "book") {
    await createBookReview({ id, titleArg, ratingFlag, tagsFlag });
  } else {
    await createScreenReview({ type, id, titleArg, ratingFlag, tagsFlag });
  }
} finally {
  rl.close();
}

async function resolveMediaType(): Promise<MediaType> {
  const flag = readFlag("--type");
  if (flag) {
    const normalized = flag.toLowerCase();
    if (normalized === "movie" || normalized === "tv" || normalized === "book") {
      return normalized;
    }
    throw new Error(`Ogiltig typ "${flag}". Använd movie, tv eller book.`);
  }

  const answer = (await rl.question("Typ (movie/tv/book): "))
    .trim()
    .toLowerCase();

  if (answer === "movie" || answer === "tv" || answer === "book") {
    return answer;
  }

  throw new Error("Du måste välja movie, tv eller book.");
}

async function createScreenReview(options: {
  type: "movie" | "tv";
  id?: string;
  titleArg: string;
  ratingFlag?: string;
  tagsFlag?: string;
}) {
  let tmdbId = options.id ? Number.parseInt(options.id, 10) : null;

  if (!tmdbId) {
    const query =
      options.titleArg || (await rl.question("Titel att söka efter: ")).trim();

    if (!query) {
      throw new Error("Du måste ange en titel eller ett TMDB-id.");
    }

    const results = await searchTmdb(query, options.type);
    if (results.length === 0) {
      throw new Error(`Inga TMDB-träffar för "${query}".`);
    }

    const selected = await selectResult(results, (result) => {
      const year = result.releaseDate?.slice(0, 4) || "?";
      return `${result.title} (${year})`;
    });
    tmdbId = selected.id;
  }

  const data = await getTmdbData(tmdbId, options.type);
  if (!data) {
    throw new Error(`Kunde inte hämta TMDB-data för ${tmdbId}.`);
  }

  const rating = await resolveRating(options.ratingFlag);
  const tags = await resolveTags(options.tagsFlag);
  const description =
    (await rl.question(`Beskrivning [Mina tankar om ${data.title}]: `)).trim() ||
    `Mina tankar om ${data.title}`;

  const frontmatter = {
    title: data.title,
    date: new Date().toISOString().slice(0, 10),
    lang: "sv",
    description,
    tmdb_id: data.id,
    tmdb_type: data.type,
    review_score: rating,
    tags,
  };

  writePost(data.title, frontmatter, "Skriv din recension här.\n");
}

async function createBookReview(options: {
  id?: string;
  titleArg: string;
  ratingFlag?: string;
  tagsFlag?: string;
}) {
  let bookId = options.id ? Number.parseInt(options.id, 10) : null;

  if (!bookId) {
    const query =
      options.titleArg || (await rl.question("Titel att söka efter: ")).trim();

    if (!query) {
      throw new Error("Du måste ange en titel eller ett Hardcover-id.");
    }

    const results = await searchHardcover(query);
    if (results.length === 0) {
      throw new Error(`Inga Hardcover-träffar för "${query}".`);
    }

    const selected = await selectResult(results, (result) => {
      const authors = result.authors.length ? ` – ${result.authors.join(", ")}` : "";
      return `${result.title}${authors}`;
    });
    bookId = selected.id;
  }

  const data = await getHardcoverData(bookId);
  if (!data) {
    throw new Error(`Kunde inte hämta Hardcover-data för ${bookId}.`);
  }

  const rating = await resolveRating(options.ratingFlag);
  const tags = await resolveTags(options.tagsFlag);
  const description =
    (await rl.question(`Beskrivning [Mina tankar om ${data.title}]: `)).trim() ||
    `Mina tankar om ${data.title}`;

  const frontmatter = {
    title: data.title,
    date: new Date().toISOString().slice(0, 10),
    lang: "sv",
    description,
    hardcover_id: data.id,
    review_score: rating,
    tags,
  };

  writePost(data.title, frontmatter, "Skriv din recension här.\n");
}

async function selectResult<T>(
  results: T[],
  format: (result: T) => string,
): Promise<T> {
  console.log("\nTräffar:");
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${format(result)}`);
  });

  const answer = (await rl.question(`Välj 1-${results.length} [1]: `)).trim();
  const index = answer ? Number.parseInt(answer, 10) - 1 : 0;

  if (!Number.isInteger(index) || index < 0 || index >= results.length) {
    throw new Error("Ogiltigt val.");
  }

  return results[index];
}

async function resolveRating(flag?: string): Promise<number> {
  const answer = (
    flag || (await rl.question("Betyg 0-10 [7]: "))
  ).trim();
  const rating = Number.parseFloat(answer || "7");

  if (Number.isNaN(rating) || rating < 0 || rating > 10) {
    throw new Error("Betyget måste vara ett tal mellan 0 och 10.");
  }

  return rating;
}

async function resolveTags(flag?: string): Promise<string[]> {
  const answer = (
    flag || (await rl.question("Taggar, kommaseparerade [recensioner]: "))
  ).trim();
  const tags = (answer || "recensioner")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(tags)];
}

function writePost(
  title: string,
  frontmatter: Record<string, unknown>,
  body: string,
) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const slug = uniqueSlug(slugify(title));
  const file = path.join(POSTS_DIR, `${slug}.md`);
  const content = stringifyFrontmatter(body, frontmatter);
  fs.writeFileSync(file, content, { flag: "wx" });
  console.log(`\nSkapade ${path.relative(process.cwd(), file)}`);
}

function uniqueSlug(base: string): string {
  let slug = base;
  let counter = 2;

  while (fs.existsSync(path.join(POSTS_DIR, `${slug}.md`))) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/&/g, " och ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return slug || "recension";
}

function readFlag(name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function positionalArgs(): string[] {
  const flagsWithValues = new Set(["--type", "--id", "--rating", "--tags"]);
  const positional: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (flagsWithValues.has(arg)) {
      index += 1;
      continue;
    }

    if (!arg.startsWith("--")) {
      positional.push(arg);
    }
  }

  return positional;
}
