import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ReportProblemFooterProps {
  subject: string;
}

export function ReportProblemFooter({ subject }: ReportProblemFooterProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-black border-t-2 border-bs-red py-3 px-4 flex items-center justify-center">
      <FaExclamationTriangle className="mr-2 text-white" />
      <a
        href={`mailto:wallace.baldenebre@gmail.com?subject=${encodeURIComponent(subject)}`}
        className="text-white font-bold"
      >
        {t('placeDetail.reportProblem')}
      </a>
    </div>
  );
}

export default ReportProblemFooter;