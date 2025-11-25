import flagSp from "@/assets/imgs/flags/flag_sp.png";
import { FaInstagram, FaLinkedin, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { useNavigate } from 'react-router-dom';

export function AboutMePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-black border-b-2 border-bs-red">
        <div className="mx-auto max-w-6xl px-4 sm:px-0 flex items-center pt-8 sm:pt-12 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-lg font-bold flex items-center"
          >
            <FaArrowLeft className="mr-2" /> {t('common.back')}
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-lg space-y-6 text-white">

      {/* FOTO + NOME */}
      <div className="flex flex-col items-center pt-4">
        <img
          src={flagSp}
          alt="Foto"
          className="h-32 w-32 rounded-full border-2 border-bs-red shadow-md object-cover"
        />

        <SectionHeading title={"Wallace Baldenebre"} underline={false} sizeClass="text-xl" trackingClass="tracking-[0.18em]" className="mt-4" />

        <p className="text-xs text-gray-300">
          {t('aboutMe.authorTag')}
        </p>
      </div>

      {/* LINHA VERMELHA */}
      <div className="mx-auto h-[3px] w-24 bg-bs-red" />

      {/* SOBRE */}
      <section className="rounded-md bg-bs-card p-4 border border-white/10 shadow">
        <SectionHeading title={t('aboutMe.aboutHeading')} underline={false} sizeClass="text-sm" trackingClass="tracking-[0.18em]" className="mb-2" />

        <p className="text-sm leading-relaxed text-gray-200">
          {t('aboutMe.bio')}
        </p>
      </section>

      {/* REDES SOCIAIS */}
      <section className="rounded-md bg-bs-card p-4 border border-white/10 shadow">
        <SectionHeading title={t('aboutMe.socialHeading')} underline={false} sizeClass="text-sm" trackingClass="tracking-[0.18em]" className="mb-1" />
        <p className="text-sm text-gray-300 mb-3">Me encontre nas redes sociais abaixo :)</p>

        <style>{`@media (max-width:480px){ .about-grid{ grid-template-columns: 1fr !important; } }`}</style>
        <ul className="about-grid grid grid-cols-2 gap-4 w-full text-sm items-center">
          <li className="flex items-center justify-start sm:col-start-1 sm:row-start-1">
            <a
              href="https://www.instagram.com/balde_wb/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-bs-red transition-colors"
            >
              <FaInstagram aria-hidden="true" className="text-lg" />
              <span>Wallace Baldenebre</span>
            </a>
          </li>

          <li className="flex items-center justify-end sm:col-start-2 sm:row-start-1">
            <a
              href="https://www.linkedin.com/in/wallace-baldenebre/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-bs-red transition-colors"
            >
              <FaLinkedin aria-hidden="true" className="text-lg" />
              <span>LinkedIn</span>
            </a>
          </li>

          <li className="flex items-center justify-start sm:col-start-1 sm:row-start-2">
            <a
              href="https://www.instagram.com/balde_wb/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-bs-red transition-colors"
            >
              <FaInstagram aria-hidden="true" className="text-lg" />
                <span>Busca Sampa</span>
            </a>
          </li>

          <li className="flex items-center justify-end sm:col-start-2 sm:row-start-2">
            <a
              href="mailto:wallace.baldenebre@gmail.com"
              className="flex items-center gap-2 hover:text-bs-red transition-colors"
            >
              <FaEnvelope aria-hidden="true" className="text-lg" />
              <span>E-mail</span>
            </a>
          </li>
        </ul>
      </section>

      {/* FINAL */}
      <p className="text-center text-[0.65rem] text-gray-500 pt-4 pb-10">
        {t('common.version')} 1.0 — Busca Sampa
      </p>
    </div>
    </>
  );
}
