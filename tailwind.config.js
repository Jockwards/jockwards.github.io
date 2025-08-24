/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,njk,md,js}", "./_site/**/*.html"],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
};
