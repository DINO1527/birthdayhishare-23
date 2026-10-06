export type Coordinates = readonly [longitude: number, latitude: number];

export type EntranceQuestion = {
  id: string;
  question: string;
  hint: string;
  successMessage: string;
};

export type JourneyLocation = {
  id: string;
  name: string;
  kicker: string;
  caption: string;
  coordinates: Coordinates;
  coordinateLabel: string;
  image: string;
  imageLabel: string;
  ratio: "3:2" | "4:3" | "16:9";
  transition: "city" | "coast" | "tea" | "mountain" | "rail";
  zoom: number;
};

export type Memory = {
  id: string;
  title: string;
  caption: string;
  rotation: number;
  image: string;
  date?: string;
  location?: string;
};

export type LoveReason = {
  id: string;
  title: string;
  body: string;
  image: string;
};
