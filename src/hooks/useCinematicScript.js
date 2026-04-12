import { useEffect, useRef } from 'react';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';

export const useCinematicScript = (currentScroll, vH) => {
  const { play, isMuted, isUnlocked } = useSound();
  const { trigger } = useHaptics();
  
  const playedTriggers = useRef(new Set());
  const activeAmbients = useRef(new Set());
  const ambientRefs = useRef({});
  const prevScroll = useRef(0);

  useEffect(() => {
    if (!isUnlocked || isMuted || !vH) {
      prevScroll.current = currentScroll;
      return;
    }

    const isScrollingDown = currentScroll > prevScroll.current;

    // THE CINEMATIC AUDIO & HAPTIC SCRIPT
    // This defines the exact orchestration of sound and feeling as the user scrolls.
    const SCRIPT = [
      {
        act: 'ACT I: THE MONOLITH',
        events: [
          { id: 'intro_drone', type: 'trigger', triggerAt: 50, sound: 'INTRO_REVEAL', volume: 0.5, haptic: null },
          // The "Name Zoom" woosh.
          { id: 'name_zoom_woosh', type: 'trigger', triggerAt: vH * 0.3, sound: 'NAME_ZOOM', volume: 0.4, pitch: 0.85, haptic: 'medium' },
          { id: 'thud_projects', type: 'trigger', triggerAt: vH * 4.9, sound: 'HEAVY_THUD', volume: 0.05, haptic: 'heavy' },
        ]
      },
      {
        act: 'ACT II: THE ARCHIVE',
        events: [
          { id: 'thud_experience', type: 'trigger', triggerAt: vH * 11.9, sound: 'HEAVY_THUD', volume: 0.05, haptic: 'heavy' },
        ]
      },
      {
        act: 'ACT III: THE ENGINE',
        events: [
          { id: 'thud_foundation', type: 'trigger', triggerAt: vH * 18.9, sound: 'HEAVY_THUD', volume: 0.05, haptic: 'heavy' },
        ]
      },
      {
        act: 'ACT IV: THE INVERSION',
        events: [
          { id: 'thud_contact', type: 'trigger', triggerAt: vH * 23.4, sound: 'HEAVY_THUD', volume: 0.05, haptic: 'heavy' },
          { id: 'contact_ambient', type: 'ambient', range: [vH * 23.5, vH * 26.0], sound: 'END_CREDITS', volume: 0.2, pitch: 0.8 },
        ]
      }
    ];

    // Evaluate Script Events
    SCRIPT.forEach(scene => {
      scene.events.forEach(event => {
        
        // Handle One-Shot Triggers
        if (event.type === 'trigger') {
          // Trigger when scrolling DOWN past the point
          if (isScrollingDown && prevScroll.current < event.triggerAt && currentScroll >= event.triggerAt) {
            if (!playedTriggers.current.has(event.id)) {
              if (event.sound) play(event.sound, { volume: event.volume, pitch: event.pitch || 1 });
              if (event.haptic) trigger(event.haptic);
              playedTriggers.current.add(event.id);
            }
          }
          
          // Reset trigger if scrolled significantly back above
          if (currentScroll < event.triggerAt - (vH * 0.1)) {
            playedTriggers.current.delete(event.id);
          }
        }

        // Handle Ambient / Loop sounds
        if (event.type === 'ambient') {
          const [start, end] = event.range;
          const inRange = currentScroll >= start && currentScroll <= end;
          const isActive = activeAmbients.current.has(event.id);

          if (inRange && !isActive) {
            // Enter Ambient Zone
            ambientRefs.current[event.id] = play(event.sound, { loop: true, volume: event.volume, pitch: event.pitch || 1, clone: false });
            activeAmbients.current.add(event.id);
          } else if (!inRange && isActive) {
            // Leave Ambient Zone
            if (ambientRefs.current[event.id]) {
              ambientRefs.current[event.id].pause();
              ambientRefs.current[event.id] = null;
            }
            activeAmbients.current.delete(event.id);
          }
        }
      });
    });

    prevScroll.current = currentScroll;
  }, [currentScroll, isMuted, isUnlocked, play, trigger, vH]);
};
