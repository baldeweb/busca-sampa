import fs from "node:fs/promises";
import path from "node:path";

const PLACES_DIR = path.resolve("public", "data", "places");

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

async function main() {
  const entries = await fs.readdir(PLACES_DIR, { withFileTypes: true });
  const jsonFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))
    .map((e) => e.name);

  const results = [];

  for (const fileName of jsonFiles) {
    const filePath = path.join(PLACES_DIR, fileName);
    const raw = await fs.readFile(filePath, "utf8");

    /** @type {unknown} */
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      throw new Error(`Invalid JSON in ${fileName}: ${String(err)}`);
    }

    if (!Array.isArray(data)) {
      throw new Error(`Expected an array at root of ${fileName}`);
    }

    let changedCount = 0;
    const next = data.map((item) => {
      if (!isPlainObject(item)) return item;
      if (Object.prototype.hasOwnProperty.call(item, "isEnabled")) return item;
      changedCount += 1;
      return { ...item, isEnabled: true };
    });

    if (changedCount > 0) {
      await fs.writeFile(filePath, JSON.stringify(next, null, 4) + "\n", "utf8");
    }

    results.push({ fileName, changedCount, total: data.length });
  }

  const summary = results
    .sort((a, b) => a.fileName.localeCompare(b.fileName))
    .map((r) => `${r.fileName}: +${r.changedCount} / ${r.total}`)
    .join("\n");

  process.stdout.write(summary + "\n");
}

await main();
