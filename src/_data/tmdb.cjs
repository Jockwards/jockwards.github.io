const EleventyFetch = require("@11ty/eleventy-fetch");
const { readCache, writeCache } = require("./apiCache.cjs");

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function getTmdbData(id, type) {
  if (!id || !type) {
    return null;
  }

  const cacheFile = `tmdb-${type}-${id}.json`;
  const cached = readCache(cacheFile);
  if (cached) {
    console.log(`Using committed cache for TMDB ${type}/${id}`);
    return cached;
  }

  const url = `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=credits`;

  try {
    console.log(`Fetching from TMDB API: ${type}/${id}`);
    const data = await EleventyFetch(url, {
      duration: "1d",
      type: "json",
      verbose: false,
    });

    const returnData = {
      poster_path: data.poster_path,
      release_date: data.release_date || data.first_air_date,
      cast: data.credits?.cast?.slice(0, 6) || [],
      director: type === "movie" ? getDirector(data.credits?.crew) : null,
      creator:
        type === "tv" && data.created_by?.length > 0
          ? data.created_by.map((c) => c.name).join(", ")
          : null,
      type,
      title: data.title || data.name,
      id,
      slug: data.slug,
    };

    writeCache(cacheFile, returnData);
    return returnData;
  } catch (error) {
    console.error("Error fetching TMDb data:", error);
    return null;
  }
}

function getDirector(crew) {
  if (!crew) return "N/A";
  const director = crew.find((person) => person.job === "Director");
  return director ? director.name : "N/A";
}

module.exports = getTmdbData;
