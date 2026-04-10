import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ReactLenis, useLenis } from 'lenis/react';

// Utils & Helpers
import { cn } from './utils';

// Components
import { SubmergedParticles } from './components/SubmergedParticles';
import { NarrativeInterlude } from './components/NarrativeInterlude';
import { FastReadOverlay } from './components/FastReadOverlay';

// Scenes (Shots)
import { TheMonolith } from './scenes/TheMonolith';
import { TheArchive } from './scenes/TheArchive';
import { TheEngine } from './scenes/TheEngine';
import { TheFoundation } from './scenes/TheFoundation';
import { TheInversion } from './scenes/TheInversion';

// Hooks
import { useMousePos } from './hooks/useMousePos';
import { useHandheldDrift } from './hooks/useHandheldDrift';
import { useCameraTransform } from './hooks/useCameraTransform';



export default function App() {
  const containerRef = useRef(null);
  const mousePos = useMousePos();
  const drift = useHandheldDrift();
  const [isFastReadOpen, setIsFastReadOpen] = useState(false);
  
  // Dynamic Viewport Height for range calculation
  const [vH, setVH] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => setVH(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a MotionValue for scroll to use with hooks
  const { scrollY } = useScroll();
  const lerpedScroll = useSpring(scrollY, { stiffness: 35, damping: 25, mass: 2 });
  const [currentScroll, setCurrentScroll] = useState(0);

  const lenis = useLenis(({ scroll }) => {
    setCurrentScroll(scroll);
  });

  useEffect(() => {
    if (lenis) {
      if (isFastReadOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [isFastReadOpen, lenis]);

  // Define dynamic ranges for dialogues (The gaps between scenes)
  // INCREASED RANGES FOR READ TIME
  const DIALOGUE_RANGES = [
    [vH * 1.2, vH * 3.0], 
    [vH * 5.2, vH * 7.5], 
    [vH * 9.2, vH * 11.5], 
  ];

  // Define dynamic ranges for scenes (Ensure no overlap)
  const RANGES = {
    START: [0, vH * 1],
    PROJECTS: [vH * 3.2, vH * 5.0],
    EXPERIENCE: [vH * 7.8, vH * 9.0],
    FOUNDATION: [vH * 12.0, vH * 14.5],
    CONTACT: [vH * 15.0, vH * 16.5],
  };

  const cameraTransform = useCameraTransform(mousePos, drift, currentScroll);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
        <div 
          className="relative min-h-[1700vh] bg-obsidian transition-colors duration-700"
          ref={containerRef}
        >
          <div className="vignette" />
          <SubmergedParticles />
          <NarrativeInterlude scroll={currentScroll} ranges={DIALOGUE_RANGES} />
        
        <FastReadOverlay isOpen={isFastReadOpen} onClose={() => setIsFastReadOpen(false)} />

        {/* FIXED CAMERA VIEWPORT */}
        <div 
          className={cn(
            "fixed inset-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000",
            isFastReadOpen ? "blur-md scale-95 opacity-50" : "blur-0 scale-100 opacity-100"
          )}
          style={cameraTransform}
        >
          <TheMonolith 
            currentScroll={currentScroll} 
            lerpedScroll={lerpedScroll} 
            range={RANGES.START} 
            onOpenFastRead={() => setIsFastReadOpen(true)}
          />
          <TheArchive currentScroll={currentScroll} lerpedScroll={lerpedScroll} range={RANGES.PROJECTS} />
          <TheEngine currentScroll={currentScroll} lerpedScroll={lerpedScroll} range={RANGES.EXPERIENCE} />
          <TheFoundation currentScroll={currentScroll} lerpedScroll={lerpedScroll} range={RANGES.FOUNDATION} />
          <TheInversion currentScroll={currentScroll} threshold={RANGES.CONTACT[0]} />
        </div>

        {/* Progress HUD */}
        <div className={cn(
          "fixed right-12 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-50 mix-blend-difference transition-opacity duration-500",
          isFastReadOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
           {[
             { label: 'START', range: RANGES.START },
             { label: 'PROJECTS', range: RANGES.PROJECTS },
             { label: 'EXPERIENCE', range: RANGES.EXPERIENCE },
             { label: 'FOUNDATION', range: RANGES.FOUNDATION },
             { label: 'CONTACT', range: RANGES.CONTACT },
           ].map((item, i) => {
             const [start, end] = item.range;
             const active = currentScroll >= start && currentScroll < end;
             return (
               <div key={i} className="flex items-center justify-end gap-4 group cursor-pointer">
                 <span className={cn(
                   "minimal-body text-[10px] tracking-[0.3rem] transition-all",
                   active ? "text-molten-red opacity-100" : "text-stark opacity-20 group-hover:opacity-100"
                 )}>
                   {item.label}
                 </span>
                 <div className={cn(
                   "w-12 h-[1px] transition-all",
                   active ? "bg-molten-red w-24" : "bg-white/20 w-4 group-hover:w-12"
                 )} />
               </div>
             );
           })}
        </div>

        {/* Initial Prompt */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={cn(
            "fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 transition-opacity",
            (currentScroll > 100 || isFastReadOpen) ? "opacity-0" : "opacity-100"
          )}
        >
          <span className="minimal-body">INITIATE_DESCENT</span>
          <ChevronDown className="text-stark w-4 h-4" strokeWidth={1} />
        </motion.div>
      </div>

    </ReactLenis>
  );
}
