# Deployment Guide - Cloudflare Pages

The site is built with Astro and deployed from the `master` branch with Cloudflare Pages.

## Build Configuration

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `_site` |
| Root directory | `/` |
| Node version | `22.22.0` (set `NODE_VERSION`) |
| Production branch | `master` |

Astro 7 requires Node `>=22.22.0`. The repository has `.nvmrc` with `22.22.0`, but Cloudflare Pages should also have `NODE_VERSION` set to `22.22.0` in **Settings → Environment variables** for both Production and Preview.

## Environment Variables

Configure these in **Cloudflare Dashboard → Workers & Pages → jocke-pa-internet → Settings → Environment variables**:

| Variable | Production | Preview | Purpose |
| --- | --- | --- | --- |
| `TMDB_API_KEY` | Yes | Yes | Movie/TV metadata |
| `HARDCOVER_API_TOKEN` | Yes | Yes | Reading list and book metadata |
| `NODE_VERSION` | `22.22.0` | `22.22.0` | Astro build compatibility |

Do **not** add `GEMINI_API_KEY` to Cloudflare. Translations are generated locally and committed as Markdown files.

Cloudflare Pages can have separate Production and Preview values. The Wrangler command below updates Production only; add Preview values in the dashboard if preview builds need live API access.

```bash
npx wrangler pages secret put HARDCOVER_API_TOKEN --project-name jocke-pa-internet
```

Hardcover requires the token to be sent as `Authorization: Bearer <token>`. The application adds the `Bearer` prefix automatically.

## Local Development

```bash
npm install
npm run dev
```

The dev server normally runs at `http://localhost:4321`.

Create a local `.env` (gitignored) with:

```dotenv
TMDB_API_KEY=...
HARDCOVER_API_TOKEN=...
SITE_URL=https://jockeinter.net
```

`GEMINI_API_KEY` is only needed when generating translations locally.

## Verification Before Deploying

```bash
npm run check
npm run build
npm run test:a11y
```

`npm run test:a11y` expects a preview server. Start one with:

```bash
npx astro preview --host 127.0.0.1 --port 4321
npm run test:a11y
npx astro preview stop
```

To test another port:

```bash
BASE_URL=http://127.0.0.1:4322 npm run test:a11y
```

The accessibility check runs axe against the home page, blog, reading list, a review post, a regular post, a tag page, and the 404 page in both dark and light mode.

## Content Workflow

### New review

```bash
npm run new:review -- "Dune" --type movie
npm run new:review -- --type book --id 369692
```

Supported flags:

```text
npm run new:review -- [title] --type movie|tv|book [--id 123] [--rating 8] [--tags recensioner,teknologi]
```

The script searches TMDB or Hardcover, caches metadata in `.api-cache/`, and creates a Swedish Markdown post in `src/content/posts/sv/`.

### Refresh reading list

```bash
npm run refresh:reading
```

This fetches the latest Hardcover list, writes `.api-cache/reading-list.json`, and restores the previous cache if the API returns an empty list.

The reading list is cached at build time. Commit the updated cache when book data should be deployed.

## Translation Workflow

Swedish is the source language. English and Spanish posts live in:

```text
src/content/posts/sv/
src/content/posts/en/
src/content/posts/es/
```

Generate or refresh translations:

```bash
npm run translate
npm run translate -- --locale en
npm run translate -- --locale en,es --slug alien-earth --force
```

Check whether translations are missing or stale:

```bash
npm run translate:check
```

Translation rules:

- Only Swedish source posts are translated.
- Existing current translations are skipped unless `--force` is used.
- `sourceHash` records the source post hash; changing the Swedish post marks its translations stale.
- URLs, image paths, Markdown links, HTML, and `<lite-youtube>` elements are protected from translation.
- Translated posts include `aiTranslated: true`, `translationModel`, and `translatedAt`.
- The translated page shows an AI-translation notice linking back to the Swedish original.
- Review scores, TMDB IDs, Hardcover IDs, dates, and tags are copied from the source.

If `GEMINI_API_KEY` is missing, translation commands fail before making API calls. Add a fresh key to `.env`, run the translations, review the output, and commit the generated Markdown.

## URL Structure

Swedish keeps the existing URLs:

```text
/
/pages/blog/
/pages/reading-list/
/posts/<slug>/
/tags/<tag>/
/feed.xml
/sitemap.xml
```

English and Spanish are prefixed:

```text
/en/
/en/pages/blog/
/en/pages/reading-list/
/en/posts/<slug>/
/en/tags/<tag>/
/en/feed.xml

/es/
/es/pages/blog/
/es/pages/reading-list/
/es/posts/<slug>/
/es/tags/<tag>/
/es/feed.xml
```

Post and page alternates are emitted as `hreflang` links when a translation exists.

## Deployment Workflow

1. Make changes locally.
2. Run `npm run check`, `npm run build`, and `npm run test:a11y`.
3. Review generated output in `_site/` if needed.
4. Commit changes.
5. Push to `master`.
6. Cloudflare Pages builds and deploys automatically.
7. Verify the live site and `/feed.xml`.

Before switching the Astro branch to production:

- Confirm Cloudflare `NODE_VERSION=22.22.0`.
- Confirm both Production and Preview have TMDB and Hardcover credentials.
- Confirm the existing URLs and `/feed.xml` still work.
- Confirm the reading list and post metadata render.
- Confirm the accessibility check passes.

## Files That Should Be Committed

- `src/`, `public/`, `scripts/`, `astro.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.nvmrc`
- `.api-cache/*.json` for reproducible build data
- `src/content/posts/sv/*.md` and generated `src/content/posts/en/*.md`, `src/content/posts/es/*.md`
- `.gitkeep` files for empty translation directories

## Files That Should Not Be Committed

- `.env` and other environment files containing secrets
- `node_modules/`
- `_site/`
- `.astro/`
- `.cache/`
- `playwright-report/`
- `test-results/`
- Internal notes listed in `.gitignore`, including `ASTRO-MIGRATION.md`

## Troubleshooting

**Build fails with an unsupported Node version:**
- Set `NODE_VERSION=22.22.0` in Cloudflare Pages.
- Verify the value in the deployment log.

**TMDB or Hardcover data is missing:**
- Check the environment variable in the correct Cloudflare environment.
- Check the deployment log for API errors.
- Run `npm run refresh:reading` locally and commit the cache if only the reading list is stale.

**Hardcover returns 400 `Invalid Authorization format`:**
- The API requires `Authorization: Bearer <token>`.
- Do not store the token with `Bearer` already included; the application adds it.

**Translation command fails immediately:**
- Add a fresh `GEMINI_API_KEY` to `.env`.
- Confirm the key is not committed or exposed in client-side code.

**Accessibility check fails to connect:**
- Start the preview server first.
- Use the same port in `BASE_URL`.
- Stop old preview servers with `npx astro preview stop`.

---

**Last Updated:** October 20, 2026
