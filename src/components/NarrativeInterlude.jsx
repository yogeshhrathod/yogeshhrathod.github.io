import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../context/SoundContext';
import { motion } from 'framer-motion';
import { cn } from '../utils';
import { dialogues } from '../data/resume';

/**
 * TypewriterChar 
 */
const TypewriterLine = ({ line, progress, showCursor }) => {
  const charsRevealed = Math.floor(progress * line.length);
  const revealed = line.slice(0, charsRevealed);
  const hidden = line.slice(charsRevealed);

  return (
    <div className="text-center font-mono text-[5vw] md:text-[2.2vw] leading-[1.6] tracking-[0.1rem] uppercase max-w-5xl mx-auto px-4 relative">
      <span className="text-stark whitespace-pre-wrap">{revealed}</span>
      {showCursor && (
        <motion.span 
          className="inline-block w-[1.5px] h-[1em] bg-white align-middle ml-1"
          style={{ 
            boxShadow: '0 0 10px #ff3300, 0 0 20px rgba(255, 51, 0, 0.5)',
            transform: 'translateY(-10%)'
          }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        />
      )}
      <span className="opacity-0 whitespace-pre-wrap select-none">{hidden}</span>
    </div>
  );
};

export const VolumetricDialogue = ({ textItems, scroll, range }) => {
  const [start, end] = range;
  const totalDist = end - start;
  const { play } = useSound();
  const lastCharIndex = useRef(-1);
  
  // TYPE for 70% of the distance, then HOLD for 30% to allow reading
  const typeEnd = start + (totalDist * 0.7);
  const progress = Math.min(Math.max((scroll - start) / (typeEnd - start), 0), 1);

  // Play sound on character reveal
  const totalCharsOverall = textItems.join("").length;
  const currentOverallIndex = Math.floor(progress * totalCharsOverall);
  
  useEffect(() => {
    if (currentOverallIndex > lastCharIndex.current && progress < 1 && progress > 0) {
      play('TYPEWRITER', { 
        volume: 0.15, 
        pitch: 0.9 + Math.random() * 0.2 // Add mechanical variance
      });
      lastCharIndex.current = currentOverallIndex;
    }
  }, [currentOverallIndex, progress, play]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 md:p-24 overflow-hidden gap-12">
      {textItems.map((line, lineIdx) => {
        const segmentSize = 1 / textItems.length;
        const lineStart = lineIdx * segmentSize;
        const lineEnd = (lineIdx + 1) * segmentSize;
        const lineProgress = Math.min(Math.max((progress - lineStart) / segmentSize, 0), 1);
        
        // A line is "active" if it hasn't finished typing yet but has already started
        const isLineActive = lineProgress > 0 && lineProgress < 1;

        return (
          <TypewriterLine 
            key={lineIdx}
            line={line}
            progress={lineProgress}
            showCursor={isLineActive}
          />
        );
      })}
    </div>
  );
};

export const NarrativeInterlude = ({ scroll, ranges }) => {
  if (!ranges) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {dialogues.map((d, i) => {
        const range = ranges[i];
        if (!range) return null;
        
        // Strictly constrained range to prevent overlap with scenes
        const isActive = scroll >= range[0] && scroll <= range[1];
        
        return (isActive && 
          <VolumetricDialogue 
            key={i}
            textItems={d.text} 
            scroll={scroll}
            range={range}
          />
        );
      })}
    </div>
  );
};
