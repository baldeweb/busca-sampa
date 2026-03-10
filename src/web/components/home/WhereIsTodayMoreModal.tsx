import type { MenuWhereIsTodayOption } from "@/core/domain/models/MenuWhereIsTodayOption";
import { SectionHeading } from "@/web/components/ui/SectionHeading";
import { AppButton } from "@/web/components/ui/AppButton";
import { AppText } from "@/web/components/ui/AppText";
import { useTranslation } from "react-i18next";
import type { ReactElement } from "react";

interface Props {
  options: MenuWhereIsTodayOption[];
  onClose: () => void;
  onSelect: (option: MenuWhereIsTodayOption) => void;
  resolveIcon: (tags: string[]) => ReactElement;
  getLabel: (option: MenuWhereIsTodayOption) => string;
}

export function WhereIsTodayMoreModal({ options, onClose, onSelect, resolveIcon, getLabel }: Props) {
  const { t } = useTranslation();

  function handleSelect(option: MenuWhereIsTodayOption) {
    onSelect(option);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="w-[90%] max-w-sm rounded-md border border-white/15 bg-bs-card shadow-xl">
        <div className="px-4 py-3">
          <div className="mb-1 flex items-center justify-between">
            <SectionHeading
              title={t("whereIsToday.moreOptionsTitle", { defaultValue: "Ver mais opções" })}
              underline={false}
              className="flex-1"
              card={false}
              tone="dark"
            />
            <AppButton variant="close" type="button" onClick={onClose} aria-label={t("common.close", { defaultValue: "Fechar" })}>
              ×
            </AppButton>
          </div>
          <div className="h-[3px] w-24 bg-bs-red" />
        </div>

        <ul className="max-h-[60vh] overflow-y-auto py-2">
          {options.map((option) => (
            <li key={option.id}>
              <AppButton
                variant="square"
                onClick={() => handleSelect(option)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3"
              >
                <AppText variant="subtitle-light" className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center" aria-hidden="true">
                    {resolveIcon(option.tags || [])}
                  </span>
                  {getLabel(option)}
                </AppText>
                <AppText variant="subtitle-light" className="opacity-70">{">"}</AppText>
              </AppButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
