import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';
import { useSceneStyle } from '../hooks/useSceneStyle';
import { profile, socials } from '../data/resume';

const FOOTER_LINKS = [
  { label: 'LINKEDIN', href: socials.linkedin },
  { label: 'GITHUB', href: socials.github },
  { label: 'NPM', href: socials.npm },
  { label: 'APP STORE', href: socials.appStore },
  { label: 'EMAIL', href: `mailto:${socials.email}` },
];

export const TheInversion = ({ progress, range }) => {
  const { play } = useSound();
  const { trigger } = useHaptics();
  const [start] = range;

  const sceneStyle = useSceneStyle(progress, range, { fade: 0.3, holdEnd: true });
  const scale = useTransform(progress, [start, start + 0.3], [0.95, 1]);

  const hover = () => {
    play('hover');
    trigger('light');
  };

  return (
    <motion.section
      style={{ ...sceneStyle, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-stark"
    >
      <div className="text-obsidian text-center px-6 md:px-12 w-full max-w-5xl pb-28 md:pb-24">
        <h2 className="titan-title text-[16vw] md:text-[8vw] tracking-[-0.2rem] md:tracking-[-0.5rem] leading-[0.8]">LET'S<br />TALK.</h2>

        <div className="mt-10 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 border-y border-obsidian/10 py-6 md:py-12">
          <div className="flex flex-col gap-2">
            <span className="minimal-body text-obsidian font-bold">TERMINAL</span>
            <a href={socials.phoneHref} onMouseEnter={hover} className="text-xs md:text-sm font-mono hover:text-molten-red transition-colors">
              {socials.phone}
            </a>
          </div>
          <div className="flex flex-col gap-2 border-y md:border-y-0 md:border-x border-obsidian/10 py-6 md:py-0">
            <span className="minimal-body text-obsidian font-bold">REPOSITORY</span>
            <a href={`mailto:${socials.email}`} onMouseEnter={hover} className="text-xs md:text-sm font-mono hover:text-molten-red transition-colors">
              {socials.email}
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="minimal-body text-obsidian font-bold">STATION</span>
            <p className="text-xs md:text-sm font-mono uppercase">{profile.location}</p>
          </div>
        </div>

        <a
          href={profile.resumePdf}
          download
          className="mt-10 md:mt-12 inline-block group"
          onMouseEnter={hover}
          onClick={() => {
            play('click');
            trigger('heavy');
          }}
        >
          <span className="uppercase tracking-[0.2rem] text-obsidian font-black text-xs md:text-lg underline decoration-molten-red decoration-4 underline-offset-8 group-hover:text-molten-red transition-colors">
            DOWNLOAD_FULL_INTEL_REPORT (PDF)
          </span>
        </a>
      </div>

      <footer className="absolute bottom-5 md:bottom-12 w-full pl-20 pr-6 md:pl-12 md:pr-36 flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end gap-4 md:gap-0 text-center md:text-left">
        <div className="hidden md:flex flex-col gap-2 items-start">
          <Terminal className="w-4 h-4 text-obsidian" strokeWidth={1.5} />
          <p className="text-[8px] font-mono text-obsidian/40 max-w-xs">BUILDING COOL STUFF SINCE 2016.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 md:gap-x-10 justify-center" aria-label="Profiles">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              onMouseEnter={hover}
              className="minimal-body text-obsidian hover:text-molten-red hover:opacity-100 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </footer>
    </motion.section>
  );
};
