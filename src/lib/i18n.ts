export type Locale = "sv" | "en" | "es";

export const LOCALES = ["sv", "en", "es"] as const;
export const DEFAULT_LOCALE: Locale = "sv";

export const LOCALE_META: Record<
  Locale,
  {
    htmlLang: string;
    ogLocale: string;
    dateLocale: string;
    label: string;
    shortLabel: string;
    siteTitle: string;
    siteDescription: string;
    feedPath: string;
  }
> = {
  sv: {
    htmlLang: "sv",
    ogLocale: "sv_SE",
    dateLocale: "sv-SE",
    label: "Svenska",
    shortLabel: "SV",
    siteTitle: "Jocke på internet",
    siteDescription: "En blogg om foto, teknik och slumpmässiga tankar",
    feedPath: "/feed.xml",
  },
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    dateLocale: "en-US",
    label: "English",
    shortLabel: "EN",
    siteTitle: "Jocke on the internet",
    siteDescription: "A blog about photography, tech and random thoughts",
    feedPath: "/en/feed.xml",
  },
  es: {
    htmlLang: "es",
    ogLocale: "es_ES",
    dateLocale: "es-ES",
    label: "Español",
    shortLabel: "ES",
    siteTitle: "Jocke en internet",
    siteDescription:
      "Un blog sobre fotografía, tecnología y pensamientos aleatorios",
    feedPath: "/es/feed.xml",
  },
};

type UIStrings = {
  nav: { home: string; blog: string; readingList: string; rss: string };
  homeDescription: string;
  latestPosts: string;
  noPosts: string;
  blogDescription: string;
  allPosts: string;
  readingListDescription: string;
  readingList: string;
  currentlyReading: string;
  wantToRead: string;
  read: string;
  didNotFinish: string;
  tagPageTitle: (tag: string) => string;
  noTaggedPosts: string;
  filterAria: string;
  allTags: string;
  filterStatus: (visible: number, total: number) => string;
  filterStatusTemplate: string;
  filterStatusInitial: string;
  backAria: string;
  skipToContent: string;
  switchToLight: string;
  switchToDark: string;
  mainNav: string;
  language: string;
  rating: (score: number) => string;
  excerptScorePrefix: string;
  readMore: string;
  translationNotice: string;
  readOriginal: string;
  viewOnTmdb: string;
  viewOnHardcover: string;
  posterAlt: (title: string) => string;
  coverAlt: (title: string) => string;
  premiereDate: string;
  creator: string;
  director: string;
  cast: string;
  releaseDate: string;
  pages: string;
  authors: string;
  tag: string;
};

export const ui: Record<Locale, UIStrings> = {
  sv: {
    nav: { home: "Hem", blog: "Blogg", readingList: "Läslista", rss: "RSS" },
    homeDescription:
      "En modern men lite nördig blogg om teknik, kod och slumpmässiga tankar från Jocke",
    latestPosts: "Senaste inlägg",
    noPosts: "Inga inlägg ännu.",
    blogDescription: "Alla blogginlägg",
    allPosts: "Alla inlägg",
    readingListDescription: "Mina böcker från Hardcover",
    readingList: "Läslista",
    currentlyReading: "Läser nu",
    wantToRead: "Vill läsa",
    read: "Lästa",
    didNotFinish: "Lade ner",
    tagPageTitle: (tag) => `Inlägg taggade med "${tag}"`,
    noTaggedPosts: "Inga inlägg hittades med denna tagg.",
    filterAria: "Filtrera inlägg efter kategorier",
    allTags: "Alla",
    filterStatus: (visible, total) =>
      `Visar ${visible} av ${total} inlägg.`,
    filterStatusTemplate: "Visar {visible} av {total} inlägg.",
    filterStatusInitial: "Visar alla inlägg.",
    backAria: "Tillbaka",
    skipToContent: "Hoppa till innehållet",
    switchToLight: "Växla till ljust tema",
    switchToDark: "Växla till mörkt tema",
    mainNav: "Huvudmeny",
    language: "Språk",
    rating: (score) => `Betyg ${score} av 10`,
    excerptScorePrefix: "Betyg",
    readMore: "Läs mer →",
    translationNotice: "Det här är en AI-översättning.",
    readOriginal: "Läs originalet på svenska",
    viewOnTmdb: "Visa på TMDB",
    viewOnHardcover: "Visa på Hardcover",
    posterAlt: (title) => `Poster för ${title}`,
    coverAlt: (title) => `Omslag för ${title}`,
    premiereDate: "Premiärdatum",
    creator: "Skapare",
    director: "Regissör",
    cast: "Skådespelare",
    releaseDate: "Utgivningsdatum",
    pages: "Sidor",
    authors: "Författare",
    tag: "Tagg",
  },
  en: {
    nav: { home: "Home", blog: "Blog", readingList: "Reading list", rss: "RSS" },
    homeDescription:
      "A slightly nerdy blog about tech, code and random thoughts from Jocke",
    latestPosts: "Latest posts",
    noPosts: "No posts yet.",
    blogDescription: "All blog posts",
    allPosts: "All posts",
    readingListDescription: "My books from Hardcover",
    readingList: "Reading list",
    currentlyReading: "Currently reading",
    wantToRead: "Want to read",
    read: "Read",
    didNotFinish: "Did not finish",
    tagPageTitle: (tag) => `Posts tagged with "${tag}"`,
    noTaggedPosts: "No posts found with this tag.",
    filterAria: "Filter posts by category",
    allTags: "All",
    filterStatus: (visible, total) =>
      `Showing ${visible} of ${total} posts.`,
    filterStatusTemplate: "Showing {visible} of {total} posts.",
    filterStatusInitial: "Showing all posts.",
    backAria: "Back",
    skipToContent: "Skip to content",
    switchToLight: "Switch to light theme",
    switchToDark: "Switch to dark theme",
    mainNav: "Main menu",
    language: "Language",
    rating: (score) => `Rating ${score} out of 10`,
    excerptScorePrefix: "Rating",
    readMore: "Read more →",
    translationNotice: "This is an AI translation.",
    readOriginal: "Read the original in Swedish",
    viewOnTmdb: "View on TMDB",
    viewOnHardcover: "View on Hardcover",
    posterAlt: (title) => `Poster for ${title}`,
    coverAlt: (title) => `Cover for ${title}`,
    premiereDate: "Release date",
    creator: "Creator",
    director: "Director",
    cast: "Cast",
    releaseDate: "Published",
    pages: "Pages",
    authors: "Authors",
    tag: "Tag",
  },
  es: {
    nav: {
      home: "Inicio",
      blog: "Blog",
      readingList: "Lista de lectura",
      rss: "RSS",
    },
    homeDescription:
      "Un blog un poco nerd sobre tecnología, código y pensamientos aleatorios de Jocke",
    latestPosts: "Últimas entradas",
    noPosts: "Todavía no hay entradas.",
    blogDescription: "Todas las entradas del blog",
    allPosts: "Todas las entradas",
    readingListDescription: "Mis libros de Hardcover",
    readingList: "Lista de lectura",
    currentlyReading: "Leyendo ahora",
    wantToRead: "Quiero leer",
    read: "Leídos",
    didNotFinish: "Abandonados",
    tagPageTitle: (tag) => `Entradas etiquetadas con "${tag}"`,
    noTaggedPosts: "No se encontraron entradas con esta etiqueta.",
    filterAria: "Filtrar entradas por categoría",
    allTags: "Todas",
    filterStatus: (visible, total) =>
      `Mostrando ${visible} de ${total} entradas.`,
    filterStatusTemplate: "Mostrando {visible} de {total} entradas.",
    filterStatusInitial: "Mostrando todas las entradas.",
    backAria: "Volver",
    skipToContent: "Saltar al contenido",
    switchToLight: "Cambiar al tema claro",
    switchToDark: "Cambiar al tema oscuro",
    mainNav: "Menú principal",
    language: "Idioma",
    rating: (score) => `Puntuación ${score} de 10`,
    excerptScorePrefix: "Puntuación",
    readMore: "Leer más →",
    translationNotice: "Esta es una traducción automática.",
    readOriginal: "Leer el original en sueco",
    viewOnTmdb: "Ver en TMDB",
    viewOnHardcover: "Ver en Hardcover",
    posterAlt: (title) => `Póster de ${title}`,
    coverAlt: (title) => `Portada de ${title}`,
    premiereDate: "Fecha de estreno",
    creator: "Creador",
    director: "Director",
    cast: "Reparto",
    releaseDate: "Publicación",
    pages: "Páginas",
    authors: "Autores",
    tag: "Etiqueta",
  },
};

const TAG_LABELS: Record<Locale, Record<string, string>> = {
  sv: {},
  en: {
    teknologi: "technology",
    personligt: "personal",
    foto: "photo",
    övrigt: "other",
    recensioner: "reviews",
  },
  es: {
    teknologi: "tecnología",
    personligt: "personal",
    foto: "fotografía",
    övrigt: "otros",
    recensioner: "reseñas",
  },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function tagLabel(tag: string, locale: Locale): string {
  return TAG_LABELS[locale][tag] ?? tag;
}

export function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (locale === DEFAULT_LOCALE) {
    return normalized;
  }

  return normalized === "/" ? `/${locale}/` : `/${locale}${normalized}`;
}

export function allAlternates(path: string): Record<Locale, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, localePath(locale, path)]),
  ) as Record<Locale, string>;
}
