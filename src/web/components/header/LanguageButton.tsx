import { useState } from "react";
import flagBrazil from "@/assets/imgs/flags/img_flag_brazil.png";
import usaFlag from "@/assets/imgs/flags/img_flag_usa.png";
import spainFlag from "@/assets/imgs/flags/img_flag_spain.png";
import franceFlag from "@/assets/imgs/flags/img_flag_france.png";
import chinaFlag from "@/assets/imgs/flags/img_flag_china.png";
import russiaFlag from "@/assets/imgs/flags/img_flag_russia.png";
import germanyFlag from "@/assets/imgs/flags/img_flag_germany.png";
import japanFlag from "@/assets/imgs/flags/img_flag_japan.png";
import italyFlag from "@/assets/imgs/flags/img_flag_italy.png";
import netherlandsFlag from "@/assets/imgs/flags/img_flag_netherlands.png";
import polandFlag from "@/assets/imgs/flags/img_flag_poland.png";
import turkiyeFlag from "@/assets/imgs/flags/img_flag_turkiye.png";
import arabicFlag from "@/assets/imgs/flags/img_flag_arabic.png";
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
        de: { label: 'Deutsch', flag: germanyFlag },
        ja: { label: '日本語', flag: japanFlag },
        it: { label: 'Italiano', flag: italyFlag },
        nl: { label: 'Nederlands', flag: netherlandsFlag },
        pl: { label: 'Polski', flag: polandFlag },
        tr: { label: 'Türkçe', flag: turkiyeFlag },
        ar: { label: 'العربية', flag: arabicFlag }
    };
    const current = map[lang] || map['pt'];
    const currentFlag = current.flag;
    const currentLanguage = current.label;

    const [hover, setHover] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            className={`inline-flex flex-row items-center gap-2 whitespace-nowrap rounded-md border ${hover ? 'border-bs-red bg-bs-red/10' : 'border-white/30 bg-bs-card'} px-4 py-1 text-[10px] font-medium uppercase transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-bs-red/30 w-fit relative top-0 right-0 ml-auto mr-0 sm:mr-8`}
            style={hover ? { backgroundColor: 'rgba(179,59,50,0.08)', borderColor: '#b33b32' } : undefined}
        >
            <img
                src={currentFlag}
                alt={currentLanguage}
                className={`h-5 w-5 rounded-full border border-white/40 transition-transform duration-150 ${hover ? 'scale-105' : ''}`}
            />
            <span className={hover ? 'text-black' : ''} style={hover ? { color: '#000000' } : undefined}>{currentLanguage}</span>
        </button>

            {open && <LanguageSelectorModal onClose={() => setOpen(false)} />}
        </>
    );
}