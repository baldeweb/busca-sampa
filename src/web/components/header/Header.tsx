import flagSp from "@/assets/imgs/etc/logo-role-paulista.svg";
import { LanguageButton } from "./LanguageButton";
import { useTranslation } from 'react-i18next';

export function Header() {
    const { t } = useTranslation();
    return (
        <header className="bg-bs-bg-header text-white border-b-4 border-bs-red">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-4 py-6 sm:py-8">
                {/* Logo + título */}
                <div className="flex items-center gap-5 pe-4">
                    <img
                        src={flagSp}
                        alt="Bandeira do estado de São Paulo"
                        className="h-[60px] w-[150px] sm:h-[68px] sm:w-[150px]"
                    />

                    <div className="leading-tight">
                        <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-[0.08em]">
                            {t('header.title')}
                        </h1>
                        <p className="max-w-xs text-xs sm:text-sm text-gray-300">
                            {t('header.tagline')}
                        </p>
                    </div>
                </div>

                {/* Botão de idioma */}
                <LanguageButton />
            </div>
        </header>
    );
}