# Deployment Guide - Cloudflare Pages

## Required Setup for TMDB Integration

### Environment Variables

The TMDB API integration requires an API key to fetch movie and TV show data. This key is stored in a `.env` file locally (which is gitignored for security), but must be configured separately in Cloudflare Pages.

**Steps to configure on Cloudflare Pages:**

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → Select your project
3. Go to **Settings** → **Environment variables**
4. Click **Add variable** or **Edit variables**
5. Add the following:
   - **Variable name:** `TMDB_API_KEY`
   - **Value:** `your-tmdb-api-key-here` (get from https://www.themoviedb.org/settings/api)
   - **Environment:** Select both **Production** and **Preview**
6. Click **Save**
7. Redeploy the site (go to **Deployments** → **Retry deployment** on the latest build)

### Why is this needed?

- The `.env` file is in `.gitignore` and not pushed to GitHub
- Cloudflare Pages builds the site in their environment
- Without the API key, the TMDB data fetcher returns `null`
- If `tmdbData` is `null`, the card component doesn't render

### Verification

After setting the environment variable and redeploying:

1. Visit a post with TMDB data (e.g., `/posts/alien-earth/`)
2. You should see a collapsible card with:
   - Movie/TV show title (linked to TMDB)
   - Your review score (⭐ X/10)
   - Poster image
   - Release date
   - Creator (for TV shows) or Director (for movies)
   - Top 5 cast members

### Troubleshooting

**Card not showing on deployed site:**
- ✅ Verify environment variable is set in Cloudflare Pages
- ✅ Check deployment logs for errors
- ✅ Ensure all TMDB files are committed to git:
  - `src/_data/tmdb.cjs`
  - `src/_includes/components/tmdb-card.njk`
  - `src/assets/css/tmdb.css`
- ✅ Verify post has frontmatter: `tmdb_id`, `tmdb_type`, `review_score`

**Build failing:**
- Check Cloudflare deployment logs
- Common issues:
  - Missing files (check git status)
  - Import errors (check file paths)
  - CSS import issues (should be loaded via `<link>` tag, not `@import`)

---

## Build Configuration

**Build command:** `npm run build`

**Build output directory:** `_site`

**Root directory:** `/` (project root)

**Node version:** 22.x (or latest)

---

## Local Development

**Install dependencies:**
```bash
npm install
```

**Create `.env` file:**
```bash
echo "TMDB_API_KEY=your-tmdb-api-key-here" > .env
```
Replace `your-tmdb-api-key-here` with your actual API key from TMDB.

**Development server:**
```bash
npm run dev
```
- Runs Tailwind CSS in watch mode
- Runs Eleventy with live reload
- Available at `http://localhost:8080`

**Production build:**
```bash
npm run build
```
- Builds CSS with Tailwind
- Builds site with Eleventy
- Output in `_site/` directory

---

## Deployment Workflow

1. Make changes locally
2. Test with `npm run dev`
3. Build locally with `npm run build` to verify
4. Commit changes: `git add .` and `git commit -m "message"`
5. Push to GitHub: `git push`
6. Cloudflare Pages automatically deploys from the `master` branch
7. Monitor deployment in Cloudflare dashboard
8. Verify changes on live site

---

## Files That Must Be Committed

**TMDB Integration:**
- ✅ `src/_data/tmdb.cjs`
- ✅ `src/_includes/components/tmdb-card.njk`
- ✅ `src/assets/css/tmdb.css`
- ✅ Any posts with TMDB data (e.g., `src/posts/alien-earth.md`)

**Layout Changes:**
- ✅ `src/_includes/layouts/base.njk` (includes tmdb.css link)
- ✅ `src/_includes/layouts/home.njk` (uses tmdb-card component)
- ✅ `src/_includes/layouts/post.njk` (uses tmdb-card component)

**Configuration:**
- ✅ `eleventy.config.mjs` (requires tmdb.cjs, adds computed data)
- ✅ `src/assets/css/tailwind.css` (updated to remove tmdb import)

**Files That Should NOT Be Committed:**
- ❌ `.env` (contains API key - in .gitignore)
- ❌ `_site/` (build output - in .gitignore)
- ❌ `node_modules/` (dependencies - in .gitignore)
- ❌ `project-info-and-log.md` (internal notes - in .gitignore)
- ❌ `.cache/` (Eleventy cache - in .gitignore)

---

## Quick Reference

**Start development:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Deploy to production:**
```bash
git add .
git commit -m "Your commit message"
git push
```

**Check what files need to be committed:**
```bash
git status
```

**View untracked files:**
```bash
git status --short
```

---

## Additional Notes

- Cloudflare Pages builds are triggered automatically on push to `master`
- Build time is typically 30-60 seconds
- Environment variables take effect immediately after saving (may need to redeploy)
- TMDB API is free with rate limits - obtain your own API key from https://www.themoviedb.org/settings/api
- Images are automatically optimized by Eleventy (AVIF, WebP, JPEG formats)

---

**Last Updated:** October 6, 2025
