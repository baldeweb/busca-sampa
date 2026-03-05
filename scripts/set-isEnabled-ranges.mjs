import fs from "node:fs/promises";
import path from "node:path";

const PLACES_DIR = path.resolve("public", "data", "places");

/** @typedef {{ id?: number; isEnabled?: boolean; [k: string]: any }} Item */

/**
 * @param {Item} item
 * @param {(id: number) => boolean} predicate
 */
function shouldDisable(item, predicate) {
  const id = typeof item?.id === "number" ? item.id : Number(item?.id);
  if (!Number.isFinite(id)) return false;
  return predicate(id);
}

/**
 * @param {string} fileName
 * @param {(id: number) => boolean} predicate
 */
async function updateFile(fileName, predicate) {
  const filePath = path.join(PLACES_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error(`Expected an array at root of ${fileName}`);
  }

  let changed = 0;
  const next = data.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return item;

    if (shouldDisable(item, predicate)) {
      if (item.isEnabled !== false) changed += 1;
      return { ...item, isEnabled: false };
    }

    return item;
  });

  if (changed > 0) {
    await fs.writeFile(filePath, JSON.stringify(next, null, 4) + "\n", "utf8");
  }

  return { fileName, changed, total: data.length };
}

async function main() {
  const rules = [
    { file: "bars.json", predicate: (id) => id >= 11 },
    { file: "coffees.json", predicate: (id) => id >= 8 },
    { file: "forfun.json", predicate: (id) => id >= 7 },
    { file: "nature.json", predicate: (id) => id === 11 },
    { file: "nightlife.json", predicate: (id) => id >= 19 },
    { file: "restaurants.json", predicate: (id) => id >= 54 },
    { file: "stores.json", predicate: (id) => id >= 1 },
    { file: "tourist-spot.json", predicate: (id) => id >= 68 }
  ];

  const results = [];
  for (const rule of rules) {
    results.push(await updateFile(rule.file, rule.predicate));
  }

  const summary = results
    .map((r) => `${r.fileName}: changed ${r.changed} / ${r.total}`)
    .join("\n");

  process.stdout.write(summary + "\n");
}

await main();
