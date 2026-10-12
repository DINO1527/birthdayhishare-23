"use client";

import { useEffect, useRef, useState } from "react";
import { memories } from "@/data/story";
import { StoryImage } from "@/components/ui/StoryImage";
import { gsap, useGSAP } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useOverlayLock } from "@/hooks/useOverlayLock";
import { BotanicalBackdrop } from "@/components/ui/BotanicalBackdrop";

export function MemoriesScene() {
  const root = useRef<HTMLElement>(null);
  const progressIndicator = useRef<HTMLDivElement>(null);
  const progressFill = useRef<HTMLElement>(null);
  const progressCount = useRef<HTMLSpanElement>(null);
  const [selected, setSelected] = useState<(typeof memories)[number] | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const reduced = useReducedMotion();
  useOverlayLock(Boolean(selected));

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect();
        const scrollableDistance = Math.max(1, bounds.height - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -bounds.top / scrollableDistance));
        const currentMemory = Math.min(memories.length, Math.floor(progress * memories.length) + 1);
        progressFill.current?.style.setProperty("transform", `scaleY(${progress})`);
        progressIndicator.current?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
        if (progressCount.current) {
          progressCount.current.textContent = `${String(currentMemory).padStart(2, "0")} / ${String(memories.length).padStart(2, "0")}`;
        }
      });
    };
    const observer = new IntersectionObserver(([entry]) => setShowProgress(entry.isIntersecting), { threshold: 0 });
    observer.observe(section);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useGSAP(() => {
    if (reduced) return;
    gsap.utils.toArray<HTMLElement>(".memory-card").forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 32,
        z: -24,
        scale: 0.97,
        rotateX: 3,
        rotateY: index % 2 === 0 ? -2 : 2,
        transformPerspective: 1100,
        duration: 0.72,
        ease: "power2.out",
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
      });
    });
    gsap.to(".memories-scene .opening-florals", { yPercent: -12, z: 45, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    gsap.to(".memories-scene .opening-atmosphere", { yPercent: 8, scale: 1.04, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    gsap.to(".memories-scene .garden-shadow", { yPercent: 12, scale: 1.06, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } });
  }, { scope: root, dependencies: [reduced] });

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);

  return (
    <section className="scene memories-scene" data-scene="5" id="memories" ref={root}>
      <BotanicalBackdrop />
      <div className="section-heading">
        <p className="eyebrow">05 / PHOTO ARCHIVE</p>
        <h2>A Few Beautiful<br />Moments</h2>
        <p>Snapshots from a journey I&apos;m grateful for.</p>
      </div>
      {showProgress && <div className="memory-progress" ref={progressIndicator} role="progressbar" aria-label="Photo archive scroll progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
        <span className="memory-progress-label">PHOTO<br />ARCHIVE</span>
        <span className="memory-progress-track"><i ref={progressFill} /></span>
        <span className="memory-progress-count" ref={progressCount}>{String(1).padStart(2, "0")} / {String(memories.length).padStart(2, "0")}</span>
      </div>}
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
