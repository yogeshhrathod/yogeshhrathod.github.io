import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import { useSceneStyle } from '../hooks/useSceneStyle';
import { clamp01 } from '../timeline';
import { dialogues } from '../data/resume';

const TypewriterLine = ({ line, revealed, showCursor }) => (
  <p className="text-center font-mono text-[5vw] md:text-[2.2vw] leading-[1.6] tracking-[0.1rem] uppercase max-w-5xl mx-auto px-4 relative">
    <span className="text-stark whitespace-pre-wrap">{line.slice(0, revealed)}</span>
    {showCursor && (
      <motion.span
        className="inline-block w-[1.5px] h-[1em] bg-white align-middle ml-1"
        style={{ boxShadow: '0 0 10px #ff3300, 0 0 20px rgba(255, 51, 0, 0.5)', translateY: '-10%' }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
      />
    )}
    <span className="opacity-0 whitespace-pre-wrap select-none" aria-hidden="true">{line.slice(revealed)}</span>
  </p>
);

export const VolumetricDialogue = ({ lines, progress, range }) => {
  const [start, end] = range;
  const { play } = useSound();
  const sceneStyle = useSceneStyle(progress, range, { fade: 0.14 });
  const lastSoundAt = useRef(0);

  // TYPE across the first part of the gap, then HOLD so the line can be read
  // before it fades into the next scene.
  const total = lines.reduce((n, l) => n + l.length, 0);
  const typeStart = start + 0.12;
  const typeEnd = start + (end - start) * 0.68;
  const countAt = (p) => Math.round(clamp01((p - typeStart) / (typeEnd - typeStart)) * total);

  // React only re-renders when a new character actually appears.
  const [count, setCount] = useState(() => countAt(progress.get()));
  const countRef = useRef(count);

  useMotionValueEvent(progress, 'change', (p) => {
    const next = countAt(p);
    if (next === countRef.current) return;
    const typedForward = next > countRef.current;
    countRef.current = next;
    setCount(next);

    const now = performance.now();
    if (typedForward && now - lastSoundAt.current > 45) {
      lastSoundAt.current = now;
      play('TYPEWRITER', { volume: 0.15, pitch: 0.9 + Math.random() * 0.2 });
    }
  });

  // Character index at which each line starts typing.
  const offsets = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.length, 0));

  return (
    <motion.div style={sceneStyle} className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-24 overflow-hidden gap-8 md:gap-12">
      {lines.map((line, i) => {
        const revealed = Math.min(Math.max(count - offsets[i], 0), line.length);
        const isTyping = count > offsets[i] && count < offsets[i] + line.length;
        return <TypewriterLine key={i} line={line} revealed={revealed} showCursor={isTyping} />;
      })}
    </motion.div>
  );
};

export const NarrativeInterlude = ({ progress, ranges }) => (
  <div className="fixed inset-0 z-[100] pointer-events-none">
    {dialogues.map((lines, i) =>
      ranges[i] ? <VolumetricDialogue key={i} lines={lines} progress={progress} range={ranges[i]} /> : null
    )}
  </div>
);
