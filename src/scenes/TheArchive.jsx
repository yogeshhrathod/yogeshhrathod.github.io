import React, { Suspense, lazy, useState } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ScrollTrack } from '../components/ScrollTrack';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';
import { projects } from '../data/resume';

// three.js + qivi-react load only when the projects scene is reached.
const QiviLive = lazy(() => import('../components/QiviLive'));

const PREVIEW_IMG = 'w-full aspect-[16/10] object-cover object-top border border-white/15 bg-obsidian';

export const TheArchive = ({ progress, range }) => {
  const { play } = useSound();
  const { trigger } = useHaptics();

  // The live avatar owns a WebGL context, so it only exists while this scene is on screen.
  const isNear = (p) => p > range[0] - 0.3 && p < range[1] + 0.1;
  const [sceneActive, setSceneActive] = useState(() => isNear(progress.get()));
  useMotionValueEvent(progress, 'change', (p) => setSceneActive(isNear(p)));

  return (
    <ScrollTrack progress={progress} range={range} title="PROJECTS" className="max-w-5xl">
      <div className="flex flex-col items-center gap-[22vh]">
        {projects.map((proj) => (
          <article key={proj.title} className="w-full flex flex-col items-center text-center">
            <div className="minimal-body text-[10px] md:text-[12px] opacity-50 mb-5 tracking-[0.3rem] md:tracking-[0.5rem]">{proj.date}</div>
            <h3 className="titan-title text-3xl md:text-6xl text-balance">{proj.title}</h3>
            <p className="minimal-body mt-4 text-molten-red opacity-100 font-bold">{proj.subtitle}</p>
            {proj.preview && !proj.live && (
              <img src={proj.preview.src} alt={proj.preview.alt} width="1040" height="650" decoding="async" className={`mt-8 max-w-xl ${PREVIEW_IMG}`} />
            )}
            {proj.live === 'qivi' && (
              <div className="mt-8 grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <figure className="relative h-[23rem] md:h-auto border border-molten-red/40 bg-obsidian">
                  <figcaption className="absolute left-3 top-3 z-10 flex items-center gap-2 minimal-body text-[9px] font-bold opacity-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-molten-red animate-pulse" />
                    LIVE · RUNNING HERE
                  </figcaption>
                  {sceneActive && (
                    <Suspense fallback={<div className="flex h-full items-center justify-center minimal-body text-[10px] opacity-50">LOADING QIVI…</div>}>
                      <QiviLive />
                    </Suspense>
                  )}
                </figure>
                <figure className="relative self-center">
                  <img src={proj.preview.src} alt={proj.preview.alt} width="1040" height="650" decoding="async" className={PREVIEW_IMG} />
                  <figcaption className="mt-2 minimal-body text-[9px] opacity-50">THE FULL DEMO</figcaption>
                </figure>
              </div>
            )}
            <p className="mt-7 text-sm md:text-base max-w-2xl text-stark/75 leading-relaxed font-mono text-pretty">
              {proj.desc}
            </p>
            <ul className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {proj.stack.map((tech) => (
                <li key={tech} className="minimal-body text-[10px] opacity-45">{tech}</li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              {proj.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    play('hover');
                    trigger('light');
                  }}
                  className="minimal-body text-[10px] font-bold border border-white/30 px-5 py-3 inline-flex items-center gap-2 hover:bg-molten-red hover:border-molten-red hover:text-white hover:opacity-100 focus-visible:bg-molten-red focus-visible:border-molten-red outline-none transition-colors duration-300"
                >
                  {link.label}
                  <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </ScrollTrack>
  );
};
