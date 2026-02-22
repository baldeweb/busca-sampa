import flagSp from "@/assets/imgs/etc/logo-role-paulista.png";
import { LanguageButton } from "./LanguageButton";
import { useTranslation } from 'react-i18next';

export function Header() {
    const { t } = useTranslation();
    return (
        <>
            <header className="fixed top-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#212121] text-white border-b-4 border-bs-red z-40">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-4 py-6 sm:py-8">
                    {/* Logo + tagline (title removed). Mobile: stacked; Desktop: inline to the right */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 pe-4 flex-shrink-0">
                        <img
                            src={flagSp}
                            alt="Bandeira do estado de São Paulo"
                            className="h-[64px] w-[128px] sm:h-[68px] sm:w-[130px] me-4"
                        />
                    </div>

                    {/* Texto e botão de idioma */}
                    <div className="flex flex-col items-end">
                        <LanguageButton />
                        <p className="text-xs sm:text-sm text-gray-300 sm:mt-4 mt-2 mr-2 sm:mr-8 text-right">
                            {t('header.tagline')}
                        </p>
                    </div>
                </div>
            </header>
            <div className="h-[108px] sm:h-[128px]" aria-hidden="true" />
        </>
    );
}