import { useEffect, useRef } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';
import { SCENES, FADE } from '../timeline';

// THE CINEMATIC AUDIO & HAPTIC SCRIPT
// Cue points are in the same vh units as the scene timeline, so a sound can
// never drift away from the picture it belongs to.
const TRIGGERS = [
  { id: 'intro_drone', at: 0.03, sound: 'INTRO_REVEAL', volume: 0.5 },
  { id: 'name_zoom_woosh', at: 0.3, sound: 'NAME_ZOOM', volume: 0.4, pitch: 0.85, haptic: 'medium' },
  { id: 'thud_projects', at: SCENES.PROJECTS[0] + FADE / 2, sound: 'HEAVY_THUD', volume: 0.05, haptic: 'heavy' },
  { id: 'thud_experience', at: SCENES.EXPERIENCE[0] + FADE / 2, sound: 'HEAVY_THUD', volume: 0.05, haptic: 'heavy' },
  { id: 'thud_foundation', at: SCENES.FOUNDATION[0] + FADE / 2, sound: 'HEAVY_THUD', volume: 0.05, haptic: 'heavy' },
  { id: 'thud_contact', at: SCENES.CONTACT[0] + FADE / 2, sound: 'HEAVY_THUD', volume: 0.05, haptic: 'heavy' },
];

const AMBIENTS = [
  { id: 'contact_ambient', range: [SCENES.CONTACT[0], Infinity], sound: 'END_CREDITS', volume: 0.2, pitch: 0.8 },
];

export const useCinematicScript = (progress) => {
  const { play, isMuted, isUnlocked } = useSound();
  const { trigger } = useHaptics();

  const played = useRef(new Set());
  const ambients = useRef({});
  const prev = useRef(progress.get());
  const live = isUnlocked && !isMuted;

  const stopAmbient = (id) => {
    ambients.current[id]?.pause();
    delete ambients.current[id];
  };

  const evaluate = (p) => {
    const before = prev.current;
    prev.current = p;
    if (!live) return;

    TRIGGERS.forEach((cue) => {
      // Fire once when scrolling DOWN across the cue; re-arm only at the very top
      // so small back-and-forth scrolling never machine-guns the sound.
      if (before < cue.at && p >= cue.at && !played.current.has(cue.id)) {
        if (cue.sound) play(cue.sound, { volume: cue.volume, pitch: cue.pitch || 1 });
        if (cue.haptic) trigger(cue.haptic);
        played.current.add(cue.id);
      }
    });
    if (p <= 0.01) played.current.clear();

    AMBIENTS.forEach((amb) => {
      const inRange = p >= amb.range[0] && p <= amb.range[1];
      const isActive = Boolean(ambients.current[amb.id]);
      if (inRange && !isActive) {
        ambients.current[amb.id] = play(amb.sound, { loop: true, volume: amb.volume, pitch: amb.pitch || 1, clone: false });
      } else if (!inRange && isActive) {
        stopAmbient(amb.id);
      }
    });
  };

  useMotionValueEvent(progress, 'change', evaluate);

  // Muting must silence loops that are already playing; unmuting inside an
  // ambient zone must bring them back without waiting for the next scroll.
  useEffect(() => {
    if (!live) {
      Object.keys(ambients.current).forEach(stopAmbient);
    } else {
      evaluate(progress.get());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  useEffect(() => () => Object.keys(ambients.current).forEach(stopAmbient), []);
};
