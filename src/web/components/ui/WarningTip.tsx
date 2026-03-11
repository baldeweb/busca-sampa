import React from 'react';
import icWarning from '@/assets/imgs/icons/ic_warning.png';
import { AppText } from './AppText';

interface WarningTipProps {
    title: string;
    description: string;
    className?: string;
}

export const WarningTip: React.FC<WarningTipProps> = ({ title, description, className }) => {
    return (
        <div className={`flex items-start gap-3 rounded-lg border border-[#E0E0E0] bg-[#FFE7C0] p-3 ${className || ''}`.trim()}>
            <img src={icWarning} alt="" className="w-5 h-5 mt-1 ml-1 object-contain" />
            <div>         
                <AppText variant="title-light" className="truncate">{title}</AppText>
                <AppText variant="body-light" className="mt-1 leading-relaxed">{description}</AppText>
            </div>
        </div>
    );
};
