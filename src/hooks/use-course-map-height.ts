import { useLayoutEffect, type RefObject } from 'react';

export const useCourseMapHeight = (
  mapRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  conclusionRef: RefObject<HTMLDivElement | null>,
) =>
  useLayoutEffect(() => {
    const map = mapRef.current;
    const content = contentRef.current;
    const conclusion = conclusionRef.current;
    if (!map || !content || !conclusion) {
      return undefined;
    }

    const syncHeight = () => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      const contentTop = content.getBoundingClientRect().top;
      const conclusionBottom = conclusion.getBoundingClientRect().bottom;
      const mapHeight = `${conclusionBottom - contentTop}px`;
      map.style.height = desktop ? mapHeight : '';
      map.style.maxHeight = desktop ? mapHeight : '';
      map.style.minHeight = desktop ? mapHeight : '';
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(content);
    observer.observe(conclusion);
    window.addEventListener('resize', syncHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeight);
      map.style.height = '';
      map.style.maxHeight = '';
      map.style.minHeight = '';
    };
  }, [conclusionRef, contentRef, mapRef]);
