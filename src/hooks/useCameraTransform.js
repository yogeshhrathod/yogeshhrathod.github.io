import { useEffect } from 'react';
import { animate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useHandheldDrift } from './useHandheldDrift';
import { SCENES } from '../timeline';

/**
 * The camera: mouse parallax + handheld drift + haptic impact shake.
 * Returns independent transform MotionValues for the fixed viewport, so the
 * browser only ever composites — nothing here touches React state or layout.
 */
export const useCameraTransform = (progress) => {
  const reduced = useReducedMotion();
  const drift = useHandheldDrift();

  const mouseX = useSpring(0, { stiffness: 50, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mouseX, mouseY]);

  // The camera settles to a locked-off shot as the contact scene arrives.
  const contact = SCENES.CONTACT[0];
  const tilt = useTransform(progress, [contact - 0.4, contact], [reduced ? 0 : 1, 0]);

  const rotateX = useTransform([mouseY, drift.y, tilt], ([y, dy, k]) => (y * 5 + dy * 0.2) * k);
  const rotateY = useTransform([mouseX, drift.x, tilt], ([x, dx, k]) => (-x * 5 + dx * 0.2) * k);

  // Visual haptics: only real impacts move the frame, hovers do not.
  const shake = useMotionValue(0);
  useEffect(() => {
    if (reduced) return undefined;
    const onImpact = (e) => {
      const i = e.detail?.intensity ?? 0;
      if (i < 3) return;
      animate(shake, [0, -i, i, -i / 2, 0], { duration: 0.22, ease: 'easeOut' });
    };
    window.addEventListener('ui-haptic-impact', onImpact);
    return () => window.removeEventListener('ui-haptic-impact', onImpact);
  }, [shake, reduced]);

  return { rotateX, rotateY, x: shake, y: shake, transformPerspective: 1000 };
};
