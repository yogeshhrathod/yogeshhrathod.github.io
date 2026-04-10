import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Archive,
  ChevronDown, 
  Terminal, 
  Database
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- UTILS ---
const lerp = (start, end, factor) => start + (end - start) * factor;

// --- CANVAS ASH COMPONENT ---
const AshAtmospheric = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: Math.random() * 1 + 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      death: Math.random() * 0.5 + 0.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y -= p.speedY; // Ash rising/drifting

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-10 opacity-40 mix-blend-screen"
    />
  );
};

// --- MAIN APP ---
export default function App() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState(0);
  const [lerpedScroll, setLerpedScroll] = useState(0);

  // Handle Mouse Move for Steadicam
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth Scroll Lerp Logic (Technical Mandate)
  useEffect(() => {
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    const update = () => {
      currentScroll = lerp(currentScroll, targetScroll, 0.07); // physical resistance
      setLerpedScroll(currentScroll);
      setScrollPos(targetScroll);
      
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll);
    const id = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(id);
    };
  }, []);

  // Handheld Drift Logic (Sine wave noise)
  const [drift, setDrift] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let time = 0;
    const animate = () => {
      time += 0.02;
      setDrift({
        x: Math.sin(time * 0.7) * 5,
        y: Math.cos(time * 0.5) * 5,
      });
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  // Camera Distortion Logic
  const cameraTransform = useMemo(() => {
    const tiltX = mousePos.y * 5 + drift.y * 0.2;
    const tiltY = -mousePos.x * 5 + drift.x * 0.2;
    const chromatic = Math.min(Math.abs(scrollPos - lerpedScroll) * 0.1, 10);
    
    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0px)`,
    };
  }, [mousePos, drift, scrollPos, lerpedScroll]);


  return (
    <div 
      className={cn(
        "relative min-h-[400vh] transition-colors duration-700 bg-obsidian"
      )}
      ref={containerRef}
    >
      <div className="vignette" />
      <AshAtmospheric />


      {/* FIXED CAMERA VIEWPORT */}
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden pointer-events-none"
        style={cameraTransform}
      >
        {/* SHOT 01: THE MONOLITH */}
        <section className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000",
          lerpedScroll < 1000 ? "opacity-100" : "opacity-0"
        )}>
           <motion.div 
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1 + (lerpedScroll / 500) * 10, opacity: 1 }}
            className="flex flex-col items-center"
           >
              <h1 className="titan-title text-[20vw] text-stark leading-none text-center select-none">
                HELL<br/>MERI
              </h1>
              <div className="mt-8 flex gap-24 items-center">
                <span className="minimal-body">MONOLITHIC GRANDEUR</span>
                <span className="minimal-body">EST. MMXXVI</span>
              </div>
           </motion.div>

           {/* God Rays */}
           <div className="god-ray left-1/4 top-[-20%] opacity-20" />
           <div className="god-ray right-1/4 top-[-10%] opacity-15" />
        </section>

        {/* SHOT 02: THE ARCHIVE */}
        <section className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-1000 px-24",
          lerpedScroll >= 1000 && lerpedScroll < 3000 ? "opacity-100" : "opacity-0"
        )}>
          <div className="grid grid-cols-3 gap-12 w-full max-w-7xl">
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ z: -500, opacity: 0 }}
                animate={lerpedScroll >= 1000 ? { 
                  z: (lerpedScroll - 1000) * 0.2 - 200, 
                  opacity: 1 
                } : {}}
                className="aspect-[2/3] bg-white/5 border border-white/10 p-6 flex flex-col justify-end group cursor-pointer hover:border-molten-red transition-colors"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="flex flex-col gap-2">
                  <Archive className="text-molten-red w-4 h-4" strokeWidth={1} />
                  <h3 className="titan-title text-2xl tracking-widest">SHOT_{i+1}</h3>
                  <p className="minimal-body opacity-40 group-hover:opacity-100 transition-opacity">Brutalist Sub-Sector {100 + i}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="absolute top-12 left-12">
             <div className="flex items-center gap-4">
                <Database className="text-molten-red w-4 h-4" strokeWidth={1} />
                <span className="minimal-body">ACCESSING CENTRAL REPOSITORY...</span>
             </div>
          </div>
        </section>


        <section className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000",
          lerpedScroll >= 3000 ? "bg-stark opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="text-obsidian text-center px-12">
            <h2 className="titan-title text-9xl tracking-[2rem] mb-12 italic">INVERTED</h2>
            <div className="flex flex-col gap-4 items-center">
              <span className="minimal-body text-obsidian font-bold">THE END IS THE BEGINNING</span>
              <div className="h-px w-64 bg-obsidian/20" />
            </div>
          </div>
          
          <footer className="absolute bottom-12 w-full px-12 flex justify-between items-end border-t border-obsidian/10 pt-12">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-obsidian" strokeWidth={1.5} />
                <span className="text-[10px] font-mono font-bold text-obsidian">SYSTEM_STATUS: NOMINAL</span>
              </div>
              <p className="text-[8px] font-mono text-obsidian/40 max-w-xs">
                © 2026 HELL MERI CORE. ALL RIGHTS RESERVED. UNAUTHORIZED ACCESS IS PUNISHABLE BY PERMANENT DATA DELETION.
              </p>
            </div>
            <div className="flex gap-12">
               <span className="minimal-body text-obsidian">ARCHIVE</span>
               <span className="minimal-body text-obsidian">PROTOCOL</span>
               <span className="minimal-body text-obsidian">CONTACT</span>
            </div>
          </footer>
        </section>
      </div>

      {/* Progress Indicator */}
      <div className="fixed right-12 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-50 mix-blend-difference">
         {[0, 1, 2].map((i) => (
           <div 
            key={i} 
            className={cn(
              "w-0.5 h-12 transition-all duration-500",
              Math.floor(lerpedScroll / 1300) === i ? "bg-molten-red h-24" : "bg-white/20"
            )}
           />
         ))}
      </div>

      {/* Scroll Hint */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={cn(
          "fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 transition-opacity",
          lerpedScroll > 100 ? "opacity-0" : "opacity-100"
        )}
      >
        <span className="minimal-body">DESCEND</span>
        <ChevronDown className="text-stark w-4 h-4" strokeWidth={1} />
      </motion.div>
    </div>
  );
}
