import React from 'react';
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '@/web/components/ui/SectionHeading';
import { Toolbar } from '@/web/components/layout/Toolbar';
import { useNavigate } from 'react-router-dom';
import icWalkingTour from '@/assets/imgs/icons/ic_walking_tour.png';

export function WalkingTourPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-bs-bg text-white flex flex-col">
            <Toolbar onBack={() => navigate(-1)} />

            <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-[#FFFFFF]">
                <div className="mx-auto max-w-5xl px-0 sm:px-12 pt-0 pb-6 sm:pb-12 text-black">
                    <div className="w-full bg-[#F5F5F5] border border-[#8492A6] rounded-b-[30px] px-4 py-8">
                        <div className="flex items-start gap-4">
                            <img src={icWalkingTour} alt="walking tour" className="w-12 h-12 object-contain" />
                            <div>
                                <SectionHeading title={t('walkingTour.title')} underline={false} sizeClass="text-2xl sm:text-3xl text-black" />
                                <p className="text-sm text-gray-600 max-w-2xl whitespace-pre-line leading-relaxed">{t('walkingTour.placeholder')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="flex-1">
                {/* Intentionally left empty: no filter and no place list on this screen */}
            </main>
        </div>
    );
}
