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
  const gridClass = gridClassName || "grid grid-cols-3 min-[790px]:grid-cols-5 gap-2 text-xs w-full";
  return (
    <div className={containerClassName || "bg-[#FFFFFF] text-black pb-4"}>
      <h3 className={`font-bold text-lg mb-3 pt-8 mt-3 ${paddingClassName}`}>{heading}</h3>
      <div className={`${gridClass} ${paddingClassName}`}>
        {/* Botão "Todos" */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`btn-square btn-red-outline w-full font-semibold uppercase rounded-md px-4 py-4 leading-tight transition-colors border shadow-sm ${
            selectedEnv === null
              ? 'bg-bs-red text-white border-bs-red'
              : 'bg-white text-black border-[#0F0D13]'
          }`}
        >
          {t('common.all')}
        </button>
        {/* Primeiros 4 tipos em mobile, 8 em desktop */}
        {environments.slice(0, 8).map((env, idx) => (
          <button
            key={env.value}
            type="button"
            onClick={() => onSelect(selectedEnv === env.value ? null : env.value)}
            className={`btn-square btn-hover-red w-full font-semibold uppercase rounded-md px-4 py-4 leading-tight transition-colors border shadow-sm ${
              selectedEnv === env.value
                ? 'bg-bs-red text-white border-bs-red'
                : 'bg-white text-black border-[#0F0D13]'
            } ${idx >= 4 ? 'hidden sm:block' : ''}`}
          >
            {env.label}
          </button>
        ))}
        {/* Botão "Ver mais" se houver mais de 4 em mobile ou mais de 8 em desktop */}
        {showViewMore && environments.length > 4 && (
          <button
            type="button"
            onClick={onViewMore}
            className={`btn-square-dark btn-hover-red w-full py-4 font-semibold text-xs rounded-md ${
              environments.length > 8 ? '' : 'sm:hidden'
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