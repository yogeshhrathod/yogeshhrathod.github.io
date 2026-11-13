import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useSound } from '../context/SoundContext';

/**
 * Boot sequence, then the entry screen.
 *
 * Browsers will not start audio until the visitor clicks, taps or presses a
 * key. Asking them to "enter" gives us that gesture up front, so the score is
 * already playing when the first scene appears.
 *
 * onEnter fires the moment the loader starts to leave, so the stage mounts
 * underneath and the two cross-dissolve. onDone fires when the dissolve ends.
 */
export const CinematicLoader = ({ onEnter, onDone }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const { play, setSoundOn } = useSound();
  const ready = progress === 100;

  useEffect(() => {
    let interval;
    const bootSequence = () => {
      let currentProgress = 0;
      interval = setInterval(() => {
        // "Real" feeling variable load speeds
        currentProgress = Math.min(100, currentProgress + Math.random() * 20 + 5);
        setProgress(Math.floor(currentProgress));
        if (currentProgress >= 100) clearInterval(interval);
      }, 110);
    };

    if (document.readyState === 'complete') {
      bootSequence();
    } else {
      window.addEventListener('load', bootSequence, { once: true });
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', bootSequence);
    };
  }, []);

  const entered = useRef(false);
  const enter = (withSound) => {
    if (entered.current) return;
    entered.current = true;
    setSoundOn(withSound);
    play('arrive');
    setIsExiting(true);
    onEnter();
  };

  // Enter / Space also start the film, with sound.
  const enterRef = useRef(enter);
  useEffect(() => {
    enterRef.current = enter;
  });
  useEffect(() => {
    if (!ready) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.target instanceof HTMLButtonElement) return; // the focused button handles it
      e.preventDefault();
      enterRef.current(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ready]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!isExiting && (
        <motion.div
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] bg-obsidian flex flex-col items-center justify-center p-8"
        >
          {/* Atmospheric Haze */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,200,200,0.02)_0%,transparent_60%)]" />

          <div className="relative flex flex-col items-center gap-4 w-full max-w-[200px]">
            <div className="w-full flex justify-between text-[8px] font-mono text-stark/40 tracking-[0.4rem] uppercase">
              <span>SYSTEM_BOOT</span>
              <span>{ready ? 'OK' : `${progress}%`}</span>
            </div>

            <div className="w-full h-[1px] bg-white/5 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-stark/60 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.15, ease: 'linear' }}
              />
            </div>
          </div>

          <div className="relative h-36 mt-10 flex flex-col items-center">
            {ready ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col items-center gap-5"
              >
                <button
                  type="button"
                  autoFocus
                  onClick={() => enter(true)}
                  className="group inline-flex items-center gap-3 border border-stark/50 px-8 py-4 minimal-body text-[11px] md:text-xs font-bold text-stark opacity-100 cursor-pointer outline-none hover:bg-molten-red hover:border-molten-red hover:text-white focus-visible:border-molten-red transition-colors duration-300"
                >
                  <Volume2 className="w-4 h-4 text-molten-red group-hover:text-white transition-colors" strokeWidth={1.5} />
                  ENTER WITH SOUND
                </button>
                <button
                  type="button"
                  onClick={() => enter(false)}
                  className="minimal-body text-[10px] text-stark opacity-50 hover:opacity-100 underline underline-offset-4 decoration-white/30 cursor-pointer transition-opacity"
                >
                  ENTER WITHOUT SOUND
                </button>
              </motion.div>
            ) : (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-[7px] text-stark/30 font-mono tracking-[0.5rem] uppercase whitespace-nowrap"
              >
                AWAITING_DATA...
              </motion.span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
