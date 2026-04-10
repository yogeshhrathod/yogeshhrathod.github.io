import React, { createContext, useContext, useCallback } from 'react';

const HapticContext = createContext(null);

const WAVEFORMS = {
  selection: [10],
  light: [10],
  medium: [15],
  heavy: [20, 10, 20],
  engine: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  heartbeat: [40, 60, 100],
  glitch: [2, 5, 2, 10, 2, 5],
};

export const HapticProvider = ({ children }) => {
  
  const trigger = useCallback((type = 'selection') => {
    const pattern = WAVEFORMS[type] || [10];

    // 1. Hardware Haptics (Navigator API - Android/PWA)
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }

    // 2. Visual Haptics Sync
    // Determine intensity for the visual shake
    let intensity = 1;
    if (type === 'heavy') intensity = 3;
    if (type === 'engine') intensity = 0.5;
    if (type === 'glitch') intensity = 5;

    const event = new CustomEvent('ui-haptic-impact', { 
      detail: { type, pattern, intensity } 
    });
    window.dispatchEvent(event);
  }, []);

  return (
    <HapticContext.Provider value={{ trigger }}>
      {children}
    </HapticContext.Provider>
  );
};

export const useHaptics = () => {
  const context = useContext(HapticContext);
  if (!context) {
    throw new Error('useHaptics must be used within a HapticProvider');
  }
  return context;
};
