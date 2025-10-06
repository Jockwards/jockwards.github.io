require("dotenv").config();
const EleventyFetch = require("@11ty/eleventy-fetch");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const CACHE_DIR = path.join(__dirname, "../../.api-cache");

async function getTmdbData(id, type) {
  if (!id || !type) {
    return null;
  }

  const cacheFile = path.join(CACHE_DIR, `tmdb-${type}-${id}.json`);

  // Try committed cache first (for Cloudflare builds)
  if (fs.existsSync(cacheFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      console.log(`Using committed cache for TMDB ${type}/${id}`);
      return cached;
    } catch (e) {
      console.error("Error reading cache file:", e);
    }
  }

  // Fetch from API if cache doesn't exist
  const url = `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=credits`;
  
  try {
    console.log(`Fetching from TMDB API: ${type}/${id}`);
    const data = await EleventyFetch(url, {
      duration: "1d",
      type: "json",
      verbose: false,
    });

    const director = type === 'movie' ? getDirector(data.credits?.crew) : null;
    const creator = type === 'tv' && data.created_by?.length > 0 
      ? data.created_by.map(c => c.name).join(', ') 
      : null;

    const returnData = {
      poster_path: data.poster_path,
      release_date: data.release_date || data.first_air_date,
      cast: data.credits?.cast?.slice(0, 5) || [],
      director: director,
      creator: creator,
      type: type,
      title: data.title || data.name,
      id: id,
      slug: data.slug,
    };

    // Save to committed cache
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(cacheFile, JSON.stringify(returnData, null, 2));
    console.log(`Saved to committed cache: ${cacheFile}`);
    
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
