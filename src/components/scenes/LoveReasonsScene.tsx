"use client";

import { useRef } from "react";
import { loveReasons } from "@/data/story";
import { StoryImage } from "@/components/ui/StoryImage";
import { gsap, useGSAP } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BotanicalBackdrop } from "@/components/ui/BotanicalBackdrop";

export function LoveReasonsScene() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>(".reason-row").forEach((row) => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", toggleActions: "play none none reverse" } });
        timeline.from(row, { opacity: 0.2, y: 32, duration: 0.8, ease: "power2.out" })
          .from(row.querySelector(".reason-number"), { y: 16, opacity: 0, duration: 0.6 }, 0.12)
          .from(row.querySelector(".reason-photo"), { scale: 0.94, duration: 1 }, 0);
        const rule = row.querySelector(".reason-rule");
        if (rule) timeline.from(rule, { scaleX: 0, transformOrigin: "left", duration: 0.9 }, 0.1);
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section className="scene reasons-scene" data-scene="6" id="reasons" ref={root}>
      <BotanicalBackdrop />
      <div className="section-heading centered">
        <p className="eyebrow">06 / JUST YOU</p>
        <h2>Things I Love<br />About You</h2>
        <p>A few reasons you make my world brighter.</p>
      </div>

      <div className="story-ornament" aria-hidden="true"><span />✦<span /></div>
      <div className="reasons-list">
        {loveReasons.map((reason, index) => (
          <article className="reason-row" key={reason.id}>
            <span className="reason-number">{reason.id}</span>
            <div className="reason-copy">
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
            </div>
            <StoryImage src={reason.image} alt={`Photograph for ${reason.title}`} label={`LOVE REASON ${reason.id}`} className="reason-photo" />
            {index < loveReasons.length - 1 && <div className="reason-rule" />}
          </article>
        ))}
      </div>
    </section>
  );
}
