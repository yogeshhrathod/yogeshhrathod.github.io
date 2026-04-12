import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound, SOUNDS } from '../context/SoundContext';
import { cn } from '../utils';

export const SoundControl = () => {
  const { isMuted, toggleMute } = useSound();

  return (
    <div className="fixed bottom-12 right-12 z-[9999] pointer-events-auto">
      <motion.button
        onClick={toggleMute}
        whileHover={{ width: '12rem' }}
        initial={{ width: '3.5rem' }}
        className={cn(
          "h-14 flex items-center bg-obsidian border border-white/20 shadow-2xl rounded-full overflow-hidden group transition-all duration-300",
          isMuted ? "opacity-60 hover:opacity-100" : "opacity-100"
        )}
      >
        <div className="flex-shrink-0 w-14 h-full flex items-center justify-center">
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-stark/40 group-hover:text-stark transition-colors" strokeWidth={1.5} />
          ) : (
            <Volume2 className="w-5 h-5 text-molten-red" strokeWidth={1.5} />
          )}
        </div>
        
        <div className="flex flex-col items-start pr-6 overflow-hidden">
          <span className="minimal-body text-[8px] tracking-[0.2rem] text-stark font-bold">
            {isMuted ? 'UNMUTE_SYSTEM' : 'SYSTEM_ACTIVE'}
          </span>
          <span className="minimal-body text-[6px] text-stark/40">
            {isMuted ? 'AUDIO_ENCRYPTED' : 'ATMOSPHERIC_LINK'}
          </span>
        </div>
      </motion.button>
    </div>
  );
};
