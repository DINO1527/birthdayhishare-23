import type { EntranceQuestion, JourneyLocation, LoveReason, Memory } from "@/types/story";

export const sceneLabels = [
  "For You",
  "Birthday",
  "Where It Started",
  "Places We Touched",
  "Memories",
  "Things I Love",
  "Voice Note",
  "Letter",
  "Finale",
] as const;

export const entranceQuestions: EntranceQuestion[] = [
  {
    id: "first-love-language",
    question: "What is our first version of saying “love you”?",
    hint: "Not quite… think about us.",
    successMessage: "You remembered.",
  },
  {
    id: "husband-name",
    question: "What does your husband call you?",
    hint: "That memory is hiding somewhere…",
    successMessage: "That’s my girl.",
  },
];

export const originLocations = {
  kokkuvil: {
    name: "Kokkuvil",
    role: "Me",
    coordinates: [81.6715, 7.738] as const,
    detail: "A soft cross-shaped light — a quiet trace of my Christian beginning.",
  },
  poompuhar: {
    name: "Poompuhar",
    role: "You",
    // Intentionally area-level near the lagoon, never a private address.
    coordinates: [81.6885, 7.7245] as const,
    detail: "A fine kolam line — a respectful trace of your Hindu beginning.",
  },
  meeting: { coordinates: [81.6845, 7.7305] as const },
};

export const journeyLocations: JourneyLocation[] = [
  { id: "fort-park", name: "Fort Park, Batticaloa", kicker: "FAMILIAR CITY · 01", caption: "Quiet moments in a familiar city.", coordinates: [81.70106, 7.70924], coordinateLabel: "Fort Park public map point", image: "/api/story-photo/journey/fort-park-batticaloa.webp", imageLabel: "FORT PARK MEMORY", ratio: "3:2", transition: "city", zoom: 14.2 },
  { id: "icbt", name: "ICBT Batticaloa", kicker: "EVERYDAY PLACE · 02", caption: "One of those everyday places that quietly became part of us.", coordinates: [81.7101234, 7.7147061], coordinateLabel: "178A New Kalmunai Road public campus point", image: "/api/story-photo/journey/icbt-batticaloa.webp", imageLabel: "ICBT BATTICALOA MEMORY", ratio: "3:2", transition: "city", zoom: 14.5 },
  { id: "kallady", name: "Kallady Beach", kicker: "OLD MEETING PLACE · 03", caption: "Where ordinary evenings became memories.", coordinates: [81.718864, 7.718139], coordinateLabel: "Kallady Beach public shoreline point", image: "/api/story-photo/journey/kallady-beach.webp", imageLabel: "KALLADY MEMORY", ratio: "16:9", transition: "coast", zoom: 14.1 },
  { id: "kattankudy-beach", name: "Kattankudy Beach", kicker: "BY THE WATER · 04", caption: "A different stretch of coast, and another place that became ours.", coordinates: [81.73765, 7.69102], coordinateLabel: "OpenStreetMap beach feature", image: "/api/story-photo/journey/kattankudy-beach.webp", imageLabel: "KATTANKUDY BEACH MEMORY", ratio: "16:9", transition: "coast", zoom: 14.1 },
  { id: "kattankudy-hotel", name: "Kattankudy Beach Hotel", kicker: "A PLACE OF OURS · 05", caption: "Not the business. Just the memory we made there.", coordinates: [81.7319296, 7.6815176], coordinateLabel: "Approximate public coastal point", image: "/api/story-photo/journey/kattankudy-beach-hotel.webp", imageLabel: "KATTANKUDY BEACH HOTEL MEMORY", ratio: "3:2", transition: "city", zoom: 14.6 },
  { id: "kalmunai", name: "Kalmunai", kicker: "TEA & CONVERSATION · 06", caption: "Some places stay with you because of something as simple as tea and conversation.", coordinates: [81.8270944, 7.4129583], coordinateLabel: "Kalmunai city point, Survey Department of Sri Lanka", image: "/api/story-photo/journey/kalmunai-tea.webp", imageLabel: "KALMUNAI TEA MEMORY", ratio: "4:3", transition: "tea", zoom: 12.7 },
  { id: "chariot-path", name: "Chariot Path", kicker: "OUR FIRST TRIP · 07", caption: "Somewhere between the road, the mountains and the silence, something between us changed.", coordinates: [80.723896, 7.084631], coordinateLabel: "Chariot Path mountain, via Frotoft Tea Estate", image: "/api/story-photo/journey/chariot-path-first-trip.webp", imageLabel: "OUR FIRST TRIP — CHARIOT PATH", ratio: "3:2", transition: "mountain", zoom: 11.7 },
  { id: "knuckles", name: "Knuckles, Matale", kicker: "OUR SECOND TRIP · 08", caption: "Another road, another mountain, another chapter of us.", coordinates: [80.8025, 7.413833], coordinateLabel: "Representative public point within the Knuckles range", image: "/api/story-photo/journey/knuckles-second-trip.webp", imageLabel: "KNUCKLES SECOND TRIP", ratio: "3:2", transition: "mountain", zoom: 10.9 },
  { id: "bellwood", name: "Bellwood, Kandy", kicker: "NATURE-LOVING MEMORIES · 09", caption: "Cold air, green hills, and one of those days I never wanted to end.", coordinates: [80.6712, 7.2077], coordinateLabel: "Bellwood Colony locality", image: "/api/story-photo/journey/bellwood-kandy.webp", imageLabel: "BELLWOOD MEMORY", ratio: "3:2", transition: "mountain", zoom: 12.3 },
  { id: "peradeniya", name: "Peradeniya Railway Station", kicker: "THE HARD GOODBYES · 10", caption: "Some stations are remembered for where they take you. I remember this one because I hated watching you leave.", coordinates: [80.590061, 7.257299], coordinateLabel: "Peradeniya Junction railway station", image: "/api/story-photo/journey/peradeniya-station.webp", imageLabel: "PERADENIYA STATION MEMORY", ratio: "3:2", transition: "rail", zoom: 14.2 },
  { id: "galle-face", name: "Colombo / Galle Face", kicker: "ANOTHER CITY · 11", caption: "Another city. Still us.", coordinates: [79.8435, 6.92655], coordinateLabel: "Galle Face Green public coastal point", image: "/api/story-photo/journey/galle-face-colombo.webp", imageLabel: "GALLE FACE MEMORY", ratio: "16:9", transition: "coast", zoom: 13.4 },
];

export const memories: Memory[] = [
  { id: "01", title: "The day we met", caption: "The beginning of everything.", rotation: -6, image: "/api/story-photo/memories/memory-01.webp" },
  { id: "02", title: "Our little adventures", caption: "New places, always my favourite person.", rotation: 5, image: "/api/story-photo/memories/memory-02.webp" },
  { id: "03", title: "Simple happiness", caption: "The ordinary moments mattered too.", rotation: -3, image: "/api/story-photo/memories/memory-03.webp" },
  { id: "04", title: "You, always", caption: "A photograph I never get tired of.", rotation: 7, image: "/api/story-photo/memories/memory-04.webp" },
  { id: "05", title: "That sunset", caption: "One more evening I wanted to keep.", rotation: -5, image: "/api/story-photo/memories/memory-05.webp" },
  { id: "06", title: "A random Tuesday", caption: "Because normal days with you are still special.", rotation: 4, image: "/api/story-photo/memories/memory-06.webp" },
];

export const loveReasons: LoveReason[] = [
  { id: "01", title: "Your laugh.", body: "It still makes my whole day lighter.", image: "/api/story-photo/reasons/reason-01.webp" },
  { id: "02", title: "Your kindness.", body: "The way you think about people inspires me.", image: "/api/story-photo/reasons/reason-02.webp" },
  { id: "03", title: "The ordinary days.", body: "You make simple moments feel worth remembering.", image: "/api/story-photo/reasons/reason-03.webp" },
  { id: "04", title: "You, exactly as you are.", body: "The easiest reason and the most important one.", image: "/api/story-photo/reasons/reason-04.webp" },
];
