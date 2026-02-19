import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { Header } from "../header/Header";
import { NavigationBar } from "./NavigationBar";
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
        title: showHeader ? 'Rolê Paulista | Role Paulista' : undefined,
        description: showHeader ? 'A melhor recomendação, a poucos cliques de distância' : undefined,
    });

    useEffect(() => {
        const origin = window.location.origin;
        const homeUrl = `${origin}/`;

        const ensureMeta = (name: string, content: string) => {
            let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        const ensureCanonical = (href: string) => {
            let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                document.head.appendChild(link);
            }
            link.setAttribute('href', href);
        };

        const ensureJsonLd = (id: string, payload: object) => {
            let script = document.getElementById(id) as HTMLScriptElement | null;
            if (!script) {
                script = document.createElement('script');
                script.id = id;
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(payload);
        };

        ensureMeta('keywords', 'Rolê Paulista, Role Paulista, role paulista, rolê paulista, São Paulo, recomendações, restaurantes, bares, vida noturna');
        ensureCanonical(homeUrl);

        ensureJsonLd('seo-organization', {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Rolê Paulista',
            alternateName: ['Role Paulista', 'rolê paulista', 'role paulista'],
            url: homeUrl,
        });

        ensureJsonLd('seo-website', {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Rolê Paulista',
            alternateName: ['Role Paulista', 'rolê paulista', 'role paulista'],
            url: homeUrl,
            inLanguage: 'pt-BR',
            description: 'A melhor recomendação, a poucos cliques de distância',
        });

        ensureJsonLd('seo-home-itemlist', {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Categorias principais',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Abrem hoje', url: `${origin}/abrem-hoje` },
                { '@type': 'ListItem', position: 2, name: 'Gratuitos', url: `${origin}/gratuito` },
                { '@type': 'ListItem', position: 3, name: 'Restaurantes', url: `${origin}/restaurantes` },
                { '@type': 'ListItem', position: 4, name: 'Bares', url: `${origin}/bares` },
                { '@type': 'ListItem', position: 5, name: 'Vida Noturna', url: `${origin}/vida-noturna` },
                { '@type': 'ListItem', position: 6, name: 'Cafeterias', url: `${origin}/cafeterias` },
                { '@type': 'ListItem', position: 7, name: 'Natureza', url: `${origin}/natureza` },
                { '@type': 'ListItem', position: 8, name: 'Pontos Turísticos', url: `${origin}/pontos-turisticos` },
                { '@type': 'ListItem', position: 9, name: 'Diversão', url: `${origin}/diversao` },
            ],
        });
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-bs-bg text-white">
            {showHeader && <Header />}
            <main
                className={"flex-1 w-full pt-0"}
                style={{ paddingBottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}
            >
                <Outlet />
            </main>
            <NavigationBar />
        </div>
    );
}