import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { AppButton } from '../ui/AppButton';
import { AppText } from '../ui/AppText';

interface ToolbarProps {
  onBack: () => void;
  showVisitedButton?: boolean;
  isAlreadyVisited?: boolean;
  onVisitedClick?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onBack,
  showVisitedButton = false,
  isAlreadyVisited = false,
  onVisitedClick,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <section className="fixed top-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#212121] border-b-2 border-bs-red z-50">
        <div className="mx-auto max-w-5xl px-1 sm:px-9 flex items-center pt-8 sm:pt-12 pb-4">
          <AppButton
            variant="ghost"
            onClick={onBack}
            className="flex items-center"
          >
            <FaArrowLeft size="18" className="mr-2" /> <AppText variant="title-dark">{t('common.back')}</AppText>
          </AppButton>

          <div className="ml-auto flex gap-2">
            {showVisitedButton && (
              isAlreadyVisited ? (
                <AppButton
                  variant="outline"
                  onClick={onVisitedClick}
                  className="px-3 py-1.5 mr-1 sm:mr-3"
                >
                  {t('placeDetail.alreadyVisited')}
                </AppButton>
              ) : (
                <AppButton
                  variant="outline"
                  onClick={onVisitedClick}
                  className="px-3 py-1.5 mr-1 sm:mr-3"
                >
                  {t('placeDetail.notVisited')}
                </AppButton>
              )
            )}
          </div>
        </div>
      </section>
      <div className="h-[72px] sm:h-[92px]" aria-hidden="true" />
    </>
  );
};

export default Toolbar;
