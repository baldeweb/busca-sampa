import React, { useEffect, useRef } from "react";
import { isOpenNow } from "@/core/domain/enums/openingHoursUtils";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';

export interface Period {
  days: string[];
  open?: string;
  close?: string;
}

interface OpeningPattern {
  id: string;
  description: string;
  periods: Period[];
}

interface Props {
  pattern: OpeningPattern | null;
  isOpen: boolean;
  onClose: () => void;
  customMessage?: string;
  instagramUrl?: string;
}

const dayLabels: Record<string, Record<string,string>> = {
  MONDAY: { pt: "Segunda", en: "Monday" },
  TUESDAY: { pt: "Terça", en: "Tuesday" },
  WEDNESDAY: { pt: "Quarta", en: "Wednesday" },
  THURSDAY: { pt: "Quinta", en: "Thursday" },
  FRIDAY: { pt: "Sexta", en: "Friday" },
  SATURDAY: { pt: "Sábado", en: "Saturday" },
  SUNDAY: { pt: "Domingo", en: "Sunday" },
  HOLIDAY: { pt: "Feriado", en: "Holiday" },
  EVERYDAY: { pt: "Todos os dias", en: "Everyday" },
  CHECK_AVAILABILITY: { pt: "Consultar Instagram", en: "Check Instagram" }
};

export const OpeningHoursModal: React.FC<Props> = ({ pattern, isOpen, onClose, customMessage, instagramUrl }) => {
  if (!isOpen) return null;
  const { t, i18n } = useTranslation();

  const now = new Date();
  const currentDay = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"][now.getDay()];
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" role="dialog" aria-modal="true" aria-labelledby="opening-hours-heading">
      <div className="bg-bs-card rounded-app shadow-lg w-[90vw] max-w-md" onKeyDown={handleKeyDown}>
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-bs-red">
          <SectionHeading id="opening-hours-heading" title={t('openingHours.title')} underline={false} sizeClass="text-lg" />
          <button ref={closeBtnRef} onClick={onClose} className="text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-bs-red/70 rounded" aria-label={t('common.close')}>×</button>
        </div>
        {customMessage ? (
          <div className="p-5 text-center">
            <p className="mb-4 text-sm text-gray-200">{customMessage}</p>
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-bs-red text-white px-4 py-2 rounded font-bold">
                <span className="mr-2">📷</span> {t('openingHours.followButton')}
              </a>
            )}
          </div>
        ) : (
          <div className="p-4">
            {pattern?.periods?.length ? (
              <ul>
                {["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"].map((day, idx) => {
                  const periods = pattern.periods.filter(p => p.days.includes(day) || p.days.includes("EVERYDAY"));
                  const isToday = currentDay === day;
                  const aberto = isOpenNow(periods);
                  return (
                    <li key={day} className="mb-2">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold uppercase w-24 ${isToday ? "text-green-500" : "text-white"}`}>{dayLabels[day][i18n.language as 'pt'|'en']}</span>
                        <div className="flex flex-col items-end min-w-[120px]">
                          {periods.length === 0 ? (
                            <span className="text-xs text-red-400">{t('openingHours.closed')}</span>
                          ) : (
                            <>
                              {periods.map((p, pidx) => (
                                p.open && p.close ? (
                                  <span key={pidx} className="block text-xs text-right">{t('openingHours.range', { open: p.open, close: p.close })}</span>
                                ) : null
                              ))}
                              {isToday && (
                                <span className={`mt-1 text-xs font-bold ${aberto ? "text-green-500" : "text-red-500"}`}>{aberto ? t('placeDetail.openNow') : t('placeDetail.closedNow')}</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      {idx < 6 && <div className="border-b border-white/30 mt-2" />}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center text-sm text-gray-300">{t('openingHours.notProvided')}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
