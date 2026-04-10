import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const SoundContext = createContext(null);

export const SOUNDS = {
  CLICK_MECHANICAL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Standard crisp click
  SWOOSH_CINEMATIC: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle digital sweep
  TYPEWRITER: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Re-using crisp click for reliable typewriter strokes
  HEAVY_THUD: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',     
  HOVER_PHYSICAL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Deepened via pitch modulation in components
};

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true); 
  const [masterVolume, setMasterVolume] = useState(0.25); 
  const audioCache = useRef({});

  const play = useCallback((soundName, options = {}) => {
    if (isMuted) return;

    const { volume = 1, loop = false, pitch = 1 } = options;
    const url = SOUNDS[soundName] || soundName;

    // For ambient loops, we might want to keep a reference
    let audio = new Audio(url);
    audio.volume = masterVolume * volume;
    audio.loop = loop;
    audio.playbackRate = pitch;
    
    audio.play().catch(e => {
        // Autoplay policy usually blocks this
        console.warn("SFX play blocked or failed:", e);
    });

    return audio;
  }, [isMuted, masterVolume]);

  const toggleMute = () => setIsMuted(prev => !prev);

  return (
    <SoundContext.Provider value={{ play, isMuted, toggleMute, setMasterVolume }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
