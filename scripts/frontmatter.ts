import { parse, stringify } from "yaml";

export type Frontmatter = Record<string, unknown>;

export function parseFrontmatter(raw: string): {
  data: Frontmatter;
  content: string;
} {
  const match = raw.match(
    /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/,
  );

  if (!match) {
    return { data: {}, content: raw };
  }

  const parsed = parse(match[1]);
  if (parsed !== null && (typeof parsed !== "object" || Array.isArray(parsed))) {
    throw new Error("Frontmatter måste vara ett objekt.");
  }

  return {
    data: (parsed ?? {}) as Frontmatter,
    content: raw.slice(match[0].length),
  };
}

export function stringifyFrontmatter(body: string, data: Frontmatter): string {
  const normalizedBody = body.replace(/^\r?\n/, "").replace(/\r\n/g, "\n");
  const ending = normalizedBody.endsWith("\n") ? "" : "\n";

  return `---\n${stringify(data, { lineWidth: 0 })}---\n${normalizedBody}${ending}`;
}
