import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const SoundContext = createContext(null);

export const SOUNDS = {
  CLICK_MECHANICAL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  SWOOSH_CINEMATIC: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  TYPEWRITER: 'https://assets.mixkit.co/active_storage/sfx/1364/1364-preview.mp3',
  HEAVY_THUD: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  HOVER_PHYSICAL: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  INTRO_REVEAL: 'https://assets.mixkit.co/active_storage/sfx/2633/2633-preview.mp3', 
  END_CREDITS: 'https://assets.mixkit.co/active_storage/sfx/2557/2557-preview.mp3', 
  NAME_ZOOM: 'https://assets.mixkit.co/active_storage/sfx/1723/1723-preview.mp3',
};

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('audio_preference');
    return saved === null ? true : saved === 'muted';
  });
  const [masterVolume, setMasterVolume] = useState(0.25);
  const audioCache = useRef({});
  const hasUnlockedReference = useRef(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlockAudio = useCallback(() => {
    if (hasUnlockedReference.current) return;
    Object.values(audioCache.current).forEach(audio => {
      const p = audio.play();
      if (p) p.then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    });
    hasUnlockedReference.current = true;
    setIsUnlocked(true);
    console.log("Audio Context Unlocked");
  }, []);

  // Preload and Bind Global Activation
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([name, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audioCache.current[name] = audio;
    });

    // Auto-unlock on first gesture
    const handleGesture = () => {
      unlockAudio();
    };
    
    // Check if we already have permission (rare, but good practice)
    if (navigator.userActivation?.hasBeenActive) {
      unlockAudio();
    } else {
      window.addEventListener('click', handleGesture, { once: true });
      window.addEventListener('keydown', handleGesture, { once: true });
      window.addEventListener('touchstart', handleGesture, { once: true });
      window.addEventListener('scroll', handleGesture, { once: true }); // Catch scroll as gesture
    }

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('scroll', handleGesture);
    };
  }, [unlockAudio]);

  const play = useCallback((soundName, options = {}) => {
    if (isMuted) return null;

    const { volume = 1, loop = false, pitch = 1, clone = true } = options;
    const cachedAudio = audioCache.current[soundName];
    
    if (!cachedAudio) {
      // Fallback for dynamic URLs not in SOUNDS
      const audio = new Audio(soundName);
      audio.volume = masterVolume * volume;
      audio.loop = loop;
      audio.playbackRate = pitch;
      audio.play().catch(() => {});
      return audio;
    }

    // Use clone for overlapping SFX (typewriter), use original for persistent ambient loops
    const audioInstance = clone ? cachedAudio.cloneNode() : cachedAudio;
    audioInstance.volume = masterVolume * volume;
    audioInstance.loop = loop;
    audioInstance.playbackRate = pitch;

    audioInstance.play().catch(e => {
        // Silently catch autoplay/policy blocks
        console.warn(`Audio play blocked for ${soundName}`);
    });

    return audioInstance;
  }, [isMuted, masterVolume]);

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (!next) unlockAudio();
      localStorage.setItem('audio_preference', next ? 'muted' : 'unmuted');
      return next;
    });
  };

  return (
    <SoundContext.Provider value={{ play, isMuted, toggleMute, setMasterVolume, unlockAudio, isUnlocked }}>
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
