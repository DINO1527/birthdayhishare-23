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
    detail: "Oru Christian plzham pastor family-La irundha Fire ana Christian podiyan.",
  },
  poompuhar: {
    name: "Poompuhar",
    role: "You",
    // Intentionally area-level near the lagoon, never a private address.
    coordinates: [81.6885, 7.7245] as const,
    detail: "Arambatha Hindu plzham, kulzhal podura family-La irundha Fire ana Agnostic Theist ponnu.",
  },
  meeting: { coordinates: [81.6845, 7.7305] as const },
};

export const journeyLocations: JourneyLocation[] = [
  { id: "chariot-path", name: "Chariot Path", kicker: "THE FIRST PROPOSAL · 01", caption: "The first iconic proposal place - my pattu enaku kidacha naal.", coordinates: [80.723896, 7.084631], coordinateLabel: "Chariot Path mountain, via Frotoft Tea Estate", image: "/api/story-photo/journey/chariot-path-first-trip.webp", imageLabel: "OUR FIRST TRIP - CHARIOT PATH", ratio: "3:2", transition: "mountain", zoom: 11.7 },
  { id: "fort-park", name: "Fort Park, Batticaloa", kicker: "FAMILIAR CITY · 02", caption: "Another day out - Batticaloa-voda one and only urupadiyana public park.", coordinates: [81.70106, 7.70924], coordinateLabel: "Fort Park public map point", image: "/api/story-photo/journey/fort-park-batticaloa.webp", imageLabel: "FORT PARK MEMORY", ratio: "3:2", transition: "city", zoom: 14.2 },
  { id: "kattankudy-beach", name: "Kattankudy Beach", kicker: "AFTER-WORK MEMORIES · 03", caption: "Dialog la vela senja old memories. Work mudinja ovvoru naalum inga vandhu dhuva illama enjoy pannom.Ipaium nan ipidithan bro, unaluku than intrest poith", coordinates: [81.73765, 7.69102], coordinateLabel: "OpenStreetMap beach feature", image: "/api/story-photo/journey/kattankudy-beach.webp", imageLabel: "KATTANKUDY BEACH MEMORY", ratio: "16:9", transition: "coast", zoom: 14.1 },
  { id: "kallady", name: "Kallady Beach", kicker: "BEACH GOSSIPS · 04", caption: "Innonu spot for our beach gossips.My 1st oneside love, pulamalugal,brekupugal, niraiya per da kastengala feel pannura my fav place, after the certin point en aal kooda diffrent feela", coordinates: [81.718864, 7.718139], coordinateLabel: "Kallady Beach public shoreline point", image: "/api/story-photo/journey/kallady-beach.webp", imageLabel: "KALLADY MEMORY", ratio: "16:9", transition: "coast", zoom: 14.1 },
  { id: "kalmunai", name: "Kalmunai", kicker: "THE LONG RIDE · 05", caption: "Iconic long-drive moments - 35-35 km bike travel for chai and parotta.", coordinates: [81.8270944, 7.4129583], coordinateLabel: "Kalmunai city point, Survey Department of Sri Lanka", image: "/api/story-photo/journey/kalmunai-tea.webp", imageLabel: "KALMUNAI TEA MEMORY", ratio: "4:3", transition: "tea", zoom: 12.7 },
  { id: "kokkatticholai", name: "Kokkatticholai", kicker: "A RANDOM DAY OUT · 06", caption: "Random day out - namma Kalmunai pogum vazhiyila.", coordinates: [81.71667, 7.61667], coordinateLabel: "Kokkatticholai village public map point", image: "/api/story-photo/journey/kokkatticholai.webp", imageLabel: "KOKKATTICHOLAI MEMORY", ratio: "3:2", transition: "city", zoom: 13.5 },
  { id: "savukadi", name: "Savukadi", kicker: "LOVE STARTING MOMENTS · 07", caption: "Love peak moments… love start aana moments. time porathe teriyama love pannuna times.", coordinates: [81.669273,7.765301 ], coordinateLabel: "Savukkadi locality public map point", image: "/api/story-photo/journey/savukadi.webp", imageLabel: "SAVUKADI MEMORY", ratio: "3:2", transition: "coast", zoom: 14.1 },
  { id: "thooviyadi", name: "Thooviyadi", kicker: "ONE MORE COASTAL MEMORY · 08", caption: "usal spot, every 2 weeks study leavu ella leavukum pattuva meet pannura our gang spot", coordinates: [81.715955,7.722633], coordinateLabel: "Approximate public locality point", image: "/api/story-photo/journey/thooviyadi.webp", imageLabel: "THOOVIYADI MEMORY", ratio: "3:2", transition: "coast", zoom: 13.8 },
  { id: "knuckles", name: "Knuckles, Matale", kicker: "OUR SECOND TRIP · 09", caption: "Trip plan successful-a possible aana sambavem. friends-oda enjoy pannina camping memories.", coordinates: [80.8025, 7.413833], coordinateLabel: "Representative public point within the Knuckles range", image: "/api/story-photo/journey/knuckles-second-trip.webp", imageLabel: "KNUCKLES SECOND TRIP", ratio: "3:2", transition: "mountain", zoom: 10.9 },
  { id: "nuwara-eliya", name: "Nuwara Eliya", kicker: "OUR FIRST HILL-COUNTRY RIDE · 10", caption: "Couple bike long trip, chill cool climate, and my pattu-oda first real flower bouquet.", coordinates: [80.78286, 6.97078], coordinateLabel: "Nuwara Eliya town public map point", image: "/api/story-photo/journey/nuwara-eliya.webp", imageLabel: "NUWARA ELIYA MEMORY", ratio: "3:2", transition: "mountain", zoom: 12.5 },
  { id: "bellwood", name: "Bellwood, Kandy", kicker: "A QUIET MOUNTAIN RIDE · 11", caption: "Short day out - noise ellam vittu, quiet-a mountain bike ride pona naal.", coordinates: [80.6712, 7.2077], coordinateLabel: "Bellwood Colony locality", image: "/api/story-photo/journey/bellwood-kandy.webp", imageLabel: "BELLWOOD MEMORY", ratio: "3:2", transition: "mountain", zoom: 12.3 },
  { id: "peradeniya", name: "Peradeniya Railway Station", kicker: "GOODBYES & ARRIVALS · 12", caption: "Kandy-a vittu pogumbodhu heart-breaking place; thirumbi varumbodhu most exciting place.", coordinates: [80.590061, 7.257299], coordinateLabel: "Peradeniya Junction railway station", image: "/api/story-photo/journey/peradeniya-station.webp", imageLabel: "PERADENIYA STATION MEMORY", ratio: "3:2", transition: "rail", zoom: 14.2 },
  { id: "sri-dalada-maligawa", name: "Sri Dalada Maligawa", kicker: "A PEACEFUL KANDY VISIT · 13", caption: "Religious temple-oda amaidhi… peaceful-a irundha antha Kandy visit.", coordinates: [80.6386, 7.2939], coordinateLabel: "Sri Dalada Maligawa public map point", image: "/api/story-photo/journey/sri-dalada-maligawa.webp", imageLabel: "SRI DALADA MALIGAWA MEMORY", ratio: "3:2", transition: "city", zoom: 15.2 },
  { id: "kandy-lake-park", name: "Kandy Lake Park", kicker: "OUR EVERYDAY KANDY · 14", caption: "usal spot in kandy.", coordinates: [80.6389, 7.2921], coordinateLabel: "Kandy Lake public map point", image: "/api/story-photo/journey/kandy-lake-park.webp", imageLabel: "KANDY LAKE PARK MEMORY", ratio: "3:2", transition: "city", zoom: 14.8 },
  { id: "galle-face", name: "Colombo / Galle Face", kicker: "A DAY IN COLOMBO · 15", caption: "Just another day of our Colombo posh-life demo.", coordinates: [79.8435, 6.92655], coordinateLabel: "Galle Face Green public coastal point", image: "/api/story-photo/journey/galle-face-colombo.webp", imageLabel: "GALLE FACE MEMORY", ratio: "16:9", transition: "coast", zoom: 13.4 },
  { id: "mount-lavinia", name: "Mount Lavinia", kicker: "POSH COLOMBO LIFE · 16", caption: "colombo life da demo  .", coordinates: [79.86262, 6.84006], coordinateLabel: "Mount Lavinia Beach public shoreline point", image: "/api/story-photo/journey/mount-lavinia.webp", imageLabel: "MOUNT LAVINIA MEMORY", ratio: "3:2", transition: "coast", zoom: 13.5 },
];

export const memories: Memory[] = [
  { 
    id: "01", 
    title: "You, Always", 
    caption: "Silly moments and innocent smiles, wrapped in a love that knows no distance or time.", 
    rotation: -6, 
    image: "/api/story-photo/memories/memory-01.webp"  
  },
  { 
    id: "02", 
    title: "Simple Happiness", 
    caption: "A gaze I want to protect forever; the kind of joy that softens the world.", 
    rotation: 5, 
    image: "/api/story-photo/memories/memory-02.webp" 
  },
  { 
    id: "03", 
    title: "Your First Hero", 
    caption: "Admittedly a little jealous of his place in your heart, but inspired to love you just as honestly and deeply one day.", 
    rotation: -3, 
    image: "/api/story-photo/memories/memory-03.webp" 
  },
  { 
    id: "04", 
    title: "An Irreplaceable Space", 
    caption: "A void no one can ever fill... yet I know she watches over your progress, wrapping you in her eternal blessings from above.", 
    rotation: 7, 
    image: "/api/story-photo/memories/memory-04.webp" 
  },
  { 
    id: "05", 
    title: "The Wednesday Family", 
    caption: "The beautiful beginning of your story. Your true identity, your safe haven, and your nest.", 
    rotation: -5, 
    image: "/api/story-photo/memories/memory-06.webp" 
  },
  { 
    id: "06", 
    title: "The Day We Met", 
    caption: "The exact moment the universe shifted, and my timeline changed forever.", 
    rotation: 4, 
    image: "/api/story-photo/memories/memory-05.webp" 
  },
];

export const loveReasons: LoveReason[] = [
  {
    id: "01",
    title: "Your Unconditional Love",
    body: "The way you love me is beyond anything I could ever deserve or give in return. Your pure heart and ultimate devotion leave me speechless every single day.",
    image: "/api/story-photo/reasons/reason-01.webp",
  },
  {
    id: "02",
    title: "Your Kind & Respectful Soul",
    body: "Your gentle attitude, the respect you show me, and the way you always stand by my side make me feel like the luckiest person alive.",
    image: "/api/story-photo/reasons/reason-02.webp",
  },
  {
    id: "03",
    title: "Your Inner Child",
    body: "Your playful, cute, and playful nature brings light into my darkest moments. That childlike spirit in you is something I will protect forever.",
    image: "/api/story-photo/reasons/reason-03.webp",
  },
  {
    id: "04",
    title: "Your Breathtaking Beauty",
    body: "Your eyes, your hair, your gorgeous smile... I am completely addicted to every single detail of you, inside and out.",
    image: "/api/story-photo/reasons/reason-04.webp",
  },
  {
    id: "05",
    title: "Simply Everything About You",
    body: "I haven't just fallen in love with you; I fall for you again every second. You are my home, my addiction, and my entire world.",
    image: "/api/story-photo/reasons/reason-05.webp",
  },
];
