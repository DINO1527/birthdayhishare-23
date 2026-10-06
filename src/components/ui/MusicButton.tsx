"use client";

import { useEffect, useRef, useState } from "react";

export function MusicButton() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/audio/background-music.mp3", { method: "HEAD" })
      .then((response) => { if (active) setMissing(!response.ok); })
      .catch(() => { if (active) setMissing(true); });
    return () => { active = false; };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio || missing) return;

    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
      }
    } catch {
      setMissing(true);
      setPlaying(false);
    }
  }

  if (missing) return null;

  return (
    <div className="music-control">
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="/audio/background-music.mp3"
        onError={() => setMissing(true)}
      />
      <button
        type="button"
        className={`round-icon ${playing ? "is-active" : ""}`}
        onClick={toggle}
        aria-label={playing ? "Pause background music" : "Play background music"}
        title="Background music"
      >
        {playing ? "Ⅱ" : "♪"}
      </button>
    </div>
  );
}
