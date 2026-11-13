// The whole film is laid out in viewport-heights of scroll ("vh units").
// `progress` (see Stage.jsx) is scrollY / viewportHeight, so every scene,
// dialogue, sound cue and nav target reads from this one table.
export const FADE = 0.18;

export const SCENES = {
  START: [0, 1],
  PROJECTS: [2, 6.6],
  COMPANION: [6.6, 8.2],
  EXPERIENCE: [9.2, 12.4],
  FOUNDATION: [13.4, 15.8],
  CONTACT: [16.8, 17.8],
};

// The gaps between scenes, one per entry in `dialogues` (data/resume.js).
export const DIALOGUE_RANGES = [
  [1, 2],
  [8.2, 9.2],
  [12.4, 13.4],
  [15.8, 16.8],
];

// Scrollable distance. The page is one viewport taller than this.
export const TOTAL_SCROLL = SCENES.CONTACT[1];

export const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
