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

	return {
		dir: {
			input: "src",
			output: "_site",
			includes: "_includes",
			layouts: "_includes/layouts",
			data: "data",
		},
	};
}
