import embedEverything from "eleventy-plugin-embed-everything";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  // Copy `src/assets` to `_site/assets` except the tailwind.css source file
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon": "assets/favicon",
    "src/assets/media": "assets/media",
    "src/assets/css/nav.css": "assets/css/nav.css",
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
    urlPath: "/img/",        // Public URL path for images
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
  };
}
