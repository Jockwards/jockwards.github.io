import { readCache, writeCache } from "./cache";
import { getEnv } from "./env";

const API_TOKEN = getEnv("HARDCOVER_API_TOKEN");
const API_URL = "https://api.hardcover.app/v1/graphql";

export type HardcoverData = {
  cover_url: string | null;
  release_date: string | null;
  pages: number | null;
  authors: string[];
  title: string;
  subtitle: string | null;
  id: number;
  slug: string;
  type: "book";
};

export type HardcoverSearchResult = {
  id: number;
  title: string;
  authors: string[];
  releaseDate: string | null;
  slug: string;
};

type HardcoverSearchHit = {
  document?: {
    id?: string | number;
    title?: string;
    slug?: string;
    release_date?: string | null;
    author_names?: string[];
  };
};

type HardcoverSearchResponse = {
  errors?: unknown;
  data?: {
    search?: {
      results?: string | { hits?: HardcoverSearchHit[] };
    };
  };
};

type HardcoverResponse = {
  errors?: unknown;
  data?: {
    books?: Array<{
      id: number;
      slug: string;
      title: string;
      subtitle?: string | null;
      release_date?: string | null;
      pages?: number | null;
      image?: { url?: string | null };
      contributions?: Array<{ author?: { name?: string } }>;
    }>;
  };
};

export async function searchHardcover(
  query: string,
): Promise<HardcoverSearchResult[]> {
  if (!API_TOKEN) {
    throw new Error("HARDCOVER_API_TOKEN is missing");
  }

  const gql = `
    query {
      search(query: ${JSON.stringify(query)}, query_type: "Book", per_page: 5) {
        results
      }
    }
  `;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: gql }),
  });

  if (!response.ok) {
    throw new Error(`Hardcover search responded with ${response.status}`);
  }

  const data = (await response.json()) as HardcoverSearchResponse;
  const rawResults = data.data?.search?.results;
  const results = (
    typeof rawResults === "string" ? JSON.parse(rawResults) : rawResults
  ) as { hits?: HardcoverSearchHit[] } | undefined;

  return (results?.hits || [])
    .map((hit) => hit.document)
    .filter(
      (document): document is NonNullable<HardcoverSearchHit["document"]> =>
        Boolean(document?.id && document.title),
    )
    .slice(0, 5)
    .map((book) => ({
      id: Number(book.id),
      title: book.title || "",
      authors: book.author_names || [],
      releaseDate: book.release_date || null,
      slug: book.slug || "",
    }));
}

export async function getHardcoverData(
  id: string | number,
): Promise<HardcoverData | null> {
  const bookId = Number.parseInt(String(id), 10);
  if (!bookId || Number.isNaN(bookId)) {
    return null;
  }

  const cacheFile = `hardcover-${bookId}.json`;
  const cached = readCache<HardcoverData>(cacheFile);
  if (cached) {
    return cached;
  }

  if (!API_TOKEN) {
    console.error(`HARDCOVER_API_TOKEN is missing; cannot fetch book ${bookId}`);
    return null;
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
      console.error("Hardcover API errors:", data.errors);
      return null;
    }

    const book = data.data?.books?.[0];
    if (!book) {
      console.error("No book found with ID:", bookId);
      return null;
    }

    const returnData: HardcoverData = {
      cover_url: book.image?.url || null,
      release_date: book.release_date || null,
      pages: book.pages ?? null,
      authors:
        book.contributions
          ?.map((contribution) => contribution.author?.name)
          .filter((name): name is string => Boolean(name)) || [],
      title: book.title,
      subtitle: book.subtitle || null,
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
