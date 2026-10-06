"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const reveals = [
  "#hero .hero-copy", "#journey .journey-heading",
  "#journey .journey-map-frame", "#memories .section-heading", "#reasons .section-heading",
  "#voice .voice-content", "#letter .letter-paper", "#finale .final-content",
];

export function SceneLandingTransitions() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        animations.push(entry.target.animate([
          { opacity: 0.45, transform: "translate3d(0, 26px, 0) rotateX(2deg)", filter: "blur(3px)" },
          { opacity: 1, transform: "translate3d(0, 0, 0) rotateX(0deg)", filter: "blur(0)" },
        ], { duration: 780, easing: "cubic-bezier(.18,.7,.2,1)" }));
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.01 });
    for (const selector of reveals) {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    }

    const sections = Array.from(document.querySelectorAll<HTMLElement>(".scene:not(.opening-scene)"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (const section of sections) {
        const bounds = section.getBoundingClientRect();
        const inRange = bounds.top < viewport && bounds.bottom > 0;
        section.classList.toggle("is-visible", inRange);
        if (!inRange) continue;
        const entering = Math.max(0, Math.min(1, (viewport - bounds.top) / (viewport * 0.55)));
        const leaving = Math.max(0, Math.min(1, bounds.bottom / (viewport * 0.6)));
        section.style.setProperty("--edge-reveal", String(Math.min(entering, leaving)));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return null;
}
