const EleventyFetch = require("@11ty/eleventy-fetch");
const { readCache, writeCache } = require("./apiCache.cjs");

const API_TOKEN = process.env.HARDCOVER_API_TOKEN;
const API_URL = "https://api.hardcover.app/v1/graphql";
const USER_ID = 49438;
const CACHE_FILE = "reading-list.json";

const STATUSES = {
  1: { name: "Want to Read", key: "wantToRead" },
  2: { name: "Currently Reading", key: "currentlyReading" },
  3: { name: "Read", key: "read" },
  4: { name: "Did Not Finish", key: "didNotFinish" },
};

function groupByAuthorAndSeries(books) {
  const grouped = {};

  books.forEach((book) => {
    const author = book.authors[0] || "Unknown Author";

    if (!grouped[author]) {
      grouped[author] = { standalone: [], series: {} };
    }

    if (book.series) {
      if (!grouped[author].series[book.series]) {
        grouped[author].series[book.series] = [];
      }
      grouped[author].series[book.series].push(book);
    } else {
      grouped[author].standalone.push(book);
    }
  });

  Object.keys(grouped).forEach((author) => {
    Object.keys(grouped[author].series).forEach((seriesName) => {
      grouped[author].series[seriesName].sort((a, b) => {
        const posA = parseFloat(a.seriesPosition) || 0;
        const posB = parseFloat(b.seriesPosition) || 0;
        return posA - posB;
      });
    });
  });

  return grouped;
}

function transformUserBooks(userBooks) {
  const groupedBooks = {
    wantToRead: [],
    currentlyReading: [],
    read: [],
    didNotFinish: [],
  };

  userBooks.forEach((item) => {
    const status = STATUSES[item.status_id];
    if (!status || !groupedBooks[status.key]) {
      return;
    }

    const bookSeries = item.book.book_series?.[0];
    groupedBooks[status.key].push({
      id: item.book.id,
      slug: item.book.slug,
      title: item.book.title,
      cover: item.book.image?.url || null,
      authors: item.book.contributions?.map((c) => c.author?.name).filter(Boolean) || [],
      series: bookSeries?.series?.name || null,
      seriesPosition: bookSeries?.position || null,
    });
  });

  groupedBooks.readGrouped = groupByAuthorAndSeries(groupedBooks.read);
  return groupedBooks;
}

async function getReadingList() {
  const cached = readCache(CACHE_FILE);
  if (cached) {
    console.log(`Using committed cache for reading list (${cached.read?.length || 0} read books)`);
    return cached;
  }

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
          book_series {
            series {
              name
            }
            position
          }
        }
      }
    }
  `;

  try {
    console.log("Fetching reading list from Hardcover API");
    const data = await EleventyFetch(API_URL, {
      duration: "1h",
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
      console.error("Hardcover reading list API errors:", data.errors);
      return {};
    }

    const userBooks = data.data?.user_books || [];
    console.log(`Hardcover reading list retrieved: ${userBooks.length} books`);

    const groupedBooks = transformUserBooks(userBooks);
    writeCache(CACHE_FILE, groupedBooks);
    return groupedBooks;
  } catch (error) {
    console.error("Error fetching reading list:", error);
    return {};
  }
}

module.exports = getReadingList;
