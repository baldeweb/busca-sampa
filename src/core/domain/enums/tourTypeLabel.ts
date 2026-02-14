import i18n from '@/i18n';

function normalizeTypeKey(type: string) {
  if (!type) return type;
  return type
    .replace(/-/g, '_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

const TOUR_MAP: Record<string, string> = {
  ALL: 'Tudo',
  ARTISTIC: 'Artístico',
  FREE: 'Gratuito',
  NIGHTLIFE: 'Balada',
  BARS: 'Bares',
  GASTRONOMIC: 'Gastronômico',
  HISTORY: 'História',
  MUSEUMS: 'Museus',
  OTHERS: 'Outros',
};

export function getTourTypeLabel(type: string): string {
  const key = normalizeTypeKey(type);
  const path = `tourType.${key}`;
  try {
    if (i18n && i18n.exists(path)) return i18n.t(path);
  } catch (_) {}
  return TOUR_MAP[key] || type;
}
