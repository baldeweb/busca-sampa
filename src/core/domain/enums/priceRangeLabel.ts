import i18n from '@/i18n';
import type { PriceRange } from './PriceRange';

const FALLBACK_MAP: Record<PriceRange, string> = {
  FREE: 'Gratuito',
  ECONOMIC: 'Economico (R$40 - R$60)',
  MODERATE: 'Moderado (R$60 - R$100)',
  ABOVEAVERAGE: 'Acima da Média (R$100 - R$150)',
  FULLEXPERIENCE: 'Experiencia completa (R$150+)',
};

export function getPriceRangeLabel(price: PriceRange): string {
  const key = String(price || '').trim();
  const path = `priceRange.${key}`;
  try {
    if (i18n && i18n.exists(path)) return i18n.t(path);
  } catch (_) {}
  return (FALLBACK_MAP as any)[price] || '-';
}
