Audio files
===========
background-music.mp3: Pesamale, supplied by the site owner.
voice-preview.wav: temporary Windows-generated spoken sample, labelled in the player.

Replace the sample by adding your recording as public/audio/voice-message.mp3,
then run npm run build (or the Cloudflare build). The page selects your recording
at build time and removes the sample label automatically.

Music starts with a tap. Each chapter has a gentle preset volume and retains
changes made during the visit. The voice player lowers the background music,
then restores the current chapter volume on pause, end, or leaving the section.
Both players pause when the browser tab is hidden.
