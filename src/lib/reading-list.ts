import { readCache, writeCache } from "./cache";
import { getEnv } from "./env";

const API_TOKEN = getEnv("HARDCOVER_API_TOKEN");
const API_URL = "https://api.hardcover.app/v1/graphql";
const USER_ID = 49438;
const CACHE_FILE = "reading-list.json";

const STATUSES: Record<number, "wantToRead" | "currentlyReading" | "read" | "didNotFinish"> = {
  1: "wantToRead",
  2: "currentlyReading",
  3: "read",
  4: "didNotFinish",
};

export type Book = {
  id: number;
  slug: string;
  title: string;
  cover: string | null;
  authors: string[];
  series: string | null;
  seriesPosition: string | null;
};

export type AuthorGroup = {
  standalone: Book[];
  series: Record<string, Book[]>;
};

export type ReadingList = {
  wantToRead: Book[];
  currentlyReading: Book[];
  read: Book[];
  didNotFinish: Book[];
  readGrouped: Record<string, AuthorGroup>;
};

type HardcoverUserBook = {
  status_id: number;
  book: {
    id: number;
    slug: string;
    title: string;
    image?: { url?: string | null };
    contributions?: Array<{ author?: { name?: string } }>;
    book_series?: Array<{
      series?: { name?: string };
      position?: string | number | null;
    }>;
  };
};

type HardcoverResponse = {
  errors?: unknown;
  data?: {
    user_books?: HardcoverUserBook[];
  };
};

export async function getReadingList(): Promise<ReadingList> {
  const cached = readCache<ReadingList>(CACHE_FILE);
  if (cached) {
    return cached;
  }

  if (!API_TOKEN) {
    console.error(
      "HARDCOVER_API_TOKEN is missing and no reading-list cache is available",
    );
    return emptyReadingList();
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
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Hardcover responded with ${response.status}`);
    }

    const data = (await response.json()) as HardcoverResponse;

    if (data.errors) {
      console.error("Hardcover reading list API errors:", data.errors);
      return emptyReadingList();
    }

    const readingList = transformUserBooks(data.data?.user_books || []);
    writeCache(CACHE_FILE, readingList);
    return readingList;
  } catch (error) {
    console.error("Error fetching reading list:", error);
    return emptyReadingList();
  }
}

function emptyReadingList(): ReadingList {
  return {
    wantToRead: [],
    currentlyReading: [],
    read: [],
    didNotFinish: [],
    readGrouped: {},
  };
}

function transformUserBooks(userBooks: HardcoverUserBook[]): ReadingList {
  const groupedBooks = emptyReadingList();

  userBooks.forEach((item) => {
    const status = STATUSES[item.status_id];
    if (!status) {
      return;
    }

    const bookSeries = item.book.book_series?.[0];
    groupedBooks[status].push({
      id: item.book.id,
      slug: item.book.slug,
      title: item.book.title,
      cover: item.book.image?.url || null,
      authors:
        item.book.contributions
          ?.map((contribution) => contribution.author?.name)
          .filter((name): name is string => Boolean(name)) || [],
      series: bookSeries?.series?.name || null,
      seriesPosition:
        bookSeries?.position === null || bookSeries?.position === undefined
          ? null
          : String(bookSeries.position),
    });
  });

  groupedBooks.readGrouped = groupByAuthorAndSeries(groupedBooks.read);
  return groupedBooks;
}

function groupByAuthorAndSeries(books: Book[]): Record<string, AuthorGroup> {
  const grouped: Record<string, AuthorGroup> = {};

  books.forEach((book) => {
    const author = book.authors[0] || "Okänd författare";

    if (!grouped[author]) {
      grouped[author] = { standalone: [], series: {} };
    }

    if (book.series) {
      grouped[author].series[book.series] ??= [];
      grouped[author].series[book.series].push(book);
    } else {
      grouped[author].standalone.push(book);
    }
  });

  Object.values(grouped).forEach((author) => {
    Object.values(author.series).forEach((series) => {
      series.sort(
        (a, b) =>
          (Number.parseFloat(a.seriesPosition || "0") || 0) -
          (Number.parseFloat(b.seriesPosition || "0") || 0),
      );
    });
  });

  return grouped;
}
