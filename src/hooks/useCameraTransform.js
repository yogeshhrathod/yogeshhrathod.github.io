import { useTransform } from 'framer-motion';

export const useCameraTransform = (xPercent, yPercent, drift, currentScroll) => {
  // We use useTransform to combine multiple motion values into a single transform string
  // This happens outside of React's render cycle!
  
  return useTransform(
    [xPercent, yPercent, drift.x, drift.y],
    ([x, y, dx, dy]) => {
      // Disable tilt on contact page for stability
      const isContactPage = currentScroll >= 23000; // Use a reasonable threshold
      const tiltX = isContactPage ? 0 : (y * 5 + dy * 0.2);
      const tiltY = isContactPage ? 0 : (-x * 5 + dx * 0.2);
      
      return `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0px)`;
    }
  );
};
