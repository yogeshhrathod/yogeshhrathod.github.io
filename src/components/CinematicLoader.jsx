import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';

export const CinematicLoader = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    let int;
    const bootSequence = () => {
      let currentProgress = 0;
      int = setInterval(() => {
        // "Real" feeling variable load speeds
        const increment = Math.random() * 20 + 5;
        currentProgress += increment;
        
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(int);
          
          // Drama pause before exit
          setTimeout(() => {
            setIsExiting(true);
            play('HEAVY_THUD', { volume: 0.3 }); // Will only play if user naturally interacted earlier, or silent
            setTimeout(() => onEnter(), 1000);
          }, 600);
        }
        
        setProgress(Math.floor(currentProgress));
      }, 120);
    };

    // Fast track if document is already fully loaded and cached, but maintain cinematic minimum
    if (document.readyState === 'complete') {
        bootSequence();
    } else {
        window.addEventListener('load', bootSequence);
        return () => window.removeEventListener('load', bootSequence);
    }

    return () => clearInterval(int);
  }, [onEnter, play]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div 
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
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
                  className="absolute top-0 left-0 bottom-0 bg-stark/60"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15, ease: "linear" }}
                />
            </div>

            <div className="h-4 flex items-center justify-center w-full mt-2">
               <motion.span 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: progress === 100 ? 1 : 0 }}
                 className="text-[7px] text-stark/30 font-mono tracking-[0.5rem] uppercase"
               >
                 INITIALIZATION_COMPLETE
               </motion.span>
               <motion.span 
                 animate={{ opacity: [0, 1, 0] }}
                 transition={{ repeat: Infinity, duration: 1 }}
                 className="text-[7px] text-stark/30 font-mono tracking-[0.5rem] uppercase absolute"
                 style={{ display: progress < 100 ? 'block' : 'none' }}
               >
                 AWAITING_DATA...
               </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
