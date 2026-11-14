import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ScrollTrack } from '../components/ScrollTrack';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';
import { projects } from '../data/resume';

// Qivi has its own live scene (TheCompanion) right after this one.
const listed = projects.filter((proj) => !proj.live);
const pad = (n) => String(n).padStart(2, '0');

export const TheArchive = ({ progress, range }) => {
  const { play } = useSound();
  const { trigger } = useHaptics();

  return (
    <ScrollTrack progress={progress} range={range} title="PROJECTS" className="max-w-6xl md:pr-16">
      <div className="flex flex-col gap-[18vh] md:gap-[24vh]">
        {listed.map((proj, i) => {
          const flip = i % 2 === 1;
          return (
            <article key={proj.title} className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 md:gap-12">
              {/* Visual: a faded capture, or a hollow numeral when there is nothing to show */}
              <div
                className={`order-first md:col-span-6 ${flip ? 'md:order-first' : 'md:order-last'} ${proj.preview ? '' : 'hidden md:flex'} justify-center`}
                aria-hidden={proj.preview ? undefined : 'true'}
              >
                {proj.preview ? (
                  <img
                    src={proj.preview.src}
                    alt={proj.preview.alt}
                    width="1040"
                    height="650"
                    decoding="async"
                    className="edge-fade w-[115%] max-w-none -mx-[7.5%] aspect-[16/10] object-cover object-top opacity-90"
                  />
                ) : (
                  <span className="outline-num select-none">{pad(i + 1)}</span>
                )}
              </div>

              <div className="md:col-span-6 relative">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-molten-red">{pad(i + 1)}</span>
                  <span className="h-px w-8 bg-white/25 self-center" />
                  <span className="minimal-body text-[10px] opacity-50">{proj.date}</span>
                </div>
                <h3 className="titan-title text-[2.4rem] md:text-6xl mt-5 text-balance">{proj.title}</h3>
                <p className="mt-3 text-molten-red text-sm md:text-base font-medium tracking-tight">{proj.subtitle}</p>
                <p className="mt-6 text-[15px] md:text-lg leading-relaxed text-stark/75 max-w-[52ch] text-pretty">{proj.desc}</p>
                <p className="mt-6 font-mono text-[11px] md:text-xs text-stark/45 tracking-wide">
                  {proj.stack.join('  ·  ')}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-1">
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
                      className="link-line"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </ScrollTrack>
  );
};
