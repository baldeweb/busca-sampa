import i18n from '@/i18n';

function normalizeTypeKey(type: string) {
  if (!type) return type;
  return type.replace(/-/g, '_').toUpperCase();
}

const PLURAL_MAP: Record<string, string> = {
  RESTAURANTS: 'Restaurantes',
  BARS: 'Bares',
  NIGHTLIFE: 'Vida Noturna',
  COFFEES: 'Cafeterias',
  NATURE: 'Natureza',
  TOURIST_SPOT: 'Pontos Turísticos',
  FORFUN: 'Diversão',
  STORES: 'Lojas',
};

const SINGULAR_MAP: Record<string, string> = {
  RESTAURANTS: 'Restaurante',
  BARS: 'Bar',
  NIGHTLIFE: 'Vida Noturna',
  COFFEES: 'Cafeteria',
  NATURE: 'Natureza',
  TOURIST_SPOT: 'Ponto Turístico',
  FORFUN: 'Diversão',
  STORES: 'Loja',
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
      COFFEES: 'COFFEES',
      BARS: 'BAR',
      TOURIST_SPOT: 'TOURIST_SPOT',
      NATURE: 'NATURE',
      FORFUN: 'FORFUN',
      STORES: 'STORES'
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
      COFFEES: 'COFFEES',
      BARS: 'BAR',
      TOURIST_SPOT: 'TOURIST_SPOT',
      NATURE: 'NATURE',
      FORFUN: 'FORFUN',
      STORES: 'STORES'
    };
    if (i18n && fallbackMap[key]) {
      const pathMap = `placeList.noun.${fallbackMap[key]}`;
      if (i18n.exists(pathMap)) return i18n.t(pathMap);
    }
  } catch (_) {}
  return SINGULAR_MAP[key] || type;
}
