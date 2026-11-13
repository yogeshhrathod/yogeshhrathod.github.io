import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useSceneStyle } from '../hooks/useSceneStyle';
import { FADE, clamp01 } from '../timeline';

/**
 * A full-screen shot whose content is taller than the frame.
 * Scroll progress across `range` pans the content from its first line to its
 * last. The pan distance is measured from the real DOM, so the shot always
 * ends exactly on the final item no matter the screen size or content length.
 */
export const ScrollTrack = ({ progress, range, title, children, className = '' }) => {
  const [start, end] = range;
  const sceneStyle = useSceneStyle(progress, range);
  const frameRef = useRef(null);
  const trackRef = useRef(null);
  const [extent, setExtent] = useState(0);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const track = trackRef.current;
    if (!frame || !track) return undefined;
    const measure = () => setExtent(Math.max(0, track.offsetHeight - frame.clientHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const panStart = start + FADE * 0.5;
  const panEnd = end - FADE * 1.5;
  const y = useTransform(progress, (p) => -clamp01((p - panStart) / (panEnd - panStart)) * extent);

  return (
    <motion.section ref={frameRef} style={sceneStyle} className="absolute inset-0 overflow-hidden">
      {/* MASSIVE SECTION HEADER */}
      <div className="absolute inset-x-0 top-[12%] flex justify-center pointer-events-none opacity-[0.07]" aria-hidden="true">
        <span className="titan-title text-[22vw] whitespace-nowrap">{title}</span>
      </div>

      <div className="scene-mask absolute inset-0">
        <motion.div
          ref={trackRef}
          style={{ y }}
          className={`mx-auto w-full px-5 md:px-12 pt-[36vh] pb-[38vh] will-change-transform ${className}`}
        >
          <h2 className="sr-only">{title}</h2>
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};
