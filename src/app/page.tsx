import { OpeningScene } from "@/components/scenes/OpeningScene";
import { HeroScene } from "@/components/scenes/HeroScene";
import { StoryMapScene } from "@/components/scenes/StoryMapScene";
import { TimelineScene } from "@/components/scenes/TimelineScene";
import { MemoriesScene } from "@/components/scenes/MemoriesScene";
import { LoveReasonsScene } from "@/components/scenes/LoveReasonsScene";
import { VoiceScene } from "@/components/scenes/VoiceScene";
import { LetterScene } from "@/components/scenes/LetterScene";
import { FinalScene } from "@/components/scenes/FinalScene";
import { SceneProgress } from "@/components/ui/SceneProgress";
import { SceneLandingTransitions } from "@/components/ui/SceneLandingTransitions";
import { MusicButton } from "@/components/ui/MusicButton";
import { existsSync } from "node:fs";
import { join } from "node:path";

export default function Home() {
  const hasVoice = existsSync(join(process.cwd(), "public/audio/voice-message.mp3"));
  return (
    <main>
      <SceneLandingTransitions />
      <SceneProgress />
      <MusicButton />
      <OpeningScene />
      <HeroScene />
      <StoryMapScene />
      <TimelineScene />
      <MemoriesScene />
      <LoveReasonsScene />
      <VoiceScene source={hasVoice ? "/audio/voice-message.mp3" : "/audio/voice-preview.wav"} sample={!hasVoice} />
      <LetterScene />
      <FinalScene />
    </main>
  );
}
