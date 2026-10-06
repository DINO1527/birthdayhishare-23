"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { journeyLocations } from "@/data/story";
import { StoryImage } from "@/components/ui/StoryImage";

const TravelMap = dynamic(() => import("@/components/maps/TravelMap").then((module) => module.TravelMap), { ssr: false, loading: () => <div className="map-loading">Preparing Sri Lanka…</div> });

export function TimelineScene() {
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const items = Array.from(root.current?.querySelectorAll<HTMLElement>(".journey-stop") ?? []);
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const focusLine = window.innerHeight * (window.innerWidth <= 900 ? 0.65 : 0.5);
        let closest = 0;
        let closestDistance = Infinity;
        items.forEach((item, index) => {
          const bounds = item.getBoundingClientRect();
          const distance = Math.abs(bounds.top + bounds.height / 2 - focusLine);
          if (distance < closestDistance) {
            closest = index;
            closestDistance = distance;
          }
        });
        setActiveIndex(closest);
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="scene timeline-scene" data-scene="4" id="journey" ref={root}>
      <div className="section-heading centered journey-heading">
        <p className="eyebrow">04 / THE PLACES OUR STORY TOUCHED</p>
        <h2>Our Journey<br />Across The Map</h2>
        <p>Separate trips. Shared chapters. One growing story.</p>
      </div>

      <div className="journey-layout">
        <div className="journey-map-column">
          <div className="journey-map-frame">
            <TravelMap activeIndex={activeIndex} />
            <div className="journey-active-name"><span>{String(activeIndex + 1).padStart(2, "0")}</span><b>{journeyLocations[activeIndex].name}</b></div>
            <p className="journey-map-note">A memory map — not one literal road trip.</p>
            <a className="travel-map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>
          </div>
          <div className="travel-progress" aria-label={`Travel memory ${activeIndex + 1} of ${journeyLocations.length}`}><span style={{ width: `${((activeIndex + 1) / journeyLocations.length) * 100}%` }} /></div>
        </div>

        <div className="journey-stops">
          {journeyLocations.map((location, index) => (
            <article className={`journey-stop is-${location.transition} ${index === activeIndex ? "is-active" : ""}`} data-index={index} key={location.id}>
              <div className="journey-transition" aria-hidden="true">
                {location.transition === "coast" && <i className="wave-line" />}
                {location.transition === "mountain" && <><i className="mountain-layer one" /><i className="mountain-layer two" /></>}
                {location.transition === "rail" && <i className="rail-line" />}
                {location.transition === "tea" && <><i className="tea-cup" /><i className="tea-steam" /></>}
                {location.transition === "city" && <i className="city-grid" />}
              </div>
              <p className="eyebrow">{location.kicker}</p>
              <h3>{location.name}</h3>
              <StoryImage src={location.image} alt={`${location.name} relationship memory`} label={location.imageLabel} className={`journey-photo ratio-${location.ratio.replace(":", "-")}`} />
              <p className="journey-caption">{location.caption}</p>
              <p className="coordinate-note">{location.coordinateLabel}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
