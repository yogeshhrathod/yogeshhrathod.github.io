import React from 'react';
import { Terminal } from 'lucide-react';
import { cn } from '../utils';

export const TheInversion = ({ currentScroll, threshold = 11000 }) => {
  return (
    <section className={cn(
      "absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000",
      currentScroll >= threshold ? "bg-stark opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )}>
      {/* MASSIVE SECTION HEADER */}
      <div className="absolute top-[10%] left-0 w-full overflow-hidden pointer-events-none opacity-5">
        <h2 className="titan-title text-[25vw] whitespace-nowrap -translate-x-1/2 left-1/2 absolute text-obsidian">THE_END</h2>
      </div>
      <div className="text-obsidian text-center px-6 md:px-12 w-full max-w-5xl">
        <h2 className="titan-title text-[10vw] md:text-[8vw] tracking-[-0.2rem] md:tracking-[-0.5rem] italic text-shadow-none leading-[0.8]">ESTABLISH<br/>CONTACT</h2>
        
        <div className="mt-12 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-y border-obsidian/10 py-8 md:py-12">
           <div className="flex flex-col gap-2">
             <span className="minimal-body text-obsidian font-bold">TERMINAL</span>
             <a href="tel:+918698482662" className="text-[10px] font-mono hover:text-molten-red transition-colors">+91 8698482662</a>
           </div>
           <div className="flex flex-col gap-2 border-y md:border-y-0 md:border-x border-obsidian/10 py-8 md:py-0">
             <span className="minimal-body text-obsidian font-bold">REPOSITORY</span>
             <a href="mailto:yrathod33@gmail.com" className="text-[10px] font-mono hover:text-molten-red transition-colors">yrathod33@gmail.com</a>
           </div>
           <div className="flex flex-col gap-2">
             <span className="minimal-body text-obsidian font-bold">STATION</span>
             <p className="text-[10px] font-mono">PUNE, INDIA</p>
           </div>
        </div>
        
        <div className="mt-12 group cursor-pointer">
           <span className="minimal-body text-obsidian font-black text-lg underline decoration-molten decoration-4 underline-offset-8">DOWNLOAD_FULL_INTEL_REPORT (PDF)</span>
        </div>
      </div>
      
      <footer className="absolute bottom-12 w-full px-12 flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-obsidian" strokeWidth={1.5} />
            <span className="text-[10px] font-mono font-bold text-obsidian">SYSTEM_AUTH: YOGESH_RATHOD</span>
          </div>
          <p className="text-[8px] font-mono text-obsidian/40 max-w-xs">
            ARCHITECTING IMMOVABLE OBJECTS SINCE 2016.
          </p>
        </div>
        <div className="flex gap-12">
           <a href="https://www.linkedin.com/in/Rathod-Yogesh" target="_blank" rel="noopener noreferrer" className="minimal-body text-obsidian hover:text-molten">LINKEDIN</a>
           <a href="https://github.com/yrathod33" target="_blank" rel="noopener noreferrer" className="minimal-body text-obsidian hover:text-molten">GITHUB</a>
           <a href="mailto:yrathod33@gmail.com" className="minimal-body text-obsidian hover:text-molten">INSTANT</a>
        </div>
      </footer>
    </section>
  );
};
