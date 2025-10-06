require("dotenv").config();
const EleventyFetch = require("@11ty/eleventy-fetch");

const API_TOKEN = process.env.HARDCOVER_API_TOKEN;
const API_URL = "https://api.hardcover.app/v1/graphql";
const USER_ID = 49438;

// Status mapping based on Hardcover
const STATUSES = {
  1: { name: "Want to Read", key: "wantToRead" },
  2: { name: "Currently Reading", key: "currentlyReading" },
  3: { name: "Read", key: "read" },
  4: { name: "Did Not Finish", key: "didNotFinish" },
};

async function getReadingList() {
  const query = `
    query {
      user_books(where: {user_id: {_eq: ${USER_ID}}}, order_by: {updated_at: desc}) {
        status_id
        book {
          id
          slug
          title
          image {
            url
          }
          contributions(where: {author_id: {_is_null: false}}, limit: 2) {
            author {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const data = await EleventyFetch(API_URL, {
      duration: "1h", // Cache for 1 hour (shorter for reading list updates)
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
      console.error("Hardcover reading list API errors:", data.errors);
      return {};
    }

    const userBooks = data.data?.user_books || [];
    console.log(`Hardcover reading list retrieved: ${userBooks.length} books`);

    // Group books by status
    const groupedBooks = {
      wantToRead: [],
      currentlyReading: [],
      read: [],
      didNotFinish: [],
    };

    userBooks.forEach(item => {
      const status = STATUSES[item.status_id];
      if (status && groupedBooks[status.key]) {
        groupedBooks[status.key].push({
          id: item.book.id,
          slug: item.book.slug,
          title: item.book.title,
          cover: item.book.image?.url || null,
          authors: item.book.contributions?.map(c => c.author?.name).filter(Boolean) || [],
        });
      }
    });

    return groupedBooks;
  } catch (error) {
    console.error("Error fetching reading list:", error);
    return {};
  }
}

module.exports = getReadingList;
