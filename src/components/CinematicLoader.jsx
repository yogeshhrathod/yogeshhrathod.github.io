import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';

export const CinematicLoader = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { unlockAudio, play } = useSound();
  const { trigger } = useHaptics();

  useEffect(() => {
    let int;
    const simulateLoad = () => {
      let currentProgress = 0;
      int = setInterval(() => {
        const increment = Math.random() * 15 + 5;
        currentProgress += increment;
        
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(int);
          setTimeout(() => setReady(true), 500); // Dramatic pause
        }
        
        setProgress(Math.floor(currentProgress));
      }, 150);
    };

    simulateLoad();
    return () => clearInterval(int);
  }, []);

  const handleEnterClick = () => {
    if (!ready) return;
    setIsExiting(true);
    unlockAudio();
    play('HEAVY_THUD', { volume: 0.5 });
    trigger('heavy');
    
    // Give time for exit animation before unmounting
    setTimeout(() => {
      onEnter();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div 
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] bg-obsidian flex flex-col items-center justify-center p-8 pointer-events-auto"
        >
          <div className="flex flex-col items-center gap-12 w-full max-w-sm">
            <div className="w-full flex justify-between text-[10px] font-mono text-stark/60 tracking-[0.2rem]">
                <span>NEURAL_LINK_ESTABLISHING</span>
                <span>{progress}%</span>
            </div>
            
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 bottom-0 bg-molten-red shadow-[0_0_10px_rgba(255,51,0,0.5)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: "linear" }}
                />
            </div>

            <div className="h-12 flex items-center justify-center w-full mt-4">
                <motion.button
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ 
                     opacity: ready ? 1 : 0, 
                     y: ready ? 0 : 10,
                     scale: ready ? [1, 1.05, 1] : 0.95
                  }}
                  transition={{ 
                     duration: 0.8, 
                     ease: "easeOut",
                     scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                  }}
                  onClick={handleEnterClick}
                  onMouseEnter={() => trigger('light')}
                  disabled={!ready}
                  className="px-12 py-4 bg-molten-red/10 border border-molten-red/50 text-molten-red font-mono text-[12px] tracking-[0.3rem] hover:bg-molten-red hover:text-obsidian hover:border-molten-red transition-all cursor-pointer shadow-[0_0_20px_rgba(255,51,0,0.1)] hover:shadow-[0_0_30px_rgba(255,51,0,0.4)] disabled:cursor-not-allowed"
                >
                  [ CLICK TO INITIALIZE EXPERIENCE ]
                </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
