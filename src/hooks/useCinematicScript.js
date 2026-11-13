import { useEffect, useRef } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';
import { SCENES, FADE } from '../timeline';

// THE CINEMATIC SOUND & HAPTIC SCRIPT
// Cue points use the same vh units as the scene timeline, so a sound can never
// drift away from the picture it belongs to.
const CUES = [
  { at: 0.3, sound: 'breath', haptic: 'medium' },
  { at: SCENES.PROJECTS[0] + FADE / 2, sound: 'arrive', haptic: 'heavy' },
  { at: SCENES.COMPANION[0] + FADE / 2, sound: 'arrive', haptic: 'medium' },
  { at: SCENES.EXPERIENCE[0] + FADE / 2, sound: 'arrive', haptic: 'heavy' },
  { at: SCENES.FOUNDATION[0] + FADE / 2, sound: 'arrive', haptic: 'heavy' },
  { at: SCENES.CONTACT[0] + FADE / 2, sound: 'arrive', haptic: 'heavy' },
];

const COOLDOWN_MS = 1200;
const moodAt = (p) => (p >= SCENES.CONTACT[0] ? 'light' : 'dark');

export const useCinematicScript = (progress) => {
  const { play, setMood, isMuted } = useSound();
  const { trigger } = useHaptics();

  const prev = useRef(progress.get());
  const lastFired = useRef(new Map());
  const mood = useRef(null);

  useMotionValueEvent(progress, 'change', (p) => {
    const before = prev.current;
    prev.current = p;

    // A cue fires each time the viewer scrolls DOWN across it. The cooldown
    // stops jitter around a cue point from machine-gunning the sound.
    CUES.forEach((cue) => {
      if (!(before < cue.at && p >= cue.at)) return;
      const t = performance.now();
      if (t - (lastFired.current.get(cue.at) ?? -Infinity) < COOLDOWN_MS) return;
      lastFired.current.set(cue.at, t);
      play(cue.sound);
      trigger(cue.haptic);
    });

    const next = moodAt(p);
    if (next !== mood.current) {
      mood.current = next;
      setMood(next);
    }
  });

  // Sound switched on mid-film: open with the reveal and match the bed to the
  // scene the viewer is already in.
  useEffect(() => {
    if (isMuted) return;
    mood.current = moodAt(progress.get());
    setMood(mood.current);
    play('swell');
  }, [isMuted, play, setMood, progress]);
};
