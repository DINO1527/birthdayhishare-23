"use client";

import { useEffect, useRef, useState } from "react";
import { sceneLabels } from "@/data/story";
import { connectAudio, setAudioGain } from "@/lib/audio";

const sceneVolumes = [0.34, 0.5, 0.36, 0.46, 0.48, 0.4, 0.22, 0.26, 0.52];

export function MusicButton() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [scene, setScene] = useState(1);
  const [volumes, setVolumes] = useState(sceneVolumes);
  const [ducked, setDucked] = useState(false);
  const [status, setStatus] = useState("");
  const volume = volumes[scene - 1];

  useEffect(() => {
    const onScene = (event: Event) => setScene((event as CustomEvent<number>).detail);
    const onVoice = (event: Event) => setDucked((event as CustomEvent<boolean>).detail);
    const onHidden = () => { if (document.hidden) audioRef.current?.pause(); };
    window.addEventListener("birthday-scene-change", onScene);
    window.addEventListener("birthday-voice-playing", onVoice);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("birthday-scene-change", onScene);
      window.removeEventListener("birthday-voice-playing", onVoice);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) setAudioGain(audioRef.current, volume * (ducked ? 0.16 : 1), 0.45);
  }, [volume, ducked]);

  useEffect(() => {
    if (!playing || !analyser.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const bins = new Uint8Array(analyser.current.frequencyBinCount);
    let last = 0;
    const update = (time: number) => {
      if (time - last > 65 && analyser.current) {
        analyser.current.getByteFrequencyData(bins);
        const energy = bins.slice(1, 18).reduce((sum, value) => sum + value, 0) / (17 * 255);
        document.documentElement.style.setProperty("--music-energy", String(energy * (volume > 0 ? 1 : 0)));
        last = time;
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(frame); document.documentElement.style.setProperty("--music-energy", "0"); };
  }, [playing, volume]);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    try {
      const graph = await connectAudio(audio);
      analyser.current = graph.analyser;
      setAudioGain(audio, volume * (ducked ? 0.16 : 1));
      await audio.play();
      setStatus("");
    } catch { setStatus("Music could not start. Tap play to try again."); setExpanded(true); }
  }

  return <div className="music-control" onKeyDown={(event) => { if (event.key === "Escape") setExpanded(false); }}>
    <audio ref={audioRef} loop preload="none" src="/audio/background-music.mp3" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setStatus("Music is unavailable right now. Please try again."); }} />
    <div className="music-buttons">
      <button type="button" className={`round-icon music-toggle ${playing ? "is-active" : ""}`} onClick={toggle} aria-label={playing ? "Pause background music" : "Play background music"} aria-pressed={playing}>
        {playing ? <span className="music-bars" aria-hidden="true"><i /><i /><i /></span> : "♪"}
      </button>
      <button type="button" className="music-settings" onClick={() => setExpanded(!expanded)} aria-label="Music volume settings" aria-expanded={expanded} aria-controls="music-panel">⌄</button>
    </div>
    {expanded && <div className="music-panel" id="music-panel">
      <div className="music-panel-heading"><div><span className="eyebrow">OUR SOUNDTRACK</span><strong>Pesamale</strong></div><button type="button" onClick={() => setExpanded(false)} aria-label="Close music settings">×</button></div>
      <label htmlFor="music-volume">{sceneLabels[scene - 1]} <span>{Math.round(volume * 100)}%</span></label>
      <input id="music-volume" type="range" min="0" max="100" value={Math.round(volume * 100)} onChange={(event) => setVolumes((previous) => previous.map((value, index) => index === scene - 1 ? Number(event.target.value) / 100 : value))} />
      <p>{ducked ? "Softened while your voice note plays." : "A gentle mix for each chapter."}</p>
      <button type="button" className="music-mute" onClick={() => setVolumes((previous) => previous.map((value, index) => index === scene - 1 ? value > 0 ? 0 : sceneVolumes[index] : value))}>{volume > 0 ? "Mute this chapter" : "Unmute this chapter"}</button>
      {status && <p role="status">{status}</p>}
    </div>}
  </div>;
}
