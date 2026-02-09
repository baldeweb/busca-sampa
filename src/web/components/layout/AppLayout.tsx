import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { Header } from "../header/Header";
import { AppFooter } from "./AppFooter";
import { useSeo } from '@/web/hooks/useSeo';

export default function AppLayout() {
    const location = useLocation();
    const showHeader = location.pathname === "/";

    useEffect(() => {
        // On route change, scroll to top so page header / top content is visible
        try {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            // Also ensure html/body are at top for mobile/ios quirks
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch (e) {
            /* ignore */
        }
    }, [location.pathname]);

    // SEO: set homepage title and description so search engines display the desired text
    useSeo({
        title: showHeader ? 'Rolê Paulista' : undefined,
        description: showHeader ? 'A melhor recomendação, com poucos cliques de distância' : undefined,
    });

    return (
        <div className="min-h-screen flex flex-col bg-bs-bg text-white">
            {showHeader && <Header />}
            <main
                className={"flex-1 w-full pt-0"}
                style={{ paddingBottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}
            >
                <Outlet />
            </main>
            <AppFooter />
        </div>
    );
}