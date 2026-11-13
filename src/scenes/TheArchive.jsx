import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ScrollTrack } from '../components/ScrollTrack';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';
import { projects } from '../data/resume';

export const TheArchive = ({ progress, range }) => {
  const { play } = useSound();
  const { trigger } = useHaptics();

  return (
    <ScrollTrack progress={progress} range={range} title="PROJECTS" className="max-w-5xl">
      <div className="flex flex-col items-center gap-[22vh]">
        {/* Qivi has its own live scene (TheCompanion) right after this one */}
        {projects.filter((proj) => !proj.live).map((proj) => (
          <article key={proj.title} className="w-full flex flex-col items-center text-center">
            <div className="minimal-body text-[10px] md:text-[12px] opacity-50 mb-5 tracking-[0.3rem] md:tracking-[0.5rem]">{proj.date}</div>
            <h3 className="titan-title text-3xl md:text-6xl text-balance">{proj.title}</h3>
            <p className="minimal-body mt-4 text-molten-red opacity-100 font-bold">{proj.subtitle}</p>
            {proj.preview && (
              // No frame: the image dissolves into the dark on every side.
              <img
                src={proj.preview.src}
                alt={proj.preview.alt}
                width="1040"
                height="650"
                decoding="async"
                className="edge-fade mt-2 -mb-4 md:-mb-8 w-full max-w-3xl aspect-[16/10] object-cover object-top opacity-90"
              />
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
