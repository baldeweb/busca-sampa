import React from 'react';
import icWarning from '@/assets/imgs/icons/ic_warning.png';

interface WarningTipProps {
    title: string;
    description: string;
    className?: string;
}

export const WarningTip: React.FC<WarningTipProps> = ({ title, description, className }) => {
    return (
        <div className={`flex items-start gap-3 rounded-lg border border-[#E0E0E0] bg-[#FFE7C0] p-3 ${className || ''}`.trim()}>
            <img src={icWarning} alt="" className="w-6 h-6 mt-0.5 object-contain" />
            <div>
                <h4 className="text-sm font-bold uppercase tracking-[0.06em] text-gray-700">
                    {title}
                </h4>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};
