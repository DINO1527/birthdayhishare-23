"use client";

import dynamic from "next/dynamic";
import { StoryImage } from "@/components/ui/StoryImage";
import { originLocations } from "@/data/story";

const StoryOriginsMap = dynamic(() => import("@/components/maps/StoryOriginsMap").then((module) => module.StoryOriginsMap), { ssr: false, loading: () => <div className="map-loading">Preparing the map…</div> });

export function StoryMapScene() {
  return (
    <section className="scene map-scene" data-scene="3" id="story-map">
      <div className="origin-map-shell">
        <StoryOriginsMap />
        <div className="map-story-intro">
          <p className="eyebrow">03 / WHERE IT STARTED</p>
          <h2>Where Our<br />Story Started</h2>
          <p>One world. One island. One city. Two lives.</p>
        </div>
        <div className="map-zoom-copy" aria-hidden="true">
          <span>WORLD</span><span>SOUTH ASIA</span><span>SRI LANKA</span><span>BATTICALOA</span>
        </div>
        <div className="origin-background-notes">
          <article><span className="faith-mark christian-mark">†</span><p className="eyebrow">{originLocations.kokkuvil.name} · {originLocations.kokkuvil.role}</p><p>{originLocations.kokkuvil.detail}</p></article>
          <article><span className="faith-mark hindu-mark">✧</span><p className="eyebrow">{originLocations.poompuhar.name} · {originLocations.poompuhar.role}</p><p>{originLocations.poompuhar.detail}</p></article>
        </div>
        <div className="paths-crossed-copy"><p className="eyebrow">TWO BEGINNINGS</p><h3>And then<br />our paths crossed.</h3></div>
        <div className="origin-photo-reveal">
          <StoryImage src="/api/story-photo/story/paths-crossed.webp" alt="Couple photograph emerging from the Batticaloa map" label="OUR PATHS CROSSED" sizes="(max-width: 900px) 72vw, 340px" />
          <p className="eyebrow">DIFFERENT BEGINNINGS. ONE STORY.</p>
        </div>
        <a className="origin-map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>
      </div>
    </section>
  );
}
