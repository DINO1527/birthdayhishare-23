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
  { id: "chariot-path", name: "Chariot Path", kicker: "THE FIRST PROPOSAL · 01", caption: "The first iconic proposal place — my pattu enaku kidacha naal.", coordinates: [80.723896, 7.084631], coordinateLabel: "Chariot Path mountain, via Frotoft Tea Estate", image: "/api/story-photo/journey/chariot-path-first-trip.webp", imageLabel: "OUR FIRST TRIP — CHARIOT PATH", ratio: "3:2", transition: "mountain", zoom: 11.7 },
  { id: "fort-park", name: "Fort Park, Batticaloa", kicker: "FAMILIAR CITY · 02", caption: "Another day out — Batticaloa-voda one and only public park.", coordinates: [81.70106, 7.70924], coordinateLabel: "Fort Park public map point", image: "/api/story-photo/journey/fort-park-batticaloa.webp", imageLabel: "FORT PARK MEMORY", ratio: "3:2", transition: "city", zoom: 14.2 },
  { id: "kattankudy-beach", name: "Kattankudy Beach", kicker: "AFTER-WORK MEMORIES · 03", caption: "Dialog company-oda old memories. Work mudinja ovvoru naalum inga vandhu dhuva illama enjoy pannom.", coordinates: [81.73765, 7.69102], coordinateLabel: "OpenStreetMap beach feature", image: "/api/story-photo/journey/kattankudy-beach.webp", imageLabel: "KATTANKUDY BEACH MEMORY", ratio: "16:9", transition: "coast", zoom: 14.1 },
  { id: "kallady", name: "Kallady Beach", kicker: "BEACH GOSSIPS · 04", caption: "Innonu spot for our beach gossips.", coordinates: [81.718864, 7.718139], coordinateLabel: "Kallady Beach public shoreline point", image: "/api/story-photo/journey/kallady-beach.webp", imageLabel: "KALLADY MEMORY", ratio: "16:9", transition: "coast", zoom: 14.1 },
  { id: "kalmunai", name: "Kalmunai", kicker: "THE LONG RIDE · 05", caption: "Iconic long-drive moments — 35 km bike travel for chai and parotta.", coordinates: [81.8270944, 7.4129583], coordinateLabel: "Kalmunai city point, Survey Department of Sri Lanka", image: "/api/story-photo/journey/kalmunai-tea.webp", imageLabel: "KALMUNAI TEA MEMORY", ratio: "4:3", transition: "tea", zoom: 12.7 },
  { id: "kokkatticholai", name: "Kokkatticholai", kicker: "A RANDOM DAY OUT · 06", caption: "Random day out — namma Kalmunai pogum vazhiyila.", coordinates: [81.71667, 7.61667], coordinateLabel: "Kokkatticholai village public map point", image: "/api/story-photo/journey/kokkatticholai.webp", imageLabel: "KOKKATTICHOLAI MEMORY", ratio: "3:2", transition: "city", zoom: 13.5 },
  { id: "savukadi", name: "Savukadi", kicker: "LOVE STARTING MOMENTS · 07", caption: "Love peak moments… love start aana moments. Time fast-a pogudhu; innum konjam neram venum.", coordinates: [81.6247, 7.8036], coordinateLabel: "Savukkadi locality public map point", image: "/api/story-photo/journey/savukadi.webp", imageLabel: "SAVUKADI MEMORY", ratio: "3:2", transition: "coast", zoom: 14.1 },
  { id: "thooviyadi", name: "Thooviyadi", kicker: "ONE MORE COASTAL MEMORY · 08", caption: "Antha naaloda beach memory — namma story-la innum oru idam.", coordinates: [81.681, 7.775], coordinateLabel: "Approximate public locality point", image: "/api/story-photo/journey/thooviyadi.webp", imageLabel: "THOOVIYADI MEMORY", ratio: "3:2", transition: "coast", zoom: 13.8 },
  { id: "knuckles", name: "Knuckles, Matale", kicker: "OUR SECOND TRIP · 09", caption: "Trip plan successful-a possible aana place — friends-oda enjoy pannina camping memories.", coordinates: [80.8025, 7.413833], coordinateLabel: "Representative public point within the Knuckles range", image: "/api/story-photo/journey/knuckles-second-trip.webp", imageLabel: "KNUCKLES SECOND TRIP", ratio: "3:2", transition: "mountain", zoom: 10.9 },
  { id: "nuwara-eliya", name: "Nuwara Eliya", kicker: "OUR FIRST HILL-COUNTRY RIDE · 10", caption: "Couple bike long trip, chill cool climate, and my pattu-oda first real flower bouquet.", coordinates: [80.78286, 6.97078], coordinateLabel: "Nuwara Eliya town public map point", image: "/api/story-photo/journey/nuwara-eliya.webp", imageLabel: "NUWARA ELIYA MEMORY", ratio: "3:2", transition: "mountain", zoom: 12.5 },
  { id: "bellwood", name: "Bellwood, Kandy", kicker: "A QUIET MOUNTAIN RIDE · 11", caption: "Short day out — noise ellam vittu, quiet-a mountain bike ride pona naal.", coordinates: [80.6712, 7.2077], coordinateLabel: "Bellwood Colony locality", image: "/api/story-photo/journey/bellwood-kandy.webp", imageLabel: "BELLWOOD MEMORY", ratio: "3:2", transition: "mountain", zoom: 12.3 },
  { id: "peradeniya", name: "Peradeniya Railway Station", kicker: "GOODBYES & ARRIVALS · 12", caption: "Kandy-a vittu pogumbodhu heart-breaking place; thirumbi varumbodhu most exciting place.", coordinates: [80.590061, 7.257299], coordinateLabel: "Peradeniya Junction railway station", image: "/api/story-photo/journey/peradeniya-station.webp", imageLabel: "PERADENIYA STATION MEMORY", ratio: "3:2", transition: "rail", zoom: 14.2 },
  { id: "sri-dalada-maligawa", name: "Sri Dalada Maligawa", kicker: "A PEACEFUL KANDY VISIT · 13", caption: "Religious temple-oda amaidhi… peaceful-a irundha antha Kandy visit.", coordinates: [80.6386, 7.2939], coordinateLabel: "Sri Dalada Maligawa public map point", image: "/api/story-photo/journey/sri-dalada-maligawa.webp", imageLabel: "SRI DALADA MALIGAWA MEMORY", ratio: "3:2", transition: "city", zoom: 15.2 },
  { id: "kandy-lake-park", name: "Kandy Lake Park", kicker: "OUR EVERYDAY KANDY · 14", caption: "Namma living-together and hostel center place — every time we pass inga dhaan.", coordinates: [80.6389, 7.2921], coordinateLabel: "Kandy Lake public map point", image: "/api/story-photo/journey/kandy-lake-park.webp", imageLabel: "KANDY LAKE PARK MEMORY", ratio: "3:2", transition: "city", zoom: 14.8 },
  { id: "galle-face", name: "Colombo / Galle Face", kicker: "A DAY IN COLOMBO · 15", caption: "Just another day of our Colombo posh-life demo.", coordinates: [79.8435, 6.92655], coordinateLabel: "Galle Face Green public coastal point", image: "/api/story-photo/journey/galle-face-colombo.webp", imageLabel: "GALLE FACE MEMORY", ratio: "16:9", transition: "coast", zoom: 13.4 },
  { id: "mount-lavinia", name: "Mount Lavinia", kicker: "POSH COLOMBO LIFE · 16", caption: "Mount Lavinia-la namma posh Colombo life demo.", coordinates: [79.86262, 6.84006], coordinateLabel: "Mount Lavinia Beach public shoreline point", image: "/api/story-photo/journey/mount-lavinia.webp", imageLabel: "MOUNT LAVINIA MEMORY", ratio: "3:2", transition: "coast", zoom: 13.5 },
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
