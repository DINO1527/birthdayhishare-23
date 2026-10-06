"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { StoryImage } from "@/components/ui/StoryImage";
import { useOverlayLock } from "@/hooks/useOverlayLock";

export function FinalScene() {
  const root = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useOverlayLock(revealed);

  useEffect(() => {
    if (!revealed) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setRevealed(false); };
    window.addEventListener("keydown", close);
    return () => { window.removeEventListener("keydown", close); trigger?.focus(); };
  }, [revealed]);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".final-reveal", {
        opacity: 0.35,
        y: 22,
        stagger: 0.1,
        duration: 0.75,
        scrollTrigger: { trigger: root.current, start: "top 84%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section className="scene final-scene" data-scene="9" id="finale" ref={root}>
      <div className="final-stars" aria-hidden="true" />
      <div className="final-content">
        <p className="eyebrow final-reveal">09 / ALWAYS</p>
        <h2 className="final-reveal">Out of all the places,<br />our paths crossed.</h2>
        <p className="final-kicker final-reveal">And I&apos;m so grateful you&apos;re here.</p>
        <StoryImage src="/api/story-photo/ending/final-couple.webp" alt="The two of us together" label="FINAL COUPLE PHOTO" className="final-photo final-reveal" sizes="(max-width: 900px) 72vw, 390px" />
        <h3 className="final-reveal">Happy Birthday,<br />My Love.</h3>
        <button type="button" ref={triggerRef} className="final-button final-reveal" onClick={() => setRevealed(true)}>
          My Wish For You <span>→</span>
        </button>
      </div>

      {revealed && (
        <div className="final-modal" role="dialog" aria-modal="true" aria-label="Final birthday surprise">
          <button type="button" ref={closeRef} className="modal-close" onClick={() => setRevealed(false)} aria-label="Close">×</button>
          <p className="eyebrow">ONE LAST WISH</p>
          <h3>For every tomorrow.</h3>
          <p>May this year be gentle with your heart and brave with your dreams. Whatever comes, I hope we keep finding joy in the little things—and keep finding our way to each other.</p>
        </div>
      )}
    </section>
  );
}
