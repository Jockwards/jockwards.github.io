require("dotenv").config();
const EleventyFetch = require("@11ty/eleventy-fetch");

const API_TOKEN = process.env.HARDCOVER_API_TOKEN;
const API_URL = "https://api.hardcover.app/v1/graphql";

async function getHardcoverData(id) {
  if (!id) {
    return null;
  }

  const query = `
    query {
      books(where: {id: {_eq: ${id}}}) {
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

  try {
    // Use Eleventy Fetch with caching
    const data = await EleventyFetch(API_URL, {
      duration: "1d",
      type: "json",
      verbose: true,
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
      console.error("No book found with ID:", id);
      return null;
    }

    const book = data.data.books[0];
    console.log("Hardcover data retrieved:", { id, title: book.title });

    const returnData = {
      cover_url: book.image?.url || null,
      release_date: book.release_date,
      pages: book.pages,
      authors: book.contributions?.map(c => c.author?.name).filter(Boolean) || [],
      title: book.title,
      subtitle: book.subtitle,
      id: id,
      slug: book.slug,
      type: 'book',
    };

    return returnData;
  } catch (error) {
    console.error("Error fetching Hardcover data:", error);
    return null;
  }
}

module.exports = getHardcoverData;
