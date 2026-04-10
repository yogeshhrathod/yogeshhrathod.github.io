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

// --- SUBMERGED PARTICLES (Ubisoft Rule: < 0.1px per frame) ---
const SubmergedParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.08,
      speedY: (Math.random() - 0.5) * 0.08,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

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
      className="fixed inset-0 pointer-events-none z-10 opacity-30 mix-blend-screen"
    />
  );
};

const dialogues = [
  { trigger: [1000, 2000], text: ["CHECK OUT MY PROJECTS.", "LIKE REMEMBERIT, LUNA_ AND SCOOTY."] },
  { trigger: [4000, 5000], text: ["AHHHHH... THAT'S LUNA.", "AND HERE IS MY WORK EXPERIENCE."] },
  { trigger: [7000, 8000], text: ["AND THIS IS MY EDUCATION."] },
];

const VolumetricDialogue = ({ text, active, scrollProgress, label }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Background Vertical Anchor */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={active ? { x: 0, opacity: 0.05 } : { x: -100, opacity: 0 }}
        className="tectonic-vertical absolute left-12 top-1/2 -translate-y-1/2 titan-title"
      >
        {label}
      </motion.div>

      {/* Main Dialogue Thought */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.h2 
          animate={active ? { filter: "blur(0px)", opacity: 1, scale: 1 } : { filter: "blur(40px)", opacity: 0, scale: 1.2 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "titan-title text-[8vw] tracking-[3rem] text-stark text-center volumetric-glow",
            active && "chromatic-glitch"
          )}
        >
          {text[0]}
        </motion.h2>
        
        {text[1] && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={active ? { opacity: 0.4, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="minimal-body text-stark mt-8 tracking-[1rem]"
          >
            {text[1]}
          </motion.p>
        )}
      </div>

      {/* Lens Flare Sweep */}
      <motion.div 
        animate={active ? { x: ["-100%", "200%"] } : { x: "-100%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
      />
    </div>
  );
};

const NarrativeInterlude = ({ scroll }) => {
  const labels = ["ARCHIVE", "ENGINE", "FOUNDATION"];
  
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {dialogues.map((d, i) => {
        const isActive = scroll >= d.trigger[0] && scroll <= d.trigger[1];
        return (isActive && 
          <VolumetricDialogue 
            key={i}
            text={d.text} 
            active={isActive}
            label={labels[i] || "LOG"}
          />
        );
      })}
    </div>
  );
};







// --- MAIN APP ---
export default function App() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState(0);
  
  // Create a MotionValue for scroll to use with hooks
  const lerpedScrollVal = useScroll().scrollY;
  const lerpedScroll = useSpring(lerpedScrollVal, { stiffness: 50, damping: 20 });
  
  // Keep regular state for logic or non-motion components if needed, 
  // but we'll use a derived state for simpler triggers in NarrativeInterlude
  const [currentScroll, setCurrentScroll] = useState(0);

  // Resume Data
  const projects = [
    { title: "REMEMBERIT", desc: "The Tag-Based File Explorer (Electron/SQLite). Intuitive drag and drop file organization, filtering, and reference management without relocating files.", date: "2024" },
    { title: "LUNA_", desc: "Next-Gen Intelligent Interface. Advanced data orchestration and seamless user experiences. Built for the modern web.", date: "2024 - PRESENT", github: "https://luna.wesparkvault.com/" },
    { title: "SCOOTY", desc: "Urban Mobility Revolution. A seamless rental and tracking ecosystem for modern city transit.", date: "2024", github: "https://scooty.wesparkvault.com/" },
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

  // Update current scroll state for non-motion logic
  useEffect(() => {
    const unsub = lerpedScroll.on("change", (v) => setCurrentScroll(v));
    return () => unsub();
  }, [lerpedScroll]);

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
    const isContactPage = currentScroll >= 8400;
    const tiltX = isContactPage ? 0 : (mousePos.y * 5 + drift.y * 0.2);
    const tiltY = isContactPage ? 0 : (-mousePos.x * 5 + drift.x * 0.2);
    
    return {
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0px)`,
    };
  }, [mousePos, drift, currentScroll]);

  // Derived transforms for Monolith
  const monolithScale = useTransform(lerpedScroll, [0, 900], [1, 5]);
  const monolithOpacity = useTransform(lerpedScroll, [800, 1000], [1, 0]);
  const statusOpacity = useTransform(lerpedScroll, [0, 500], [1, 0]);

  return (
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
        {/* SHOT 01: THE MONOLITH */}
        <section className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000",
          currentScroll < 1000 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
           <motion.div 
            style={{ scale: monolithScale, opacity: monolithOpacity }}
            className="flex flex-col items-center"
           >
               <motion.div 
                 style={{ opacity: statusOpacity }}
                 className="absolute top-12 left-12"
               >
                 <span className="minimal-body text-[10px] text-molten-red font-bold tracking-[0.5rem]">STATUS // OPERATIONAL</span>
               </motion.div>

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

           {/* PROTAGONIST EXPRESSION: AHHHHH (SONIC REVEAL) */}
           <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-[150]"
            style={{
              opacity: useTransform(lerpedScroll, [4000, 4300, 4700, 5000], [0, 0.15, 0.15, 0]),
              scale: useTransform(lerpedScroll, [4000, 5000], [0.9, 1.2]),
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

        {/* SHOT 02: THE ARCHIVE (PROJECTS) - CINEMATIC CREDITS */}
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
               y: useTransform(lerpedScroll, [2000, 4000], [1000, -2000]),
               translateZ: useTransform(lerpedScroll, [2000, 4000], [0, 200])
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

        {/* SHOT 03: THE ENGINE (SKILLS & EXPERIENCE) */}
        <section className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-1000 px-24",
          currentScroll >= 5000 && currentScroll < 7000 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
          {/* MASSIVE SECTION HEADER */}
          <div className="absolute top-[15%] left-0 w-full overflow-hidden pointer-events-none opacity-10">
            <h2 className="titan-title text-[25vw] whitespace-nowrap -translate-x-1/2 left-1/2 absolute">EXPERIENCE</h2>
          </div>

          <div className="flex flex-col gap-12 w-full max-w-7xl relative z-10">
            <div className="grid grid-cols-1 gap-8">
              {experience.map((exp, i) => (
                <motion.div 
                  key={i}
                  style={{ x: useTransform(lerpedScroll, [5000, 7000], [i % 2 === 0 ? 100 : -100, i % 2 === 0 ? -100 : 100]) }}
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
               translateZ: useTransform(lerpedScroll, [8000, 10000], [0, 400])
             }}
           />

           <div className="w-full max-w-7xl relative z-10 flex flex-col gap-24">
              
              {/* Education Slab */}
              <motion.div 
                className="w-full flex flex-col md:flex-row gap-12 items-start"
                style={{
                   x: useTransform(lerpedScroll, [8000, 9500], [200, -200]),
                   translateZ: useTransform(lerpedScroll, [8000, 9500], [0, 100])
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
                   x: useTransform(lerpedScroll, [8600, 10000], [-300, 300]),
                   translateZ: useTransform(lerpedScroll, [8600, 10000], [0, 150])
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

        {/* SHOT 05: THE INVERSION (CONTACT) */}
        <section className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000",
          currentScroll >= 11000 ? "bg-stark opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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
      </div>

      {/* Progress */}
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
  );
}

