import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download } from 'lucide-react';
import { profile, projects, experience, education, achievements, skillGroups, socials } from '../data/resume';
import { useSound } from '../context/SoundContext';

const SectionTitle = ({ children, meta }) => (
  <h3 className="text-xs font-bold uppercase tracking-[0.4rem] mb-10 border-b border-zinc-200 pb-2 flex justify-between items-baseline gap-4">
    <span>{children}</span>
    {meta && <span className="text-[9px] font-normal text-zinc-400 whitespace-nowrap">{meta}</span>}
  </h3>
);

const Bullets = ({ points }) => (
  <ul className="list-none space-y-3 text-sm text-zinc-600 leading-relaxed">
    {points.map((point) => (
      <li key={point} className="flex gap-4">
        <span className="text-zinc-300 shrink-0">{'>>'}</span>
        <span>{point}</span>
      </li>
    ))}
  </ul>
);

const pad = (n) => String(n).padStart(2, '0');

export const FastReadOverlay = ({ isOpen, onClose }) => {
  const { play } = useSound();

  const close = () => {
    play('whoosh');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Optical Trauma Flicker */}
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100001] bg-white pointer-events-none"
          />

          <motion.div
            key="paper"
            role="dialog"
            aria-modal="true"
            aria-label="Resume"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
            className="fixed inset-0 z-[100000] bg-zinc-50 overflow-y-auto overscroll-contain pointer-events-auto selection:bg-zinc-200"
          >
            {/* Header / Toolbar */}
            <div className="sticky top-0 w-full z-[10] bg-zinc-50/95 border-b border-zinc-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FileText size={18} className="text-zinc-400" />
                <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2rem]">TRANSCRIPT_V2026.TXT</span>
              </div>
              <div className="flex items-center gap-6">
                <a
                  href={profile.resumePdf}
                  download
                  className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <Download size={14} />
                  <span className="hidden md:inline">DOWNLOAD_PDF</span>
                </a>
                <button
                  onClick={close}
                  aria-label="Close resume"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* "Paper" Container */}
            <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-20 pb-32 font-mono text-zinc-900">
              {/* Typewriter / LaTeX Inspired Header */}
              <div className="text-center mb-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight uppercase">CURRICULUM VITÆ</h1>
                <h2 className="text-xl md:text-2xl mb-2 uppercase">{profile.name}</h2>
                <p className="text-xs text-zinc-500 tracking-widest uppercase">
                  {profile.title} // {profile.focus}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] text-zinc-500 tracking-[0.15rem] border-y border-zinc-200 py-3 uppercase">
                  <span>{profile.location}</span>
                  <span className="text-zinc-300">/</span>
                  <a className="hover:text-zinc-900" href={`mailto:${socials.email}`}>{socials.email}</a>
                  <span className="text-zinc-300">/</span>
                  <a className="hover:text-zinc-900" href={socials.phoneHref}>{socials.phone}</a>
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-zinc-500 tracking-[0.15rem] uppercase">
                  {[['LinkedIn', socials.linkedin], ['GitHub', socials.github], ['npm', socials.npm], ['App Store', socials.appStore]].map(([label, href]) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 hover:decoration-zinc-900">
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-20">
                <section>
                  <SectionTitle>SECTION_01: SUMMARY</SectionTitle>
                  <p className="text-sm text-zinc-600 leading-relaxed">{profile.summary}</p>
                </section>

                <section>
                  <SectionTitle meta={`ENTRY_COUNT [${pad(projects.length)}]`}>SECTION_02: SELECTED PROJECTS</SectionTitle>
                  <div className="space-y-12">
                    {projects.map((project) => (
                      <div key={project.title}>
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-2">
                          <h4 className="text-lg font-bold">{project.name}</h4>
                          <span className="text-[11px] italic text-zinc-500">{project.stack.join(', ')}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-[10px] tracking-[0.15rem]">
                          {project.links.map((link) => (
                            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-zinc-500 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 hover:decoration-zinc-900">
                              {link.label}
                            </a>
                          ))}
                        </div>
                        <Bullets points={project.points} />
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <SectionTitle meta={`ENTRY_COUNT [${pad(experience.length)}]`}>SECTION_03: EXPERIENCE</SectionTitle>
                  <div className="space-y-14">
                    {experience.map((exp) => (
                      <div key={exp.company}>
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-5">
                          <h4 className="text-xl font-bold">{exp.fullName ?? exp.company}</h4>
                          <span className="text-xs italic text-zinc-500">[{exp.period}]</span>
                        </div>
                        <div className="space-y-8">
                          {exp.roles.map((role) => (
                            <div key={role.role + role.period}>
                              <p className="text-sm font-bold text-zinc-800 mb-3">
                                {role.role}
                                <span className="font-normal italic text-zinc-500"> · {role.period} · {exp.location}</span>
                              </p>
                              <Bullets points={role.points} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <SectionTitle>SECTION_04: TECHNICAL SKILLS</SectionTitle>
                  <dl className="space-y-4">
                    {skillGroups.map((group) => (
                      <div key={group.label} className="grid grid-cols-1 md:grid-cols-[12rem_minmax(0,1fr)] gap-1 md:gap-6">
                        <dt className="text-sm font-bold">{group.label}</dt>
                        <dd className="text-sm text-zinc-600 leading-relaxed">{group.items.join(', ')}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                    <SectionTitle>SECTION_05: EDUCATION</SectionTitle>
                    {education.map((edu) => (
                      <div key={edu.institute}>
                        <h4 className="text-base font-bold mb-1">{edu.institute}</h4>
                        <p className="text-sm text-zinc-700 mb-2">{edu.degree}</p>
                        <p className="text-xs italic text-zinc-500">{edu.period} // {edu.location}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <SectionTitle>SECTION_06: AWARDS</SectionTitle>
                    <div className="space-y-5">
                      {achievements.map((ach) => (
                        <div key={ach.title}>
                          <p className="text-sm font-bold text-zinc-800">{ach.place} — {ach.title}</p>
                          <p className="text-xs text-zinc-500 italic">{ach.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              <footer className="mt-32 pt-12 border-t border-zinc-200 text-center">
                <p className="text-[9px] text-zinc-400 tracking-[0.5rem] uppercase">END_OF_TRANSCRIPT // COMPILED_NOVEMBER_2026</p>
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
