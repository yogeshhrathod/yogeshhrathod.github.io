import React, { useState } from 'react';
import { CinematicLoader } from './components/CinematicLoader';
import { Stage } from './Stage';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <>
      {hasEntered && <Stage />}
      {!loaderDone && (
        <CinematicLoader onEnter={() => setHasEntered(true)} onDone={() => setLoaderDone(true)} />
      )}
    </>
  );
}
