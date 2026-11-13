import { useEffect, useState } from 'react';

/**
 * Viewport height that ignores the mobile URL bar sliding in and out.
 * Reacting to those ~60-100px changes would rescale the whole timeline
 * mid-scroll and make every scene jump.
 */
export const useViewportHeight = () => {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));

  useEffect(() => {
    const onResize = () => {
      setSize((prev) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w === prev.w && Math.abs(h - prev.h) < 130) return prev;
        return { w, h };
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size.h;
};
