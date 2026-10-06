# File map

```text
src/app/layout.tsx                         fonts, metadata, smooth-scroll provider
src/app/page.tsx                           scene composition
src/app/globals.css                        full visual system + responsiveness
src/data/story.ts                          questions, coordinates, captions, image paths
src/types/story.ts                         content types
src/lib/animation.ts                       GSAP + ScrollTrigger registration
src/hooks/useReducedMotion.ts              accessibility hook
src/components/providers/SmoothScrollProvider.tsx
src/components/ui/SceneProgress.tsx        fixed 01/09 indicator
src/components/ui/MusicButton.tsx          background music control
src/components/ui/PhotoPlaceholder.tsx     safe placeholder before real images exist
src/components/ui/StoryImage.tsx           real image loader with labeled fallback
src/components/three/Envelope3D.tsx        procedural 3D envelope
src/components/maps/StoryOriginsMap.tsx    world → Sri Lanka → Batticaloa map
src/components/maps/TravelMap.tsx          active travel-memory map
src/components/scenes/OpeningScene.tsx     scene 01
src/components/scenes/HeroScene.tsx        scene 02
src/components/scenes/StoryMapScene.tsx    scene 03
src/components/scenes/TimelineScene.tsx    scene 04 geographic travel journey
src/components/scenes/MemoriesScene.tsx    scene 05
src/components/scenes/LoveReasonsScene.tsx scene 06
src/components/scenes/VoiceScene.tsx       scene 07
src/components/scenes/LetterScene.tsx      scene 08
src/components/scenes/FinalScene.tsx       scene 09
IMAGE-ASSET-GUIDE.md                       exact image folders, names, and ratios
public/maplibre-gl-worker.mjs              self-hosted MapLibre worker for Next/Turbopack
public/maplibre-gl-shared.mjs              shared MapLibre worker runtime imported by the worker
```
