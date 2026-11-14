import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import { profile } from '../data/resume';

const MIN_SHOW_MS = 1500; // long enough to read as a title card, short enough not to annoy
const EASE_OUT = [0.22, 1, 0.36, 1];
const EASE_SPLIT = [0.76, 0, 0.24, 1];
const NAME = 'YOGESH RATHOD';

/**
 * Title card.
 *
 * A single hairline crosses the middle of the screen and grows outward as the
 * site really loads (web fonts + page assets). The name rises letter by letter
 * from behind it. When loading is done, a click anywhere (or Enter) splits the
 * frame along that line: the top half lifts away, the bottom half drops, and
 * the site is already there underneath.
 *
 * Browsers will not start audio until the visitor clicks, taps or presses a
 * key, so entering here is also what lets the music play from the first scene.
 *
 * onEnter fires the moment the frame starts to split, so the stage mounts
 * underneath. onDone fires when the split has finished.
 */
export const CinematicLoader = ({ onEnter, onDone }) => {
  const { play, setSoundOn, isMuted } = useSound();
  const [withSound, setWithSound] = useState(() => !isMuted);
  const [fontsReady, setFontsReady] = useState(false);
  const [ready, setReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // 0 → 1, driven by real milestones and eased so it never jumps.
  const progress = useMotionValue(0);
  const lineScale = useTransform(progress, (v) => Math.max(v, 0.002));
  const percent = useTransform(progress, (v) => String(Math.round(v * 100)).padStart(3, '0'));

  useEffect(() => {
    let target = 0;
    let controls;
    let cancelled = false;
    const advance = (to) => {
      target = Math.max(target, to);
      controls?.stop();
      controls = animate(progress, target, {
        duration: target === 1 ? 0.6 : 1,
        ease: EASE_OUT,
        onComplete: () => {
          if (target === 1 && !cancelled) setReady(true);
        },
      });
    };

    advance(0.12);
    const fonts = (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!cancelled) setFontsReady(true);
      advance(0.6);
    });
    const page = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve, { once: true });
    }).then(() => advance(0.85));
    const minimum = new Promise((resolve) => setTimeout(resolve, MIN_SHOW_MS));

    Promise.all([fonts, page, minimum]).then(() => {
      if (!cancelled) advance(1);
    });

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [progress]);

  const entered = useRef(false);
  const enter = () => {
    if (entered.current || !ready) return;
    entered.current = true;
    setSoundOn(withSound);
    play('arrive');
    setIsExiting(true);
    onEnter();
  };

  // Enter / Space also start the film.
  const enterRef = useRef(enter);
  useEffect(() => {
    enterRef.current = enter;
  });
  useEffect(() => {
    if (!ready) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.target instanceof HTMLButtonElement) return; // a focused button handles it
      e.preventDefault();
      enterRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ready]);

  const letterTransition = (i) => ({ duration: 0.9, ease: EASE_OUT, delay: 0.15 + i * 0.045 });

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!isExiting && (
        <motion.div
          key="title-card"
          // The container itself stays put while its two halves split apart.
          exit={{ opacity: 1 }}
          transition={{ duration: 1.25 }}
          onClick={enter}
          className={`fixed inset-0 z-[99999] ${ready ? 'cursor-pointer' : 'cursor-progress'}`}
        >
          {/* ── TOP HALF: the name sits on the seam ───────────────────────── */}
          <motion.div
            exit={{ y: '-100%' }}
            transition={{ duration: 1.15, ease: EASE_SPLIT }}
            className="absolute inset-x-0 top-0 h-1/2 bg-charcoal flex flex-col items-center justify-end overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(226,96,58,0.10)_0%,transparent_70%)]"
            />
            <h1 className="relative pb-5 md:pb-7 px-4 text-center" aria-label={NAME}>
              {NAME.split('').map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: fontsReady ? '0%' : '110%' }}
                    exit={{ y: '-30%', opacity: 0 }}
                    transition={letterTransition(i)}
                    className="titan-title inline-block text-[7.4vw] md:text-[6.4vw] leading-[1] text-stark"
                  >
                    {ch === ' ' ? ' ' : ch}
                  </motion.span>
                </span>
              ))}
            </h1>
          </motion.div>

          {/* ── BOTTOM HALF: role, then the invitation ───────────────────── */}
          <motion.div
            exit={{ y: '100%' }}
            transition={{ duration: 1.15, ease: EASE_SPLIT }}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-charcoal flex flex-col items-center justify-start overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(226,96,58,0.08)_0%,transparent_70%)]"
            />
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: fontsReady ? 0.7 : 0, y: fontsReady ? 0 : -8 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.75 }}
              className="relative pt-5 md:pt-7 px-6 text-center text-sm md:text-lg font-light tracking-tight text-stark"
            >
              {profile.title} · {profile.focus}
            </motion.p>

            <div className="relative mt-[12vh] h-10 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {ready ? (
                  <motion.button
                    key="enter"
                    type="button"
                    autoFocus
                    onClick={(e) => {
                      e.stopPropagation();
                      enter();
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.45, 1, 0.45] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="minimal-body text-[10px] md:text-[11px] text-stark cursor-pointer focus-visible:outline-none focus-visible:text-white"
                  >
                    <span className="md:hidden">Tap anywhere to enter</span>
                    <span className="hidden md:inline">Click anywhere to enter</span>
                  </motion.button>
                ) : (
                  <motion.span key="loading" exit={{ opacity: 0 }} className="font-mono text-[11px] text-stark/40 tabular-nums tracking-[0.2em]">
                    {percent}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Corners */}
            <span className="absolute left-5 md:left-10 bottom-5 md:bottom-8 minimal-body text-[9px] opacity-35">Pune, India</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setWithSound((on) => !on);
              }}
              aria-pressed={withSound}
              className="absolute right-5 md:right-10 bottom-4 md:bottom-7 py-1 minimal-body text-[9px] md:text-[10px] text-stark opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
            >
              Sound <span className={withSound ? 'text-molten-red' : 'opacity-60'}>{withSound ? 'on' : 'off'}</span>
            </button>
          </motion.div>

          {/* ── THE SEAM: progress, then the line the frame splits along ─── */}
          <motion.div
            aria-hidden="true"
            exit={{ opacity: 0, scaleY: 3 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px pointer-events-none"
          >
            <motion.div
              style={{ scaleX: lineScale }}
              className="h-full w-full bg-molten-red shadow-[0_0_12px_rgba(226,96,58,0.7)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
