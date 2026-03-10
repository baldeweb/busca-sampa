import fs from "node:fs/promises";
import path from "node:path";

const FILE_PATH = path.resolve("public", "data", "places", "restaurants.json");

const REGION_KEYWORDS = {
  BRAZILIAN_REGION_NORTH: ["norte", "para", "paraense", "amazonia", "acre", "rondonia", "roraima", "amapa", "tocantins", "tucupi"],
  BRAZILIAN_REGION_NORTHEAST: ["nordeste", "bahia", "baiano", "pernambuco", "ceara", "maranhao", "sergipe", "alagoas", "paraiba", "piaui", "rio grande do norte"],
  BRAZILIAN_REGION_CENTER_WEST: ["centro-oeste", "centro oeste", "goias", "goiano", "mato grosso", "mato grosso do sul", "distrito federal", "brasilia", "pantanal"],
  BRAZILIAN_REGION_SOUTH: ["sul", "gaucho", "gaucha", "rio grande do sul", "santa catarina", "parana", "curitibano", "curitibana"],
  BRAZILIAN_REGION_SOUTHEAST: ["sudeste", "sao paulo", "paulista", "minas gerais", "mineiro", "mineira", "rio de janeiro", "carioca", "espirito santo", "capixaba"],
};

const DOCERIA_KEYWORDS = ["doceria", "confeitaria", "sobremesa", "doce", "brigadeiro", "bolo", "patisserie", "pâtisserie"];
const SORVETERIA_KEYWORDS = ["sorveteria", "sorvete", "gelato", "ice cream", "sundae"];
const VEGAN_KEYWORDS = ["vegano", "vegana", "vegan", "plant-based", "plant based"];

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includesAnyKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(normalize(keyword)));
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function ensureTag(tags, tag) {
  const normalizedTarget = String(tag || "").trim().toUpperCase();
  if (!normalizedTarget) return tags;
  const normalizedExisting = new Set(tags.map((item) => String(item || "").trim().toUpperCase()));
  if (normalizedExisting.has(normalizedTarget)) return tags;
  return [...tags, normalizedTarget];
}

async function main() {
  const raw = await fs.readFile(FILE_PATH, "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("Expected restaurants.json root to be an array.");
  }

  const counters = {
    PASTRY_SHOP: 0,
    SORVETERIA: 0,
    VEGAN: 0,
    BRAZILIAN_REGION_NORTH: 0,
    BRAZILIAN_REGION_NORTHEAST: 0,
    BRAZILIAN_REGION_CENTER_WEST: 0,
    BRAZILIAN_REGION_SOUTH: 0,
    BRAZILIAN_REGION_SOUTHEAST: 0,
    updatedPlaces: 0,
  };

  const next = data.map((place) => {
    if (!place || typeof place !== "object" || Array.isArray(place)) return place;

    const notes = ensureArray(place.notes).join(" ");
    const searchText = normalize(`${place.name || ""} ${notes}`);

    let tags = ensureArray(place.tags);
    const originalTagSet = new Set(tags.map((item) => String(item || "").trim().toUpperCase()));

    if (includesAnyKeyword(searchText, DOCERIA_KEYWORDS)) {
      tags = ensureTag(tags, "PASTRY_SHOP");
    }

    if (includesAnyKeyword(searchText, SORVETERIA_KEYWORDS)) {
      tags = ensureTag(tags, "SORVETERIA");
    }

    if (includesAnyKeyword(searchText, VEGAN_KEYWORDS)) {
      tags = ensureTag(tags, "VEGAN");
    }

    const hasBrazilian = tags.some((tag) => String(tag || "").trim().toUpperCase() === "BRAZILIAN");
    if (hasBrazilian) {
      for (const [regionTag, keywords] of Object.entries(REGION_KEYWORDS)) {
        if (includesAnyKeyword(searchText, keywords)) {
          tags = ensureTag(tags, regionTag);
        }
      }
    }

    const finalTagSet = new Set(tags.map((item) => String(item || "").trim().toUpperCase()));

    for (const key of Object.keys(counters)) {
      if (key === "updatedPlaces") continue;
      if (finalTagSet.has(key) && !originalTagSet.has(key)) {
        counters[key] += 1;
      }
    }

    const changed = tags.length !== originalTagSet.size || tags.some((tag) => !originalTagSet.has(String(tag || "").trim().toUpperCase()));
    if (!changed) return place;

    counters.updatedPlaces += 1;
    return { ...place, tags };
  });

  await fs.writeFile(FILE_PATH, JSON.stringify(next, null, 4) + "\n", "utf8");

  const summary = [
    `updatedPlaces=${counters.updatedPlaces}`,
    ...Object.entries(counters)
      .filter(([key]) => key !== "updatedPlaces")
      .map(([key, value]) => `${key}=${value}`),
  ];

  process.stdout.write(summary.join("\n") + "\n");
}

await main();
