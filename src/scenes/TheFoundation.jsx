import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { cn } from '../utils';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';
import { education, achievements } from '../data/resume';

export const TheFoundation = ({ currentScroll, lerpedScroll, range = [19000, 22000] }) => {
  const [start, end] = range;
  const { play } = useSound();
  const { trigger } = useHaptics();
  
  // Scenery transforms
  const opacity = useTransform(lerpedScroll, [start, start + 300, end - 300, end], [0, 1, 1, 0]);
  const scale = useTransform(lerpedScroll, [start, end], [1.05, 0.95]);
  const yOffset = useTransform(lerpedScroll, [start, end], [150, -450]);
  const blur = useTransform(lerpedScroll, [start, start + 500, end - 500, end], [10, 0, 0, 10]);

  // Content layers
  const educationY = useTransform(lerpedScroll, [start, end], [20, -20]);
  const achievementsY = useTransform(lerpedScroll, [start, end], [40, -40]);

  return (
    <motion.section 
      style={{ opacity, scale, filter: `blur(${blur}px)` }}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 pointer-events-none",
        currentScroll >= start && currentScroll < end ? "pointer-events-auto" : "hidden"
      )}
    >
      {/* BACKGROUND ARCHITECTURAL LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[1px] border-white/5 w-[90vw] h-[90vh] rounded-full blur-[100px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Cinematic Vertical Guides */}
        <div className="absolute top-0 right-[15%] bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-[15%] bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        
      </div>

      <motion.div 
        style={{ y: yOffset }}
        className="relative z-10 w-full max-w-6xl px-4 md:px-8 flex flex-col gap-24 md:gap-40 pt-10 md:pt-20"
      >
        {/* 1. ACADEMIC BLOCK - Museum Style */}
        <motion.div 
          style={{ y: educationY }}
          className="flex flex-col gap-10 group/section"
        >
          <div className="flex items-center gap-6">
            <div className="flex-grow h-[1px] bg-gradient-to-r from-molten-red/40 to-transparent" />
          </div>

          {education.map((edu, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start w-full">
               <div className="flex flex-col gap-2 w-full md:min-w-[300px]">
                  <h3 className="text-2xl md:text-5xl font-black italic tracking-tighter leading-[0.85] uppercase text-white group-hover/section:text-molten-red transition-colors duration-700 break-words">
                    {edu.institute}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="w-8 h-[1px] bg-white/20" />
                    <span className="minimal-body text-[9px] opacity-40">{edu.location}</span>
                  </div>
               </div>
               
               <div className="flex flex-col gap-6 flex-grow">
                  <div className="flex flex-col">
                    <span className="minimal-body text-[10px] opacity-30 mb-2">MANIFESTED_DEGREE</span>
                    <p className="text-2xl font-light tracking-[0.15rem] text-stark/90 uppercase">
                      {edu.degree}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="px-4 py-2 border border-white/10 bg-white/5">
                      <span className="minimal-body text-[10px] tracking-widest">{edu.period}</span>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </motion.div>

        {/* 2. ACHIEVEMENTS - Tectonic Slabs */}
        <motion.div 
          style={{ y: achievementsY }}
          className="flex flex-col gap-10 group/section"
        >
          <div className="flex items-center gap-6">
            <div className="flex-grow h-[1px] bg-gradient-to-l from-molten-red/40 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {achievements.map((ach, i) => (
              <div 
                key={i}
                onMouseEnter={() => {
                  play('HOVER_PHYSICAL', { volume: 0.08, pitch: 1.1 });
                  trigger('selection');
                }}
                className="relative p-10 bg-obsidian border-[1px] border-white/5 hover:border-white/20 transition-all duration-700 group flex flex-col gap-6"
              >
                {/* ID Tag */}

                
                <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none border-b border-molten-red/0 group-hover:border-molten-red/30 pb-4 transition-all">
                  {ach.title}
                </h4>

                <p className="text-sm font-light leading-relaxed text-white/40 group-hover:text-white/80 transition-all duration-500">
                  {ach.desc}
                </p>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="minimal-body text-[8px] opacity-20 group-hover:opacity-50"></span>
                  <div className="w-1.5 h-1.5 rounded-full bg-molten-red/30 group-hover:bg-molten-red group-hover:shadow-[0_0_10px_#ff3300] transition-all" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* HUD REMOVED */}
    </motion.section>
  );
};

