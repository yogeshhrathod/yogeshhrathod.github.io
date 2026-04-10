import { useState, useEffect, useMemo } from 'react';
import { useMotionValue, useSpring, useTransform, useTime } from 'framer-motion';

/**
 * useHandheldDrift
 * Simulates the "Unstable Witness" rule (Rule X).
 * Creates a weighted, organic drift that feels like a physical camera.
 * Optimized to use MotionValues to avoid React re-renders.
 */
export const useHandheldDrift = () => {
  const time = useTime();
  
  // Use transforms to create smooth paths from time
  const driftX = useTransform(time, t => Math.sin(t / 1400) * 12 + Math.sin(t / 700) * 2);
  const driftY = useTransform(time, t => Math.cos(t / 2000) * 8 + Math.cos(t / 900) * 2);

  return { x: driftX, y: driftY };
};
