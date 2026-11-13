import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { engine } from '../audio/engine';

const SoundContext = createContext(null);
const STORAGE_KEY = 'sound_enabled';

const readPreference = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
};

/**
 * Sound is ON unless the visitor has turned it off. Browsers refuse to start
 * audio before a click, tap or key press, so the entry screen (CinematicLoader)
 * asks for one; the listeners below are the safety net for any other path in.
 */
export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => !readPreference());

  useEffect(() => {
    if (isMuted) return undefined;
    const start = () => engine.enable();
    start(); // works straight away if the browser already trusts this site
    window.addEventListener('pointerdown', start, { once: true });
    window.addEventListener('keydown', start, { once: true });
    return () => {
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };
  }, [isMuted]);

  /** Call from inside a click / key handler: that gesture is what lets audio start. */
  const setSoundOn = useCallback((on) => {
    if (on) engine.enable();
    else engine.disable();
    try {
      localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
    } catch {
      /* private mode: the choice just lasts for this visit */
    }
    setIsMuted(!on);
  }, []);

  const toggleMute = useCallback(() => setSoundOn(isMuted), [isMuted, setSoundOn]);

  const value = useMemo(
    () => ({
      isMuted,
      toggleMute,
      setSoundOn,
      play: (name) => engine.play(name),
      setMood: (mood) => engine.setMood(mood),
    }),
    [isMuted, toggleMute, setSoundOn]
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
