import React from 'react';
import { ScrollTrack } from '../components/ScrollTrack';
import { experience } from '../data/resume';

export const TheEngine = ({ progress, range }) => (
  <ScrollTrack progress={progress} range={range} title="EXPERIENCE" className="max-w-6xl md:pr-60">
    <div className="flex flex-col gap-[18vh]">
      {experience.map((exp) => (
        <article key={exp.company} className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 md:gap-16 border-t border-white/20 pt-8">
          <header className="flex flex-col">
            <span className="minimal-body text-molten-red opacity-100 font-bold text-xs mb-3 tracking-widest">{exp.period}</span>
            <h3 className="titan-title text-4xl md:text-6xl leading-tight">{exp.company}</h3>
            {exp.fullName && <p className="minimal-body mt-3">{exp.fullName}</p>}
            <p className="minimal-body mt-3 text-[10px] opacity-40">{exp.location}</p>
          </header>

          <div className="flex flex-col gap-10">
            {exp.roles.map((role) => (
              <div key={role.role + role.period}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-4">
                  <h4 className="text-lg md:text-xl font-bold italic uppercase tracking-[0.12rem]">{role.role}</h4>
                  {exp.roles.length > 1 && <span className="minimal-body text-[10px] opacity-50">{role.period}</span>}
                </div>
                <ul className="flex flex-col gap-3">
                  {role.points.map((point) => (
                    <li key={point} className="flex gap-4 text-sm md:text-[15px] leading-relaxed text-stark/70 font-mono">
                      <span className="mt-[0.7em] h-px w-4 shrink-0 bg-molten-red" aria-hidden="true" />
                      <span className="text-pretty">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  </ScrollTrack>
);
