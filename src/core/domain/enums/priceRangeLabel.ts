import i18n from '@/i18n';
import type { PriceRange } from './PriceRange';

const FALLBACK_MAP: Record<PriceRange, string> = {
  FREE: 'Gratuito',
  ECONOMIC: 'Economico (R$20 - R$59)',
  MODERATE: 'Moderado (R$50 - R$79)',
  EXPENSIVE: 'Caro (R$80 - R$149)',
  'VERY-EXPENSIVE': 'Muito caro (R$150+)',
};

export function getPriceRangeLabel(price: PriceRange): string {
  const key = String(price || '').trim();
  const path = `priceRange.${key}`;
  try {
    if (i18n && i18n.exists(path)) return i18n.t(path);
  } catch (_) {}
  return (FALLBACK_MAP as any)[price] || '-';
}
