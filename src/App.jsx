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

  // Resume Data
  const projects = [
    { title: "REMEMBERIT", desc: "Tag-Based File Explorer (Electron/SQLite)", date: "2024" },
    { title: "ANAYAS", desc: "Advanced RIP REST Client / Postman Alternative", date: "2023 - PRESENT" },
    { title: "MARITIME AIS", desc: "Global Ship Tracking System (Gov. Project)", date: "2021" },
    { title: "SIMPLIFIED CREDIT", desc: "Financial Loan Aggregator & Automation", date: "2020" },
  ];

  const experience = [
    { company: "QUALYS", role: "FULL STACK NODE DEVELOPER", period: "2021 - PRESENT", bullet: "Architected gigabyte-scale reporting infrastructure." },
    { company: "GEOSPOC", role: "FULL STACK NODE DEVELOPER", period: "2020 - 2021", bullet: "Built GeoQi backend & Mapbox visualization engine." },
    { company: "REDPANDA", role: "FULL STACK NODE DEVELOPER", period: "2019 - 2020", bullet: "Led end-to-end full stack execution for international clients." },
  ];

  const skills = [
    "TYPESCRIPT", "NODEJS", "REACTJS", "VUEJS", "AWS", "ELECTRON", "POSTGRESQL", "CI/CD", "MICROSERVICES", "MAPBOX"
  ];

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

  // Smooth Scroll Lerp Logic
  useEffect(() => {
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    const update = () => {
      currentScroll = lerp(currentScroll, targetScroll, 0.07);
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

  // Handheld Drift
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

  const cameraTransform = useMemo(() => {
    const isContactPage = lerpedScroll >= 4500;
    const tiltX = isContactPage ? 0 : (mousePos.y * 5 + drift.y * 0.2);
    const tiltY = isContactPage ? 0 : (-mousePos.x * 5 + drift.x * 0.2);
    
    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0px)`,
    };
  }, [mousePos, drift, lerpedScroll]);

  return (
    <div 
      className="relative min-h-[700vh] bg-obsidian transition-colors duration-700"
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
          lerpedScroll < 900 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
           <motion.div 
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1 + (lerpedScroll / 400) * 6, opacity: 1 }}
            className="flex flex-col items-center"
           >
               <div 
                 className="relative group cursor-default pointer-events-auto z-20"
                 onMouseMove={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const x = e.clientX - rect.left;
                   const y = e.clientY - rect.top;
                   e.currentTarget.style.setProperty('--x', `${x}px`);
                   e.currentTarget.style.setProperty('--y', `${y}px`);
                 }}
               >
                 <motion.h1 
                  initial={{ filter: "blur(30px)", opacity: 0, letterSpacing: "6rem", scale: 0.8 }}
                  animate={{ filter: "blur(0px)", opacity: 0.4, letterSpacing: "1.2rem", scale: 1 }}
                  transition={{ duration: 3.5, ease: "easeOut" }}
                  className="titan-title text-[15vw] text-stark leading-none text-center select-none"
                 >
                   YOGESH<br/>RATHOD
                 </motion.h1>
                 
                 {/* HOVER LAYER */}
                 <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5 }}
                  className="titan-title text-[15vw] metallic-chrome leading-none text-center select-none absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  style={{
                    clipPath: 'circle(150px at var(--x, 50%) var(--y, 50%))',
                    WebkitClipPath: 'circle(150px at var(--x, 50%) var(--y, 50%))',
                  }}
                 >
                   YOGESH<br/>RATHOD
                 </motion.h1>
               </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
                className="mt-12 flex flex-col items-center gap-6"
              >
                <span className="minimal-body text-molten font-bold text-xl tracking-[1rem]">FULL STACK DEVELOPER</span>
                <span className="minimal-body italic opacity-80">NODEJS / CLOUD ARCHITECT / BRUTALIST CODER</span>
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
        </section>

        {/* SHOT 02: THE ARCHIVE (PROJECTS) - MONOLITHIC SLABS */}
        <section className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 px-12",
          lerpedScroll >= 900 && lerpedScroll < 2500 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
          <div className="w-full max-w-5xl flex flex-col gap-2">
            {projects.map((proj, i) => (
              <motion.div 
                key={i}
                initial={{ x: -100, opacity: 0 }}
                animate={lerpedScroll >= 900 ? { 
                  x: 0, 
                  opacity: 1,
                  z: (lerpedScroll - 1500 - (i * 200)) * 0.1
                } : {}}
                className="group flex flex-col items-center justify-center border-y border-white/10 py-10 hover:bg-white/5 transition-all text-center relative overflow-hidden"
              >
                 <div className="absolute top-4 left-6 minimal-body text-[10px] opacity-40">{proj.date}</div>
                 <h3 className="titan-title text-5xl md:text-7xl group-hover:text-molten transition-all group-hover:scale-105 duration-500">
                   {proj.title}
                 </h3>
                 <p className="minimal-body mt-4 text-xs group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 transition-all">
                   {proj.desc}
                 </p>
              </motion.div>
            ))}
          </div>
          <div className="absolute top-12 left-12">
             <div className="flex items-center gap-4">
                <Database className="text-molten w-5 h-5" strokeWidth={1} />
                <span className="minimal-body font-bold">DATA_ARCHIVE_ACTIVE</span>
             </div>
          </div>
        </section>

        {/* SHOT 03: THE ENGINE (SKILLS & EXPERIENCE) */}
        <section className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-1000 px-24",
          lerpedScroll >= 2500 && lerpedScroll < 4500 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
          <div className="flex flex-col gap-12 w-full max-w-7xl">
            <div className="grid grid-cols-1 gap-8">
              {experience.map((exp, i) => (
                <motion.div 
                  key={i}
                  animate={{ x: (lerpedScroll - 3500) * 0.05 * (i % 2 === 0 ? 1 : -1) }}
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
        </section>

        {/* SHOT 04: THE INVERSION (CONTACT) */}
        <section className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000",
          lerpedScroll >= 4500 ? "bg-stark opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
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
      </div>

      {/* Progress */}
      <div className="fixed right-12 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-50 mix-blend-difference">
         {[0, 1, 2, 3].map((i) => (
           <div 
            key={i} 
            className={cn(
              "w-0.5 h-12 transition-all duration-500",
              Math.floor(lerpedScroll / 1600) === i ? "bg-molten h-24" : "bg-white/20"
            )}
           />
         ))}
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={cn(
          "fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 transition-opacity",
          lerpedScroll > 100 ? "opacity-0" : "opacity-100"
        )}
      >
        <span className="minimal-body">INITIATE_DESCENT</span>
        <ChevronDown className="text-stark w-4 h-4" strokeWidth={1} />
      </motion.div>
    </div>
  );
}
