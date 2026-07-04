const EleventyFetch = require("@11ty/eleventy-fetch");
const { readCache, writeCache } = require("./apiCache.cjs");

const API_TOKEN = process.env.HARDCOVER_API_TOKEN;
const API_URL = "https://api.hardcover.app/v1/graphql";

async function getHardcoverData(id) {
  if (!id) {
    return null;
  }

  const bookId = parseInt(id, 10);
  if (isNaN(bookId)) {
    return null;
  }

  const cacheFile = `hardcover-${bookId}.json`;
  const cached = readCache(cacheFile);
  if (cached) {
    console.log(`Using committed cache for Hardcover book ${bookId}`);
    return cached;
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
    const data = await EleventyFetch(`${API_URL}?bookId=${bookId}`, {
      duration: "1d",
      type: "json",
      verbose: false,
      fetchOptions: {
        method: "POST",
        headers: {
          Authorization: API_TOKEN,
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
      authors: book.contributions?.map((c) => c.author?.name).filter(Boolean) || [],
      title: book.title,
      subtitle: book.subtitle,
      id: bookId,
      slug: book.slug,
      type: "book",
    };

    writeCache(cacheFile, returnData);
    return returnData;
  } catch (error) {
    console.error("Error fetching Hardcover data:", error);
    return null;
  }
}

module.exports = getHardcoverData;
