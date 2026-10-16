"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 0.8,
      smoothWheel: true,
      syncTouch: false,
      prevent: (node) => Boolean(node.closest(".memory-lightbox-card, .final-modal, input")),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const syncLock = () => {
      if (document.documentElement.classList.contains("story-locked") || document.documentElement.classList.contains("story-modal-open")) lenis.stop();
      else lenis.start();
    };

    window.addEventListener("birthday-story-lock-change", syncLock);
    syncLock();

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("birthday-story-lock-change", syncLock);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return children;
}
