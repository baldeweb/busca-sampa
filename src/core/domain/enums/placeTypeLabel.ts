function normalizeTypeKey(type: string) {
  if (!type) return type;
  return type.replace(/-/g, '_').toUpperCase();
}

const PLURAL_MAP: Record<string, string> = {
  RESTAURANT: "Restaurantes",
  RESTAURANTS: "Restaurantes",
  BAR: "Bares",
  BARS: "Bares",
  NIGHTLIFE: "Vida Noturna",
  COFFEE: "Cafeterias",
  COFFEES: "Cafeterias",
  NATURE: "Natureza",
  NATURES: "Natureza",
  TOURIST_SPOT: "Pontos Turísticos",
  TOURIST_SPOTS: "Pontos Turísticos",
};

const SINGULAR_MAP: Record<string, string> = {
  RESTAURANT: "Restaurante",
  RESTAURANTS: "Restaurante",
  BAR: "Bar",
  BARS: "Bar",
  NIGHTLIFE: "Vida Noturna",
  COFFEE: "Cafeteria",
  COFFEES: "Cafeteria",
  NATURE: "Natureza",
  NATURES: "Natureza",
  TOURIST_SPOT: "Ponto Turístico",
  TOURIST_SPOTS: "Ponto Turístico",
};

export function getPlaceTypeLabel(type: string): string {
  const key = normalizeTypeKey(type);
  return PLURAL_MAP[key] || type;
}

export function getPlaceTypeLabelSingular(type: string): string {
  const key = normalizeTypeKey(type);
  return SINGULAR_MAP[key] || type;
}
