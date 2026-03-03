import imgMe from "@/assets/imgs/etc/img_me.webp";
import { FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { AppText } from '@/web/components/ui/AppText';
import { useNavigate } from 'react-router-dom';
import Toolbar from "../components/layout/Toolbar";
import { Accordion, AccordionItem } from '../components/ui/Accordion';
import icQrCodeDonation from '../../assets/imgs/etc/img_qrcode_donation.jpeg';

export function AboutMePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const aboutList = t('aboutMe.aboutList', { returnObjects: true }) as string[];
  const whatIsList = t('aboutMe.whatIs', { returnObjects: true }) as string[];
  const earnList = t('aboutMe.earn', { returnObjects: true }) as string[];
  const howToHelp = t('aboutMe.howToHelp', { returnObjects: true }) as string[];

  return (
    <>
      <Toolbar onBack={() => navigate(-1)} />

      <div className="mx-auto max-w-4xl space-y-6 text-white">

        {/* FOTO + NOME */}
        <div className="flex flex-col items-center pt-16">
          <img
            src={imgMe}
            alt={t('aboutMe.photoAlt')}
            width={192}
            height={192}
            decoding="async"
            className="h-44 w-44 sm:h-48 sm:w-48 rounded-full border-2 border-bs-red shadow-md object-cover"
          />

          <SectionHeading 
            title={t('aboutMe.name')}
            subtitle={t('aboutMe.motto')}
            underline={false} 
            className="mt-4 aboutme-name text-center" 
            card={false} 
            tone="dark"
          />
        </div>

        {/* LINHA VERMELHA */}
        <div className="mx-auto h-[3px] w-24 bg-bs-red" />

        {/* Accordion FAQ-style */}
        <Accordion>
          <AccordionItem label={<AppText variant="title-light">{t('aboutMe.accordion.aboutLabel')}</AppText>}>
            <div className="text-base leading-relaxed #212121">
              <ul className="list-inside list-disc pl-5 space-y-2">
                {aboutList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </AccordionItem>
          <AccordionItem label={<AppText variant="title-light">{t('aboutMe.accordion.whatIsLabel')}</AppText>}>
            {whatIsList.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </AccordionItem>
          <AccordionItem label={<AppText variant="title-light">{t('aboutMe.accordion.earnLabel')}</AppText>}>
            {earnList.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </AccordionItem>
          <AccordionItem label={<AppText variant="title-light">{t('aboutMe.accordion.howToHelpLabel')}</AppText>}>
            {howToHelp.map((item) => (
              <p key={item}>{item}</p>
            ))}
            <img src={icQrCodeDonation} alt="QRCode para ajudar" width={160} height={160} decoding="async" className="w-40 h-40 mt-4" />
          </AccordionItem>
        </Accordion>

        {/* REDES SOCIAIS */}
        <section className="rounded-md bg-bs-card p-4 border border-white/10 shadow">
          <SectionHeading 
            title={t('aboutMe.socialHeading')}
            subtitle={t('aboutMe.socialDescription')}
            underline={false} 
            className="mb-12" 
            card={false} 
            tone="dark" 
          />

          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Coluna esquerda: Instagrams */}
              <div className="flex flex-col gap-4">
                <a
                  href="https://www.instagram.com/balde_wb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#D6D6D6] transition-colors pt-4"
                >
                  <FaInstagram aria-hidden="true" className="text-lg" />
                  <span>{t('aboutMe.social.wallace')}</span>
                </a>
                <a
                  href="https://www.instagram.com/rolepaulistaoficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#D6D6D6] transition-colors pt-4"
                >
                  <FaInstagram aria-hidden="true" className="text-lg" />
                  <span>{t('aboutMe.social.role')}</span>
                </a>
              </div>
              {/* Coluna direita: LinkedIn e Email */}
              <div className="flex flex-col gap-4">
                <a
                  href="https://www.linkedin.com/in/wallace-baldenebre/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#D6D6D6] transition-colors pt-4"
                >
                  <FaLinkedin aria-hidden="true" className="text-lg" />
                  <span>{t('aboutMe.social.linkedin')}</span>
                </a>
                <a
                  href="mailto:wallace.baldenebre@gmail.com?subject=Contato%20sobre%20o%20Rol%C3%AA%20Paulista"
                  className="flex items-center gap-2 hover:text-[#D6D6D6] transition-colors pt-4 pb-4"
                >
                  <FaEnvelope aria-hidden="true" className="text-lg" />
                  <span>{t('aboutMe.social.email')}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL */}
        <p className="text-center text-[0.65rem] text-gray-500 pt-4 pb-10">
          {t('common.version')} 1.0 — {t('aboutMe.roleName')}
        </p>
      </div>
    </>
  );
}
