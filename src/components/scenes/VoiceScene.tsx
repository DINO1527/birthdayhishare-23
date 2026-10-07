"use client";

import { useEffect, useRef, useState } from "react";
import { BotanicalBackdrop } from "@/components/ui/BotanicalBackdrop";
import { StoryImage } from "@/components/ui/StoryImage";
import { announceVoice, connectAudio, setAudioGain } from "@/lib/audio";

const formatTime = (time: number) => `${Math.floor(time / 60).toString().padStart(2, "0")}:${Math.floor(time % 60).toString().padStart(2, "0")}`;

export function VoiceScene({ source = "/audio/voice-preview.wav", sample = true }: { source?: string; sample?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [status, setStatus] = useState("");
  const progress = duration ? time / duration : 0;

  useEffect(() => {
    const audio = audioRef.current;
    // Cached metadata can arrive before React attaches its event handlers.
    const syncDuration = () => {
      if (audio && Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    syncDuration();
    audio?.addEventListener("durationchange", syncDuration);
    audio?.addEventListener("loadedmetadata", syncDuration);
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) audio?.pause(); }, { threshold: 0.1 });
    if (root.current) observer.observe(root.current);
    const onHidden = () => { if (document.hidden) audio?.pause(); };
    document.addEventListener("visibilitychange", onHidden);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onHidden); audio?.removeEventListener("durationchange", syncDuration); audio?.removeEventListener("loadedmetadata", syncDuration); audio?.pause(); announceVoice(false); };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    try {
      await connectAudio(audio);
      setAudioGain(audio, volume);
      await audio.play();
      setStatus("");
    } catch { setStatus("The recording could not play. Tap play to try again."); }
  }

  return <section className={`scene voice-scene ${playing ? "is-playing" : ""}`} data-scene="7" id="voice" ref={root}>
    <StoryImage src="/api/story-photo/hero/couple-hero.webp" alt="" label="" className="voice-portrait" />
    <div className="voice-blur" aria-hidden="true" />
    <BotanicalBackdrop />
    <div className="section-heading centered voice-content">
      <p className="eyebrow">07 / LISTEN</p>
      <h2>A Few Words<br />From Me</h2>
      <p className="voice-subtitle">Press play and listen to my heart.</p>
      <div className="story-ornament" aria-hidden="true"><span />✦<span /></div>
      <audio ref={audioRef} src={source} preload="metadata"
        onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
        onPlay={() => { setPlaying(true); announceVoice(true); }}
        onPause={() => { setPlaying(false); announceVoice(false); }}
        onEnded={() => { setPlaying(false); announceVoice(false); }}
        onError={() => { setPlaying(false); announceVoice(false); setStatus("The recording is unavailable. Please try again later."); }}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)} />
      <div className="voice-player">
        <button type="button" className="voice-play" onClick={toggle} aria-label={playing ? "Pause voice message" : "Play voice message"}>
          <svg viewBox="0 0 40 40" aria-hidden="true">{playing ? <path d="M11 8h6v24h-6zm12 0h6v24h-6z" /> : <path d="M12 6l23 14-23 14z" />}</svg>
        </button>
        <div className="waveform" aria-hidden="true">{Array.from({ length: 48 }, (_, index) => <i key={index} className={index / 48 < progress ? "is-played" : ""} style={{ height: `${12 + Math.sin(index * 1.7) ** 2 * Math.sin(index / 47 * Math.PI) * 80}%`, animationDelay: `${index * -0.11}s` }} />)}</div>
        <label className="sr-only" htmlFor="voice-seek">Voice message progress</label>
        <input id="voice-seek" className="voice-seek" type="range" min="0" max={duration || 1} step="0.1" value={time} disabled={!duration} onChange={(event) => { const value = Number(event.target.value); if (audioRef.current) audioRef.current.currentTime = value; setTime(value); }} />
        <div className="voice-time"><span>{formatTime(time)}</span><span>/</span><span>{formatTime(duration)}</span></div>
        <p className="voice-caption">{sample ? "SAMPLE VOICE NOTE · A LITTLE PREVIEW" : "JUST MY VOICE. JUST FOR YOU."}</p>
        <label className="voice-volume" htmlFor="voice-volume"><span>Voice volume</span><input id="voice-volume" type="range" min="0" max="100" value={Math.round(volume * 100)} onChange={(event) => { const value = Number(event.target.value) / 100; setVolume(value); if (audioRef.current) setAudioGain(audioRef.current, value); }} /><span>{Math.round(volume * 100)}%</span></label>
        {status && <p className="asset-note" role="status">{status}</p>}
      </div>
    </div>
  </section>;
}
