import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils';
import { dialogues } from '../data/resume';

/**
 * TypewriterChar 
 * Mechanical Reveal: Snaps into existence instantly (Rule XI).
 */
const TypewriterChar = ({ char, index, progress, totalChars }) => {
  const focalPoint = progress * totalChars;
  const isPast = index <= focalPoint;
  const isCursor = Math.floor(focalPoint) === index;

  return (
    <span className="relative inline-block">
      <span
        style={{ 
          opacity: isPast ? 1 : 0,
          display: 'inline-block',
          whiteSpace: char === " " ? 'pre' : 'normal',
          fontFamily: '"Special Elite", cursive',
          fontSize: '3.5vw',
          lineHeight: '1.2',
          letterSpacing: '0.1rem',
          // No transition for mechanical feel
          transition: 'none' 
        }}
        className="text-stark"
      >
        {char}
      </span>
      
      {/* Mechanical Carriage Cursor (Block Style) */}
      {isCursor && (
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.2, // Fast mechanical blink
            ease: "steps(1)" 
          }}
          className="absolute left-full top-[10%] w-[1.5vw] h-[80%] bg-molten-red ml-2 shadow-[0_0_15px_rgba(255,0,0,0.5)]"
        />
      )}
    </span>
  );
};

const TypewriterLine = ({ line, progress }) => {
  const chars = line.split("");
  
  return (
    <div className="flex flex-wrap justify-center items-center max-w-6xl">
      {chars.map((char, i) => (
        <TypewriterChar 
          key={i} 
          char={char} 
          index={i} 
          progress={progress} 
          totalChars={chars.length} 
        />
      ))}
    </div>
  );
};

export const VolumetricDialogue = ({ textItems, scroll, range }) => {
  const [start, end] = range;
  const progress = Math.min(Math.max((scroll - start) / (end - start), 0), 1);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 md:p-24 overflow-hidden gap-12">
      {textItems.map((line, lineIdx) => {
        // Sequential reveal: Each line takes a portion of the progress
        const segmentSize = 1 / textItems.length;
        const lineStart = lineIdx * segmentSize;
        const lineEnd = (lineIdx + 1) * segmentSize;
        const lineProgress = Math.min(Math.max((progress - lineStart) / segmentSize, 0), 1);

        return (
          <TypewriterLine 
            key={lineIdx}
            line={line}
            progress={lineProgress}
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
