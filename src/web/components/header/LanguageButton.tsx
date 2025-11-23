import { useState } from "react";
import flagBrazil from "@/assets/imgs/flags/img_flag_brazil.png";
import usaFlag from "@/assets/imgs/flags/img_flag_usa.png";
import spainFlag from "@/assets/imgs/flags/img_flag_spain.png";
import franceFlag from "@/assets/imgs/flags/img_flag_france.png";
import chinaFlag from "@/assets/imgs/flags/img_flag_china.png";
import russiaFlag from "@/assets/imgs/flags/img_flag_russia.png";
import { LanguageSelectorModal } from "./LanguageSelectorModal";
import { useTranslation } from 'react-i18next';

export function LanguageButton() {
    const [open, setOpen] = useState(false);
    const { i18n } = useTranslation();

    const lang = i18n.language;
    const map: Record<string, { label: string; flag: string }> = {
        pt: { label: 'Português', flag: flagBrazil },
        en: { label: 'English', flag: usaFlag },
        es: { label: 'Español', flag: spainFlag },
        fr: { label: 'Français', flag: franceFlag },
        ru: { label: 'Русский', flag: russiaFlag },
        zh: { label: '中文', flag: chinaFlag },
    };
    const current = map[lang] || map['pt'];
    const currentFlag = current.flag;
    const currentLanguage = current.label;

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex flex-col items-center gap-1 rounded-md border border-white/30 bg-bs-card px-1.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors hover:border-bs-red"
        >
            <img
                src={currentFlag}
                alt={currentLanguage}
                className="h-5 w-5 rounded-full border border-white/40"
            />
            <span>{currentLanguage}</span>
        </button>

            {open && <LanguageSelectorModal onClose={() => setOpen(false)} />}
        </>
    );
}