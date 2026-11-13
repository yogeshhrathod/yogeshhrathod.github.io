import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { cn } from '../utils';

export const SoundControl = () => {
  const { isMuted, toggleMute } = useSound();

  return (
    <div className="fixed bottom-4 left-4 md:bottom-12 md:left-auto md:right-12 z-[9999] pointer-events-auto">
      <button
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
        className={cn(
          "h-10 w-10 md:h-14 md:w-14 md:hover:w-48 flex items-center bg-obsidian border border-white/20 shadow-2xl rounded-full overflow-hidden group cursor-pointer transition-[width,opacity] duration-300 ease-out",
          isMuted ? "opacity-60 hover:opacity-100" : "opacity-100"
        )}
      >
        <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-full flex items-center justify-center">
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-stark/40 group-hover:text-stark transition-colors" strokeWidth={1.5} />
          ) : (
            <Volume2 className="w-5 h-5 text-molten-red" strokeWidth={1.5} />
          )}
        </div>
        
        <div className="hidden md:flex flex-col items-start pr-6 overflow-hidden whitespace-nowrap">
          <span className="minimal-body text-[8px] tracking-[0.2rem] text-stark font-bold">
            {isMuted ? 'UNMUTE_SYSTEM' : 'SYSTEM_ACTIVE'}
          </span>
          <span className="minimal-body text-[6px] text-stark/40">
            {isMuted ? 'AUDIO_ENCRYPTED' : 'ATMOSPHERIC_LINK'}
          </span>
        </div>
      </button>
    </div>
  );
};
