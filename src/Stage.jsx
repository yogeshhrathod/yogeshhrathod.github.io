import React, { useEffect, useRef, useState } from 'react';
import { cancelFrame, frame, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { ReactLenis, useLenis } from 'lenis/react';
import { FileText } from 'lucide-react';
import { cn } from './utils';
import { SubmergedParticles } from './components/SubmergedParticles';
import { NarrativeInterlude } from './components/NarrativeInterlude';
import { FastReadOverlay } from './components/FastReadOverlay';
import { SoundControl } from './components/SoundControl';
import { useSound } from './context/SoundContext';
import { useHaptics } from './context/HapticContext';
import { TheMonolith } from './scenes/TheMonolith';
import { TheArchive } from './scenes/TheArchive';
import { TheEngine } from './scenes/TheEngine';
import { TheFoundation } from './scenes/TheFoundation';
import { TheInversion } from './scenes/TheInversion';
import { useCameraTransform } from './hooks/useCameraTransform';
import { useCinematicScript } from './hooks/useCinematicScript';
import { useViewportHeight } from './hooks/useViewportHeight';
import { DIALOGUE_RANGES, FADE, SCENES, TOTAL_SCROLL } from './timeline';

const LENIS_OPTIONS = { lerp: 0.1, smoothWheel: true, autoRaf: false };

const NAV = [
  { label: 'START', range: SCENES.START, target: 0 },
  { label: 'PROJECTS', range: SCENES.PROJECTS, target: SCENES.PROJECTS[0] + FADE },
  { label: 'EXPERIENCE', range: SCENES.EXPERIENCE, target: SCENES.EXPERIENCE[0] + FADE },
  { label: 'FOUNDATION', range: SCENES.FOUNDATION, target: SCENES.FOUNDATION[0] + FADE },
  { label: 'CONTACT', range: [SCENES.CONTACT[0], Infinity], target: TOTAL_SCROLL },
];

const activeIndexAt = (p) => NAV.findIndex(({ range }) => p >= range[0] && p < range[1]);

/**
 * The "Director's Monitor".
 * One MotionValue — `progress`, scroll measured in viewport-heights — drives
 * every scene. Scrolling never re-renders React; only discrete changes do
 * (the active nav item, a newly typed character).
 */
export const Stage = () => {
  const { play } = useSound();
  const { trigger } = useHaptics();
  const [isFastReadOpen, setIsFastReadOpen] = useState(false);

  const vH = useViewportHeight();
  const vhRef = useRef(vH);
  const progress = useMotionValue(window.scrollY / vH);

  const lenis = useLenis(({ scroll }) => progress.set(scroll / vhRef.current));

  useEffect(() => {
    vhRef.current = vH;
    progress.set(window.scrollY / vH);
  }, [vH, progress]);

  // Step Lenis from framer-motion's frame loop so the smoothed scroll position
  // and every transform derived from it land in the same frame.
  useEffect(() => {
    if (!lenis) return undefined;
    const update = ({ timestamp }) => lenis.raf(timestamp);
    frame.update(update, true);
    return () => cancelFrame(update);
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;
    if (isFastReadOpen) lenis.stop();
    else lenis.start();
  }, [isFastReadOpen, lenis]);

  const [active, setActive] = useState(() => activeIndexAt(progress.get()));
  useMotionValueEvent(progress, 'change', (p) => setActive(activeIndexAt(p)));

  const camera = useCameraTransform(progress);
  useCinematicScript(progress);

  // Dust and the resume shortcut belong to the dark world; both leave as the
  // frame inverts to light for the contact scene.
  const contact = SCENES.CONTACT[0];
  const particleOpacity = useTransform(progress, [contact - 0.4, contact], [0.5, 0]);
  const darkUiOpacity = useTransform(progress, [contact - 0.2, contact + 0.1], [1, 0]);
  const darkUiEvents = useTransform(darkUiOpacity, (o) => (o > 0.5 ? 'auto' : 'none'));

  return (
    <>
      <ReactLenis root options={LENIS_OPTIONS} />

      <div className="relative bg-charcoal" style={{ height: (TOTAL_SCROLL + 1) * vH }}>
        <div className="vignette" />
        <div className="ambient-pool" />
        <SubmergedParticles opacity={particleOpacity} />
        <NarrativeInterlude progress={progress} ranges={DIALOGUE_RANGES} />

        <FastReadOverlay isOpen={isFastReadOpen} onClose={() => setIsFastReadOpen(false)} />

        {/* FIXED CAMERA VIEWPORT */}
        <div
          className={cn(
            'fixed inset-0 overflow-hidden transition-[opacity,scale] duration-700 ease-out',
            isFastReadOpen ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          )}
        >
          <motion.main style={camera} className="absolute inset-0 will-change-transform">
            <TheMonolith progress={progress} range={SCENES.START} />
            <TheArchive progress={progress} range={SCENES.PROJECTS} />
            <TheEngine progress={progress} range={SCENES.EXPERIENCE} />
            <TheFoundation progress={progress} range={SCENES.FOUNDATION} />
            <TheInversion progress={progress} range={SCENES.CONTACT} />
          </motion.main>
        </div>

        {/* RESUME SHORTCUT */}
        <motion.div
          style={{ opacity: darkUiOpacity, pointerEvents: darkUiEvents }}
          className="fixed top-4 right-4 md:top-12 md:right-12 z-[9999]"
        >
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 1.2, ease: 'easeOut' }}
            aria-label="View resume"
            onClick={() => {
              play('whoosh');
              trigger('heavy');
              setIsFastReadOpen(true);
            }}
            onMouseEnter={() => {
              play('hover');
              trigger('light');
            }}
            className="resume-pill relative px-4 md:px-6 py-2.5 md:py-3 border border-white/25 bg-charcoal/80 rounded-full minimal-body text-[10px] md:text-[11px] font-bold text-stark opacity-100 hover:border-molten-red hover:text-white transition-colors group flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            {/* High Speed Lens Flare Sweep */}
            <span className="absolute inset-0 -translate-x-[150%] -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-[150%]" />
            <FileText className="w-3.5 h-3.5 text-molten-red relative" strokeWidth={2} />
            <span className="relative tracking-[0.2rem]">VIEW RESUME</span>
          </motion.button>
        </motion.div>

        <SoundControl />

        {/* Progress HUD */}
        <nav
          aria-label="Sections"
          className={cn(
            'hidden md:flex fixed right-12 top-1/2 -translate-y-1/2 flex-col gap-8 z-50 mix-blend-difference transition-opacity duration-500',
            isFastReadOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
          {NAV.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.label}
                type="button"
                aria-current={isActive ? 'true' : undefined}
                className="flex items-center justify-end gap-4 group cursor-pointer"
                onClick={() => {
                  play('click');
                  trigger('selection');
                  lenis?.scrollTo(item.target * vH, { duration: 1.6 });
                }}
              >
                <span className={cn(
                  'minimal-body text-[10px] tracking-[0.3rem] transition-all duration-300',
                  isActive ? 'text-molten-red opacity-100' : 'text-stark opacity-20 group-hover:opacity-100'
                )}>
                  {item.label}
                </span>
                <span className={cn(
                  'h-px transition-all duration-300',
                  isActive ? 'bg-molten-red w-24' : 'bg-white/20 w-4 group-hover:w-12'
                )} />
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
