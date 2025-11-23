import usaFlag from "@/assets/imgs/flags/img_flag_usa.png";
import brazilFlag from "@/assets/imgs/flags/img_flag_brazil.png";
import spainFlag from "@/assets/imgs/flags/img_flag_spain.png";
import franceFlag from "@/assets/imgs/flags/img_flag_france.png";
import chinaFlag from "@/assets/imgs/flags/img_flag_china.png";
import russiaFlag from "@/assets/imgs/flags/img_flag_russia.png";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';

const LANGUAGES = [
    { code: "pt", name: "Português (BR)", flag: brazilFlag },
    { code: "en", name: "English", flag: usaFlag },
    { code: "es", name: "Español", flag: spainFlag },
    { code: "fr", name: "Français", flag: franceFlag },
    { code: "ru", name: "Русский", flag: russiaFlag },
    { code: "zh", name: "中文", flag: chinaFlag }
];

interface Props {
    onClose: () => void;
}

export function LanguageSelectorModal({ onClose }: Props) {
    const { i18n, t } = useTranslation();
    const current = i18n.language;

    function handleSelect(code: string) {
        i18n.changeLanguage(code);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
            <div className="w-[90%] max-w-sm rounded-md border border-white/15 bg-bs-card text-white shadow-xl">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between border-b border-bs-red px-4 py-3">
                    <SectionHeading title={t('common.selectLanguage')} underline={false} sizeClass="text-sm" trackingClass="tracking-[0.18em]" className="flex-1" />
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-lg font-bold leading-none hover:text-bs-red"
                    >
                        ×
                    </button>
                </div>

                {/* Lista de idiomas */}
                <ul className="max-h-[60vh] overflow-y-auto py-2">
                    {LANGUAGES.map((lang) => (
                        <li key={lang.code}>
                            <button
                                type="button"
                                onClick={() => handleSelect(lang.code)}
                                className={`flex w-full items-center justify-between px-4 py-2 hover:bg-bs-red/70 ${current === lang.code ? 'bg-bs-red/40' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={lang.flag}
                                        alt={lang.name}
                                        className="h-6 w-6 rounded-full border border-white/40"
                                    />
                                    <span className="text-sm">{lang.name}</span>
                                </div>
                                {current === lang.code && <span className="text-xs font-bold">✓</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
