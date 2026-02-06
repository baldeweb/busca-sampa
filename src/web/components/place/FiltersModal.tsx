import React, { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { getPriceRangeLabel } from "@/core/domain/enums/priceRangeLabel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: string;
  setOrder: (v: string) => void;
  openNowOnly: boolean;
  setOpenNowOnly: (v: boolean) => void;
  showOpenNowOption?: boolean;
  // new filters
  scheduleFilter?: 'any' | 'required' | 'not-required';
  setScheduleFilter?: (v: 'any' | 'required' | 'not-required') => void;
  cities?: string[];
  selectedCity?: string | null;
  setSelectedCity?: (v: string | null) => void;
  priceOptions?: string[];
  priceFilter?: string | null;
  setPriceFilter?: (v: string | null) => void;
}

export const FiltersModal: React.FC<Props> = ({ isOpen, onClose, order, setOrder, openNowOnly, setOpenNowOnly, showOpenNowOption = true, scheduleFilter, setScheduleFilter, cities, selectedCity, setSelectedCity, priceOptions, priceFilter, setPriceFilter }) => {
  const { t } = useTranslation();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) closeBtnRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" role="dialog" aria-modal="true" aria-labelledby="filters-heading">
      <div className="bg-bs-card rounded-app shadow-lg w-[90vw] max-w-md" onKeyDown={handleKeyDown}>
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-bs-red">
          <SectionHeading id="filters-heading" title={t('filters.title')} underline={false} sizeClass="text-lg" />
          <button ref={closeBtnRef} onClick={onClose} className="btn-close-round text-xl font-bold focus:outline-none focus:ring-2 focus:ring-bs-red/70" aria-label={t('common.close')}>×</button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-300 mb-4">{t('filters.subtitle')}</p>

          <div className="mb-4">
            <div className="font-bold mb-2">{t('filters.sortingTitle')}</div>
            <ul className="flex flex-col">
              <li>
                <button
                  type="button"
                  onClick={() => { console.log('[FiltersModal] order=name-asc'); setOrder('name-asc'); setOpenNowOnly(false); onClose(); }}
                  className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${order === 'name-asc' ? 'bg-bs-red/40' : ''}`}
                >
                  <span className="text-sm">{t('list.orderNameAsc')}</span>
                  {order === 'name-asc' && <span className="text-xs font-bold">✓</span>}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { console.log('[FiltersModal] order=neighborhood-asc'); setOrder('neighborhood-asc'); setOpenNowOnly(false); onClose(); }}
                  className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${order === 'neighborhood-asc' ? 'bg-bs-red/40' : ''}`}
                >
                  <span className="text-sm">{t('list.orderNeighborhoodAsc')}</span>
                  {order === 'neighborhood-asc' && <span className="text-xs font-bold">✓</span>}
                </button>
              </li>
            </ul>
          </div>

          {showOpenNowOption && (
            <div className="mt-6">
              <div className="font-bold mb-2">{t('filters.hoursTitle')}</div>
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => { console.log('[FiltersModal] openNow selected'); setOpenNowOnly(true); setOrder(''); onClose(); }}
                    className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${openNowOnly ? 'bg-bs-red/40' : ''}`}
                  >
                    <span className="text-sm">{t('filters.openNowLabel')}</span>
                    {openNowOnly && <span className="text-xs font-bold">✓</span>}
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Schedule filter */}
          <div className="mt-6">
            <div className="font-bold mb-2">{t('filters.scheduleTitle', { defaultValue: 'Agendar' })}</div>
            <ul>
              <li>
                <button
                  type="button"
                  onClick={() => { setOpenNowOnly(false); setOrder(''); setScheduleFilter && setScheduleFilter('required'); onClose(); }}
                  className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${ scheduleFilter === 'required' ? 'bg-bs-red/40' : '' }`}
                >
                  <span className="text-sm">{t('filters.scheduleRequired', { defaultValue: 'Necessário agendar' })}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setOpenNowOnly(false); setOrder(''); setScheduleFilter && setScheduleFilter('not-required'); onClose(); }}
                  className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${ scheduleFilter === 'not-required' ? 'bg-bs-red/40' : '' }`}
                >
                  <span className="text-sm">{t('filters.scheduleNotRequired', { defaultValue: 'Não precisa agendar' })}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setOpenNowOnly(false); setOrder(''); setScheduleFilter && setScheduleFilter('any'); onClose(); }}
                  className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${ scheduleFilter === 'any' ? 'bg-bs-red/40' : '' }`}
                >
                  <span className="text-sm">{t('filters.anySchedule', { defaultValue: 'Qualquer' })}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* City filter (if provided) */}
          {(Array.isArray(cities) ? cities.length > 1 : false) && (
            <div className="mt-6">
              <div className="font-bold mb-2">{t('filters.cityTitle', { defaultValue: 'Cidade' })}</div>
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => { setSelectedCity && setSelectedCity(null); setOrder(''); setOpenNowOnly(false); onClose(); }}
                    className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${ selectedCity === null ? 'bg-bs-red/40' : '' }`}
                  >
                    <span className="text-sm">{t('filters.anyCity', { defaultValue: 'Qualquer cidade' })}</span>
                  </button>
                </li>
                {(cities || []).map((c: string) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => { setSelectedCity && setSelectedCity(c); setOrder(''); setOpenNowOnly(false); onClose(); }}
                      className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${ selectedCity === c ? 'bg-bs-red/40' : '' }`}
                    >
                      <span className="text-sm">{c}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price filter (if provided and >1 option) */}
          {(Array.isArray(priceOptions) ? priceOptions.length > 1 : false) && (
            <div className="mt-6">
              <div className="font-bold mb-2">{t('filters.priceTitle', { defaultValue: 'Preço' })}</div>
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={() => { setPriceFilter && setPriceFilter(null); setOrder(''); setOpenNowOnly(false); onClose(); }}
                    className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${ priceFilter === null ? 'bg-bs-red/40' : '' }`}
                  >
                    <span className="text-sm">{t('filters.anyPrice', { defaultValue: 'Qualquer preço' })}</span>
                  </button>
                </li>
                {(priceOptions || []).map((p: string) => (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => { setPriceFilter && setPriceFilter(p); setOrder(''); setOpenNowOnly(false); onClose(); }}
                      className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${ priceFilter === p ? 'bg-bs-red/40' : '' }`}
                    >
                      <span className="text-sm">{getPriceRangeLabel(p as any)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
