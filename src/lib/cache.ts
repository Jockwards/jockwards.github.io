import fs from "node:fs";
import path from "node:path";

const CACHE_DIR = path.join(process.cwd(), ".api-cache");

export function readCache<T>(filename: string): T | null {
  const cacheFile = path.join(CACHE_DIR, filename);

  if (!fs.existsSync(cacheFile)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(cacheFile, "utf8")) as T;
  } catch (error) {
    console.error(`Error reading cache file ${filename}:`, error);
    return null;
  }
}

export function writeCache(filename: string, data: unknown): void {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const cacheFile = path.join(CACHE_DIR, filename);
  fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
  console.log(`Saved to committed cache: ${cacheFile}`);
}
