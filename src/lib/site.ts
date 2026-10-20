export const site = {
  url: import.meta.env.SITE_URL || "https://jockeinter.net",
  title: "Jocke på internet",
  description: "En blogg om foto, teknik och slumpmässiga tankar",
  author: "Jocke",
  language: "sv",
  feedPath: "/feed.xml",
} as const;

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, site.url).toString();
}
