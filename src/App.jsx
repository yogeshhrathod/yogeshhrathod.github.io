import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ReactLenis, useLenis } from 'lenis/react';

// Utils & Helpers
import { cn } from './utils';

// Components
import { SubmergedParticles } from './components/SubmergedParticles';
import { NarrativeInterlude } from './components/NarrativeInterlude';

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
  
  // Create a MotionValue for scroll to use with hooks
  const { scrollY } = useScroll();
  // Set stiffness lower for that "Heavy" cinematic feel (Rule 3)
  const lerpedScroll = useSpring(scrollY, { stiffness: 35, damping: 25, mass: 2 });
  
  const [currentScroll, setCurrentScroll] = useState(0);

  // Sync Lenis scroll with state for conditional rendering
  useLenis(({ scroll }) => {
    setCurrentScroll(scroll);
  });

  const cameraTransform = useCameraTransform(mousePos, drift, currentScroll);

  return (
    <ReactLenis root options={{ 
      lerp: 0.1, 
      duration: 1.5, 
      smoothWheel: true,
      wheelMultiplier: 0.8, // Make it feel more deliberate
    }}>
      <div 
        className="relative min-h-[1200vh] bg-obsidian transition-colors duration-700"
        ref={containerRef}
      >
        <div className="vignette" />
        <SubmergedParticles />
        <NarrativeInterlude scroll={currentScroll} />

        {/* FIXED CAMERA VIEWPORT */}
        <div 
          className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden pointer-events-none"
          style={cameraTransform}
        >
          <TheMonolith currentScroll={currentScroll} lerpedScroll={lerpedScroll} />
          <TheArchive currentScroll={currentScroll} lerpedScroll={lerpedScroll} />
          <TheEngine currentScroll={currentScroll} lerpedScroll={lerpedScroll} />
          <TheFoundation currentScroll={currentScroll} lerpedScroll={lerpedScroll} />
          <TheInversion currentScroll={currentScroll} />
        </div>

        {/* Progress HUD */}
        <div className="fixed right-12 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-50 mix-blend-difference">
           {[
             { label: 'START', range: [0, 1000] },
             { label: 'PROJECTS', range: [2000, 4000] },
             { label: 'EXPERIENCE', range: [5000, 7000] },
             { label: 'FOUNDATION', range: [8000, 10000] },
             { label: 'CONTACT', range: [11000, 12000] }
           ].map((shot, i) => (
             <div 
              key={i} 
              className={cn(
                "w-0.5 h-12 transition-all duration-500 relative group",
                currentScroll >= shot.range[0] && currentScroll <= shot.range[1] ? "bg-molten-red h-24" : "bg-white/20"
              )}
             >
                <span className="absolute right-4 top-1/2 -translate-y-1/2 minimal-body text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {shot.label}
                </span>
             </div>
           ))}
        </div>

        {/* Scroll Hint */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={cn(
            "fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 transition-opacity",
            currentScroll > 100 ? "opacity-0" : "opacity-100"
          )}
        >
          <span className="minimal-body">INITIATE_DESCENT</span>
          <ChevronDown className="text-stark w-4 h-4" strokeWidth={1} />
        </motion.div>
      </div>
    </ReactLenis>
  );
}
