"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { GeoJSONSource, Map, Marker, setWorkerUrl } from "maplibre-gl";
import { journeyLocations } from "@/data/story";
import { monochromeMapStyle } from "@/lib/mapStyle";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function travelFeature(count: number) {
  const coordinates = journeyLocations.slice(0, Math.max(1, count)).map((item) => [...item.coordinates]);
  if (coordinates.length === 1) coordinates.push(coordinates[0]);
  return { type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates } };
}

function focusLocation(map: Map, index: number, markers: HTMLElement[], animate: boolean) {
  const location = journeyLocations[index];
  (map.getSource("travel-route") as GeoJSONSource | undefined)?.setData(travelFeature(index + 1));
  markers.forEach((element, markerIndex) => element.classList.toggle("is-active", markerIndex === index));
  const compact = map.getContainer().clientWidth < 500;
  const camera = {
    center: [...location.coordinates] as [number, number],
    zoom: compact ? Math.min(location.zoom, 13.8) : location.zoom,
    pitch: compact ? 0 : location.transition === "mountain" ? 35 : 22,
    bearing: compact ? 0 : location.transition === "coast" ? 8 : -7,
    // Equal padding keeps the active memory's marker in the visual center.
    padding: { top: 38, bottom: 38, left: 38, right: 38 },
  };
  if (animate) map.easeTo({ ...camera, duration: 950, essential: true });
  else map.jumpTo(camera);
}

export function TravelMap({ activeIndex }: { activeIndex: number }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerElements = useRef<HTMLElement[]>([]);
  const activeIndexRef = useRef(activeIndex);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!container.current || mapRef.current) return;
    setWorkerUrl("/maplibre-gl-worker.mjs");
    const map = new Map({ container: container.current, style: monochromeMapStyle, center: [80.77, 7.65], zoom: 6.25, pitch: 18, bearing: 0, attributionControl: false, interactive: false, renderWorldCopies: false });
    mapRef.current = map;
    const updateMarkerVisibility = () => {
      const width = map.getContainer().clientWidth;
      const height = map.getContainer().clientHeight;
      markerElements.current.forEach((element, index) => {
        const point = map.project([...journeyLocations[index].coordinates]);
        element.style.visibility = point.x >= 22 && point.x <= width - 22 && point.y >= 78 && point.y <= height - 30 ? "visible" : "hidden";
      });
    };
    map.on("move", updateMarkerVisibility);
    map.on("resize", updateMarkerVisibility);
    map.once("style.load", () => {
      map.addSource("travel-route", { type: "geojson", data: travelFeature(1) });
      map.addLayer({ id: "travel-route-shadow", type: "line", source: "travel-route", paint: { "line-color": "rgba(255,255,255,.82)", "line-width": 7 } });
      map.addLayer({ id: "travel-route", type: "line", source: "travel-route", paint: { "line-color": "#252522", "line-width": 2.5, "line-dasharray": [1.2, 1.4] } });
      markerElements.current = journeyLocations.map((location, index) => {
        const element = document.createElement("div");
        element.className = "travel-map-marker";
        element.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>`;
        new Marker({ element, anchor: "center" }).setLngLat([...location.coordinates]).addTo(map);
        return element;
      });
      focusLocation(map, activeIndexRef.current, markerElements.current, false);
      updateMarkerVisibility();
    });
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useLayoutEffect(() => {
    activeIndexRef.current = activeIndex;
    const map = mapRef.current;
    if (!map?.getSource("travel-route")) return;
    focusLocation(map, activeIndex, markerElements.current, !reduced);
  }, [activeIndex, reduced]);

  return <div className="travel-map" ref={container} aria-label="Map of the places our story has touched" />;
}
