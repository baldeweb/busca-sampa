import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export function AppFooter() {
    // Aumenta texto (+4px aprox) e ícones um nível
    const baseClasses =
        "flex flex-col items-center justify-center flex-1 text-[0.9rem] tracking-wide";
    const { t } = useTranslation();

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-bs-bg-header border-t border-white/10 z-40 h-20">
            <nav className="flex text-white pt-3 pb-2">

                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `${baseClasses} ${isActive ? "text-bs-red font-semibold" : "text-gray-300"}`
                    }
                >
                    <span className="text-2xl">🏠</span>
                    <span>{t('footer.home')}</span>
                </NavLink>

                <NavLink
                    to="/search"
                    className={({ isActive }) =>
                        `${baseClasses} ${isActive ? "text-bs-red font-semibold" : "text-gray-300"}`
                    }
                >
                    <span className="text-2xl">🔍</span>
                    <span>{t('footer.search')}</span>
                </NavLink>

                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        `${baseClasses} ${isActive ? "text-bs-red font-semibold" : "text-gray-300"}`
                    }
                >
                    <span className="text-2xl">👤</span>
                    <span>{t('footer.about')}</span>
                </NavLink>

            </nav>
        </footer>
    );
}
