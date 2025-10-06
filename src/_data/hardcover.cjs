require("dotenv").config();
const EleventyFetch = require("@11ty/eleventy-fetch");
const fs = require("fs");
const path = require("path");

const API_TOKEN = process.env.HARDCOVER_API_TOKEN;
const API_URL = "https://api.hardcover.app/v1/graphql";
const CACHE_DIR = path.join(__dirname, "../../.api-cache");

async function getHardcoverData(id) {
  if (!id) {
    return null;
  }

  // Ensure id is a number and handle edge cases
  const bookId = parseInt(id, 10);
  if (isNaN(bookId)) {
    // Silently return null for invalid IDs (happens during template processing)
    return null;
  }

  const cacheFile = path.join(CACHE_DIR, `hardcover-${bookId}.json`);

  // Try committed cache first
  if (fs.existsSync(cacheFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      console.log(`Using committed cache for Hardcover book ${bookId}`);
      return cached;
    } catch (e) {
      console.error("Error reading cache file:", e);
    }
  }

  const query = `
    query {
      books(where: {id: {_eq: ${bookId}}}) {
        id
        slug
        title
        subtitle
        release_date
        pages
        image {
          url
        }
        contributions(where: {author_id: {_is_null: false}}, limit: 5) {
          author {
            name
          }
        }
      }
    }
  `;

  console.log("Fetching from Hardcover API:", bookId);

  try {
    const cacheKey = `${API_URL}?bookId=${bookId}`;
    
    const data = await EleventyFetch(cacheKey, {
      duration: "1d",
      type: "json",
      verbose: false,
      fetchOptions: {
        method: "POST",
        headers: {
          "Authorization": API_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      },
    });

    if (data.errors) {
      console.error("Hardcover API errors:", data.errors);
      return null;
    }

    if (!data.data?.books?.[0]) {
      console.error("No book found with ID:", bookId);
      return null;
    }

    const book = data.data.books[0];

    const returnData = {
      cover_url: book.image?.url || null,
      release_date: book.release_date,
      pages: book.pages,
      authors: book.contributions?.map(c => c.author?.name).filter(Boolean) || [],
      title: book.title,
      subtitle: book.subtitle,
      id: bookId,
      slug: book.slug,
      type: 'book',
    };

    // Save to committed cache
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(cacheFile, JSON.stringify(returnData, null, 2));
    console.log(`Saved to committed cache: ${cacheFile}`);

    return returnData;
  } catch (error) {
    console.error("Error fetching Hardcover data:", error);
    return null;
  }
}

module.exports = getHardcoverData;
