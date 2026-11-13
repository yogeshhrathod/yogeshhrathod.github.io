import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { engine } from '../audio/engine';

const SoundContext = createContext(null);
const STORAGE_KEY = 'sound_enabled';

const readPreference = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
};

/**
 * Sound is OFF until the visitor turns it on. If they turned it on during an
 * earlier visit we honour that, but a browser will only start audio after a
 * click or key press, so we wait for the first one.
 */
export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => !readPreference());

  useEffect(() => {
    if (isMuted) return undefined;
    const start = () => engine.enable();
    window.addEventListener('pointerdown', start, { once: true });
    window.addEventListener('keydown', start, { once: true });
    return () => {
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((wasMuted) => {
      const nowMuted = !wasMuted;
      // Runs inside the click handler, which is the gesture the browser needs.
      if (nowMuted) engine.disable();
      else engine.enable();
      try {
        localStorage.setItem(STORAGE_KEY, nowMuted ? 'off' : 'on');
      } catch {
        /* private mode: the choice just lasts for this visit */
      }
      return nowMuted;
    });
  }, []);

  const value = useMemo(
    () => ({
      isMuted,
      toggleMute,
      play: (name) => engine.play(name),
      setMood: (mood) => engine.setMood(mood),
    }),
    [isMuted, toggleMute]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
