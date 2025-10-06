import embedEverything from "eleventy-plugin-embed-everything";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const getTmdbData = require("./src/_data/tmdb.cjs");
const getHardcoverData = require("./src/_data/hardcover.cjs");

export default function (eleventyConfig) {
  // Add computed data for TMDB and Hardcover
  eleventyConfig.addGlobalData("eleventyComputed", {
    tmdbData: async (data) => {
      if (data.tmdb_id && data.tmdb_type) {
        return await getTmdbData(data.tmdb_id, data.tmdb_type);
      }
      return null;
    },
    hardcoverData: async (data) => {
      if (data.hardcover_id) {
        return await getHardcoverData(data.hardcover_id);
      }
      return null;
    },
  });

  // Copy `src/assets` to `_site/assets`
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon": "assets/favicon",
    "src/assets/media": "assets/media",
    "src/assets/css/nav.css": "assets/css/nav.css",
    "src/assets/css/bundle.css": "assets/css/bundle.css",
    "src/assets/css/tmdb.css": "assets/css/tmdb.css",
    "src/assets/css/reading-list.css": "assets/css/reading-list.css",
    "src/assets/css/blog.css": "assets/css/blog.css",
  });

  // Ignore layout files from being processed as pages
  eleventyConfig.ignores.add("src/_includes/**");

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return b.date - a.date; // Sort by date descending (newest first)
    }),
  );

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();
    collectionApi.getAll().forEach((item) => {
      if (item.data.tags) {
        item.data.tags
          .filter((tag) => tag !== "posts") // Exclude the 'posts' tag
          .forEach((tag) => tagSet.add(tag));
      }
    });
    return [...tagSet].sort();
  });

  // Shortcode for current date and time in 24h format
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

  // embedplugin
  eleventyConfig.addPlugin(embedEverything, {
    youtube: {
      options: {
        lite: true,
      },
    },
  });

  // Fixa till bilder
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: ["auto"],
    outputDir: "_site/img/", // Output directory for generated images
    urlPath: "/img/", // Public URL path for images
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
  };
}
