import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { getReadingList } from "../src/lib/reading-list";

const cacheFile = path.join(process.cwd(), ".api-cache/reading-list.json");
const backupFile = `${cacheFile}.bak`;

if (fs.existsSync(cacheFile)) {
  fs.renameSync(cacheFile, backupFile);
}

try {
  const readingList = await getReadingList();
  const total =
    readingList.currentlyReading.length +
    readingList.wantToRead.length +
    readingList.read.length +
    readingList.didNotFinish.length;

  if (total === 0) {
    throw new Error("Hardcover returnerade en tom läslista.");
  }

  console.log(
    `Uppdaterade läslistan: ${readingList.read.length} lästa, ${readingList.currentlyReading.length} läser, ${readingList.wantToRead.length} vill läsa.`,
  );

  if (fs.existsSync(backupFile)) {
    fs.rmSync(backupFile);
  }
} catch (error) {
  if (fs.existsSync(backupFile)) {
    fs.renameSync(backupFile, cacheFile);
  }
  throw error;
}
