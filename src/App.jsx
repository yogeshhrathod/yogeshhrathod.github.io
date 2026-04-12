import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ReactLenis, useLenis } from 'lenis/react';
import { cn } from './utils';
import { SubmergedParticles } from './components/SubmergedParticles';
import { NarrativeInterlude } from './components/NarrativeInterlude';
import { FastReadOverlay } from './components/FastReadOverlay';
import { SoundControl } from './components/SoundControl';
import { useSound } from './context/SoundContext';
import { useHaptics } from './context/HapticContext';
import { TheMonolith } from './scenes/TheMonolith';
import { TheArchive } from './scenes/TheArchive';
import { TheEngine } from './scenes/TheEngine';
import { TheFoundation } from './scenes/TheFoundation';
import { TheInversion } from './scenes/TheInversion';
import { useHandheldDrift } from './hooks/useHandheldDrift';
import { useCameraTransform } from './hooks/useCameraTransform';
import { CinematicLoader } from './components/CinematicLoader';
import { AtmosphericMetadata } from './components/AtmosphericMetadata';

export default function App() {
  const containerRef = useRef(null);
  const drift = useHandheldDrift();
  const { play } = useSound();
  const { trigger } = useHaptics();
  const [isFastReadOpen, setIsFastReadOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  
  // High-performance Mouse Tracking (Avoiding re-renders)
  const xPercent = useSpring(0, { stiffness: 50, damping: 30 });
  const yPercent = useSpring(0, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      xPercent.set(x);
      yPercent.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [xPercent, yPercent]);

  // Dynamic Viewport Height for range calculation
  // Haptic Visual Feedback Engine
  const [hapticIntensity, setHapticIntensity] = useState(0);
  useEffect(() => {
    const triggerHaptic = (e) => {
      const { intensity, pattern } = e.detail;
      
      // Calculate duration based on pattern sum
      const duration = pattern.reduce((a, b) => a + b, 0);
      
      setHapticIntensity(intensity);
      setTimeout(() => setHapticIntensity(0), duration || 50);
    };
    window.addEventListener('ui-haptic-impact', triggerHaptic);
    return () => window.removeEventListener('ui-haptic-impact', triggerHaptic);
  }, []);

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
  // SIGNIFICANTLY INCREASED RANGES FOR READ TIME
  const DIALOGUE_RANGES = [
    [vH * 1.5, vH * 4.5], // Gap 1: Projects teaser
    [vH * 8.5, vH * 11.5], // Gap 2: Experience teaser
    [vH * 15.5, vH * 18.5], // Gap 3: Education teaser
  ];

  // Define dynamic ranges for scenes (Ensure no overlap)
  // Extended ranges to give "Time to read" (Rule: Tectonic Scale)
  const RANGES = {
    START: [0, vH * 1.5],
    PROJECTS: [vH * 5.0, vH * 8.0],
    EXPERIENCE: [vH * 12.0, vH * 15.0],
    FOUNDATION: [vH * 19.0, vH * 22.0],
    CONTACT: [vH * 23.5, vH * 25.0],
  };

  const cameraTransform = useCameraTransform(xPercent, yPercent, drift, scrollY);

  // Trigger sounds on major scroll milestones
  const lastSection = useRef(null);
  useEffect(() => {
    let activeSection = null;
    Object.entries(RANGES).forEach(([key, [start, end]]) => {
      if (currentScroll >= start && currentScroll < end) {
        activeSection = key;
      }
    });

    if (activeSection && activeSection !== lastSection.current) {
      play('HEAVY_THUD', { volume: 0.05 });
      lastSection.current = activeSection;
    }
  }, [currentScroll, play, RANGES]);

  return (
    <>
      {!hasEntered && <CinematicLoader onEnter={() => setHasEntered(true)} />}
      
      {hasEntered && (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            <div 
              className="relative min-h-[2500vh] bg-obsidian transition-colors duration-700"
              ref={containerRef}
            >
          <div className="vignette" />
          <SubmergedParticles />
          <NarrativeInterlude scroll={currentScroll} ranges={DIALOGUE_RANGES} />
          <AtmosphericMetadata isVisible={!isFastReadOpen} />
        
        <FastReadOverlay isOpen={isFastReadOpen} onClose={() => setIsFastReadOpen(false)} />

        {/* FIXED CAMERA VIEWPORT */}
        <motion.div 
          className={cn(
            "fixed inset-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000",
            isFastReadOpen ? "blur-md scale-95 opacity-50" : "blur-0 scale-100 opacity-100"
          )}
          animate={{
            x: hapticIntensity > 0 ? [0, -hapticIntensity, hapticIntensity, 0] : 0,
            y: hapticIntensity > 0 ? [0, -hapticIntensity, hapticIntensity, 0] : 0,
          }}
          transition={{ duration: 0.05, repeat: hapticIntensity > 1 ? 2 : 0 }}
          style={{ transform: cameraTransform }}
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
        </motion.div>

        <SoundControl />

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
               <div 
                key={i} 
                className="flex items-center justify-end gap-4 group cursor-pointer"
                onClick={() => {
                  play('CLICK_MECHANICAL', { volume: 0.1 });
                  trigger('selection');
                  lenis?.scrollTo(start);
                }}
               >
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

      </div>

        </ReactLenis>
      )}
    </>
  );
}
