import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface BackHeaderProps {
  onBack: () => void;
  showVisitedButton?: boolean;
  isAlreadyVisited?: boolean;
  onVisitedClick?: () => void;
}

export const BackHeader: React.FC<BackHeaderProps> = ({ onBack, showVisitedButton = false, isAlreadyVisited = false, onVisitedClick }) => {
  const { t } = useTranslation();

  return (
    <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-black border-b-2 border-bs-red">
      <div className="mx-auto max-w-5xl px-4 sm:px-12 flex items-center pt-8 sm:pt-12 pb-4">
        <button onClick={onBack} className="text-white text-xl sm:text-2xl font-bold flex items-center">
          <FaArrowLeft className="mr-2" /> <span className="footer-label text-xl sm:text-2xl">{t('common.back')}</span>
        </button>

        <div className="ml-auto flex gap-2">
          {showVisitedButton && (
            isAlreadyVisited ? (
              <button
                className="bg-green-600 text-white text-sm font-bold px-3 py-1.5 rounded shadow flex items-center"
                onClick={onVisitedClick}
              >
                {t('placeDetail.alreadyVisited')}
              </button>
            ) : (
              <button
                className="bg-yellow-400 text-black text-sm font-bold px-3 py-1.5 rounded shadow flex items-center border border-yellow-600"
                onClick={onVisitedClick}
              >
                {t('placeDetail.notVisited')}
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default BackHeader;
