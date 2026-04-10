import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { Database } from 'lucide-react';
import { cn } from '../utils';
import { projects } from '../data/resume';

export const TheArchive = ({ currentScroll, lerpedScroll }) => {
  const scrollY = useTransform(lerpedScroll, [2000, 4000], [1000, -2000]);
  const scrollZ = useTransform(lerpedScroll, [2000, 4000], [0, 200]);

  return (
    <section className={cn(
      "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 px-12 perspective-[2000px] overflow-hidden",
      currentScroll >= 2000 && currentScroll < 4000 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )}>
      {/* MASSIVE SECTION HEADER */}
      <div className="absolute top-[15%] left-0 w-full overflow-hidden pointer-events-none opacity-10">
        <h2 className="titan-title text-[25vw] whitespace-nowrap -translate-x-1/2 left-1/2 absolute">PROJECTS</h2>
      </div>

      <div className="absolute top-12 left-12 z-50">
         <div className="flex items-center gap-4">
            <Database className="text-molten-red w-5 h-5" strokeWidth={1} />
            <span className="minimal-body font-bold text-stark">THE_ARCHIVE // SELECTED_WORKS</span>
         </div>
      </div>
      
      <motion.div 
        className="w-full max-w-5xl flex flex-col items-center gap-48 preserve-3d"
        style={{
           y: scrollY,
           translateZ: scrollZ
        }}
      >
        {projects.map((proj, i) => {
          const ProjectContent = (
            <div key={i} className="flex flex-col items-center text-center">
               <div className="minimal-body text-[12px] opacity-50 mb-6 tracking-[0.5rem]">{proj.date}</div>
               <h3 className={cn(
                 "titan-title text-6xl md:text-8xl transition-all duration-500",
                 proj.github ? "group-hover:text-molten-red group-hover:scale-105" : ""
               )}>
                 {proj.title}
               </h3>
               <p className="minimal-body mt-8 text-sm max-w-3xl opacity-80 leading-relaxed font-mono">
                 {proj.desc}
               </p>
               {proj.github && (
                 <div className="mt-12 minimal-body text-[10px] border border-white/30 px-6 py-3 group-hover:bg-molten-red group-hover:border-molten-red transition-all duration-300 inline-block group-hover:text-white font-bold">
                   ACCESS_SECURE_LINK
                 </div>
               )}
               <div className="w-full h-[1px] bg-white/20 mt-24 blur-[1px]"></div>
            </div>
          );

          if (proj.github) {
            return (
              <a 
                key={i}
                href={proj.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full cursor-pointer pointer-events-auto group outline-none"
              >
                {ProjectContent}
              </a>
            );
          }

          return ProjectContent;
        })}
      </motion.div>

      {/* Cinematic Vignette Slabs */}
      <div className="absolute top-0 w-full h-48 bg-gradient-to-b from-obsidian to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-obsidian to-transparent pointer-events-none z-10" />
    </section>
  );
};
