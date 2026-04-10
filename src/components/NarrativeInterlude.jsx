import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils';
import { dialogues } from '../data/resume';

export const VolumetricDialogue = ({ text, active, label }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Background Vertical Anchor */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={active ? { x: 0, opacity: 0.05 } : { x: -100, opacity: 0 }}
        className="tectonic-vertical absolute left-12 top-1/2 -translate-y-1/2 titan-title"
      >
        {label}
      </motion.div>

      {/* Main Dialogue Thought */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.h2 
          animate={active ? { filter: "blur(0px)", opacity: 1, scale: 1 } : { filter: "blur(40px)", opacity: 0, scale: 1.2 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "titan-title text-[8vw] tracking-[3rem] text-stark text-center volumetric-glow",
            active && "chromatic-glitch"
          )}
        >
          {text[0]}
        </motion.h2>
        
        {text[1] && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={active ? { opacity: 0.4, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="minimal-body text-stark mt-8 tracking-[1rem]"
          >
            {text[1]}
          </motion.p>
        )}
      </div>

      {/* Lens Flare Sweep */}
      <motion.div 
        animate={active ? { x: ["-100%", "200%"] } : { x: "-100%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
      />
    </div>
  );
};

export const NarrativeInterlude = ({ scroll }) => {
  const labels = ["ARCHIVE", "ENGINE", "FOUNDATION"];
  
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {dialogues.map((d, i) => {
        const isActive = scroll >= d.trigger[0] && scroll <= d.trigger[1];
        return (isActive && 
          <VolumetricDialogue 
            key={i}
            text={d.text} 
            active={isActive}
            label={labels[i] || "LOG"}
          />
        );
      })}
    </div>
  );
};
