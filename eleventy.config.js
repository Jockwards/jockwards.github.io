module.exports = function(eleventyConfig) {
  // Copy `src/assets` to `_site/assets`
  eleventyConfig.addPassthroughCopy("src/assets");

  // Shortcode for current date and time
  eleventyConfig.addShortcode('datetime', function() {
    return new Date().toLocaleString();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "includes",
      layouts: "layouts",
      data: "data"
    }
  };
};
