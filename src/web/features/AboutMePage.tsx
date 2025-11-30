import imgMe from "@/assets/imgs/etc/img_me.jpeg";
import { FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { useNavigate } from 'react-router-dom';
import BackHeader from "../components/layout/BackHeader";

export function AboutMePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <BackHeader onBack={() => navigate(-1)} />

      <div className="mx-auto max-w-lg space-y-6 text-white">

        {/* FOTO + NOME */}
        <div className="flex flex-col items-center pt-4">
          <img
            src={imgMe}
            alt="Foto"
            className="h-44 w-44 sm:h-48 sm:w-48 rounded-full border-2 border-bs-red shadow-md object-cover"
          />

          <SectionHeading title={"Wallace Baldenebre"} underline={false} sizeClass="text-xl" className="mt-4 aboutme-name" />
          <style>{`.aboutme-name h2{ font-family: 'Science Gothic', 'ScienceGothic', 'ScienceGothic-SemiBold', Montserrat, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; font-weight: 600 !important; }`}</style>

          <p className="text-sm text-gray-300 text-center">
            Dê um peixe a um homem, e alimente-o por um dia. Ensine um homem a pescar, e alimente-o por toda a vida
          </p>
        </div>

        {/* LINHA VERMELHA */}
        <div className="mx-auto h-[3px] w-24 bg-bs-red" />

        {/* SOBRE */}
        <section className="rounded-md bg-bs-card p-4 border border-white/10 shadow">
          <SectionHeading title={t('aboutMe.aboutHeading')} underline={false} sizeClass="text-sm" className="mb-2" />

          <div className="text-sm leading-relaxed text-gray-200">
            <ul className="list-inside list-disc pl-5 space-y-2">
              <li>Mobile Engineering há uns 8 anos (se minha memória ainda tiver boa)</li>
              <li>Bateria, Guitarra e Vocal, fazendo tudo perfeitamente errado e desconexo com a realidade</li>
              <li>Cozinhar ao nível de saber fazer um belíssimo panetone salgado (porque choras Palmirinha?)</li>
              <li>Viajante solo e mochileiro</li>
              <li>Falo Português (BR), Inglês, Espanhol e Russo (esse aqui ainda sigo estudando... Привет мой друг)</li>
              <li>Osasquense que ama São Paulo, e que também xinga a cidade na primeira oportunidade, mas sempre disposto a recomendar o melhor da cidade :)</li>
            </ul>
          </div>
        </section>

        {/* REDES SOCIAIS */}
        <section className="rounded-md bg-bs-card p-4 border border-white/10 shadow">
          <SectionHeading title={t('aboutMe.socialHeading')} underline={false} sizeClass="text-sm" className="mb-1" />
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
                <span>Role Paulista</span>
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
          {t('common.version')} 1.0 — Role Paulista
        </p>
      </div>
    </>
  );
}
