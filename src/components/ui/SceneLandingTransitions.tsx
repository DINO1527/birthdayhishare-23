"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const staggeredHeadings = [
  "#opening .opening-copy", "#hero .hero-copy", "#story-map .map-story-intro",
  "#journey .journey-heading", "#memories .section-heading", "#reasons .section-heading",
  "#voice .voice-content",
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
        const items = Array.from(entry.target.children).filter((element): element is HTMLElement =>
          element instanceof HTMLElement && element.matches(".eyebrow, h1, h2, h3, .hero-sub, .voice-subtitle"),
        );
        if (!items.length) {
          animations.push(entry.target.animate([
            { opacity: 0.35, transform: "translate3d(0, 20px, 0)" },
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
          ], { duration: 680, easing: "cubic-bezier(.2,.7,.25,1)" }));
          continue;
        }
        let order = 0;
        for (const item of items) {
          const lines = item.matches("h1, h2, h3")
            ? Array.from(item.querySelectorAll<HTMLElement>(":scope > .scene-title-line"))
            : [];
          const targets = lines.length ? lines : [item];
          for (const target of targets) {
            animations.push(target.animate([
              { opacity: 0.2, transform: "translate3d(0, 22px, 0)" },
              { opacity: 1, transform: "translate3d(0, 0, 0)" },
            ], { duration: 650, delay: order * 115, easing: "cubic-bezier(.2,.7,.25,1)" }));
            order++;
          }
        }
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.01 });
    for (const selector of staggeredHeadings) {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    }
    const mapFrame = document.querySelector<HTMLElement>("#journey .journey-map-frame");
    if (mapFrame) observer.observe(mapFrame);

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
