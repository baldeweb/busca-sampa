import { useEffect, useState } from 'react';

export function useEnvironmentVisibleCount(): number {
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

  return isSmUp ? 8 : 4;
}
