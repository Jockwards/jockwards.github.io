import "dotenv/config";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_URL || "https://jockeinter.net",
  outDir: "_site",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  i18n: {
    defaultLocale: "sv",
    locales: ["sv", "en", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  devToolbar: {
    enabled: false,
  },
});
