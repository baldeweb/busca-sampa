import React from "react";
import { isOpenNow } from "@/core/domain/enums/openingHoursUtils";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { AppText } from "../ui/AppText";
import { AppButton } from "../ui/AppButton";

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
  CHECK_AVAILABILITY_DAYTIME: { pt: "Consultar Instagram", en: "Check Instagram" }
};

export const OpeningHoursModal: React.FC<Props> = ({ pattern, isOpen, onClose, customMessage }) => {
  if (!isOpen) return null;
  const { t, i18n } = useTranslation();

  const now = new Date();
  const currentDay = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"][now.getDay()];

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
          <SectionHeading id="opening-hours-heading" title={t('openingHours.title')} underline={false} card={false} tone="dark" />
          <AppButton 
            variant="close"
            onClick={onClose} 
            className="focus:outline-none focus:ring-2 focus:ring-bs-red/70"
            aria-label={t('common.close')}>
                ×
          </AppButton>
        </div>
        {customMessage ? (
          <AppText variant="body-dark" className="p-5 mb-4 text-center">{customMessage}</AppText>
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
                      <div className="flex items-center justify-between py-2">
                        <span className={`font-bold uppercase w-24 ${isToday ? "text-green-500" : "text-white"}`}>{dayLabels[day][i18n.language as 'pt'|'en']}</span>
                        <div className="flex flex-col items-end min-w-[120px]">
                          {periods.length === 0 ? (
                            <AppText variant="selected-dark" className="text-red-400">{t('openingHours.closed')}</AppText>
                          ) : (
                            <>
                              {periods.map((p, pidx) => (
                                p.open && p.close ? (
                                  <AppText variant="selected-dark" key={pidx} className="block text-right">{t('openingHours.range', { open: p.open, close: p.close })}</AppText>
                                ) : null
                              ))}
                              {isToday && (
                                <AppText variant="selected-dark" className={`mt-1 font-bold ${aberto ? "text-green-500" : "text-red-500"}`}>{aberto ? t('placeDetail.openNow') : t('placeDetail.closedNow')}</AppText>
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
              <AppText variant="body-dark" className="flex-1 text-center">{t('openingHours.notProvided')}</AppText>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
