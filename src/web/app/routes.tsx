import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import { PlaceDetailPage } from "../features/PlaceDetailPage";
import { HomePage } from "../features/HomePage";
import { NeighborhoodListPage } from "../features/NeighborhoodListPage";
import { AboutMePage } from "../features/AboutMePage";
import { RecommendationsOriginPage } from "../features/RecommendationsOriginPage";
import { HowToRecommendPage } from "../features/HowToRecommendPage";
import { SupportPage } from "../features/SupportPage";
// RestaurantsPage was removed from explicit routes to let the generic PlaceListPage handle '/restaurants'
import { PlaceListPage } from "../features/PlaceListPage";
import { TravelItineraryPage } from "../features/TravelItineraryPage";
import { SearchPage } from "../features/SearchPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/bairro/:slug", element: <NeighborhoodListPage /> },
            { path: "/neighborhood/:slug", element: <NeighborhoodListPage /> },
            
            { path: "/recommendations-origin", element: <RecommendationsOriginPage /> },
            { path: "/how-to-recommend", element: <HowToRecommendPage /> },
            { path: "/support", element: <SupportPage /> },

            //  Travel itineraries (specific route must be before the generic "/:type")
            { path: "/roteiros", element: <TravelItineraryPage /> },
            { path: "/travel-itinerary", element: <TravelItineraryPage /> },
            { path: "/search", element: <SearchPage /> },
            //  Listagens (friendly list route: /:type, ex: /restaurants, /bars)
            { path: "/:type", element: <PlaceListPage /> },


            //  Detalhes do local (friendly slug route: /:type/:slug)
            { path: "/:type/:slug", element: <PlaceDetailPage /> },
            //  Detalhes - legacy routes (mantidas para compatibilidade)
            { path: "/place/:category/:id", element: <PlaceDetailPage /> },
            { path: "/place/:id", element: <PlaceDetailPage /> },

            //  Pagina Sobre
            { path: "/about", element: <AboutMePage /> },
        ],
    },
]);
