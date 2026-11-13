import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QiviAvatar, CHARACTERS } from 'qivi-react';
import 'qivi-react/styles.css';
import { useSound } from '../context/SoundContext';

// The real qivi-react library, running in the page. This file is loaded on
// demand (see TheCompanion), so three.js never weighs on the first paint.
const STATES = [
  { id: 'idle', label: 'IDLE', line: 'CLICK ME. I REACT.' },
  { id: 'listening', label: 'LISTEN', line: "GO ON. I'M LISTENING." },
  { id: 'thinking', label: 'THINK', line: 'HOLD ON. THINKING.' },
  { id: 'talking', label: 'TALK', line: 'THIS IS HOW I TALK.' },
  { id: 'success', label: 'CELEBRATE', line: 'DONE. NICE WORK.' },
];

const CAST = Object.entries(CHARACTERS).map(([id, character]) => ({ id, name: (character.name ?? id).toUpperCase() }));

// What Qivi does when poked, in order.
const REACTIONS = [
  { expression: 'happy', impulse: 'bounce', line: 'HEY!' },
  { expression: 'surprised', impulse: 'surprise', line: 'OH!' },
  { expression: 'playful', impulse: 'ripple', line: 'AGAIN.' },
  { expression: 'love', impulse: 'burst', line: 'I LIKE YOU.' },
  { expression: 'curious', impulse: 'sweep', line: 'WHAT WAS THAT?' },
  { expression: 'excited', impulse: ['bounce', 'burst'], line: 'MORE!' },
];

const fitSize = () => Math.round(Math.min(window.innerHeight * 0.4, window.innerWidth * 0.78, 460));

const Choice = ({ active, onClick, children }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={`minimal-body text-[10px] md:text-[11px] py-2 cursor-pointer underline-offset-8 decoration-2 transition-colors duration-200 ${
      active ? 'text-molten-red opacity-100 font-bold underline' : 'text-stark opacity-50 hover:opacity-100'
    }`}
  >
    {children}
  </button>
);

/**
 * `present` is driven by scroll: Qivi condenses out of loose particles as the
 * scene arrives and dissolves back into them as it leaves.
 */
export default function QiviLive({ present }) {
  const { play } = useSound();
  const avatar = useRef(null);
  const [state, setState] = useState('idle');
  const [cast, setCast] = useState('qivi');
  const [reaction, setReaction] = useState(null);
  const pokes = useRef(0);
  const calm = useRef();

  const [size, setSize] = useState(fitSize);
  useEffect(() => {
    const onResize = () => setSize(fitSize());
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(calm.current);
    };
  }, []);

  const poke = () => {
    const next = REACTIONS[pokes.current % REACTIONS.length];
    pokes.current += 1;
    play('sparkle');
    avatar.current?.impulse(next.impulse);
    setReaction(next);
    clearTimeout(calm.current);
    calm.current = setTimeout(() => setReaction(null), 2600);
  };

  const choose = (setter, value, impulse) => () => {
    play('tap');
    clearTimeout(calm.current);
    setReaction(null);
    setter(value);
    avatar.current?.impulse(impulse);
  };

  const line = reaction?.line ?? STATES.find((s) => s.id === state).line;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="cursor-pointer"
        style={{ width: size, height: size }}
      >
        <QiviAvatar
          ref={avatar}
          size={size}
          bleed={0.9}
          appearance="dark"
          character={CHARACTERS[cast]}
          state={present ? state : 'dissolving'}
          expression={reaction?.expression}
          voice={present && state === 'talking' ? 'simulate' : null}
          label={`${CHARACTERS[cast].name ?? 'Qivi'}, ${state}. Click to interact.`}
          onPoke={poke}
        />
      </motion.div>

      {/* What Qivi is "saying" */}
      <div className="h-8 mt-1 md:mt-3 flex items-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-sm md:text-lg tracking-[0.15rem] text-stark"
          >
            {line}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-3 md:mt-5 flex flex-col items-center gap-0 md:gap-1">
        <div className="flex flex-wrap justify-center gap-x-5 md:gap-x-7" role="group" aria-label="Conversation state">
          {STATES.map((s) => (
            <Choice key={s.id} active={state === s.id} onClick={choose(setState, s.id, 'bounce')}>{s.label}</Choice>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 md:gap-x-7" role="group" aria-label="Character">
          {CAST.map((c) => (
            <Choice key={c.id} active={cast === c.id} onClick={choose(setCast, c.id, 'ripple')}>{c.name}</Choice>
          ))}
        </div>
      </div>
    </div>
  );
}
