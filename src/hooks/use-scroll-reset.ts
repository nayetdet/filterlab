import { useEffect } from 'react';

export const useScrollReset = (key: string) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [key]);
};
