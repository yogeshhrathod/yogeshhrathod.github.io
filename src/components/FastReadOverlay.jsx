import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download } from 'lucide-react';
import { cn } from '../utils';
import { projects, experience, education, achievements, skills } from '../data/resume';

export const FastReadOverlay = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Optical Trauma Flicker */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 0.4, 0] }}
            exit={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.4, times: [0, 0.2, 0.4, 0.6, 1] }}
            className="fixed inset-0 z-[100001] bg-white pointer-events-none"
          />

          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            data-lenis-prevent
            className="fixed inset-0 z-[100000] bg-zinc-50 overflow-y-scroll pointer-events-auto selection:bg-zinc-200"
          >
            {/* Header / Toolbar */}
            <div className="sticky top-0 w-full z-[10] bg-zinc-50/90 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FileText size={18} className="text-zinc-400" />
                <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2rem]">TRANSCRIPT_V2026.TXT</span>
              </div>
              <div className="flex items-center gap-6">
                 <button className="hidden md:flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-zinc-900 transition-colors">
                  <Download size={14} />
                  DL_SYSTEM_LOG
                 </button>
                 <button 
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* "Paper" Container */}
            <div className="max-w-4xl mx-auto px-8 py-20 pb-40 font-mono text-zinc-900">
              {/* Typewriter / LaTeX Inspired Header */}
              <div className="text-center mb-24 uppercase">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                  CURRICULUM VITÆ
                </h1>
                <h2 className="text-xl md:text-2xl mb-2">Yogesh Rathod</h2>
                <p className="text-xs text-zinc-500 tracking-widest">
                  FULL STACK DEVELOPER // CLOUD ARCHITECT // TECHNICAL LEAD
                </p>
                <div className="mt-8 flex justify-center gap-4 text-[10px] text-zinc-400 tracking-[0.2rem] border-y border-zinc-200 py-3">
                  <span>PUNE, IN</span>
                  <span>/</span>
                  <span>JS.ENGINEER</span>
                  <span>/</span>
                  <span>QUALYS_LEAD</span>
                </div>
              </div>

              {/* Sections with "Typewriter" feel */}
              <div className="space-y-24">
                {/* 01. Experience */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.4rem] mb-12 border-b border-zinc-200 pb-2 flex justify-between items-baseline">
                    <span>SECTION_01: EXPERIENCE</span>
                    <span className="text-[9px] font-normal text-zinc-400">ENTRY_COUNT [03]</span>
                  </h3>
                  <div className="space-y-16">
                    {experience.map((exp, i) => (
                      <div key={i}>
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-4">
                          <h4 className="text-xl font-bold">{exp.role}</h4>
                          <span className="text-xs italic text-zinc-500">[{exp.period}]</span>
                        </div>
                        <p className="text-sm font-bold text-zinc-800 mb-4">{exp.company}</p>
                        <ul className="list-none space-y-3 text-sm text-zinc-600 leading-relaxed max-w-2xl">
                          {exp.bullet.split('. ').map((point, idx) => (
                            <li key={idx} className="flex gap-4">
                              <span className="text-zinc-300">{">> "}</span>
                              <span>{point.endsWith('.') ? point : point + '.'}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 02. Technical Focus */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.4rem] mb-12 border-b border-zinc-200 pb-2">
                    SECTION_02: ARSENAL
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-12">
                    {skills.map((skill, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 mb-1">SK_0{i+1}</span>
                        <span className="text-sm border-l border-zinc-200 pl-3">{skill}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 03. Selected Works */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.4rem] mb-12 border-b border-zinc-200 pb-2">
                    SECTION_03: INITIATIVES
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                    {projects.map((project, i) => (
                      <div key={i} className="group">
                        <div className="flex items-center gap-3 mb-4">
                          <h4 className="text-lg font-black underline decoration-zinc-200 group-hover:decoration-zinc-900 underline-offset-4 transition-all">{project.title}</h4>
                          <span className="text-[9px] text-zinc-400 font-mono tracking-tighter">[{project.date}]</span>
                        </div>
                        <p className="text-sm text-zinc-600 leading-relaxed italic">{project.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 04. Education & Accolades */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-24 font-mono">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.4rem] mb-12 border-b border-zinc-200 pb-2">
                      SECTION_04: FOUNDATION
                    </h3>
                    {education.map((edu, i) => (
                      <div key={i}>
                        <h4 className="text-lg font-bold mb-1">{edu.degree}</h4>
                        <p className="text-sm text-zinc-700 mb-2">{edu.institute}</p>
                        <p className="text-xs italic text-zinc-400">{edu.period} // {edu.location}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.4rem] mb-12 border-b border-zinc-200 pb-2">
                      SECTION_05: ACCOLADES
                    </h3>
                    <div className="space-y-6">
                      {achievements.map((ach, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="italic text-zinc-300">#{i+1}</span>
                          <div>
                            <p className="text-sm font-bold text-zinc-800">{ach.title}</p>
                            <p className="text-xs text-zinc-500 italic">{ach.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* Typewriter Footer */}
              <footer className="mt-40 pt-12 border-t border-zinc-200 text-center">
                <p className="text-[9px] text-zinc-400 tracking-[0.5rem] uppercase">
                  END_OF_TRANSCRIPT // COMPILED_APRIL_2026
                </p>
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
