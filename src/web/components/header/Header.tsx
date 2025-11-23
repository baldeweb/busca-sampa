import flagSp from "@/assets/imgs/flags/flag_sp.png";
import { LanguageButton } from "./LanguageButton";
import { useTranslation } from 'react-i18next';

export function Header() {
    const { t } = useTranslation();
    return (
        <header className="bg-bs-bg-header text-white border-b-4 border-bs-red">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 sm:px-10 lg:px-4 py-8">
                {/* Logo + título */}
                <div className="flex items-center gap-5">
                    <img
                        src={flagSp}
                        alt="Bandeira do estado de São Paulo"
                        className="h-[64px] w-[64px] rounded-app"
                    />

                    <div className="leading-tight">
                        <h1 className="text-2xl font-extrabold uppercase tracking-[0.08em]">
                            {t('header.title')}
                        </h1>
                        <p className="max-w-xs text-sm text-gray-300">
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