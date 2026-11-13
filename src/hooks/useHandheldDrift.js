import { useTransform, useTime } from 'framer-motion';

/**
 * useHandheldDrift
 * Simulates the "Unstable Witness" rule (Rule X).
 * Creates a weighted, organic drift that feels like a physical camera.
 * Runs on MotionValues only, so it never re-renders React.
 */
export const useHandheldDrift = () => {
  const time = useTime();

  const driftX = useTransform(time, (t) => Math.sin(t / 1400) * 12 + Math.sin(t / 700) * 2);
  const driftY = useTransform(time, (t) => Math.cos(t / 2000) * 8 + Math.cos(t / 900) * 2);

  return { x: driftX, y: driftY };
};
