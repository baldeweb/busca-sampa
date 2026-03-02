import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import AppLayout from "../components/layout/AppLayout";

const HomePage = lazy(() => import("../features/HomePage").then((m) => ({ default: m.HomePage })));
const NeighborhoodListPage = lazy(() => import("../features/NeighborhoodListPage").then((m) => ({ default: m.NeighborhoodListPage })));
const RecommendationsOriginPage = lazy(() => import("../features/RecommendationsOriginPage").then((m) => ({ default: m.RecommendationsOriginPage })));
const HowToRecommendPage = lazy(() => import("../features/HowToRecommendPage").then((m) => ({ default: m.HowToRecommendPage })));
const SupportPage = lazy(() => import("../features/SupportPage").then((m) => ({ default: m.SupportPage })));
const PlaceListPage = lazy(() => import("../features/PlaceListPage").then((m) => ({ default: m.PlaceListPage })));
const PlaceDetailPage = lazy(() => import("../features/PlaceDetailPage").then((m) => ({ default: m.PlaceDetailPage })));
const AboutMePage = lazy(() => import("../features/AboutMePage").then((m) => ({ default: m.AboutMePage })));
const TravelItineraryPage = lazy(() => import("../features/TravelItineraryPage").then((m) => ({ default: m.TravelItineraryPage })));
const SearchPage = lazy(() => import("../features/SearchPage").then((m) => ({ default: m.SearchPage })));

function withSuspense(element: React.ReactElement) {
    return <Suspense fallback={null}>{element}</Suspense>;
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { path: "/", element: withSuspense(<HomePage />) },
            { path: "/bairro/:slug", element: withSuspense(<NeighborhoodListPage />) },
            { path: "/neighborhood/:slug", element: withSuspense(<NeighborhoodListPage />) },
            
            { path: "/recommendations-origin", element: withSuspense(<RecommendationsOriginPage />) },
            { path: "/how-to-recommend", element: withSuspense(<HowToRecommendPage />) },
            { path: "/support", element: withSuspense(<SupportPage />) },

            //  Travel itineraries (specific route must be before the generic "/:type")
            { path: "/roteiros", element: withSuspense(<TravelItineraryPage />) },
            { path: "/travel-itinerary", element: withSuspense(<TravelItineraryPage />) },
            { path: "/search", element: withSuspense(<SearchPage />) },
            //  Listagens (friendly list route: /:type, ex: /restaurants, /bars)
            { path: "/:type", element: withSuspense(<PlaceListPage />) },


            //  Detalhes do local (friendly slug route: /:type/:slug)
            { path: "/:type/:slug", element: withSuspense(<PlaceDetailPage />) },
            //  Detalhes - legacy routes (mantidas para compatibilidade)
            { path: "/place/:category/:id", element: withSuspense(<PlaceDetailPage />) },
            { path: "/place/:id", element: withSuspense(<PlaceDetailPage />) },

            //  Pagina Sobre
            { path: "/about", element: withSuspense(<AboutMePage />) },
        ],
    },
]);
