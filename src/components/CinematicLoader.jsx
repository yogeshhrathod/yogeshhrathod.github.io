import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../context/SoundContext';

/**
 * onEnter fires the moment the loader starts to leave, so the stage mounts
 * underneath and the two cross-dissolve. onDone fires when the dissolve ends.
 */
export const CinematicLoader = ({ onEnter, onDone }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const { play } = useSound();

  // Latest callbacks without restarting the boot sequence when they change.
  const latest = useRef({ onEnter, play });
  useEffect(() => {
    latest.current = { onEnter, play };
  });

  useEffect(() => {
    let interval;
    let timeout;

    const bootSequence = () => {
      let currentProgress = 0;
      interval = setInterval(() => {
        // "Real" feeling variable load speeds
        currentProgress = Math.min(100, currentProgress + Math.random() * 20 + 5);
        setProgress(Math.floor(currentProgress));

        if (currentProgress >= 100) {
          clearInterval(interval);
          // Drama pause before exit
          timeout = setTimeout(() => {
            latest.current.play('impact');
            setIsExiting(true);
            latest.current.onEnter();
          }, 450);
        }
      }, 110);
    };

    if (document.readyState === 'complete') {
      bootSequence();
    } else {
      window.addEventListener('load', bootSequence, { once: true });
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener('load', bootSequence);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!isExiting && (
        <motion.div
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] bg-obsidian flex flex-col items-center justify-center p-8 pointer-events-none"
        >
          {/* Atmospheric Haze */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,200,200,0.02)_0%,transparent_60%)]" />

          <div className="flex flex-col items-center gap-4 w-full max-w-[200px] z-10">
            <div className="w-full flex justify-between text-[8px] font-mono text-stark/40 tracking-[0.4rem] uppercase">
              <span>SYSTEM_BOOT</span>
              <span>{progress === 100 ? 'OK' : `${progress}%`}</span>
            </div>

            <div className="w-full h-[1px] bg-white/5 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-stark/60 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.15, ease: 'linear' }}
              />
            </div>

            <div className="h-4 relative flex items-center justify-center w-full mt-2 text-[7px] text-stark/30 font-mono tracking-[0.5rem] uppercase whitespace-nowrap">
              {progress === 100 ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>INITIALIZATION_COMPLETE</motion.span>
              ) : (
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                  AWAITING_DATA...
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
