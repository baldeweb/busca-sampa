import imgMe from "@/assets/imgs/etc/img_me.jpg";
import { FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { useNavigate } from 'react-router-dom';
import Toolbar from "../components/layout/Toolbar";
import { Accordion, AccordionItem } from '../components/ui/Accordion';

export function AboutMePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Toolbar onBack={() => navigate(-1)} />

      <div className="mx-auto max-w-4xl space-y-6 text-white">

        {/* FOTO + NOME */}
        <div className="flex flex-col items-center pt-16">
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

        {/* Accordion FAQ-style */}
        <Accordion>
          <AccordionItem label="Sobre mim">
            <div className="text-base leading-relaxed #48464C">
              <ul className="list-inside list-disc pl-5 space-y-2">
                <li>Mobile Engineering há 10 anos (se minha memória ainda estiver boa)</li>
                <li>Bateria, Guitarra e Vocal, fazendo tudo perfeitamente errado e desconexo com a realidade</li>
                <li>Cozinhar ao nível de saber fazer um belíssimo panetone salgado</li>
                <li>Viajante solo e mochileiro quando sobra uma graninha pra conhecer o mundo</li>
                <li>Falo Português (BR), Inglês, Espanhol e Russo (esse aqui ainda sigo estudando... Привет мой друг)</li>
                <li>Osasquense que ama São Paulo, e que também xinga a cidade na primeira oportunidade, mas sempre disposto a recomendar o melhor :)</li>
              </ul>
            </div>
          </AccordionItem>
          <AccordionItem label="O que é o Rolê Paulista?">
            <p>A ideia nasceu de uma planilha, na qual eu registrava os melhores rolês da cidade.</p>
            <p>Inicialmente eu preenchia apenas para mim, mas com o tempo, fui compartilhando com amigos e conhecidos, até que se tornou algo maior.</p>
            <p>Então, assim nasceu o Rolê Paulista, um site com experiência de app, para facilitar o acesso às melhores experiências da cidade nos quais eu vou visitar</p>
            <p>Independente se você é de São Paulo, ou de outro estado, ou de outro país, a experiência é para todos.</p>
          </AccordionItem>
          <AccordionItem label="Quanto eu ganho com isso?">
            <p>A resposta é bem simples: nada. O Rolê Paulista é um projeto pessoal, feito por paixão e amor pela cidade de São Paulo. Talvez futuramente eu ganhe com publicação ou adsense? Talvez, mas a ideia é que o site SEMPRE seja gratuito, tanto para quem acessa, quanto as postagens que eu faço dos locais.</p>
            <p>Eu não vou aceitar receber dinheiro por isso, principalmente para falar bem de um lugar, quero manter a integridade e a autenticidade do conteúdo, indo aos lugares e passando a experiência real para vocês na qual eu tive.</p>
            <p>Talvez leve um tempo até que eu suba as postagens no Instagram ou aqui no site, porque atualmente eu sou a equipe de infraestrutura, desenvolvimento, marketing, design e conteúdo, tudo ao mesmo tempo haha, por isso peço desculpas se demorar para atualizar alguma coisa :)</p>
          </AccordionItem>
        </Accordion>

        {/* REDES SOCIAIS */}
        <section className="rounded-md bg-bs-card p-4 border border-white/10 shadow">
          <SectionHeading title={t('aboutMe.socialHeading')} underline={false} sizeClass="text-base sm:text-lg" className="mb-1" />
          <p className="text-sm text-gray-300 mb-3">Me encontre nas redes sociais abaixo :)</p>

          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Coluna esquerda: Instagrams */}
              <div className="flex flex-col gap-4">
                <a
                  href="https://www.instagram.com/balde_wb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-bs-red transition-colors pt-4"
                >
                  <FaInstagram aria-hidden="true" className="text-lg" />
                  <span>Wallace Baldenebre</span>
                </a>
                <a
                  href="https://www.instagram.com/rolepaulistaoficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-bs-red transition-colors pt-4"
                >
                  <FaInstagram aria-hidden="true" className="text-lg" />
                  <span>Role Paulista</span>
                </a>
              </div>
              {/* Coluna direita: LinkedIn e Email */}
              <div className="flex flex-col gap-4">
                <a
                  href="https://www.linkedin.com/in/wallace-baldenebre/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-bs-red transition-colors pt-4"
                >
                  <FaLinkedin aria-hidden="true" className="text-lg" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="mailto:wallace.baldenebre@gmail.com?subject=Contato%20sobre%20o%20Rol%C3%AA%20Paulista"
                  className="flex items-center gap-2 hover:text-bs-red transition-colors pt-4 pb-4"
                >
                  <FaEnvelope aria-hidden="true" className="text-lg" />
                  <span>E-mail</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL */}
        <p className="text-center text-[0.65rem] text-gray-500 pt-4 pb-10">
          {t('common.version')} 1.0 — Role Paulista
        </p>
      </div>
    </>
  );
}
