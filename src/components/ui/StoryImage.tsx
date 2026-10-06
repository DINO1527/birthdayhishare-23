"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type StoryImageProps = {
  src: string;
  alt: string;
  label: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
};

export function StoryImage({ src, alt, label, className = "", sizes = "(max-width: 900px) 92vw, 44vw", eager = false }: StoryImageProps) {
  const [missing, setMissing] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setReady(document.body.classList.contains("story-ready"));
    window.addEventListener("birthday-story-ready-change", sync);
    sync();
    return () => window.removeEventListener("birthday-story-ready-change", sync);
  }, []);

  return (
    <div className={`story-image ${className} ${missing ? "is-missing" : ""}`}>
      {ready && !missing && (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          onError={() => setMissing(true)}
        />
      )}
      {missing && (
        <div className="story-image-placeholder" aria-label={`${label} placeholder`}>
          <span>PHOTO PLACEHOLDER</span>
          <strong>{label}</strong>
        </div>
      )}
    </div>
  );
}
