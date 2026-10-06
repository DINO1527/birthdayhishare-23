"use client";

import { useRef } from "react";
import { loveReasons } from "@/data/story";
import { StoryImage } from "@/components/ui/StoryImage";
import { gsap, useGSAP } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function LoveReasonsScene() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".reason-row", {
        opacity: 0.45,
        y: 24,
        duration: 0.7,
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      });
      gsap.from(".reason-rule", { scaleX: 0, transformOrigin: "left", stagger: 0.08, scrollTrigger: { trigger: root.current, start: "top 82%" } });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section className="scene reasons-scene" data-scene="6" id="reasons" ref={root}>
      <div className="section-heading">
        <p className="eyebrow">06 / JUST YOU</p>
        <h2>Things I Love<br />About You</h2>
        <p>A few reasons you make my world brighter.</p>
      </div>

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
