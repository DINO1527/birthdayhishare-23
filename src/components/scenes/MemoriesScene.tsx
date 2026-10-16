"use client";

import { useEffect, useState } from "react";
import { memories } from "@/data/story";
import { StoryImage } from "@/components/ui/StoryImage";
import { useOverlayLock } from "@/hooks/useOverlayLock";
import { BotanicalBackdrop } from "@/components/ui/BotanicalBackdrop";

export function MemoriesScene() {
  const [selected, setSelected] = useState<(typeof memories)[number] | null>(null);
  useOverlayLock(Boolean(selected));

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);

  return (
    <section className="scene memories-scene" data-scene="5" id="memories">
      <BotanicalBackdrop />
      <div className="section-heading">
        <p className="eyebrow">05 / PHOTO ARCHIVE</p>
        <h2><span className="scene-title-line">A Few Beautiful</span><span className="scene-title-line">Moments</span></h2>
        <p>Snapshots from a journey I&apos;m grateful for.</p>
      </div>
      <div className="memory-cloud">
        {memories.map((memory) => (
          <button className="memory-card" key={memory.id} style={{ rotate: `${memory.rotation}deg` }} onClick={() => setSelected(memory)} aria-label={`Open memory ${memory.id}: ${memory.title}`}>
            <StoryImage src={memory.image} alt={memory.title} label={`MEMORY ${memory.id}`} />
            <div><p className="eyebrow">MEMORY {memory.id}</p><h3>{memory.title}</h3><p>{memory.caption}</p></div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="memory-lightbox" role="dialog" aria-modal="true" aria-label={`Memory ${selected.id}`} onClick={() => setSelected(null)}>
          <div className="memory-lightbox-card" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="Close memory">×</button>
            <StoryImage src={selected.image} alt={selected.title} label={`MEMORY ${selected.id}`} sizes="(max-width: 900px) 90vw, 700px" />
            <div><p className="eyebrow">MEMORY {selected.id}{selected.date ? ` · ${selected.date}` : ""}</p><h3>{selected.title}</h3>{selected.location && <p className="memory-location">{selected.location}</p>}<p>{selected.caption}</p></div>
          </div>
        </div>
      )}
    </section>
  );
}
