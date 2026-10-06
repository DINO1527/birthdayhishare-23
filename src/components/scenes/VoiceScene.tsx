"use client";

import { useEffect, useRef, useState } from "react";

export function VoiceScene() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [available, setAvailable] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/audio/voice-message.mp3", { method: "HEAD" })
      .then((response) => { if (active) setAvailable(response.ok); })
      .catch(() => { if (active) setAvailable(false); });
    return () => { active = false; };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
        setStatus("Playing your voice message…");
      }
    } catch {
      setStatus("The recording could not play right now.");
    }
  }

  return (
    <section className="scene voice-scene" data-scene="7" id="voice">
      <div className="voice-blur" aria-hidden="true" />
      <div className={`voice-background ${playing ? "is-playing" : ""}`} aria-hidden="true" />
      <div className="section-heading centered voice-content">
        <p className="eyebrow">07 / LISTEN</p>
        <h2>A Few Words<br />From Me</h2>
        <p>{available ? "Press play and listen to my heart." : "Some feelings deserve their own quiet moment."}</p>

        {available ? <><audio
          ref={audioRef}
          src="/audio/voice-message.mp3"
          preload="metadata"
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) => {
            const el = event.currentTarget;
            setProgress(el.duration ? el.currentTime / el.duration : 0);
          }}
        />

        <button type="button" className="voice-play" onClick={toggle} aria-label={playing ? "Pause voice message" : "Play voice message"}>
          {playing ? "Ⅱ" : "▶"}
        </button>

        <div className="waveform" aria-hidden="true">
          {Array.from({ length: 44 }).map((_, index) => (
            <i
              key={index}
              className={index / 44 <= progress ? "is-played" : ""}
              style={{ height: `${20 + ((index * 17) % 62)}%` }}
            />
          ))}
        </div>
        {status && <p className="asset-note">{status}</p>}</> : (
          <div className="voice-written"><p>Across every place we&apos;ve been, my favourite part has always been you.</p><p>I hope you hear that in every little thing I do.</p></div>
        )}
      </div>
    </section>
  );
}
