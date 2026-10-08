"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function LetterScene() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".letter-paragraph", {
        opacity: 0.5,
        y: 12,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 84%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section className="scene letter-scene" data-scene="8" id="letter" ref={root}>
      <div className="letter-paper">
        <p className="eyebrow">08 / A BIRTHDAY LETTER</p>
        <div className="letter-heading"><span className="letter-stamp" aria-hidden="true">♡</span><h2>For You</h2></div>
        <div className="letter-copy">
          <p className="letter-paragraph"><strong>Happy Birthday, my love.</strong> When I think of us, I remember the quiet moments as much as the big ones: conversations over tea, the sea beside us, and roads that somehow kept leading us back to each other. Even the hard goodbyes remind me how deeply I care. Wherever this next year takes us, I hope you feel as loved as you make me feel. Thank you for being exactly you. I would choose our ordinary days, our adventures, and every beginning all over again.</p>
          <p className="letter-signature letter-paragraph">Always yours,<span aria-hidden="true"> ♡</span></p>
        </div>
      </div>
    </section>
  );
}
