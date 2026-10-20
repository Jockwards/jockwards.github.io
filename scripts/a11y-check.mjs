import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL || "http://127.0.0.1:4321";
const paths = [
  "/",
  "/pages/blog/",
  "/pages/reading-list/",
  "/posts/alien-earth/",
  "/posts/drifting-in-sweden/",
  "/tags/ovrigt/",
  "/en/",
  "/en/pages/blog/",
  "/en/pages/reading-list/",
  "/en/posts/alien-earth/",
  "/en/tags/recensioner/",
  "/es/",
  "/es/pages/blog/",
  "/es/pages/reading-list/",
  "/es/posts/alien-earth/",
  "/es/tags/recensioner/",
  "/404.html",
];
const schemes = ["dark", "light"];

const browser = await chromium.launch();
let serious = 0;

try {
  for (const scheme of schemes) {
    const context = await browser.newContext({ colorScheme: scheme });

    for (const path of paths) {
      const page = await context.newPage();
      await page.goto(`${base}${path}`, { waitUntil: "load" });
      await page.waitForTimeout(300);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      const important = results.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical",
      );

      if (important.length > 0) {
        serious += important.length;
        console.error(`\n${scheme} ${path}`);
        for (const violation of important) {
          console.error(
            `  ${violation.impact}: ${violation.id} - ${violation.help}`,
          );
          for (const node of violation.nodes.slice(0, 3)) {
            console.error(`    ${node.target.join(" ")}`);
          }
        }
      } else {
        console.log(`${scheme} ${path}: OK`);
      }

      await page.close();
    }

    await context.close();
  }
} finally {
  await browser.close();
}

if (serious > 0) {
  console.error(`\n${serious} serious/critical accessibility violation(s).`);
  process.exitCode = 1;
} else {
  console.log("\nNo serious/critical accessibility violations.");
}
