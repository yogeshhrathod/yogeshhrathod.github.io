import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSceneStyle } from '../hooks/useSceneStyle';
import { useSound } from '../context/SoundContext';
import { useHaptics } from '../context/HapticContext';
import { projects } from '../data/resume';

// three.js + qivi-react are fetched only as this scene approaches.
const loadQivi = () => import('../components/QiviLive');
const QiviLive = lazy(loadQivi);
const qivi = projects.find((p) => p.live === 'qivi');

/**
 * A held shot for one project: Qivi itself, running live, with nothing around
 * it. It forms out of particles on the way in and dissolves on the way out.
 */
export const TheCompanion = ({ progress, range }) => {
  const [start, end] = range;
  const { play } = useSound();
  const { trigger } = useHaptics();
  const sceneStyle = useSceneStyle(progress, range, { fade: 0.22 });

  const phaseAt = (p) => {
    if (p < start - 0.25 || p > end + 0.05) return 'away'; // not mounted: no WebGL context held
    const t = (p - start) / (end - start);
    return t > 0.16 && t < 0.86 ? 'present' : 'forming';
  };
  const [phase, setPhase] = useState(() => phaseAt(progress.get()));
  useMotionValueEvent(progress, 'change', (p) => setPhase(phaseAt(p)));

  // Warm-up: while the visitor is still on the opening scene, fetch the code
  // and run Qivi invisibly for a moment so the GPU compiles its shaders then.
  // Without this the first arrival at this scene stalls the scroll.
  const [warming, setWarming] = useState(false);
  useEffect(() => {
    let timer;
    let cancelled = false;
    const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 2500));
    const cancelIdle = window.cancelIdleCallback ?? clearTimeout;
    const id = idle(() => {
      loadQivi()
        .then(() => {
          if (cancelled) return;
          setWarming(true);
          timer = setTimeout(() => setWarming(false), 900);
        })
        .catch(() => {});
    });
    return () => {
      cancelled = true;
      cancelIdle(id);
      clearTimeout(timer);
    };
  }, []);

  const titleScale = useTransform(progress, [start, end], [0.92, 1.12]);
  const uiOpacity = useTransform(progress, [start + 0.2, start + 0.4, end - 0.4, end - 0.22], [0, 1, 1, 0]);

  return (
    <motion.section style={sceneStyle} className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-5">
      {/* MASSIVE TITLE, behind the avatar */}
      <motion.div style={{ scale: titleScale }} className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]" aria-hidden="true">
        <span className="titan-title text-[34vw] whitespace-nowrap">QIVI</span>
      </motion.div>

      <div className="relative flex flex-col items-center text-center">
        <motion.div style={{ opacity: uiOpacity }} className="flex flex-col items-center">
          <span className="minimal-body text-[10px] opacity-50 tracking-[0.4rem]">{qivi.date} · RUNNING LIVE</span>
          <h2 className="mt-2 minimal-body text-molten-red opacity-100 font-bold">QIVI — {qivi.subtitle}</h2>
        </motion.div>

        <div className="min-h-[40vh] flex items-center justify-center">
          {(phase !== 'away' || warming) && (
            <Suspense fallback={<span className="minimal-body text-[10px] opacity-40">SUMMONING QIVI…</span>}>
              <QiviLive present={phase === 'present'} />
            </Suspense>
          )}
        </div>

        <motion.div style={{ opacity: uiOpacity }} className="mt-4 md:mt-6 flex flex-wrap justify-center gap-x-8 gap-y-1">
          {qivi.links.map((link) => (
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
              <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
            </a>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};
