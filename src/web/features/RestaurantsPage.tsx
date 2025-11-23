import { useRecommendationList } from "@/web/hooks/useRecommendationList";
import { PlaceGrid } from "@/web/components/place/PlaceGrid";
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';

export function RestaurantsPage() {
    const { t } = useTranslation();
    const { data, loading, error } = useRecommendationList("restaurants");
    return (
        <div className="space-y-5">
            <div>
                <SectionHeading title={t('placeType.RESTAURANT')} sizeClass="text-xl text-black" trackingClass="tracking-[0.18em]" />
            </div>
            {loading && <p className="text-sm text-gray-300">{t('common.loading')}</p>}
            {error && (
                <p className="text-sm text-red-400">{t('common.loadError')}</p>
            )}
            {!loading && !error && (
                <PlaceGrid places={data} />
            )}
        </div>
    );
}
