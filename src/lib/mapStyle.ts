import type { StyleSpecification } from "maplibre-gl";

export const monochromeMapStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
      maxzoom: 19,
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm", paint: { "raster-saturation": -1, "raster-contrast": -0.16, "raster-brightness-min": 0.2, "raster-brightness-max": 0.96, "raster-opacity": 0.76 } }],
};
