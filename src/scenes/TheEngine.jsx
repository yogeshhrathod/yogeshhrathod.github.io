import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { cn } from '../utils';
import { useSound } from '../context/SoundContext';
import { experience, skills } from '../data/resume';

export const TheEngine = ({ currentScroll, lerpedScroll, range = [12000, 15000] }) => {
  const [start, end] = range;
  const { play } = useSound();
  return (
    <section className={cn(
      "absolute inset-0 flex items-center justify-center transition-opacity duration-1000 px-6 md:px-24",
      currentScroll >= start && currentScroll < end ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none hidden"
    )}>
      {/* MASSIVE SECTION HEADER */}
      <div className="absolute top-[15%] left-0 w-full overflow-hidden pointer-events-none opacity-10">
        <h2 className="titan-title text-[25vw] whitespace-nowrap -translate-x-1/2 left-1/2 absolute">EXPERIENCE</h2>
      </div>

      <div className="flex flex-col gap-12 w-full max-w-7xl relative z-10">
        <div className="grid grid-cols-1 gap-8">
          {experience.map((exp, i) => (
            <motion.div 
              key={i}
              style={{ x: useTransform(lerpedScroll, [start, end], [i % 2 === 0 ? 100 : -100, i % 2 === 0 ? -100 : 100]) }}
              className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/20 pb-8 group"
            >
              <div className="flex flex-col">
                <span className="minimal-body text-molten-red font-bold text-xs mb-2 tracking-widest">{exp.period}</span>
                <h4 className="titan-title text-4xl md:text-6xl italic leading-tight">{exp.company}</h4>
                <p className="minimal-body mt-2 group-hover:text-stark">{exp.role}</p>
              </div>
              <div className="max-w-md mt-6 md:mt-0">
                <p className="text-[12px] opacity-70 leading-relaxed uppercase tracking-[0.2rem] font-medium">{exp.bullet}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-6 justify-center mt-8 cursor-default">
           {skills.map((skill, i) => (
             <span 
              key={i} 
              onMouseEnter={() => play('CLICK_MECHANICAL', { volume: 0.05, pitch: 1.5 })}
              className="minimal-body text-[10px] border border-white/30 px-4 py-2 hover:bg-molten-red hover:border-molten-red hover:text-white transition-all duration-300"
            >
               {skill}
             </span>
           ))}
        </div>
      </div>
    </section>
  );
};
