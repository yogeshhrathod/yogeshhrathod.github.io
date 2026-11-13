import React, { useRef } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSceneStyle } from '../hooks/useSceneStyle';
import { profile } from '../data/resume';

const TITLE_CLASS = 'titan-title text-[14vw] md:text-[15vw] leading-none text-center select-none';
const TITLE_STYLE = { letterSpacing: '0.2em', marginRight: '-0.2em' };
// Only opacity / transform / filter are animated: nothing here triggers layout.
const TITLE_INTRO = {
  initial: { filter: 'blur(18px)', opacity: 0, scale: 0.86 },
  transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
};

export const TheMonolith = ({ progress, range }) => {
  const [start, end] = range;
  const span = end - start;
  const at = (t) => start + span * t;

  const sceneStyle = useSceneStyle(progress, range, { holdStart: true });
  const monolithScale = useTransform(progress, [start, end], [1, 3.2]);
  const monolithOpacity = useTransform(progress, [at(0.45), at(0.85)], [1, 0]);
  const hintOpacity = useTransform(progress, [start, at(0.15)], [1, 0]);

  const flashlightX = useMotionValue(0);
  const flashlightY = useMotionValue(0);
  const flashlightOpacity = useMotionValue(0);
  const titleContainerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!titleContainerRef.current) return;
    const rect = titleContainerRef.current.getBoundingClientRect();
    // The title is scaled by scroll: convert back to its own unscaled pixels.
    const k = rect.width / titleContainerRef.current.offsetWidth || 1;
    flashlightX.set((e.clientX - rect.left) / k);
    flashlightY.set((e.clientY - rect.top) / k);
  };

  const flashlightClipPath = useTransform(
    [flashlightX, flashlightY],
    ([x, y]) => `circle(150px at ${x}px ${y}px)`
  );

  const sonicOpacity = useTransform(progress, [at(0.6), at(0.72), at(0.86), at(0.98)], [0, 0.14, 0.14, 0]);
  const sonicScale = useTransform(progress, [at(0.6), end], [0.9, 1.2]);

  return (
    <motion.section style={sceneStyle} className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        style={{ scale: monolithScale, opacity: monolithOpacity }}
        className="flex flex-col items-center will-change-transform"
      >
        <div
          ref={titleContainerRef}
          className="relative cursor-default z-20"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => flashlightOpacity.set(1)}
          onMouseLeave={() => flashlightOpacity.set(0)}
        >
          <motion.h1
            {...TITLE_INTRO}
            animate={{ filter: 'blur(0px)', opacity: 0.4, scale: 1 }}
            style={TITLE_STYLE}
            className={`${TITLE_CLASS} text-stark`}
          >
            YOGESH<br />RATHOD
          </motion.h1>

          {/* HOVER LAYER */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: flashlightOpacity,
              clipPath: flashlightClipPath,
              WebkitClipPath: flashlightClipPath,
            }}
          >
            <motion.div
              {...TITLE_INTRO}
              animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
              style={TITLE_STYLE}
              className={`${TITLE_CLASS} metallic-chrome`}
            >
              YOGESH<br />RATHOD
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9, ease: 'easeOut' }}
          className="mt-8 md:mt-12 flex flex-col items-center gap-4 md:gap-6 px-6 text-center"
        >
          <span className="minimal-body text-molten-red opacity-100 font-bold text-xs md:text-xl tracking-[0.3rem] md:tracking-[0.8rem]">{profile.tagline}</span>
          <span className="minimal-body italic opacity-80 text-[10px] md:text-sm">
            {profile.title} / {profile.focus} / {profile.location}
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -500 }}
        animate={{ opacity: 0.2, x: 0 }}
        transition={{ duration: 4, ease: 'easeOut' }}
        className="god-ray left-1/4 top-[-20%]"
      />
      <motion.div
        initial={{ opacity: 0, x: 500 }}
        animate={{ opacity: 0.15, x: 0 }}
        transition={{ duration: 4, ease: 'easeOut', delay: 0.4 }}
        className="god-ray right-1/4 top-[-10%]"
      />

      {/* SCROLL CUE */}
      <motion.div style={{ opacity: hintOpacity }} className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.2 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="minimal-body text-[9px] opacity-50 tracking-[0.4rem]">SCROLL</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
            <ChevronDown className="w-4 h-4 text-stark/50" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* PROTAGONIST EXPRESSION: AHHHHH (SONIC REVEAL) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[150]"
        style={{ opacity: sonicOpacity, scale: sonicScale }}
      >
        <span className="titan-title text-[18vw] text-molten-red whitespace-nowrap" style={TITLE_STYLE}>AHHHHH</span>
        {/* Sonic Ripple */}
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
          className="absolute w-[50vw] h-[50vw] border border-molten-red/30 rounded-full"
        />
      </motion.div>
    </motion.section>
  );
};
