# Birthday Story — Next.js Starter

A mobile-first, cinematic scrolling birthday card starter based on the mockups generated in this project.

## 1. Requirements

- Node.js 24 LTS recommended (Next.js 16 requires Node >= 20.9)
- npm 10+

## 2. Install

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Before deployment, run:

```bash
npm run lint
npm run build
```

## 3. What works immediately

The site includes the story photographs and map coordinates. It runs without optional audio or GLB files. It includes:

- 3D envelope made from Three.js geometry
- GSAP scroll reveals
- Lenis smooth scroll
- server-checked two-question entrance with a signed, seven-day HttpOnly session
- MapLibre world → Sri Lanka → Batticaloa origin sequence
- scroll-controlled geographic journey through eleven real places
- floating memory cards
- love-reasons editorial list
- a written voice-note scene that becomes an audio player when a recording is supplied
- birthday letter
- dark cinematic final reveal
- mobile/desktop responsive layout
- reduced-motion fallback

## 4. Asset folders

### Photos

Story photos live in `private/images`, outside Next.js's public folder. The entrance preloads all 24 optimized photos after the questions are answered, then opens the story. See `IMAGE-ASSET-GUIDE.md` for photo names and ratios. Keep replacement photos under the matching `private/images` folder, and optimize large files before deployment. The Cloudflare build copies them into Worker static assets under a protected path; see `CLOUDFLARE-DEPLOY.md`.

The original, uncompressed photos are retained locally under ignored `private/originals` for backup. Do not upload that folder. `scripts/prepare-private-images.mjs` can process newly added WebP photos from `public/images`; verify that it removed every public copy afterward.

Set `STORY_SESSION_SECRET` to a unique random value of at least 32 characters and set `STORY_ANSWER_1` and `STORY_ANSWER_2` to the two entrance answers in your hosting environment. Local values live in the ignored `.env.local` file. The site requires a server deployment; static export cannot serve the protected photo route. Keep the session secret private and stable between deployments. If it changes, visitors must unlock again.

The photos are protected from anonymous requests, and public indexing is disabled. Anyone who unlocks the story can still save or photograph what their browser displays. Previously deployed public photo URLs and external caches must be removed or purged separately; moving files in this workspace does not revoke old copies.

### Audio

```text
/public/audio/background-music.mp3
/public/audio/voice-message.mp3
```

Keep each compressed enough for mobile delivery. Background music should only start after the user taps the control/open button.
Files in `public/audio` are publicly accessible. Do not place a private recording there without first adding an authenticated audio route like the photo route.

### 3D models later

```text
/public/models/envelope.glb
/public/models/coffee.glb
/public/models/car.glb
/public/models/globe.glb
```

The current version does not need them because the envelope and globe are generated in Three.js.

## 5. Mockup mapping

Reference images are bundled under `/design-reference`.

| Scene | Reference | Current implementation |
|---|---|---|
| 01 Opening | `01-opening.png` | 3D envelope + open transition |
| 02 Hero | `02-hero.png` | editorial hero with a private photograph |
| 03 Map | `03-story-map.png` | MapLibre geographic zoom + two local origin routes |
| 04 Journey | `04-timeline.png` | sticky Sri Lanka map + eleven memory chapters |
| 05 Memories | `05-memories.png` | floating editorial photo cards |
| 06 Reasons | `06-love-reasons.png` | numbered editorial list |
| 07 Voice | `07-voice.png` | written message, with optional audio player |
| 08 Letter | `08-letter.png` | calm paper-letter section |
| 09 Finale | `10-finale.png` | dark cinematic ending + final surprise modal |

## 6. Where to edit story content

The location and memory copy lives in:

```text
src/data/story.ts
```

The long birthday letter lives in:

```text
src/components/scenes/LetterScene.tsx
```

## 7. Maps and location editing

Both map scenes use MapLibre with monochrome OpenStreetMap tiles. Coordinates, labels, captions, image paths, transition types, and camera zoom live in `src/data/story.ts`. Kokkuvil and Poompuhar deliberately use area-level points rather than private addresses. Confirm the approximate Kattankudy hotel point if the location needs to be exact.

## 8. Before publishing

1. Set the three story environment variables in the hosting service.
2. Confirm that no photos remain in `public/images` and exclude `private/originals` from the upload.
3. Purge any older public photo URLs from previous deployments and caches.
4. Test on a phone and desktop, including reduced motion and a slow network.
