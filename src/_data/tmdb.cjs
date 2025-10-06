require("dotenv").config();
const fetch = require("node-fetch");

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function getTmdbData(id, type) {
  if (!id || !type) {
    return null;
  }

  const url = `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=credits`;
  console.log("Fetching TMDb data from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `TMDb API error: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data = await response.json();
    console.log("TMDb API response:", data);

    // For movies, get director. For TV shows, get creator
    const director = type === 'movie' ? getDirector(data.credits?.crew) : null;
    const creator = type === 'tv' && data.created_by?.length > 0 
      ? data.created_by.map(c => c.name).join(', ') 
      : null;

    const returnData = {
      poster_path: data.poster_path,
      release_date: data.release_date || data.first_air_date,
      cast: data.credits?.cast?.slice(0, 5) || [], // Get the first 5 cast members
      director: director,
      creator: creator,
      type: type,
      title: data.title || data.name, // Movie title or TV show name
      id: id,
    };
    console.log("Returning TMDb data:", returnData);
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
