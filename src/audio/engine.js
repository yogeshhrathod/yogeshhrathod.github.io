// Sound engine — everything is synthesised with the Web Audio API.
// No audio files, no network requests, no decode latency: a sound starts on
// the exact frame it is asked for. One AudioContext, one master bus.
//
//   master gain ── compressor ── speakers
//     ├─ one-shot voices   (hover, click, key, whoosh, impact, swell)
//     └─ ambient bed       (a slow drone that brightens for the contact scene)

const MASTER_LEVEL = 0.8;

let ctx = null;
let master = null;
let noise = null;
let bed = null;
let enabled = false;

const now = () => ctx.currentTime;

const build = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return false;
  ctx = new AudioCtx();

  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -14;
  limiter.ratio.value = 6;
  limiter.connect(ctx.destination);

  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(limiter);

  // Two seconds of white noise, shared by every noise-based voice.
  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;

  return true;
};

/** A gain node with an attack / exponential-decay envelope, auto-cleaned up. */
const envelope = (peak, attack, decay, at = now()) => {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  g.connect(master);
  return g;
};

const tone = ({ type = 'sine', from, to = from, peak, attack = 0.005, decay, at = now() }) => {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + attack + decay);
  osc.connect(envelope(peak, attack, decay, at));
  osc.start(at);
  osc.stop(at + attack + decay + 0.05);
};

const hiss = ({ filter = 'bandpass', from, to = from, q = 1, peak, attack = 0.005, decay, at = now() }) => {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(from, at);
  if (to !== from) f.frequency.exponentialRampToValueAtTime(to, at + attack + decay);
  src.connect(f);
  f.connect(envelope(peak, attack, decay, at));
  src.start(at, Math.random() * 1.5);
  src.stop(at + attack + decay + 0.05);
};

const VOICES = {
  // Pointer lands on something clickable: a small glassy tick.
  hover: () => tone({ from: 1500, to: 1100, peak: 0.035, decay: 0.05 }),

  // Something was pressed: a short, dry knock.
  click: () => {
    tone({ type: 'triangle', from: 300, to: 130, peak: 0.16, decay: 0.07 });
    hiss({ from: 3200, q: 2, peak: 0.05, decay: 0.02 });
  },

  // One typewriter key. Pitch is randomised so a run of them sounds mechanical, not looped.
  key: () => {
    const v = 0.85 + Math.random() * 0.3;
    hiss({ from: 2600 * v, q: 3, peak: 0.07, attack: 0.002, decay: 0.03 });
    tone({ from: 190 * v, to: 120 * v, peak: 0.05, attack: 0.002, decay: 0.03 });
  },

  // Fast movement: panels opening and closing, the name rushing past camera.
  whoosh: () => {
    hiss({ from: 260, to: 2400, q: 0.8, peak: 0.16, attack: 0.22, decay: 0.38 });
  },

  // A new scene lands: sub drop with a soft dust layer on top.
  impact: () => {
    tone({ from: 105, to: 36, peak: 0.55, attack: 0.008, decay: 0.7 });
    hiss({ filter: 'lowpass', from: 900, to: 120, peak: 0.12, decay: 0.3 });
  },

  // The opening reveal: a slow two-note rise.
  swell: () => {
    const at = now();
    tone({ from: 110, to: 112, peak: 0.12, attack: 1.1, decay: 2.2, at });
    tone({ from: 164.8, to: 166, peak: 0.08, attack: 1.4, decay: 2.2, at });
    hiss({ from: 400, to: 1800, q: 0.6, peak: 0.03, attack: 1.2, decay: 1.6, at });
  },
};

const startBed = () => {
  if (bed) return;
  const out = ctx.createGain();
  out.gain.value = 0;
  out.connect(master);

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 220;
  lowpass.connect(out);

  // Dark layer: two slightly detuned low notes that beat slowly against each other.
  const dark = ctx.createGain();
  dark.gain.value = 1;
  dark.connect(lowpass);
  // Light layer: the same chord two octaves up, faded in for the contact scene.
  const light = ctx.createGain();
  light.gain.value = 0;
  light.connect(lowpass);

  const voices = [
    [55, dark, 0.5], [55.35, dark, 0.5], [82.4, dark, 0.3],
    [220, light, 0.22], [329.6, light, 0.16], [440.6, light, 0.1],
  ].map(([freq, dest, level]) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = level;
    osc.connect(g);
    g.connect(dest);
    osc.start();
    return osc;
  });

  // Breathing: a very slow tremolo so the bed never sits perfectly still.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const depth = ctx.createGain();
  depth.gain.value = 0.015;
  lfo.connect(depth);
  depth.connect(out.gain);
  lfo.start();

  out.gain.setTargetAtTime(0.07, now(), 1.5);
  bed = { out, lowpass, light, dark, nodes: [...voices, lfo] };
};

export const engine = {
  /** Call from a user gesture (click / key press); browsers require one. */
  enable() {
    enabled = true;
    if (!ctx && !build()) return;
    ctx.resume();
    master.gain.cancelScheduledValues(now());
    master.gain.setTargetAtTime(MASTER_LEVEL, now(), 0.08);
    startBed();
  },

  disable() {
    enabled = false;
    if (!ctx) return;
    master.gain.cancelScheduledValues(now());
    master.gain.setTargetAtTime(0, now(), 0.05);
    // Stop the audio thread entirely once the fade has finished.
    setTimeout(() => { if (!enabled) ctx.suspend(); }, 400);
  },

  /** True only while sound is on and the browser has actually let it start. */
  get live() {
    return enabled && ctx?.state === 'running';
  },

  play(name) {
    if (!this.live) return;
    VOICES[name]?.();
  },

  /** 'dark' for the main film, 'light' once the frame inverts for the contact scene. */
  setMood(mood) {
    if (!bed) return;
    const lightOn = mood === 'light';
    const t = now();
    bed.light.gain.setTargetAtTime(lightOn ? 1 : 0, t, 0.8);
    bed.dark.gain.setTargetAtTime(lightOn ? 0.45 : 1, t, 0.8);
    bed.lowpass.frequency.setTargetAtTime(lightOn ? 1400 : 220, t, 0.8);
  },
};
