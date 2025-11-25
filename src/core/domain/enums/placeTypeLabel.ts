import i18n from '@/i18n';

function normalizeTypeKey(type: string) {
  if (!type) return type;
  return type.replace(/-/g, '_').toUpperCase();
}

const PLURAL_MAP: Record<string, string> = {
  RESTAURANT: 'Restaurantes',
  RESTAURANTS: 'Restaurantes',
  BAR: 'Bares',
  BARS: 'Bares',
  NIGHTLIFE: 'Vida Noturna',
  COFFEE: 'Cafeterias',
  COFFEES: 'Cafeterias',
  NATURE: 'Natureza',
  NATURES: 'Natureza',
  TOURIST_SPOT: 'Pontos Turísticos',
  TOURIST_SPOTS: 'Pontos Turísticos',
};

const SINGULAR_MAP: Record<string, string> = {
  RESTAURANT: 'Restaurante',
  RESTAURANTS: 'Restaurante',
  BAR: 'Bar',
  BARS: 'Bar',
  NIGHTLIFE: 'Vida Noturna',
  COFFEE: 'Cafeteria',
  COFFEES: 'Cafeteria',
  NATURE: 'Natureza',
  NATURES: 'Natureza',
  TOURIST_SPOT: 'Ponto Turístico',
  TOURIST_SPOTS: 'Ponto Turístico',
};

export function getPlaceTypeLabel(type: string): string {
  const key = normalizeTypeKey(type);
  const path = `placeType.${key}`;
  try {
    if (i18n && i18n.exists(path)) return i18n.t(path);
    // try common plural->singular fallbacks (e.g. RESTAURANTS -> RESTAURANT)
    if (i18n && key.endsWith('S')) {
      const singular = key.slice(0, -1);
      const pathSing = `placeType.${singular}`;
      if (i18n.exists(pathSing)) return i18n.t(pathSing);
    }
    // try explicit known mappings
    const fallbackMap: Record<string, string> = {
      RESTAURANTS: 'RESTAURANT',
      COFFEES: 'COFFEE',
      BARS: 'BAR',
      TOURIST_SPOTS: 'TOURIST_SPOT',
      NATURES: 'NATURE'
    };
    if (i18n && fallbackMap[key]) {
      const pathMap = `placeType.${fallbackMap[key]}`;
      if (i18n.exists(pathMap)) return i18n.t(pathMap);
    }
  } catch (_) {}
  return PLURAL_MAP[key] || type;
}

export function getPlaceTypeLabelSingular(type: string): string {
  const key = normalizeTypeKey(type);
  const path = `placeList.noun.${key}`;
  try {
    if (i18n && i18n.exists(path)) return i18n.t(path);
    // fallback: if plural key is provided, try singular variant
    if (i18n && key.endsWith('S')) {
      const singular = key.slice(0, -1);
      const pathSing = `placeList.noun.${singular}`;
      if (i18n.exists(pathSing)) return i18n.t(pathSing);
    }
    const fallbackMap: Record<string, string> = {
      RESTAURANTS: 'RESTAURANT',
      COFFEES: 'COFFEE',
      BARS: 'BAR',
      TOURIST_SPOTS: 'TOURIST_SPOT',
      NATURES: 'NATURE'
    };
    if (i18n && fallbackMap[key]) {
      const pathMap = `placeList.noun.${fallbackMap[key]}`;
      if (i18n.exists(pathMap)) return i18n.t(pathMap);
    }
  } catch (_) {}
  return SINGULAR_MAP[key] || type;
}
