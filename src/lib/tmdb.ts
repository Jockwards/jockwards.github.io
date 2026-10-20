import { readCache, writeCache } from "./cache";
import { getEnv } from "./env";

const API_KEY = getEnv("TMDB_API_KEY");
const BASE_URL = "https://api.themoviedb.org/3";

export type TmdbPerson = {
  name: string;
  character?: string;
};

export type TmdbSearchResult = {
  id: number;
  title: string;
  releaseDate: string | null;
  overview: string;
};

export type TmdbData = {
  poster_path: string | null;
  release_date: string | null;
  cast: TmdbPerson[];
  director: string | null;
  creator: string | null;
  type: "movie" | "tv";
  title: string;
  id: number;
  slug?: string;
};

type TmdbResponse = {
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  credits?: {
    cast?: Array<{ name?: string; character?: string }>;
    crew?: Array<{ job?: string; name?: string }>;
  };
  created_by?: Array<{ name?: string }>;
  title?: string;
  name?: string;
  slug?: string;
};

type TmdbSearchResponse = {
  results?: Array<{
    id: number;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    overview?: string;
  }>;
};

export async function searchTmdb(
  query: string,
  type: "movie" | "tv",
): Promise<TmdbSearchResult[]> {
  if (!API_KEY) {
    throw new Error("TMDB_API_KEY is missing");
  }

  const url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=sv-SE`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB search responded with ${response.status}`);
  }

  const data = (await response.json()) as TmdbSearchResponse;

  return (data.results || []).slice(0, 5).map((result) => ({
    id: result.id,
    title: result.title || result.name || "Okänd titel",
    releaseDate: result.release_date || result.first_air_date || null,
    overview: result.overview || "",
  }));
}

export async function getTmdbData(
  id: number,
  type: "movie" | "tv",
): Promise<TmdbData | null> {
  if (!id || !type) {
    return null;
  }

  const cacheFile = `tmdb-${type}-${id}.json`;
  const cached = readCache<TmdbData>(cacheFile);
  if (cached) {
    return cached;
  }

  if (!API_KEY) {
    console.error(`TMDB_API_KEY is missing; cannot fetch ${type}/${id}`);
    return null;
  }

  const url = `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=credits`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB responded with ${response.status}`);
    }

    const data = (await response.json()) as TmdbResponse;

    const returnData: TmdbData = {
      poster_path: data.poster_path ?? null,
      release_date: data.release_date || data.first_air_date || null,
      cast:
        data.credits?.cast?.slice(0, 6).map((actor) => ({
          name: actor.name || "",
          character: actor.character,
        })) || [],
      director: type === "movie" ? getDirector(data.credits?.crew) : null,
      creator:
        type === "tv" && data.created_by?.length
          ? data.created_by.map((creator) => creator.name).filter(Boolean).join(", ")
          : null,
      type,
      title: data.title || data.name || "",
      id,
      slug: data.slug,
    };

    writeCache(cacheFile, returnData);
    return returnData;
  } catch (error) {
    console.error("Error fetching TMDB data:", error);
    return null;
  }
}

function getDirector(
  crew: Array<{ job?: string; name?: string }> | undefined,
): string | null {
  if (!crew) {
    return null;
  }

  return crew.find((person) => person.job === "Director")?.name || null;
}
