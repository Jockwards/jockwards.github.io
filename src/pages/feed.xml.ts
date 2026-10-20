import type { APIRoute } from "astro";
import { createFeed } from "../lib/feed";
import { site } from "../lib/site";

export const GET: APIRoute = async (context) =>
  createFeed("sv", context.site ?? site.url);
