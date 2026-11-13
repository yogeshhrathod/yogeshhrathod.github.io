// Sound engine — everything is synthesised with the Web Audio API.
// No audio files, no network requests, one AudioContext.
//
// The palette is deliberately soft: sine bells tuned to one pentatonic scale
// (so any two sounds are always in harmony), slow attacks, long tails, and a
// shared reverb. There are no clicks, noise bursts or sub drops.
//
//   voices ─┬─────────────── master ── limiter ── speakers
//           └─ send ─ reverb ──┘
//   music (chords + bass + arpeggio + melody) ─ same two paths
//
// The background is real music, composed live: a four-chord progression at a
// slow tempo, a plucked arpeggio that outlines each chord, and a melody that
// wanders stepwise through the scale. It never repeats exactly.

const MASTER_LEVEL = 0.7;

// D major pentatonic, D4 → A5.
const SCALE = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99, 880.0];
const pick = (lo, hi) => SCALE[lo + Math.floor(Math.random() * (hi - lo + 1))];

let ctx = null;
let master = null;
let reverb = null;
let noise = null;
let music = null;
let enabled = false;
let arrivals = 0;

const now = () => ctx.currentTime;

const build = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return false;
  ctx = new AudioCtx();

  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -16;
  limiter.ratio.value = 4;
  limiter.connect(ctx.destination);

  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(limiter);

  // A soft hall, built from decaying noise instead of a recorded impulse file.
  const seconds = 3;
  const impulse = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch += 1) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2.6;
    }
  }
  const hall = ctx.createConvolver();
  hall.buffer = impulse;
  const hallTone = ctx.createBiquadFilter();
  hallTone.type = 'lowpass';
  hallTone.frequency.value = 3200;
  const hallLevel = ctx.createGain();
  hallLevel.gain.value = 0.5;
  reverb = ctx.createGain();
  reverb.connect(hall);
  hall.connect(hallTone);
  hallTone.connect(hallLevel);
  hallLevel.connect(master);

  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const n = noise.getChannelData(0);
  for (let i = 0; i < n.length; i += 1) n[i] = Math.random() * 2 - 1;

  return true;
};

/** Soft envelope: linear fade in, then a natural exponential tail. */
const shape = (peak, attack, decay, send, at, out = master) => {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(peak, at + attack);
  g.gain.setTargetAtTime(0, at + attack, decay / 4);
  g.connect(out);
  if (send > 0) {
    const s = ctx.createGain();
    s.gain.value = send;
    g.connect(s);
    s.connect(reverb);
  }
  return g;
};

const note = ({ freq, peak, attack = 0.012, decay = 0.5, send = 0.5, delay = 0, at = now() + delay, out, type = 'sine' }) => {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(shape(peak, attack, decay, send, at, out));
  osc.start(at);
  osc.stop(at + attack + decay * 2);
};

/** A bell: fundamental plus two quiet, faster-fading overtones. */
const bell = ({ freq, peak, decay = 1, send = 0.6, delay = 0, attack = 0.012, at = now() + delay, out }) => {
  note({ freq, peak, attack, decay, send, at, out });
  note({ freq: freq * 2, peak: peak * 0.22, attack, decay: decay * 0.5, send, at, out });
  note({ freq: freq * 3.01, peak: peak * 0.07, attack, decay: decay * 0.3, send, at, out });
};

const VOICES = {
  // Pointer lands on something clickable: one faint glass note.
  hover: () => note({ freq: pick(5, 8), peak: 0.022, decay: 0.4, send: 0.7 }),

  // Something was pressed: a small bell.
  tap: () => bell({ freq: pick(2, 5), peak: 0.08, decay: 0.8 }),

  // One typed character: a muted, marimba-like touch.
  key: () => note({ freq: pick(0, 4), peak: 0.016, attack: 0.004, decay: 0.12, send: 0.35 }),

  // Movement (panels sliding, the name passing camera): a slow breath of air.
  breath: () => {
    const at = now();
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(350, at);
    f.frequency.linearRampToValueAtTime(900, at + 0.6);
    f.frequency.linearRampToValueAtTime(300, at + 1.6);
    src.connect(f);
    f.connect(shape(0.045, 0.55, 1.1, 0.5, at));
    src.start(at, Math.random());
    src.stop(at + 3);
  },

  // A new scene arrives: a low, warm two-note bell with a high answer that
  // steps up the scale on each scene.
  arrive: () => {
    bell({ freq: 146.83, peak: 0.13, decay: 3.2, attack: 0.03 });
    bell({ freq: 220, peak: 0.08, decay: 3, attack: 0.03, delay: 0.07 });
    bell({ freq: SCALE[(arrivals * 2) % 6], peak: 0.045, decay: 2.4, delay: 0.2 });
    arrivals += 1;
  },

  // Sound switched on / the film opens: a chord blooming upward.
  swell: () => {
    [146.83, 220, 369.99, 587.33].forEach((freq, i) => {
      note({ freq, peak: 0.07 - i * 0.012, attack: 1.2, decay: 3.5, send: 0.7, delay: i * 0.35 });
    });
  },

  // Qivi reacts: three quick ascending bells.
  sparkle: () => {
    const base = 4 + Math.floor(Math.random() * 3);
    [0, 1, 2].forEach((step) => {
      bell({ freq: SCALE[Math.min(base + step, 8)], peak: 0.05, decay: 0.7, send: 0.8, delay: step * 0.075 });
    });
  },
};

// ── Background music ────────────────────────────────────────────────────────
const BEAT = 0.72;          // seconds: about 83 bpm, felt in slow two
const BEATS_PER_BAR = 8;
const BAR = BEAT * BEATS_PER_BAR;

// D major: I – vi – IV – V. Each chord: a bass note, four pad notes, and the
// tones the arpeggio climbs through.
const PROGRESSION = [
  { bass: 73.42, pad: [146.83, 185.0, 220.0, 329.63], arp: [293.66, 369.99, 440.0, 587.33] },   // Dmaj9
  { bass: 61.74, pad: [123.47, 146.83, 185.0, 220.0], arp: [246.94, 293.66, 369.99, 493.88] },   // Bm7
  { bass: 98.0, pad: [123.47, 146.83, 196.0, 293.66], arp: [246.94, 293.66, 392.0, 587.33] },    // Gmaj
  { bass: 110.0, pad: [138.59, 164.81, 220.0, 329.63], arp: [277.18, 329.63, 440.0, 659.25] },   // A
];

/** A held note with a slow fade in and out, for chords and bass. */
const sustain = (freq, at, length, level, type, out) => {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(level, at + 1.6);
  g.gain.setValueAtTime(level, at + length - 0.4);
  g.gain.linearRampToValueAtTime(0, at + length + 1.8); // overlaps the next chord
  osc.connect(g);
  g.connect(out);
  osc.start(at);
  osc.stop(at + length + 2);
};

const scheduleBar = (at) => {
  const { out, bright } = music;
  const chord = PROGRESSION[music.bar % PROGRESSION.length];
  const phrase = Math.floor(music.bar / PROGRESSION.length);

  // Harmony
  sustain(chord.bass, at, BAR, 0.075, 'sine', out);
  chord.pad.forEach((freq) => sustain(freq, at, BAR, 0.02, 'triangle', out));

  // Arpeggio: up through the chord on the first phrase, up-and-back after it.
  const order = phrase % 2 === 0 ? [0, 1, 2, 3, 2, 1, 2, 3] : [0, 2, 1, 3, 2, 3, 1, 2];
  order.forEach((tone, beat) => {
    note({ freq: chord.arp[tone], peak: beat === 0 ? 0.03 : 0.021, attack: 0.008, decay: 0.9, send: 0.6, at: at + beat * BEAT, out });
  });

  // Melody: a slow stepwise walk through the scale, with rests. It enters
  // after the first pass of the chords, and opens up for the contact scene.
  if (music.bar >= 2) {
    const density = bright ? 0.7 : 0.45;
    [0, 2, 3, 4, 6, 7].forEach((beat) => {
      if (Math.random() > density) return;
      const step = [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)];
      music.degree = Math.min(SCALE.length - 1, Math.max(2, music.degree + step));
      bell({ freq: SCALE[music.degree], peak: 0.032, decay: 2.2, send: 0.9, at: at + beat * BEAT + BEAT / 2, out });
    });
  }

  music.bar += 1;
};

const startMusic = () => {
  if (music) {
    // Coming back from mute: pick the tune up from the next bar, not from stale timings.
    music.nextBar = Math.max(music.nextBar, now() + 0.15);
  } else {
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 1500;
    tone.connect(master);
    const send = ctx.createGain();
    send.gain.value = 0.55;
    tone.connect(send);
    send.connect(reverb);

    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.setTargetAtTime(1, now(), 1.2);
    out.connect(tone);
    music = { out, tone, bar: 0, degree: 5, bright: false, nextBar: now() + 0.4, timer: null };
  }

  // Bars are scheduled on the audio clock a little ahead of time, so the
  // rhythm stays exact even when the page is busy.
  const pump = () => {
    while (music.nextBar < now() + 1.5) {
      scheduleBar(music.nextBar);
      music.nextBar += BAR;
    }
  };
  clearInterval(music.timer);
  pump();
  music.timer = setInterval(pump, 400);
};

export const engine = {
  /** Call from a user gesture (click / key press); browsers require one. */
  enable() {
    enabled = true;
    if (!ctx && !build()) return;
    ctx.resume();
    master.gain.cancelScheduledValues(now());
    master.gain.setTargetAtTime(MASTER_LEVEL, now(), 0.25);
    startMusic();
  },

  disable() {
    enabled = false;
    if (!ctx) return;
    master.gain.cancelScheduledValues(now());
    master.gain.setTargetAtTime(0, now(), 0.12);
    clearInterval(music?.timer);
    // Stop the audio thread entirely once the fade has finished.
    setTimeout(() => { if (!enabled) ctx.suspend(); }, 700);
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
    if (!music) return;
    music.bright = mood === 'light';
    music.tone.frequency.setTargetAtTime(music.bright ? 3200 : 1500, now(), 1.2);
  },
};
