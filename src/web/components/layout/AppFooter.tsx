import React from 'react';
import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import icHome from '../../../assets/imgs/icons/ic_home.png';
import icSearch from '../../../assets/imgs/icons/ic_search.png';
import icAbout from '../../../assets/imgs/icons/ic_about.png';

export function AppFooter() {
    // Aumenta texto (+4px aprox) e ícones um nível
    const baseClasses =
        "flex flex-col items-center justify-center flex-1 text-[0.7rem] tracking-wide";
    const { t } = useTranslation();
    const [showSearchModal, setShowSearchModal] = React.useState(false);

    return (
        <footer
            className="fixed bottom-0 left-0 right-0 bg-bs-bg-header border-t border-white/10 z-50"
            style={{ paddingBottom: "env(safe-area-inset-bottom)", WebkitPaddingEnd: "env(safe-area-inset-right)" }}
        >
            <nav className="flex text-white pt-2 pb-2">

                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `${baseClasses} ${isActive ? "font-semibold" : "text-gray-300"}`
                    }
                    style={({ isActive }) => (isActive ? { color: '#F59D98' } : undefined)}
                >
                    <img src={icHome} alt="Home" className="w-6 h-6 mb-0.5" />
                    <span>{t('footer.home')}</span>
                </NavLink>

                <button
                    onClick={() => setShowSearchModal(true)}
                    className={
                        `${baseClasses} text-gray-300 focus:outline-none`
                    }
                    aria-haspopup="dialog"
                    aria-expanded={showSearchModal}
                >
                    <img src={icSearch} alt="Buscar" className="w-6 h-6 mb-0.5" />
                    <span>{t('footer.search')}</span>
                </button>

                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        `${baseClasses} ${isActive ? "font-semibold" : "text-gray-300"}`
                    }
                    style={({ isActive }) => (isActive ? { color: '#F59D98' } : undefined)}
                >
                    <img src={icAbout} alt="Sobre" className="w-6 h-6 mb-0.5" />
                    <span>{t('footer.about')}</span>
                </NavLink>

            </nav>
            {/* Modal de aviso: funcionalidade em desenvolvimento */}
            {showSearchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-bs-card rounded-lg shadow-lg w-[90vw] max-w-md border border-white">
                        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-bs-red">
                            <SectionHeading title={t('footer.search')} underline={false} sizeClass="text-lg" className="flex-1" />
                            <button onClick={() => setShowSearchModal(false)} className="text-white text-xl font-bold">×</button>
                        </div>
                        <div className="p-5 text-center">
                            <p className="mb-2 text-sm text-gray-200">Esta funcionalidade esta em desenvolvimento :)</p>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}

