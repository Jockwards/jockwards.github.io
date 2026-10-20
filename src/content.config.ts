import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z
    .string()
    .nullish()
    .transform((value) => value ?? ""),
  tags: z.array(z.string()).default([]),
  lang: z.string().default("sv"),
  review_score: z.number().min(0).max(10).optional(),
  tmdb_id: z.number().int().positive().optional(),
  tmdb_type: z.enum(["movie", "tv"]).optional(),
  hardcover_id: z.union([z.number().int().positive(), z.string()]).optional(),
  translationOf: z.string().optional(),
  sourceHash: z.string().optional(),
  aiTranslated: z.boolean().optional(),
  translationModel: z.string().optional(),
  translatedAt: z.coerce.date().optional(),
});

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: postSchema,
});

export const collections = { posts };
