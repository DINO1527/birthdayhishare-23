# Image asset guide

Place final story images under `private/images`. Never publish them from `public/images`. Keep these filenames, or update the matching path in `src/data/story.ts` or the relevant scene component. The protected image route currently serves WebP files.

| Scene | Folder and filename | Ratio | Suggested export |
|---|---|---:|---:|
| 02 hero | `private/images/hero/couple-hero.webp` | 4:5 portrait | 1600 × 2000 |
| 03 map reveal | `private/images/story/paths-crossed.webp` | 4:5 portrait | 1200 × 1500 |
| 04 Fort Park | `private/images/journey/fort-park-batticaloa.webp` | 3:2 landscape | 1800 × 1200 |
| 04 Kallady Beach | `private/images/journey/kallady-beach.webp` | 16:9 landscape | 1920 × 1080 |
| 04 Kattankudy Beach | `private/images/journey/kattankudy-beach.webp` | 16:9 landscape | 1920 × 1080 |
| 04 Kalmunai tea | `private/images/journey/kalmunai-tea.webp` | 4:3 landscape | 1600 × 1200 |
| 04 Chariot Path | `private/images/journey/chariot-path-first-trip.webp` | 3:2 landscape | 1800 × 1200 |
| 04 Knuckles | `private/images/journey/knuckles-second-trip.webp` | 3:2 landscape | 1800 × 1200 |
| 04 Bellwood | `private/images/journey/bellwood-kandy.webp` | 3:2 landscape | 1800 × 1200 |
| 04 Peradeniya station | `private/images/journey/peradeniya-station.webp` | 3:2 landscape | 1800 × 1200 |
| 04 Galle Face | `private/images/journey/galle-face-colombo.webp` | 16:9 landscape | 1920 × 1080 |
| 04 Mount Lavinia | `private/images/journey/mount-lavinia.webp` | 3:2 card | 1800 × 1200 |
| 04 Nuwara Eliya | `private/images/journey/nuwara-eliya.webp` | 3:2 card | 1800 × 1200 |
| 04 Kokkatticholai | `private/images/journey/kokkatticholai.webp` | 3:2 landscape | 1800 × 1200 |
| 04 Sri Dalada Maligawa | `private/images/journey/sri-dalada-maligawa.webp` | 3:2 card | 1800 × 1200 |
| 04 Kandy Lake Park | `private/images/journey/kandy-lake-park.webp` | 3:2 card | 1800 × 1200 |
| 04 Savukadi | `private/images/journey/savukadi.webp` | 3:2 landscape | 1800 × 1200 |
| 04 Thooviyadi | `private/images/journey/thooviyadi.webp` | 3:2 landscape | 1800 × 1200 |
| 05 memory 01–06 | `private/images/memories/memory-01.webp` … `memory-06.webp` | 4:3 landscape | 1600 × 1200 |
| 06 reason 01–04 | `private/images/reasons/reason-01.webp` … `reason-04.webp` | 4:3 landscape | 1200 × 900 |
| 09 final couple | `private/images/ending/final-couple.webp` | 4:5 portrait | 1200 × 1500 |

Compression targets:

- Hero: 300–650 KB.
- Journey and final images: 180–450 KB each.
- Memories/reasons: 100–280 KB each.

Audio files:

- `public/audio/background-music.mp3`
- `public/audio/voice-message.mp3`

For entrance testing, click **Reset private entrance** in Scene 01 after unlocking, or open the site once with `?resetStory=1`.
