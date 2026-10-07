"use client";

import { useEffect, useState } from "react";
import { sceneLabels } from "@/data/story";

export function SceneProgress() {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("birthday-scene-change", { detail: current }));
  }, [current]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    if (!sections.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const focusLine = window.innerHeight * 0.48;
      const active = sections.find((section) => {
        const box = section.getBoundingClientRect();
        return box.top <= focusLine && box.bottom > focusLine;
      });
      if (active) setCurrent(Number(active.dataset.scene ?? 1));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <aside className="scene-progress" aria-label="Story progress">
      <div className="scene-count">
        {String(current).padStart(2, "0")} <span>/ {String(sceneLabels.length).padStart(2, "0")}</span>
      </div>
      <div className="scene-progress-track">
        <span style={{ width: `${(current / sceneLabels.length) * 100}%` }} />
      </div>
      <div className="scene-label">{sceneLabels[current - 1]}</div>
    </aside>
  );
}
