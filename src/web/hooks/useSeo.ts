import { useEffect, useRef } from 'react';

interface SeoOptions {
  title?: string;
  description?: string;
}

export function useSeo({ title, description }: SeoOptions) {
  const prevTitle = useRef<string>(document.title || '');
  const metaSelector = 'meta[name="description"]';
  const prevDescription = useRef<string | null>(null);

  useEffect(() => {
    if (title) document.title = title;

    const existing = document.querySelector(metaSelector) as HTMLMetaElement | null;
    if (existing) {
      prevDescription.current = existing.getAttribute('content');
      if (description) existing.setAttribute('content', description);
    } else if (description) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
      // indicate that prevDescription is null so we remove on cleanup
      prevDescription.current = null;
    }

    return () => {
      if (title) document.title = prevTitle.current;
      try {
        const current = document.querySelector(metaSelector) as HTMLMetaElement | null;
        if (current) {
          if (prevDescription.current !== null) {
            current.setAttribute('content', prevDescription.current || '');
          } else if (description) {
            // we previously inserted this meta tag; remove it
            current.parentNode?.removeChild(current);
          }
        }
      } catch (_) {}
    };
  }, [title, description]);
}
