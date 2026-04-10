import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound, SOUNDS } from '../context/SoundContext';
import { cn } from '../utils';

export const SoundControl = () => {
  const { isMuted, toggleMute, play } = useSound();
  const ambientRef = useRef(null);

  // Global ambient hum removed per request. Ambient will be handled per scene if needed.
  useEffect(() => {
     // Scene specific audio could be managed here if context provided active scene
  }, [isMuted]);

  return (
    <button
      onClick={() => {
        toggleMute();
        if (isMuted) {
            play('CLICK_MECHANICAL', { volume: 0.1 });
        }
      }}
      className={cn(
        "fixed bottom-8 right-12 z-[100] flex items-center gap-4 group transition-all duration-700",
        "opacity-40 hover:opacity-100"
      )}
    >
      <div className="flex flex-col items-end">
        <span className="minimal-body text-[8px] tracking-[0.4rem] uppercase">
          {isMuted ? 'Audio // Offline' : 'Audio // Atmospheric'}
        </span>
        <span className="minimal-body text-[10px] text-stark/40 group-hover:text-stark transition-colors">
          {isMuted ? 'ENGAGE_SYSTEM' : 'MUTE_SYSTEM'}
        </span>
      </div>
      
      <div className="relative w-10 h-10 flex items-center justify-center border border-stark/10 group-hover:border-stark/40 transition-all">
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-stark/40 group-hover:text-molten-red transition-colors" strokeWidth={1} />
        ) : (
          <Volume2 className="w-4 h-4 text-molten-red" strokeWidth={1} />
        )}
        
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-1 h-1 bg-molten-red/40" />
      </div>
    </button>
  );
};
