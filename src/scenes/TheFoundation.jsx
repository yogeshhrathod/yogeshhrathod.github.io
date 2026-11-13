import React from 'react';
import { ScrollTrack } from '../components/ScrollTrack';
import { education, achievements, skillGroups } from '../data/resume';

const Rule = ({ label, flip }) => (
  <div className={`flex items-center gap-6 ${flip ? 'flex-row-reverse' : ''}`}>
    <span className="minimal-body text-[10px] text-molten-red opacity-100 font-bold tracking-[0.4rem]">{label}</span>
    <div className={`flex-grow h-px from-molten-red/40 to-transparent ${flip ? 'bg-gradient-to-l' : 'bg-gradient-to-r'}`} />
  </div>
);

export const TheFoundation = ({ progress, range }) => (
  <ScrollTrack progress={progress} range={range} title="FOUNDATION" className="max-w-6xl md:pr-60">
    <div className="flex flex-col gap-[16vh]">
      {/* 1. ARSENAL */}
      <div className="flex flex-col gap-10">
        <Rule label="ARSENAL" />
        <dl className="flex flex-col">
          {skillGroups.map((group) => (
            <div key={group.label} className="grid grid-cols-1 md:grid-cols-[14rem_minmax(0,1fr)] gap-3 md:gap-8 py-5 border-b border-white/10">
              <dt className="text-sm md:text-base font-black italic uppercase tracking-[0.12rem]">{group.label}</dt>
              <dd className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="minimal-body text-[10px] border border-white/20 px-3 py-1.5 cursor-default hover:bg-molten-red hover:border-molten-red hover:text-white hover:opacity-100 transition-colors duration-300"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 2. ACADEMIC BLOCK - Museum Style */}
      <div className="flex flex-col gap-10 group/section">
        <Rule label="EDUCATION" flip />
        {education.map((edu) => (
          <div key={edu.institute} className="flex flex-col md:flex-row gap-6 md:gap-12 items-start w-full">
            <div className="flex flex-col gap-2 md:w-1/2">
              <h3 className="text-2xl md:text-5xl font-black italic tracking-tighter leading-[0.9] uppercase text-white group-hover/section:text-molten-red transition-colors duration-700 text-balance">
                {edu.institute}
              </h3>
              <div className="flex items-center gap-4 mt-2">
                <span className="w-8 h-px bg-white/20" />
                <span className="minimal-body text-[9px] opacity-40">{edu.location}</span>
              </div>
            </div>
            <div className="flex flex-col gap-6 md:w-1/2">
              <p className="text-lg md:text-2xl font-light tracking-[0.12rem] text-stark/90 uppercase">{edu.degree}</p>
              <div className="self-start px-4 py-2 border border-white/10 bg-white/5">
                <span className="minimal-body text-[10px] tracking-widest">{edu.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. ACHIEVEMENTS - Tectonic Slabs */}
      <div className="flex flex-col gap-10">
        <Rule label="AWARDS" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {achievements.map((ach) => (
            <div
              key={ach.title}
              className="relative pt-6 group flex flex-col gap-4"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-molten-red/60 via-white/15 to-transparent" aria-hidden="true" />
              <span className="minimal-body text-[10px] text-molten-red opacity-100 font-bold tracking-[0.3rem]">{ach.place}</span>
              <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none">{ach.title}</h4>
              <p className="text-sm font-light leading-relaxed text-white/50 group-hover:text-white/80 transition-colors duration-500">
                {ach.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </ScrollTrack>
);
