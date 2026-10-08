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
  const [selected, setSelected] = useState<(typeof memories)[number] | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
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
        setScrollProgress(Math.min(1, Math.max(0, -bounds.top / scrollableDistance)));
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
    gsap.from(".memory-card", { opacity: 0, y: 70, z: -90, scale: 0.9, rotateX: 10, rotateY: (index) => index % 2 === 0 ? -7 : 7, transformPerspective: 1100, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 84%" } });
    gsap.to(".memory-card:nth-child(odd)", { yPercent: -11, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.to(".memory-card:nth-child(even)", { yPercent: 7, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.to(".memories-scene .opening-florals", { yPercent: -18, z: 105, rotateX: 5, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    gsap.to(".memories-scene .opening-atmosphere", { yPercent: 13, z: -80, scale: 1.08, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    gsap.to(".memories-scene .garden-shadow", { yPercent: 22, scale: 1.12, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } });
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
      {showProgress && <div className="memory-progress" role="progressbar" aria-label="Photo archive scroll progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(scrollProgress * 100)}>
        <span className="memory-progress-label">PHOTO<br />ARCHIVE</span>
        <span className="memory-progress-track"><i style={{ transform: `scaleY(${scrollProgress})` }} /></span>
        <span className="memory-progress-count">{String(Math.min(memories.length, Math.floor(scrollProgress * memories.length) + 1)).padStart(2, "0")} / {String(memories.length).padStart(2, "0")}</span>
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
