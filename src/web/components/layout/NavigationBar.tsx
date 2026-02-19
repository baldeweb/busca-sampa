import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import icHome from '../../../assets/imgs/icons/ic_home.png';
import icItinerary from '../../../assets/imgs/icons/ic_itinerary.png';
import icSearch from '../../../assets/imgs/icons/ic_search.png';
import icAbout from '../../../assets/imgs/icons/ic_about.png';

export function NavigationBar() {
    // Texto e ícones: cor alinhada com seção "Perto de mim"
    const baseClasses =
        "py-2 px-2 flex flex-col items-center justify-center flex-1 basis-0 text-[0.9rem] tracking-wide transition-colors";
    const getNavItemClass = (isActive: boolean, disableActiveBg?: boolean, roundedClass?: string) => {
        const activeBg = isActive && !disableActiveBg ? "bg-[#D6D6D6]" : "";
        return `${baseClasses} ${isActive ? "font-semibold" : ""} ${activeBg} hover:bg-[#D6D6D6] ${roundedClass || ""}`;
    };
    const { t } = useTranslation();
    const showRoteiros = true;
    const showBuscar = true;

    return (
        <footer
            className="fixed bottom-0 left-0 right-0 bg-[#F5F5F5] z-50 rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[0px] rounded-br-[0px]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)", WebkitPaddingEnd: "env(safe-area-inset-right)", borderTop: '1px solid #212121' }}
        >
            <div className="mx-auto max-w-5xl px-4">
                <nav className="flex text-[#212121] justify-center">

                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => getNavItemClass(isActive, true, "rounded-tl-[20px]")}
                >
                    <img src={icHome} alt="Home" className="w-5 h-5" />
                    <span className="footer-label">{t('footer.home')}</span>
                </NavLink>

                {showRoteiros && (
                    <NavLink
                        to="/roteiros"
                        className={({ isActive }) => getNavItemClass(isActive)}
                    >
                        <img src={icItinerary} alt={t('travelItinerary.title')} className="w-6 h-6" />
                        <span className="footer-label">{t('travelItinerary.title')}</span>
                    </NavLink>
                )}

                {showBuscar && (
                    <NavLink
                        to="/search"
                        className={({ isActive }) => getNavItemClass(isActive)}
                    >
                        <img src={icSearch} alt="Buscar" className="w-5 h-5" />
                        <span className="footer-label">{t('footer.search')}</span>
                    </NavLink>
                )}

                <NavLink
                    to="/about"
                    className={({ isActive }) => getNavItemClass(isActive, false, "rounded-tr-[20px]")}
                >
                    <img src={icAbout} alt="Sobre" className="w-5 h-5" />
                    <span className="footer-label">{t('footer.about')}</span>
                </NavLink>

                </nav>
            </div>
        </footer>
    );
}
