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
      gsap.from(".letter-paper", {
        opacity: 0,
        y: 38,
        rotateX: 5,
        scale: 0.985,
        transformOrigin: "50% 80%",
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
      });
      gsap.from(".letter-paragraph", {
        opacity: 0,
        y: 16,
        duration: 0.72,
        stagger: 0.16,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });
      gsap.from(".letter-pin", {
        opacity: 0,
        scale: 0.55,
        rotate: -18,
        duration: 0.7,
        stagger: 0.12,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section className="scene letter-scene" data-scene="8" id="letter" ref={root}>
      <div className="letter-paper">
        <div className="letter-pin letter-pin-top" aria-hidden="true"><i /><i /><i /><i /><i /><b /><span /></div>
        <div className="letter-pin letter-pin-bottom" aria-hidden="true"><i /><i /><i /><i /><i /><b /><span /></div>
        <p className="eyebrow">08 / A BIRTHDAY LETTER</p>
        <div className="letter-heading"><span className="letter-stamp" aria-hidden="true">♡</span><h2>For You</h2></div>
        <div className="letter-copy" role="region" tabIndex={0} aria-label="Birthday letter">
          <p className="letter-paragraph"><strong>Happy Birthday, my love.</strong> Happy Birthday, My Precious Pattu Ma! 🎂💖✨</p>
          <p className="letter-paragraph">You are the absolute gem of my life and the love of my whole world! 💎 You know how people say the sunrise is beautiful? It really is, because my girl came into my life like a bright new day. 🌅</p>
          <p className="letter-paragraph">En irundhu pona vaazhkaiyil oli eathi vacha en kuthu vilakku... ena maayam senju ena thookuna di! ✨</p>
          <p className="letter-paragraph">Theoretically, practically, and honestly speaking, I am never the type of person to fall into this kind of love so suddenly. But what kind of magic did you cast on me? How did I fall so deeply in love with you? You completely spellbound me with those gorgeous eyes... 👀💫</p>
          <p className="letter-paragraph">You are my best part, my absolute everything. Even if you weren&apos;t my very first love, true and unconditional love is something I only experienced after I found my Pattu. What a truly beautiful life this is with you! Through all my ups and downs, you have stood by me as the most perfect, comforting, and ultimate companion. 👩‍❤️‍👨</p>
          <p className="letter-paragraph">I am so proud of you, I am jealous of you, and I am completely crazy about you! 🤪 You are such a glorious, breathtaking person. Happy Birthday to the absolute love of my life, my precious angel! From the moment you walked into my world, you transformed ordinary days into pure magic. Today, I just want to remind you how deeply and hopelessly addicted I am to every single detail of you. 🪄👑</p>
          <p className="letter-paragraph">Unnodaiya pure heart, unoda ultimate love, and the deep respect you show me leave me breathless—you love me so unconditionally that even I feel I can never match the beauty of your soul. Unoda gorgeous eyes, unoda soft hair, that mesmerising smile, unoda cute childlike nature, and unoda angelic kindness... every single part of you makes me fall in love with you all over again, every single second! 🌸🌷</p>
          <p className="letter-paragraph">Nee en vaazhkaiyil vandha dheyvadhai, en home, en peace, and en entire universe. 🏡🕊️ On this special day, I promise to protect that innocent child inside you, cherish your gentle heart forever, and adore you more with each passing breath.</p>
          <p className="letter-paragraph">Happy Birthday, my beautiful queen-may your life be as radiant, sweet, and breathtaking as the love you give me every single day! 💖👑 Infinity love you, my everything! ♾️❤️</p>
          <p className="letter-signature letter-paragraph">Always yours,<span aria-hidden="true"> ♡</span></p>
        </div>
      </div>
    </section>
  );
}
