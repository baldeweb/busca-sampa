import flagSp from "@/assets/imgs/etc/logo-role-paulista.png";
import { LanguageButton } from "./LanguageButton";
import { useTranslation } from 'react-i18next';

export function Header() {
    const { t } = useTranslation();
    return (
        <header className="bg-bs-bg-header text-white border-b-4 border-bs-red">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-4 py-6 sm:py-8">
                {/* Logo + tagline (title removed). Mobile: stacked; Desktop: inline to the right */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-5 pe-4">
                    <img
                        src={flagSp}
                        alt="Bandeira do estado de São Paulo"
                        className="h-[60px] w-[130px] sm:h-[68px] sm:w-[130px]"
                    />
                    <p className="max-w-xs text-xs sm:text-sm text-gray-300">
                        {t('header.tagline')}
                    </p>
                </div>

                {/* Botão de idioma */}
                <LanguageButton />
            </div>
        </header>
    );
}