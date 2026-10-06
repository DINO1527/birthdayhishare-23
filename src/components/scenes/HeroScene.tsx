"use client";

import { useRef } from "react";
import { StoryImage } from "@/components/ui/StoryImage";
import { gsap, useGSAP } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HeroScene() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".hero-reveal", {
        y: 24,
        opacity: 0.32,
        duration: 0.75,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 86%" },
      });
      gsap.to(".hero-photo", {
        yPercent: 7,
        scale: 1.045,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section className="scene hero-scene" data-scene="2" id="hero" ref={root}>
      <div className="hero-copy">
        <p className="eyebrow hero-reveal">02 / HAPPY BIRTHDAY</p>
        <h2 className="hero-reveal">Happy Birthday,<br />My Love.</h2>
        <p className="hero-sub hero-reveal">You make ordinary days unforgettable.</p>
      </div>
      <StoryImage src="/api/story-photo/hero/couple-hero.webp" alt="A portrait of us together" label="COUPLE HERO PHOTO · 4:5" className="hero-photo" eager sizes="(max-width: 900px) 92vw, 52vw" />
      <div className="scroll-cue">SCROLL <span>↓</span></div>
    </section>
  );
}
