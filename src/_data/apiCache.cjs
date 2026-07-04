const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "../../.api-cache");

function readCache(filename) {
  const cacheFile = path.join(CACHE_DIR, filename);
  if (!fs.existsSync(cacheFile)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
  } catch (error) {
    console.error(`Error reading cache file ${filename}:`, error);
    return null;
  }
}

function writeCache(filename, data) {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const cacheFile = path.join(CACHE_DIR, filename);
  fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
  console.log(`Saved to committed cache: ${cacheFile}`);
}

module.exports = { readCache, writeCache, CACHE_DIR };
