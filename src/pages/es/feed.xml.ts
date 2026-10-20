import type { APIRoute } from "astro";
import { createFeed } from "../../lib/feed";
import { site } from "../../lib/site";

export const GET: APIRoute = async (context) =>
  createFeed("es", context.site ?? site.url);
