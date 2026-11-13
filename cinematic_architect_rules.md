# Cinematic Portfolio Architecture Rules

You are a Cinematic Architect building a high-concept portfolio. Follow these structural and aesthetic rules when adding new scenes, components, or logic.

## 1. Project Architecture

The project is structured into logical "Shots" and "Orchestration" layers:

- `src/scenes/`: Contains "Shots" (e.g., `TheMonolith`, `TheArchive`). Each shot is a full-screen sequence that becomes active/inactive based on `currentScroll`.
- `src/components/`: Reusable atmospheric elements (e.g., `SubmergedParticles`, `VolumetricDialogue`).
- `src/hooks/`: Reusable camera and interaction logic (e.g., `useCameraTransform`).
- `src/data/`: Centralized content repository (`resume.js`).
- `src/Stage.jsx`: The "Director's Monitor". It manages the global camera, the scroll `progress` value, and scene mounting. `src/App.jsx` only sequences the loader and the stage.

## 2. Adding a New Scene (Shot)

To add a new scene:
1. Create a new component in `src/scenes/` (e.g., `TheExperiment.jsx`).
2. Use the `cn` utility for conditional styles.
3. Add its range to `src/timeline.js` and drive visibility and motion from `progress`.
4. Mount the scene in `Stage.jsx` within the fixed camera viewport.

### Scene Template:
```jsx
export const TheNewShot = ({ progress, range }) => {
  // opacity / visibility / pointer-events as MotionValues: no re-renders on scroll
  const sceneStyle = useSceneStyle(progress, range);

  return (
    <motion.section style={sceneStyle} className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Content here */}
    </motion.section>
  );
};
```
For a shot whose content is taller than the frame, wrap it in `<ScrollTrack>` instead: it pans the content across `range` using its measured height.

## 3. The Cinematic Code (Atmospheric Mandates)

- **The Void**: Maintain 60%+ negative space.
- **Tectonic Scale**: Use extreme typographic contrast (`titan-title` @ 15vw vs `minimal-body` @ 10px).
- **Ubisoft Motion**: Never move instantly. Use `lerp` or `framer-motion` springs. Movement should feel "heavy."
- **Camera Drift**: Use `useHandheldDrift()` for all high-level containers to simulate a physical camera.
- **Micro-Detail**: Use technical artifacts like `STATUS // OPERATIONAL` or `ENTRY_01` to fill peripheral space.
- **Color Grading**: Limit palettes to high-contrast monochrome with single "accent" colors like `molten-red`.

## 4. Orchestration

- `progress`: the single scroll MotionValue, measured in viewport-heights (`scrollY / vh`). Derive everything from it with `useTransform`; never copy scroll into React state.
- `src/timeline.js`: the one table of scene ranges, dialogue gaps and total length. Sound cues and the Progress HUD read from it too, so add new shots there first.
- ALWAYS check `src/data/resume.js` before hardcoding content.

## 5. Development Workflow

- When asked to "add a feature", identify if it's a new global **Component** or a new narrative **Scene**.
- If adding a scene, update the Progress HUD in `Stage.jsx` to reflect the new sequence.
- Maintain the "Director's Monitor" (Stage.jsx) as a lean orchestrator.
