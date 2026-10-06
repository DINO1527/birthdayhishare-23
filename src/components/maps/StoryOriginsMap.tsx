"use client";

import { useEffect, useRef } from "react";
import { GeoJSONSource, Map, Marker, setWorkerUrl } from "maplibre-gl";
import { originLocations } from "@/data/story";
import { monochromeMapStyle } from "@/lib/mapStyle";
import { ScrollTrigger } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function pointAlong(start: readonly [number, number], end: readonly [number, number], amount: number): [number, number] {
  return [start[0] + (end[0] - start[0]) * amount, start[1] + (end[1] - start[1]) * amount];
}

function segment(progress: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (progress - start) / (end - start)));
}

function easeInOut(progress: number) {
  return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

function routeFeature(start: readonly [number, number], end: readonly [number, number]) {
  return { type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates: [start, end] } };
}

export function StoryOriginsMap() {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!container.current || mapRef.current) return;
    setWorkerUrl("/maplibre-gl-worker.mjs");
    const map = new Map({
      container: container.current,
      style: monochromeMapStyle,
      center: [80.78, 7.88],
      zoom: reduced ? 12.5 : 1.45,
      pitch: reduced ? 30 : 0,
      attributionControl: false,
      interactive: false,
      renderWorldCopies: false,
    });
    mapRef.current = map;
    let scrollTrigger: ReturnType<typeof ScrollTrigger.create> | undefined;

    map.once("style.load", () => {
      const meeting = originLocations.meeting.coordinates;
      const localCenter: readonly [number, number] = [
        (originLocations.kokkuvil.coordinates[0] + originLocations.poompuhar.coordinates[0]) / 2,
        (originLocations.kokkuvil.coordinates[1] + originLocations.poompuhar.coordinates[1]) / 2,
      ];
      map.addSource("route-me", { type: "geojson", data: routeFeature(originLocations.kokkuvil.coordinates, originLocations.kokkuvil.coordinates) });
      map.addSource("route-you", { type: "geojson", data: routeFeature(originLocations.poompuhar.coordinates, originLocations.poompuhar.coordinates) });
      map.addLayer({ id: "route-me", type: "line", source: "route-me", paint: { "line-color": "#171715", "line-width": 4, "line-opacity": 0.9 } });
      map.addLayer({ id: "route-you", type: "line", source: "route-you", paint: { "line-color": "#6b3b3e", "line-width": 4, "line-opacity": 0.82 } });

      const markers = [
        { location: originLocations.kokkuvil, symbol: "†", kind: "christian" },
        { location: originLocations.poompuhar, symbol: "✧", kind: "hindu" },
      ];
      markers.forEach(({ location, symbol, kind }) => {
        const element = document.createElement("div");
        element.className = `origin-map-marker is-${kind}`;
        element.innerHTML = `<span class="origin-symbol">${symbol}</span><b>${location.name}</b><small>${location.role}</small>`;
        new Marker({ element, anchor: "bottom" }).setLngLat([...location.coordinates]).addTo(map);
      });
      const meetingElement = document.createElement("div");
      meetingElement.className = "origin-map-marker is-meeting";
      meetingElement.innerHTML = "<i></i><b>Our paths crossed</b>";
      new Marker({ element: meetingElement, anchor: "center" }).setLngLat([...meeting]).addTo(map);

      if (reduced) {
        map.jumpTo({ center: [...localCenter], zoom: 12.6, pitch: 0, bearing: 0 });
        (map.getSource("route-me") as GeoJSONSource).setData(routeFeature(originLocations.kokkuvil.coordinates, meeting));
        (map.getSource("route-you") as GeoJSONSource).setData(routeFeature(originLocations.poompuhar.coordinates, meeting));
        container.current?.closest(".origin-map-shell")?.classList.add("is-complete");
        return;
      }

      const shell = container.current?.closest(".origin-map-shell");

      const updateScene = (progress: number) => {
        const worldToIsland = easeInOut(segment(progress, 0.02, 0.34));
        const islandToMeeting = easeInOut(segment(progress, 0.36, 0.59));
        const localProgress = easeInOut(segment(progress, 0.61, 0.72));
        const introProgress = easeInOut(segment(progress, 0.22, 0.36));
        const notesOutProgress = easeInOut(segment(progress, 0.73, 0.79));
        const completeProgress = easeInOut(segment(progress, 0.75, 0.86));
        const islandCenter: readonly [number, number] = [80.72, 7.88];
        const center = pointAlong(
          pointAlong([80.78, 7.88], islandCenter, worldToIsland),
          localCenter,
          islandToMeeting,
        );

        map.jumpTo({
          center,
          zoom: 1.45 + worldToIsland * 4.65 + islandToMeeting * 6.5,
          pitch: worldToIsland * 10 * (1 - islandToMeeting),
          bearing: 0,
        });
        (map.getSource("route-me") as GeoJSONSource).setData(routeFeature(originLocations.kokkuvil.coordinates, pointAlong(originLocations.kokkuvil.coordinates, meeting, localProgress)));
        (map.getSource("route-you") as GeoJSONSource).setData(routeFeature(originLocations.poompuhar.coordinates, pointAlong(originLocations.poompuhar.coordinates, meeting, localProgress)));

        if (shell instanceof HTMLElement) {
          const activeStage = progress < 0.18 ? 0 : progress < 0.4 ? 1 : progress < 0.61 ? 2 : 3;
          shell.style.setProperty("--origin-progress", String(progress));
          shell.style.setProperty("--intro-progress", String(introProgress));
          shell.style.setProperty("--intro-shift", `${introProgress * -24}px`);
          shell.style.setProperty("--local-progress", String(localProgress));
          shell.style.setProperty("--local-shift", `${(1 - localProgress) * 10}px`);
          shell.style.setProperty("--notes-opacity", String(localProgress * (1 - notesOutProgress)));
          shell.style.setProperty("--marker-opacity", String(localProgress));
          shell.style.setProperty("--complete-progress", String(completeProgress));
          shell.style.setProperty("--complete-shift", `${(1 - completeProgress) * 24}px`);
          shell.style.setProperty("--photo-rotate", `${(1 - completeProgress) * 62}deg`);
          shell.style.setProperty("--photo-shift", `${(1 - completeProgress) * 160}px`);
          shell.style.setProperty("--photo-scale", String(0.62 + completeProgress * 0.38));
          shell.querySelectorAll(".map-zoom-copy span").forEach((label, index) => {
            label.classList.toggle("is-active", index === activeStage);
          });
        }
      };

      updateScene(0);
      scrollTrigger = ScrollTrigger.create({
        trigger: "#story-map",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => updateScene(progress),
      });
    });

    return () => {
      scrollTrigger?.kill();
      map.remove();
      mapRef.current = null;
    };
  }, [reduced]);

  return <div className="origin-map" ref={container} aria-label="Map zooming from the world to Sri Lanka and Batticaloa" />;
}
