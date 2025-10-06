# API Cache Directory

This directory contains cached API responses that are committed to git.

## Why?

- Cloudflare Pages doesn't persist `.cache/` between builds
- Committing API responses prevents hitting rate limits
- Faster builds on Cloudflare
- Still fresh data when updated locally

## How it works

1. **Local development**: APIs are fetched and cached here
2. **Git commit**: Cache files are committed with code
3. **Cloudflare build**: Uses committed cache files, no API calls needed

## When to update

- When adding new TMDB/Hardcover content
- Run `npm run build` locally to fetch fresh data
- Commit the updated cache files

## Files

- `tmdb-*.json` - TMDB API responses (movies/TV shows)
- `hardcover-*.json` - Hardcover API responses (books)
- `reading-list.json` - Reading list data
