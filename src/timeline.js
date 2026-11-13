// The whole film is laid out in viewport-heights of scroll ("vh units").
// `progress` (see Stage.jsx) is scrollY / viewportHeight, so every scene,
// dialogue, sound cue and nav target reads from this one table.
export const FADE = 0.18;

export const SCENES = {
  START: [0, 1],
  PROJECTS: [2.2, 7.4],
  EXPERIENCE: [8.6, 11.8],
  FOUNDATION: [13, 15.4],
  CONTACT: [16.6, 17.6],
};

// The gaps between scenes, one per entry in `dialogues` (data/resume.js).
export const DIALOGUE_RANGES = [
  [1, 2.2],
  [7.4, 8.6],
  [11.8, 13],
  [15.4, 16.6],
];

// Scrollable distance. The page is one viewport taller than this.
export const TOTAL_SCROLL = SCENES.CONTACT[1];

export const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
