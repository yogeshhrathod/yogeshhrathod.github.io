import React, { useRef, useState } from 'react';
import { QiviAvatar, CHARACTERS } from 'qivi-react';
import 'qivi-react/styles.css';
import { useSound } from '../context/SoundContext';

// The real qivi-react library, running in the page. This file is loaded on
// demand (see TheArchive), so three.js never weighs on the first paint.
const STATES = [
  { id: 'idle', label: 'IDLE' },
  { id: 'listening', label: 'LISTENING' },
  { id: 'thinking', label: 'THINKING' },
  { id: 'talking', label: 'TALKING' },
  { id: 'success', label: 'SUCCESS' },
];

const CAST = Object.entries(CHARACTERS).map(([id, character]) => ({ id, name: character.name ?? id }));

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={`minimal-body text-[10px] px-3 py-1.5 border cursor-pointer transition-colors duration-200 ${
      active
        ? 'bg-molten-red border-molten-red text-white opacity-100'
        : 'border-white/20 hover:border-white/60 hover:opacity-100'
    }`}
  >
    {children}
  </button>
);

export default function QiviLive() {
  const { play } = useSound();
  const avatar = useRef(null);
  const [state, setState] = useState('idle');
  const [cast, setCast] = useState('qivi');

  const choose = (setter, value, impulse) => () => {
    play('click');
    setter(value);
    avatar.current?.impulse(impulse);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-4 p-4">
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <QiviAvatar
          ref={avatar}
          size={170}
          appearance="dark"
          character={CHARACTERS[cast]}
          state={state}
          voice={state === 'talking' ? 'simulate' : null}
          label={`${CHARACTERS[cast].name ?? 'Qivi'}, ${state}`}
          onPoke={() => play('hover')}
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Conversation state">
          {STATES.map((s) => (
            <Chip key={s.id} active={state === s.id} onClick={choose(setState, s.id, 'bounce')}>{s.label}</Chip>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Character">
          {CAST.map((c) => (
            <Chip key={c.id} active={cast === c.id} onClick={choose(setCast, c.id, 'ripple')}>{c.name}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
