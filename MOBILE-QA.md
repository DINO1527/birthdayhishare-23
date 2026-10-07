# Mobile and audio verification — 7 October 2026

- `npm run build`: passed (Next.js production build, TypeScript, prerendering).
- `npm run lint`: passed.
- `git diff --check`: passed.
- Browser viewport review: 390×844 (iPhone 12), 414×896 (iPhone 11), 412×915 (Note20).
- Opening: sealed and opened states fit the viewport; letter remains behind the side pockets. Loading progress uses a foreground HTML progress bar with left-to-right fill. Return-to-opening grid regression checked.
- Reasons: all four number columns share the same left alignment at all three widths; rows reveal independently while scrolling. Body text remains inside its column.
- Voice: sample duration 14.82s; play, pause, seeking, volume/mute, and leaving-section pause checked. Cached metadata correctly initializes the duration display.
- Music: owner-supplied Pesamale file, 178.14s; manual start, pause, chapter volume control, mute, voice ducking, and audio-reactive visual signal checked. Tab visibility pauses both players.
- Cross-origin session POST rejected with 403; matching local origin accepted after hostname validation fix.
- No browser console errors in final checks. Third-party Three.js emitted Clock/shadow-map deprecation warnings.

These are browser viewport checks, not tests on physical iOS/Android hardware or native mobile Chrome. Network and real-device audio behavior still benefit from a device smoke test.

## Replace the sample voice

Add `public/audio/voice-message.mp3` and rebuild. The page chooses it at build time and removes the sample label. See `public/audio/README.txt`.

## Local production preview

Run `npm run build`, then `npm run start`. The development indicator is disabled, and production uses the existing private entrance configuration. No remote deployment was performed.
