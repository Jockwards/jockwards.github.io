import "dotenv/config";
import embedEverything from "eleventy-plugin-embed-everything";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const getTmdbData = require("./src/_data/tmdb.cjs");
const getHardcoverData = require("./src/_data/hardcover.cjs");

export default function (eleventyConfig) {
  eleventyConfig.addGlobalData("eleventyComputed", {
    tmdbData: async (data) => {
      if (data.tmdb_id && data.tmdb_type) {
        return await getTmdbData(data.tmdb_id, data.tmdb_type);
      }
      return null;
    },
    hardcoverData: async (data) => {
      if (data.hardcover_id && typeof data.hardcover_id !== "object") {
        return await getHardcoverData(data.hardcover_id);
      }
      return null;
    },
    canonicalUrl: (data) => {
      if (!data.page?.url) return null;
      const siteUrl = data.site?.url || "https://jockeinter.net";
      return `${siteUrl}${data.page.url}`;
    },
  });

  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon": "assets/favicon",
    "src/assets/media": "assets/media",
    "src/assets/css/bundle.css": "assets/css/bundle.css",
    "src/assets/css/tmdb.css": "assets/css/tmdb.css",
    "src/assets/css/reading-list.css": "assets/css/reading-list.css",
    "src/assets/css/blog.css": "assets/css/blog.css",
  });

  eleventyConfig.ignores.add("src/_includes/**");

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date),
  );

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();
    collectionApi.getAll().forEach((item) => {
      if (item.data.tags) {
        item.data.tags
          .filter((tag) => tag !== "posts")
          .forEach((tag) => tagSet.add(tag));
      }
    });
    return [...tagSet].sort();
  });

  eleventyConfig.addFilter("striptags", (content) => {
    if (!content) return "";
    return content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  });

  eleventyConfig.addFilter("truncate", (content, length = 280) => {
    if (!content || content.length <= length) return content;
    return `${content.slice(0, length).trim()}…`;
  });

  eleventyConfig.addFilter("postExcerpt", (post, length = 280) => {
    const text = (post.data.description || post.data.title || "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return "";
    if (text.length <= length) return text;
    return `${text.slice(0, length).trim()}…`;
  });

  eleventyConfig.addFilter("reviewScoreClass", (score) => {
    if (score <= 3.33) return "score-bronze";
    if (score <= 6.66) return "score-silver";
    return "score-gold";
  });

  eleventyConfig.addFilter("isoDate", (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("rssDate", (date) => {
    return new Date(date).toUTCString();
  });

  eleventyConfig.addFilter("absoluteUrl", (url, base) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${base}${url}`;
  });

  eleventyConfig.addShortcode("datetime", () =>
    new Date().toLocaleString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
  );

  eleventyConfig.addPlugin(embedEverything, {
    youtube: {
      options: {
        lite: true,
      },
    },
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: ["auto"],
    outputDir: "_site/img/",
    urlPath: "/img/",
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
      pictureAttributes: {},
    },
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    pathPrefix: "/",
    htmlBaseUrl: process.env.SITE_URL || "https://jockeinter.net",
  };
}
