import { useEffect, useState } from 'react';

export function useEnvironmentVisibleCount(totalEnvironments: number, showViewMore = true): number {
  const getIsSmUp = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
    return window.matchMedia('(min-width: 640px)').matches;
  };

  const [isSmUp, setIsSmUp] = useState<boolean>(getIsSmUp);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const media = window.matchMedia('(min-width: 640px)');
    const update = () => setIsSmUp(media.matches);

    update();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  const maxItems = isSmUp ? 17 : 7;
  const baseSlots = maxItems - 1;
  const hasViewMore = showViewMore && totalEnvironments > baseSlots;
  return Math.max(baseSlots - (hasViewMore ? 1 : 0), 0);
}
