import { useState, useEffect } from 'react';
import gsap from 'gsap';

/**
 * useHandheldDrift
 * Simulates the "Unstable Witness" rule (Rule X) using GSAP.
 * Creates a weighted, organic drift that feels like a physical camera.
 */
export const useHandheldDrift = () => {
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a smooth, organic float
      gsap.to({}, {
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: function() {
          // Add a tiny bit of random noise on top of the sine wave
          const time = Date.now() * 0.001;
          setDrift({
            x: Math.sin(time * 0.7) * 12 + (Math.random() - 0.5) * 2,
            y: Math.cos(time * 0.5) * 8 + (Math.random() - 0.5) * 2,
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return drift;
};
