"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { BotanicalBackdrop } from "@/components/ui/BotanicalBackdrop";
import { StoryImage } from "@/components/ui/StoryImage";
import { announceVoice, connectAudio, setAudioGain } from "@/lib/audio";

const formatTime = (time: number) => `${Math.floor(time / 60).toString().padStart(2, "0")}:${Math.floor(time % 60).toString().padStart(2, "0")}`;

export function VoiceScene({ source = "/audio/voice-preview.wav", sample = true }: { source?: string; sample?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState("");
  const progress = duration ? time / duration : 0;

  useEffect(() => {
    const audio = audioRef.current;
    const syncDuration = () => { if (audio && Number.isFinite(audio.duration)) setDuration(audio.duration); };
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
      const playback = audio.play();
      await Promise.all([playback, connectAudio(audio)]);
      setAudioGain(audio, 0.85, 0.15);
      setStatus("");
    } catch { setStatus("Tap play to hear the message again."); }
  }

  function seek(event: PointerEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!audio || !duration || !bounds.width) return;
    const fraction = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const nextTime = fraction * duration;
    audio.currentTime = nextTime;
    setTime(nextTime);
  }

  function seekByKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const step = event.shiftKey ? 10 : 5;
    const nextTime = event.key === "Home" ? 0 : event.key === "End" ? duration : event.key === "ArrowRight" || event.key === "PageUp" ? Math.min(duration, time + step) : event.key === "ArrowLeft" || event.key === "PageDown" ? Math.max(0, time - step) : null;
    if (nextTime === null) return;
    event.preventDefault();
    audio.currentTime = nextTime;
    setTime(nextTime);
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
        onError={() => { setPlaying(false); announceVoice(false); setStatus("The recording is unavailable right now."); }}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)} />
      <div className="voice-player">
        <button type="button" className="voice-play" onClick={toggle} aria-label={playing ? "Pause voice message" : "Play voice message"}>
          <svg viewBox="0 0 40 40" aria-hidden="true">{playing ? <path d="M11 8h6v24h-6zm12 0h6v24h-6z" /> : <path d="M12 6l23 14-23 14z" />}</svg>
        </button>
        <div ref={waveformRef} className="waveform waveform-scrubber" role="slider" aria-label="Seek through voice message on the waveform" aria-valuemin={0} aria-valuemax={Math.round(duration)} aria-valuenow={Math.round(time)} aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`} tabIndex={duration ? 0 : -1} onPointerDown={(event) => { if (!duration) return; event.currentTarget.setPointerCapture(event.pointerId); seek(event); }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) seek(event); }} onKeyDown={seekByKeyboard}>
          {Array.from({ length: 48 }, (_, index) => <i key={index} className={index / 48 <= progress ? "is-played" : ""} style={{ height: `${12 + Math.sin(index * 1.7) ** 2 * Math.sin(index / 47 * Math.PI) * 80}%`, animationDelay: `${index * -0.11}s` }} />)}
        </div>
        <p className="voice-caption">{sample ? "A LITTLE SAMPLE · TAP THE WAVE TO REPLAY" : "JUST MY VOICE. JUST FOR YOU."}</p>
        {status && <p className="asset-note" role="status">{status}</p>}
      </div>
    </div>
  </section>;
}
