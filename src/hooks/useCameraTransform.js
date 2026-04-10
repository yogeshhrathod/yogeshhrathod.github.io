import { useMemo } from 'react';

export const useCameraTransform = (mousePos, drift, currentScroll) => {
  return useMemo(() => {
    // Disable tilt on contact page for stability or according to design
    const isContactPage = currentScroll >= 8400; 
    const tiltX = isContactPage ? 0 : (mousePos.y * 5 + drift.y * 0.2);
    const tiltY = isContactPage ? 0 : (-mousePos.x * 5 + drift.x * 0.2);
    
    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0px)`,
    };
  }, [mousePos, drift, currentScroll]);
};
