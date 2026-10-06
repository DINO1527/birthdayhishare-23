"use client";

import { useEffect } from "react";

let openOverlays = 0;

export function useOverlayLock(open: boolean) {
  useEffect(() => {
    if (!open) return;
    openOverlays++;
    if (openOverlays === 1) {
      document.documentElement.classList.add("story-modal-open");
      document.body.classList.add("story-modal-open");
      window.dispatchEvent(new Event("birthday-story-lock-change"));
    }
    return () => {
      openOverlays--;
      if (openOverlays === 0) {
        document.documentElement.classList.remove("story-modal-open");
        document.body.classList.remove("story-modal-open");
        window.dispatchEvent(new Event("birthday-story-lock-change"));
      }
    };
  }, [open]);
}
