import React from 'react';
import { useTranslation } from 'react-i18next';

interface EnvironmentGridProps {
  environments: Array<{ value: string; label: string }>;
  selectedEnv: string | null;
  onSelect: (value: string | null) => void;
  onViewMore: () => void;
  title?: string;
  showViewMore?: boolean;
  containerClassName?: string;
  contentPaddingClassName?: string;
  gridClassName?: string;
}

const EnvironmentGrid: React.FC<EnvironmentGridProps> = ({ environments, selectedEnv, onSelect, onViewMore, title, showViewMore = true, containerClassName, contentPaddingClassName, gridClassName }) => {
  const { t } = useTranslation();
  const heading = title || t('placeList.environmentTitle') || 'Tipo de ambiente:';
  const paddingClassName = contentPaddingClassName || "px-4 sm:px-0";
  const gridClass = gridClassName || "text-xs";
  const maxItemsMobile = 7;
  const maxItemsDesktop = 17;
  const baseSlotsMobile = maxItemsMobile - 1;
  const baseSlotsDesktop = maxItemsDesktop - 1;
  const showViewMoreOnMobile = showViewMore && environments.length > baseSlotsMobile;
  const showViewMoreOnDesktop = showViewMore && environments.length > baseSlotsDesktop;
  const visibleEnvironmentsMobile = baseSlotsMobile - (showViewMoreOnMobile ? 1 : 0);
  const visibleEnvironmentsDesktop = baseSlotsDesktop - (showViewMoreOnDesktop ? 1 : 0);
  const showViewMoreButton = showViewMoreOnMobile || showViewMoreOnDesktop;
  return (
    <div className={containerClassName || "bg-[#FFFFFF] text-black pb-4"}>
      <h3 className={`font-bold text-lg mb-3 pt-8 mt-3 ${paddingClassName}`}>{heading}</h3>
      <div className={`${gridClass} ${paddingClassName} flex flex-wrap items-start gap-2`}>
        {/* Botão "Todos" */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`btn-square btn-red-outline btn-hover-red inline-flex items-center justify-center align-top font-semibold uppercase rounded-md px-4 py-4 leading-tight transition-colors border shadow-sm ${
            selectedEnv === null
              ? 'bg-bs-red text-white border-bs-red'
              : 'bg-white text-black border-[#0F0D13]'
          }`}
        >
          {t('common.all')}
        </button>
        {/* Tipos visíveis: até 7 itens no mobile e 17 no desktop (contando Tudo/Mais Opções) */}
        {environments.map((env, idx) => (
          <button
            key={env.value}
            type="button"
            onClick={() => onSelect(selectedEnv === env.value ? null : env.value)}
            className={`btn-square btn-hover-gray inline-flex items-center justify-center align-top font-semibold uppercase rounded-md px-4 py-4 leading-tight transition-colors border shadow-sm ${
              selectedEnv === env.value
                ? 'bg-bs-red text-white border-bs-red'
                : 'bg-white text-black border-[#0F0D13]'
            } ${idx < visibleEnvironmentsMobile ? 'inline-flex' : 'hidden'} ${idx < visibleEnvironmentsDesktop ? 'sm:inline-flex' : 'sm:hidden'}`}
          >
            <span
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                lineHeight: '1.1',
                maxHeight: '2.2em',
              }}
              title={env.label}
            >
              {env.label}
            </span>
          </button>
        ))}
        {/* Botão "Ver mais" quando houver itens além do limite */}
        {showViewMoreButton && (
          <button
            type="button"
            onClick={onViewMore}
            className={`btn-square-dark btn-hover-red inline-flex items-center justify-center align-top py-4 font-semibold text-xs rounded-md px-4 ${
              showViewMoreOnDesktop ? 'sm:inline-flex' : 'sm:hidden'
            }`}
          >
            {t('home.viewMore')}
          </button>
        )}
      </div>
    </div>
  );
};

export default EnvironmentGrid;