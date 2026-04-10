import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { cn } from '../utils';
import { education, achievements } from '../data/resume';

export const TheFoundation = ({ currentScroll, lerpedScroll }) => {
  const gridZ = useTransform(lerpedScroll, [8000, 10000], [0, 400]);
  const academicX = useTransform(lerpedScroll, [8000, 9500], [200, -200]);
  const academicZ = useTransform(lerpedScroll, [8000, 9500], [0, 100]);
  const achievementX = useTransform(lerpedScroll, [8600, 10000], [-300, 300]);
  const achievementZ = useTransform(lerpedScroll, [8600, 10000], [0, 150]);

  return (
    <section className={cn(
      "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 px-12 perspective-[3000px] overflow-hidden",
      currentScroll >= 8000 && currentScroll < 10000 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )}>
       {/* MASSIVE SECTION HEADER */}
       <div className="absolute top-[15%] left-0 w-full overflow-hidden pointer-events-none opacity-10">
         <h2 className="titan-title text-[25vw] whitespace-nowrap -translate-x-1/2 left-1/2 absolute">FOUNDATION</h2>
       </div>

       {/* Background Grid Pattern for "Scanner" feel */}
       <motion.div 
         className="absolute inset-0 z-0 opacity-10 pointer-events-none"
         style={{
           backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
           backgroundSize: '40px 40px',
           translateZ: gridZ
         }}
       />

       <div className="w-full max-w-7xl relative z-10 flex flex-col gap-24">
          
          {/* Education Slab */}
          <motion.div 
            className="w-full flex flex-col md:flex-row gap-12 items-start"
            style={{
               x: academicX,
               translateZ: academicZ
            }}
          >
             <div className="bg-white/5 border border-white/10 p-12 w-full md:w-2/3 backdrop-blur-sm relative group hover:border-molten-red transition-all duration-700 hover:shadow-[0_0_100px_rgba(255,0,0,0.1)]">
                <div className="absolute top-0 left-0 w-2 h-full bg-molten-red group-hover:w-4 transition-all duration-500" />
                <h2 className="minimal-body text-[10px] text-molten-red tracking-[0.5rem] mb-12">ACADEMIC_CORE</h2>
                {education.map((edu, col) => (
                  <div key={col} className="flex flex-col gap-4">
                    <h3 className="titan-title text-5xl md:text-7xl leading-[0.9] uppercase mix-blend-difference">{edu.institute}</h3>
                    <p className="minimal-body text-[16px] font-bold tracking-[0.2rem] opacity-90">{edu.degree}</p>
                    <div className="flex gap-8 mt-6">
                      <span className="minimal-body text-[10px] bg-white/10 px-4 py-2 border border-white/20">{edu.period}</span>
                      <span className="minimal-body text-[10px] bg-molten-red/10 border border-molten-red/30 px-4 py-2 text-molten-red">{edu.location}</span>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>

          {/* Achievements Grid */}
          <motion.div 
            className="w-full flex flex-col items-end"
            style={{
               x: achievementX,
               translateZ: achievementZ
            }}
          >
             <div className="w-full md:w-3/4">
                <h2 className="minimal-body text-[10px] text-molten-red tracking-[0.5rem] mb-6 text-right w-full border-b border-white/10 pb-4">
                  EXTERNAL_REPORTS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  {achievements.map((ach, i) => (
                    <div 
                      key={i}
                      className="bg-obsidian border border-white/20 p-8 flex flex-col justify-between min-h-[250px] relative overflow-hidden group hover:bg-white/5 transition-all duration-500 hover:-translate-y-2 hover:border-molten-red/50"
                    >
                       {/* Hover Flare */}
                       <div className="absolute inset-0 bg-radial-gradient from-molten-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                       
                       <div>
                         <span className="minimal-body text-[10px] opacity-40 mb-2 block">ENTRY_{i+1}</span>
                         <span className="titan-title text-4xl text-molten-red">
                           {ach.title}
                         </span>
                       </div>
                       <p className="minimal-body text-[11px] font-mono leading-relaxed mt-6 border-t border-white/10 pt-4 group-hover:text-white transition-colors duration-300">
                         {ach.desc}
                       </p>
                    </div>
                  ))}
                </div>
             </div>
          </motion.div>
       </div>
    </section>
  );
};
