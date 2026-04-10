import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils';
import { dialogues } from '../data/resume';

/**
 * TypewriterChar 
 */
const TypewriterChar = ({ char, index, progress, totalChars, showCursor }) => {
  const focalPoint = progress * totalChars;
  // Use < instead of <= to prevent the first letter (index 0) from showing at progress 0
  const isPast = index < focalPoint;
  const isTarget = Math.floor(focalPoint) === index;
  const isEndOfLine = index === totalChars - 1;

  // Rule: Show cursor only if this character is the active typing point on an active line
  // And hide it once the line is fully discovered
  const activeCursor = showCursor && isTarget && progress < 1;

  return (
    <span className="relative inline-block">
      <span
        style={{ 
          opacity: isPast ? 1 : 0,
          display: 'inline-block',
          whiteSpace: char === " " ? 'pre' : 'normal',
          fontFamily: '"Courier Prime", monospace',
          fontSize: '2.2vw',
          lineHeight: '1.4',
          letterSpacing: '0.05rem',
          transition: 'none' 
        }}
        className="text-stark font-bold"
      >
        {char}
      </span>
      
      {activeCursor && (
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.2,
            ease: "steps(1)" 
          }}
          className="absolute left-full top-[10%] w-[1.2vw] h-[80%] bg-molten-red ml-1 shadow-[0_0_10px_rgba(255,0,0,0.5)]"
        />
      )}
    </span>
  );
};

const TypewriterLine = ({ line, progress, showCursor }) => {
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
          showCursor={showCursor}
        />
      ))}
    </div>
  );
};

export const VolumetricDialogue = ({ textItems, scroll, range }) => {
  const [start, end] = range;
  const totalDist = end - start;
  
  // TYPE for 70% of the distance, then HOLD for 30% to allow reading
  const typeEnd = start + (totalDist * 0.7);
  const progress = Math.min(Math.max((scroll - start) / (typeEnd - start), 0), 1);

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
