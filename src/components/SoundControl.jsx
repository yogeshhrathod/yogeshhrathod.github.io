import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { cn } from '../utils';

export const SoundControl = () => {
  const { isMuted, toggleMute } = useSound();

  return (
    <div className="fixed bottom-4 left-4 md:bottom-12 md:left-auto md:right-12 z-[9999] pointer-events-auto">
      <button
        type="button"
        onClick={toggleMute}
        aria-pressed={!isMuted}
        aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
        className={cn(
          'h-10 md:h-12 pl-3 pr-4 md:pl-4 md:pr-5 flex items-center gap-3 bg-obsidian border rounded-full shadow-2xl cursor-pointer transition-colors duration-300',
          isMuted ? 'border-white/25 hover:border-white/60' : 'border-molten-red'
        )}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-stark/70" strokeWidth={1.5} />
        ) : (
          <Volume2 className="w-4 h-4 text-molten-red" strokeWidth={1.5} />
        )}
        <span className="minimal-body text-[10px] font-bold text-stark opacity-100 whitespace-nowrap">
          {isMuted ? 'SOUND OFF' : 'SOUND ON'}
        </span>
      </button>
    </div>
  );
};
