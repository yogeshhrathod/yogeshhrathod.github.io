# Cinematic Portfolio Architecture Rules

You are a Cinematic Architect building a high-concept portfolio. Follow these structural and aesthetic rules when adding new scenes, components, or logic.

## 1. Project Architecture

The project is structured into logical "Shots" and "Orchestration" layers:

- `src/scenes/`: Contains "Shots" (e.g., `TheMonolith`, `TheArchive`). Each shot is a full-screen sequence that becomes active/inactive based on `currentScroll`.
- `src/components/`: Reusable atmospheric elements (e.g., `SubmergedParticles`, `VolumetricDialogue`).
- `src/hooks/`: Reusable camera and interaction logic (e.g., `useCameraTransform`).
- `src/data/`: Centralized content repository (`resume.js`).
- `src/App.jsx`: The "Director's Monitor". It manages the global camera, scroll lerping, and scene mounting.

## 2. Adding a New Scene (Shot)

To add a new scene:
1. Create a new component in `src/scenes/` (e.g., `TheExperiment.jsx`).
2. Use the `cn` utility for conditional styles.
3. Use `currentScroll` to determine visibility and `lerpedScroll` for fine-grained motion.
4. Mount the scene in `App.jsx` within the fixed camera viewport.

### Scene Template:
```jsx
export const TheNewShot = ({ currentScroll, lerpedScroll }) => {
  const isActive = currentScroll >= START_VAL && currentScroll < END_VAL;
  
  return (
    <section className={cn(
      "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000",
      isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    )}>
      {/* Content here */}
    </section>
  );
};
```

## 3. The Cinematic Code (Atmospheric Mandates)

- **The Void**: Maintain 60%+ negative space.
- **Tectonic Scale**: Use extreme typographic contrast (`titan-title` @ 15vw vs `minimal-body` @ 10px).
- **Ubisoft Motion**: Never move instantly. Use `lerp` or `framer-motion` springs. Movement should feel "heavy."
- **Camera Drift**: Use `useHandheldDrift()` for all high-level containers to simulate a physical camera.
- **Micro-Detail**: Use technical artifacts like `STATUS // OPERATIONAL` or `ENTRY_01` to fill peripheral space.
- **Color Grading**: Limit palettes to high-contrast monochrome with single "accent" colors like `molten-red`.

## 4. Orchestration

- `currentScroll`: Use this for "On/Off" logic (showing/hiding sections).
- `lerpedScroll`: Use this for "Motion" logic (scenery movement, scaling, rotation).
- ALWAYS check `src/data/resume.js` before hardcoding content.

## 5. Development Workflow

- When asked to "add a feature", identify if it's a new global **Component** or a new narrative **Scene**.
- If adding a scene, update the Progress HUD in `App.jsx` to reflect the new sequence.
- Maintain the "Director's Monitor" (App.jsx) as a lean orchestrator.
