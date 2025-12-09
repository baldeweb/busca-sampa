import React, { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: string;
  setOrder: (v: string) => void;
  openNowOnly: boolean;
  setOpenNowOnly: (v: boolean) => void;
  showOpenNowOption?: boolean;
}

export const FiltersModal: React.FC<Props> = ({ isOpen, onClose, order, setOrder, openNowOnly, setOpenNowOnly, showOpenNowOption = true }) => {
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
          <button ref={closeBtnRef} onClick={onClose} className="text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-bs-red/70 rounded" aria-label={t('common.close')}>×</button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-300 mb-4">{t('filters.subtitle')}</p>

          <div className="mb-4">
            <div className="font-bold mb-2">{t('filters.sortingTitle')}</div>
            <ul className="flex flex-col">
              <li>
                <button
                  type="button"
                  onClick={() => { setOrder('name-asc'); setOpenNowOnly(false); onClose(); }}
                  className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${order === 'name-asc' ? 'bg-bs-red/40' : ''}`}
                >
                  <span className="text-sm">{t('list.orderNameAsc')}</span>
                  {order === 'name-asc' && <span className="text-xs font-bold">✓</span>}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setOrder('name-desc'); setOpenNowOnly(false); onClose(); }}
                  className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${order === 'name-desc' ? 'bg-bs-red/40' : ''}`}
                >
                  <span className="text-sm">{t('list.orderNameDesc')}</span>
                  {order === 'name-desc' && <span className="text-xs font-bold">✓</span>}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setOrder('neighborhood-asc'); setOpenNowOnly(false); onClose(); }}
                  className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${order === 'neighborhood-asc' ? 'bg-bs-red/40' : ''}`}
                >
                  <span className="text-sm">{t('list.orderNeighborhoodAsc')}</span>
                  {order === 'neighborhood-asc' && <span className="text-xs font-bold">✓</span>}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setOrder('neighborhood-desc'); setOpenNowOnly(false); onClose(); }}
                  className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${order === 'neighborhood-desc' ? 'bg-bs-red/40' : ''}`}
                >
                  <span className="text-sm">{t('list.orderNeighborhoodDesc')}</span>
                  {order === 'neighborhood-desc' && <span className="text-xs font-bold">✓</span>}
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
                    onClick={() => { setOpenNowOnly(true); setOrder(''); onClose(); }}
                    className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${openNowOnly ? 'bg-bs-red/40' : ''}`}
                  >
                    <span className="text-sm">{t('filters.openNowLabel')}</span>
                    {openNowOnly && <span className="text-xs font-bold">✓</span>}
                  </button>
                </li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
