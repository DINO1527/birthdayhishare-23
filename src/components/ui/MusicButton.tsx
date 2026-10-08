"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { connectAudio, setAudioGain } from "@/lib/audio";

const chapterVolume = [0.38, 0.45, 0.38, 0.43, 0.44, 0.42, 0.2, 0.24, 0.46];
const lyricLineCount = 34;

export function MusicButton() {
  const controlRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const activeChapter = useRef(1);
  const voicePlaying = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [error, setError] = useState(false);

  const lyricLines = [
    "தீம்", "தனனா தீம்", "ததீம் தனனா தீம்", "தீம், தனனா தீம், தனனா-நனா தீம்", "ததீம் தனனா தீம், தான நானா தீம்", "தீம், தனனா தீம், தனனா-நனா தீம்", "ததீம் தனனா தீம்",
    "காதல் வாராதோ, தூரம் போகாதோ?", "கண்கள் ஏங்காதோ காற்றில்?", "பேசாமலே காதல் வாராதோ?", "நீங்காமலே தூரம் போகாதோ?", "காதல் வாராதோ, தூரம் போகாதோ?", "கண்கள் ஏங்காதோ, காற்றில் கரையாதோ?", "காதல் வாராதோ, தூரம் போகாதோ?", "கண்கள் ஏங்காதோ, காற்றில் கரையாதோ?", "காதலே கண்ணீருமாய் கரைந்தாய்", "காதலே கண்ணீருமாய் கரைந்தாய்",
    "संत बताशी जोड़, तेरे हरि", "साधु बताशी जोड़", "संत बताशी जोड़, तेरे हरि", "साधु बताशी जोड़",
    "மனமொழியில் பேசும் மதி இரவை காண", "விழிமொழியில் பேச ஏங்காதோ?", "பகலிரவை காண, பனிமலரை தேட", "பிழை புரியும் நேரம் வாராதோ?", "உன் பார்வை பார்த்திருந்தேன், காலம் காத்திருந்தேன்", "நெஞ்சம் பொய் சொன்னதே, காதல் என்றுரைத்தேன்", "உன் பார்வை பார்த்திருந்தேன், காலம் காத்திருந்தேன்", "நெஞ்சம் பொய் சொன்னதே, காதல் என்றுரைத்தேன்",
    "காதல் வாராதோ, தூரம் போகாதோ?", "கண்கள் ஏங்காதோ, காற்றில் கரையாதோ?", "காதல் வாராதோ, தூரம் போகாதோ?", "கண்கள் ஏங்காதோ, காற்றில் கரையாதோ?", "காதலே கண்ணீருமாய் கரைந்தாய்", "காதலே கண்ணீருமாய் கரைந்தாய்",
  ];

  const startMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      // Request playback in the click stack so iOS and mobile Chrome accept it.
      const playback = audio.play();
      const [graph] = await Promise.all([connectAudio(audio), playback]);
      analyserRef.current = graph.analyser;
      setAudioGain(audio, chapterVolume[activeChapter.current - 1] * (voicePlaying.current ? 0.18 : 1), 1.1);
      setError(false);
    } catch { setError(true); }
  }, []);

  const stopMusic = useCallback(() => audioRef.current?.pause(), []);

  useEffect(() => {
    const onGesture = () => { setExpanded(true); void startMusic(); };
    const onScene = (event: Event) => {
      const next = (event as CustomEvent<number>).detail;
      if (!Number.isInteger(next)) return;
      activeChapter.current = Math.max(1, Math.min(chapterVolume.length, next));
      const audio = audioRef.current;
      if (audio && !audio.paused) setAudioGain(audio, chapterVolume[activeChapter.current - 1] * (voicePlaying.current ? 0.18 : 1), 0.8);
    };
    const onVoice = (event: Event) => {
      voicePlaying.current = (event as CustomEvent<boolean>).detail;
      const audio = audioRef.current;
      if (audio && !audio.paused) setAudioGain(audio, chapterVolume[activeChapter.current - 1] * (voicePlaying.current ? 0.18 : 1), 0.7);
    };
    const onVisibility = () => { if (document.hidden) stopMusic(); };
    window.addEventListener("birthday-story-music-start", onGesture);
    window.addEventListener("birthday-scene-change", onScene);
    window.addEventListener("birthday-voice-playing", onVoice);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("birthday-story-music-start", onGesture);
      window.removeEventListener("birthday-scene-change", onScene);
      window.removeEventListener("birthday-voice-playing", onVoice);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [startMusic, stopMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const syncTime = () => {
      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 180;
      setCurrentLine(Math.min(lyricLineCount - 1, Math.floor((audio.currentTime / duration) * lyricLineCount)));
    };
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("seeked", syncTime);
    return () => { audio.removeEventListener("timeupdate", syncTime); audio.removeEventListener("seeked", syncTime); };
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const collapseOutside = (event: PointerEvent) => {
      if (!controlRef.current?.contains(event.target as Node)) setExpanded(false);
    };
    const collapseOnScroll = () => setExpanded(false);
    document.addEventListener("pointerdown", collapseOutside);
    window.addEventListener("scroll", collapseOnScroll, true);
    return () => {
      document.removeEventListener("pointerdown", collapseOutside);
      window.removeEventListener("scroll", collapseOnScroll, true);
    };
  }, [expanded]);

  useEffect(() => {
    if (!playing || !analyserRef.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let last = 0;
    const bins = new Uint8Array(analyserRef.current.frequencyBinCount);
    const readBeat = (time: number) => {
      if (time - last > 65 && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(bins);
        const energy = bins.slice(1, 18).reduce((sum, value) => sum + value, 0) / (17 * 255);
        document.documentElement.style.setProperty("--music-energy", String(energy));
        last = time;
      }
      frame = requestAnimationFrame(readBeat);
    };
    frame = requestAnimationFrame(readBeat);
    return () => { cancelAnimationFrame(frame); document.documentElement.style.setProperty("--music-energy", "0"); };
  }, [playing]);

  function tapFloatingButton() {
    if (expanded) setExpanded(false);
    else {
      setExpanded(true);
      if (!playing) void startMusic();
    }
  }

  function pauseOrPlay() {
    if (playing) stopMusic();
    else void startMusic();
  }

  return <div ref={controlRef} className={`music-control ${expanded ? "is-expanded" : ""} ${playing ? "is-playing" : ""}`}>
    <audio ref={audioRef} loop preload="none" src="/audio/background-music.mp3" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setError(true); }} />
    <button type="button" className={`music-float ${playing ? "is-playing" : ""}`} onClick={tapFloatingButton} aria-label={expanded ? "Collapse music player" : playing ? "Expand music player" : "Play Pesamale"} aria-expanded={expanded}>
      <span className="music-pulse" aria-hidden="true" />
      <span className="music-note" aria-hidden="true">{playing ? <span className="music-wave"><i /><i /><i /><i /><i /></span> : "♪"}</span>
      <Image src="/images/pesamale-cover.png" alt="" width={52} height={52} className="music-button-cover" />
    </button>
    <div className={`music-card ${expanded ? "is-revealed" : ""}`} aria-hidden={!expanded}>
      <div className="music-details"><strong>Pesamale</strong><span>Sony Music South · 2026</span></div>
      <div className="music-lyrics" aria-label="Pesamale lyrics">
        <div className="music-lyrics-window" aria-live="polite" aria-atomic="true">
          {lyricLines.map((line, index) => <p key={index} className={index === currentLine ? "is-current" : ""}>{line}</p>)}
        </div>
      </div>
      <button type="button" className="music-play-toggle" onClick={pauseOrPlay} tabIndex={expanded ? 0 : -1} aria-label={playing ? "Pause Pesamale" : "Play Pesamale"}>{playing ? "Ⅱ" : "▶"}</button>
      {error && <span className="music-error" role="status">Tap play to try again</span>}
    </div>
  </div>;
}
