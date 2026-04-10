import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { cn } from '../utils';
import { experience, skills } from '../data/resume';

export const TheEngine = ({ currentScroll, lerpedScroll, range = [5000, 7000] }) => {
  const [start, end] = range;
  const opacity = useTransform(
    lerpedScroll, 
    [start - 500, start, end - 500, end], 
    [0, 1, 1, 0]
  );

  return (
    <motion.section 
      style={{ opacity }}
      className={cn(
        "absolute inset-0 flex items-center justify-center px-24",
        currentScroll >= (start - 500) && currentScroll < end ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
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
                <span className="minimal-body text-molten font-bold text-xs mb-2 tracking-widest">{exp.period}</span>
                <h4 className="titan-title text-6xl italic leading-tight">{exp.company}</h4>
                <p className="minimal-body mt-2 group-hover:text-stark">{exp.role}</p>
              </div>
              <div className="max-w-md mt-6 md:mt-0">
                <p className="text-[12px] opacity-70 leading-relaxed uppercase tracking-[0.2rem] font-medium">{exp.bullet}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-6 justify-center mt-8">
           {skills.map((skill, i) => (
             <span key={i} className="minimal-body text-[10px] border border-white/30 px-4 py-2 hover:bg-molten hover:border-molten hover:text-white transition-all duration-300">
               {skill}
             </span>
           ))}
        </div>
      </div>
    </motion.section>
  );
};
