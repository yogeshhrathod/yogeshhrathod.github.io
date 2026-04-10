import { useState, useEffect } from 'react';

export const useHandheldDrift = () => {
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let time = 0;
    const animate = () => {
      time += 0.02;
      setDrift({
        x: Math.sin(time * 0.7) * 5,
        y: Math.cos(time * 0.5) * 5,
      });
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return drift;
};
