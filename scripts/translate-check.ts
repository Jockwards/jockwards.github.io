import {
  getSourcePosts,
  isCurrent,
  LOCALE_NAMES,
  LOCALES,
  readTranslation,
} from "./translation-utils";

const sources = getSourcePosts();
let missing = 0;
let stale = 0;

for (const source of sources) {
  for (const locale of LOCALES) {
    const translation = readTranslation(locale, source.slug);

    if (!translation) {
      console.error(`Saknas: ${locale}/${source.slug}.md`);
      missing += 1;
      continue;
    }

    if (!isCurrent(source, translation, locale)) {
      console.error(`Inaktuell: ${locale}/${source.slug}.md`);
      stale += 1;
    }
  }
}

if (missing > 0 || stale > 0) {
  console.error(
    `\n${missing} saknade och ${stale} inaktuella översättningar. Kör npm run translate.`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Alla ${sources.length * LOCALES.length} översättningar är aktuella (${LOCALES.map((locale) => LOCALE_NAMES[locale]).join(", ")}).`,
  );
}
