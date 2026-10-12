"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { StoryImage } from "@/components/ui/StoryImage";
import { useOverlayLock } from "@/hooks/useOverlayLock";

export function FinalScene() {
  const root = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);
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
      if (reduced || !photoReady) return;
      const landing = gsap.timeline({ paused: true });
      landing.fromTo(".final-photo > img", { autoAlpha: 0, scale: 1.12, yPercent: 4, filter: "brightness(.58)" }, {
        autoAlpha: 1, scale: 1, yPercent: 0, filter: "brightness(1)", duration: 1.35, ease: "power3.out",
      }, 0)
        .fromTo(".final-shade", { opacity: 0.65 }, { opacity: 1, duration: 1.1, ease: "power2.out" }, 0)
        .fromTo(".final-atmosphere", { opacity: 0 }, { opacity: 1, duration: 1.25, ease: "power2.out" }, 0)
        .from(".final-content > .eyebrow", { opacity: 0, y: -12, duration: 0.65, ease: "power3.out" }, 0.2)
        .from(".final-kicker", { opacity: 0, y: 14, duration: 0.55, ease: "power3.out" }, "-=0.2")
        .from(".final-content h2", { opacity: 0, y: 22, duration: 0.72, ease: "power3.out" }, "-=0.12")
        .from(".final-rule", { scaleX: 0, transformOrigin: "center", duration: 0.42, ease: "power2.out" }, "-=0.22")
        .from(".final-content h3", { opacity: 0, y: 18, duration: 0.65, ease: "power3.out" }, "-=0.08")
        .from(".final-button", { opacity: 0, y: 14, duration: 0.55, ease: "power3.out" }, "-=0.12")
        .from(".final-bottom-mark", { opacity: 0, y: 8, duration: 0.5, ease: "power2.out" }, "-=0.12");
      const playLanding = () => { if (landing.progress() === 0) landing.play(0); };
      ScrollTrigger.create({ trigger: root.current, start: "top 82%", once: true, onEnter: playLanding });
      const bounds = root.current?.getBoundingClientRect();
      if (bounds && bounds.top < window.innerHeight * 0.82 && bounds.bottom > 0) playLanding();
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [reduced, photoReady] },
  );

  return (
    <section className="scene final-scene" data-scene="9" id="finale" ref={root}>
      <div className="final-atmosphere" aria-hidden="true"><i /><i /><i /></div>
      <StoryImage src="/api/story-photo/ending/final-couple.webp" alt="The two of us walking together along a forest road" label="FINAL WALK TOGETHER" className="final-photo" sizes="100vw" onSettled={() => setPhotoReady(true)} />
      <div className="final-shade" aria-hidden="true" />
      <div className="final-content">
        <p className="eyebrow final-reveal">09 / ALWAYS</p>
        <div className="final-copy">
          <p className="final-kicker">No matter where the road takes us</p>
          <h2>my favourite place<br />is beside you.</h2>
          <span className="final-rule" aria-hidden="true" />
          <h3>Happy Birthday,<br /><em>my love.</em></h3>
          <button type="button" ref={triggerRef} className="final-button" onClick={() => setRevealed(true)}>
            One last wish <span aria-hidden="true">↓</span>
          </button>
        </div>
        <span className="final-bottom-mark final-reveal" aria-hidden="true">D &amp; H <i>✦</i> ALWAYS</span>
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
