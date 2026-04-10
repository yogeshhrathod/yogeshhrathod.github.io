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
    { title: "REMEMBERIT", desc: "The Tag-Based File Explorer (Electron/SQLite). Intuitive drag and drop file organization, filtering, and reference management without relocating files.", date: "2024" },
    { title: "ANAYAS", desc: "Advanced REST Client / Postman Alternative. API-dependent calls for better data fetching. Open source.", date: "10/2023 - PRESENT", github: "https://github.com/yogeshhrathod/Anayas" },
    { title: "AIS", desc: "Global Ship Tracking System (Gov Project). Analyzed past activities and identified suspicious maritime behavior in real-time.", date: "01/2021 - 12/2021" },
    { title: "SIMPLIFIED CREDIT", desc: "Financial Loan Aggregator. Automated generation of detailed Financial Models and Reports for bank viability assessments.", date: "01/2020 - 12/2020" },
  ];

  const experience = [
    { company: "QUALYS", role: "FULL STACK NODE DEVELOPER", period: "10/2021 - PRESENT", bullet: "Architected gigabyte-scale reporting infrastructure. Migrated JS to TypeScript." },
    { company: "GEOSPOC", role: "FULL STACK NODE DEVELOPER", period: "09/2020 - 09/2021", bullet: "Built GeoQi backend on AWS & Mapbox real-time visualization engine." },
    { company: "REDPANDA", role: "FULL STACK NODE DEVELOPER", period: "01/2019 - 12/2020", bullet: "Led full-stack (Vue, Node, MongoDB) end-to-end execution for global clients." },
  ];

  const education = [
    { degree: "BE COMPUTER", institute: "PUNE INSTITUTE OF COMPUTER TECHNOLOGY", period: "06/2016 - 06/2019", location: "PUNE" }
  ];

  const achievements = [
    { title: "1ST PRIZE", desc: "Software Development - Credenz'17 at PICT" },
    { title: "2ND PRIZE", desc: "Best Project Idea - SPECTER'17 at Zeal College" },
    { title: "3RD PRIZE", desc: "GameJam'18 organized at UBISOFT" }
  ];

  const skills = [
    "TYPESCRIPT", "NODEJS", "REACTJS", "VUEJS", "ANGULAR", "EXPRESSJS", 
    "POSTGRESQL", "AWS", "ELECTRON", "CI/CD", "CYPRESS", "MICROSERVICES", 
    "MAPBOX", "NESTJS", "MONGODB"
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
    const isContactPage = lerpedScroll >= 7000;
    const tiltX = isContactPage ? 0 : (mousePos.y * 5 + drift.y * 0.2);
    const tiltY = isContactPage ? 0 : (-mousePos.x * 5 + drift.x * 0.2);
    
    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0px)`,
    };
  }, [mousePos, drift, lerpedScroll]);

  return (
    <div 
      className="relative min-h-[900vh] bg-obsidian transition-colors duration-700"
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

        {/* SHOT 02: THE ARCHIVE (PROJECTS) - CINEMATIC CREDITS */}
        <section className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 px-12 perspective-[2000px] overflow-hidden",
          lerpedScroll >= 900 && lerpedScroll < 3500 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
          <div className="absolute top-12 left-12 z-50">
             <div className="flex items-center gap-4">
                <Database className="text-molten-red w-5 h-5" strokeWidth={1} />
                <span className="minimal-body font-bold text-stark">DATA_ARCHIVE_ACTIVE</span>
             </div>
          </div>
          
          <motion.div 
            className="w-full max-w-5xl flex flex-col items-center gap-48 preserve-3d"
            animate={{
               y: 1000 - Math.max(0, lerpedScroll - 900) * 1.5,
               translateZ: Math.max(0, lerpedScroll - 900) * 0.1
            }}
          >
            {projects.map((proj, i) => {
              const ProjectContent = (
                <div className="flex flex-col items-center text-center">
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

              return (
                <div key={i} className="w-full">
                  {ProjectContent}
                </div>
              );
            })}
          </motion.div>

          {/* Cinematic Vignette Slabs */}
          <div className="absolute top-0 w-full h-48 bg-gradient-to-b from-obsidian to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-obsidian to-transparent pointer-events-none z-10" />
        </section>

        {/* SHOT 03: THE ENGINE (SKILLS & EXPERIENCE) */}
        <section className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-1000 px-24",
          lerpedScroll >= 3500 && lerpedScroll < 5500 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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

        {/* SHOT 04: THE FOUNDATION (EDUCATION & ACHIEVEMENTS) */}
        <section className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 px-12",
          lerpedScroll >= 5500 && lerpedScroll < 7000 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
           <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-24">
              {/* Education */}
              <div className="flex flex-col gap-12">
                 <h2 className="minimal-body text-molten-red tracking-[0.5rem] mb-6">01 // ACADEMIC_CORE</h2>
                 {education.map((edu, col) => (
                    <motion.div 
                      key={col}
                      animate={{ y: (lerpedScroll - 5800) * -0.05 }}
                      className="border-l-2 border-white/20 pl-8 relative group hover:border-molten-red transition-colors"
                    >
                       <div className="absolute top-0 left-[-5px] w-2 h-2 bg-white group-hover:bg-molten-red transition-colors rounded-full" />
                       <h3 className="titan-title text-4xl mb-4 leading-none">{edu.institute}</h3>
                       <p className="minimal-body text-[14px] font-bold">{edu.degree}</p>
                       <div className="flex gap-4 mt-2">
                         <span className="minimal-body text-[10px] opacity-60">{edu.period}</span>
                         <span className="minimal-body text-[10px] text-molten-red">{edu.location}</span>
                       </div>
                    </motion.div>
                 ))}
              </div>

              {/* Achievements */}
              <div className="flex flex-col gap-12">
                 <h2 className="minimal-body text-molten-red tracking-[0.5rem] mb-6 border-b border-white/10 pb-4 text-right">02 // KEY_REPORTS</h2>
                 <div className="flex flex-col gap-8">
                   {achievements.map((ach, i) => (
                     <motion.div 
                       key={i}
                       animate={{ x: (lerpedScroll - 5800) * 0.05 }}
                       className="flex items-center gap-6 group bg-white/5 p-6 hover:bg-white/10 transition-colors"
                     >
                        <span className="titan-title text-3xl text-molten-red opacity-50 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {ach.title}
                        </span>
                        <p className="minimal-body text-[11px] font-mono leading-relaxed">
                          {ach.desc}
                        </p>
                     </motion.div>
                   ))}
                 </div>
              </div>
           </div>
        </section>

        {/* SHOT 05: THE INVERSION (CONTACT) */}
        <section className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000",
          lerpedScroll >= 7000 ? "bg-stark opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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
         {[0, 1, 2, 3, 4].map((i) => (
           <div 
            key={i} 
            className={cn(
              "w-0.5 h-12 transition-all duration-500",
              Math.floor(lerpedScroll / 1800) === i ? "bg-molten-red h-24" : "bg-white/20"
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
