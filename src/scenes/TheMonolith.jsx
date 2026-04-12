import React, { useRef, useEffect } from 'react';
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { cn } from '../utils';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';

export const TheMonolith = ({ currentScroll, lerpedScroll, range = [0, 1000], onOpenFastRead }) => {
  const [start, end] = range;
  const { play, isMuted, isUnlocked } = useSound();
  const { trigger } = useHaptics();
  const hasPlayedIntro = useRef(false);
  const hasPlayedZoom = useRef(false);
  const introAudioRef = useRef(null);
  const zoomAudioRef = useRef(null);
  const currentScrollRef = useRef(currentScroll);

  useEffect(() => {
    currentScrollRef.current = currentScroll;
  }, [currentScroll]);

  const monolithScale = useTransform(lerpedScroll, [start, end], [1, 5]);
  const monolithOpacity = useTransform(lerpedScroll, [start + (end - start) * 0.8, end], [1, 0]);
  const statusOpacity = useTransform(lerpedScroll, [start, start + (end - start) * 0.5], [1, 0]);
  
  const flashlightX = useMotionValue(0);
  const flashlightY = useMotionValue(0);
  const flashlightOpacity = useMotionValue(0);
  const titleContainerRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!titleContainerRef.current) return;
    const rect = titleContainerRef.current.getBoundingClientRect();
    flashlightX.set(e.clientX - rect.left);
    flashlightY.set(e.clientY - rect.top);
  };

  const flashlightClipPath = useTransform(
    [flashlightX, flashlightY],
    ([x, y]) => `circle(150px at ${x}px ${y}px)`
  );

  const sonicOpacity = useTransform(lerpedScroll, [start + (end - start) * 0.7, start + (end - start) * 0.8, start + (end - start) * 0.95, end], [0, 0.15, 0.15, 0]);
  const sonicScale = useTransform(lerpedScroll, [start + (end - start) * 0.7, end], [0.9, 1.2]);

  return (
    <section className={cn(
      "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000",
      currentScroll < end ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none hidden"
    )}>

       <motion.button 
         initial={{ opacity: 0, x: 20 }}
         animate={{ 
           opacity: 1, 
           x: 0,
           boxShadow: [
             "0 0 0px rgba(166, 52, 27, 0)",
             "0 0 15px rgba(166, 52, 27, 0.2)",
             "0 0 0px rgba(166, 52, 27, 0)"
           ],
           borderColor: [
             "rgba(232, 228, 223, 0.1)",
             "rgba(166, 52, 27, 0.2)",
             "rgba(232, 228, 223, 0.1)"
           ]
         }}
         transition={{ 
           opacity: { delay: 4, duration: 2 },
           x: { delay: 4, duration: 2 },
           boxShadow: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 5 },
           borderColor: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 5 }
         }}
         whileHover="hover"
         initial="initial"
         onClick={() => {
            play('SWOOSH_CINEMATIC', { volume: 0.4 });
            trigger('heavy');
            onOpenFastRead();
         }}
         onMouseEnter={() => {
            play('HOVER_PHYSICAL', { volume: 0.1, pitch: 1.5 });
            trigger('light');
         }}
         className="fixed top-12 right-12 px-8 py-3 border border-white/5 bg-white/5 backdrop-blur-xl rounded-full minimal-body text-[10px] text-stark/60 hover:text-white transition-all pointer-events-auto z-[300] group flex items-center gap-4 cursor-pointer overflow-hidden"
       >
          {/* High Speed Lens Flare Sweep - Desaturated */}
          <motion.div 
            variants={{
              initial: { x: "-150%", skewX: -20 },
              hover: { x: "150%", skewX: -20 }
            }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"
          />

          <div className="w-1.5 h-1.5 rounded-full bg-molten-red/50 relative z-10" />
          <div className="flex flex-col items-start leading-tight relative z-10">
            <span className="tracking-[0.2rem]">RESUME // DATA</span>
            <span className="text-[6px] opacity-20 group-hover:opacity-60 tracking-normal normal-case transition-opacity">Architectural Brief</span>
          </div>

          {/* Selection Flash */}
          <motion.div 
            variants={{
              initial: { opacity: 0 },
              hover: { opacity: [0, 1, 0], transition: { duration: 0.15 } }
            }}
            className="absolute inset-0 bg-white/10 z-0"
          />
       </motion.button>

       <motion.div 
        style={{ scale: monolithScale, opacity: monolithOpacity }}
        className="flex flex-col items-center"
       >
           <div 
             ref={titleContainerRef}
             className="relative group cursor-default pointer-events-auto z-20"
             onMouseMove={handleMouseMove}
             onMouseEnter={() => flashlightOpacity.set(1)}
             onMouseLeave={() => flashlightOpacity.set(0)}
           >
             <motion.h1 
              initial={{ filter: "blur(30px)", opacity: 0, letterSpacing: "6rem", scale: 0.8 }}
              animate={{ filter: "blur(0px)", opacity: 0.4, letterSpacing: "1.2rem", scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="titan-title text-[15vw] text-stark leading-none text-center select-none drop-shadow-[0_4px_16px_rgba(232,228,223,0.25)]"
             >
               YOGESH<br/>RATHOD
             </motion.h1>
             
             {/* HOVER LAYER */}
             <motion.div
               className="absolute inset-0 pointer-events-none"
               style={{
                 opacity: flashlightOpacity,
                 clipPath: flashlightClipPath,
                 WebkitClipPath: flashlightClipPath,
               }}
             >
               <motion.h1 
                initial={{ filter: "blur(30px)", opacity: 0, letterSpacing: "6rem", scale: 0.8 }}
                animate={{ filter: "blur(0px)", opacity: 1, letterSpacing: "1.2rem", scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="titan-title text-[15vw] metallic-chrome leading-none text-center select-none volumetric-glow drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]"
               >
                 YOGESH<br/>RATHOD
               </motion.h1>
             </motion.div>
           </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
            className="mt-12 flex flex-col items-center gap-6"
          >
            <span className="minimal-body text-molten font-bold text-xl tracking-[1rem]">I BUILD AGENTIC SYSTEMS.</span>
            <span className="minimal-body italic opacity-80">AI ORCHESTRATOR / FULL STACK ARCHITECT / AGENTIC CODER</span>
          </motion.div>
       </motion.div>

       <motion.div 
        initial={{ opacity: 0, x: -500 }}
        animate={{ opacity: 0.2, x: 0 }}
        transition={{ duration: 5, ease: "easeOut" }}
        className="god-ray left-1/4 top-[-20%]" 
       />
       <motion.div 
        initial={{ opacity: 0, x: 500 }}
        animate={{ opacity: 0.15, x: 0 }}
        transition={{ duration: 5, ease: "easeOut", delay: 0.5 }}
        className="god-ray right-1/4 top-[-10%]" 
       />

       {/* PROTAGONIST EXPRESSION: AHHHHH (SONIC REVEAL) */}
       <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[150]"
        style={{
          opacity: sonicOpacity,
          scale: sonicScale,
        }}
       >
          <h2 className="titan-title text-[25vw] italic text-molten-red tracking-[10rem] mix-blend-overlay filter blur-[2px] animate-pulse">
            AHHHHH
          </h2>
          {/* Sonic Ripple */}
          <motion.div 
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            className="absolute w-[50vw] h-[50vw] border border-molten-red/30 rounded-full"
          />
       </motion.div>
    </section>
  );
};
