import { useTransform } from 'framer-motion';
import { FADE } from '../timeline';

/**
 * Scroll-driven visibility for a scene. Everything is a MotionValue, so a
 * scene fades in and out without a single React re-render, and is fully
 * removed from painting / hit-testing while it is off screen.
 */
export const useSceneStyle = (progress, [start, end], { fade = FADE, holdStart = false, holdEnd = false } = {}) => {
  const input = [];
  const output = [];
  if (!holdStart) { input.push(start, start + fade); output.push(0, 1); }
  if (!holdEnd) { input.push(end - fade, end); output.push(1, 0); }
  if (input.length < 2) { input.unshift(start - 1); output.unshift(output[0]); }

  const opacity = useTransform(progress, input, output);
  const visibility = useTransform(opacity, (o) => (o > 0.001 ? 'visible' : 'hidden'));
  const pointerEvents = useTransform(opacity, (o) => (o > 0.6 ? 'auto' : 'none'));

  return { opacity, visibility, pointerEvents };
};
