import L from 'leaflet';

// Shared basemap for every Leaflet map in the app. CARTO's free basemaps now return an
// "API key required" watermark, so all maps use OpenStreetMap's standard tiles instead.
const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

interface BaseTileOptions {
  opacity?: number;
  // Dark-themed maps get an inverted rendering of the same tiles (see .map-tiles-dark in index.css)
  dark?: boolean;
}

export const addBaseTiles = (map: L.Map, { opacity = 1, dark = false }: BaseTileOptions = {}): L.TileLayer => {
  // OpenStreetMap's tile policy requires visible attribution, even on maps that hide Leaflet's default control.
  if (!map.attributionControl) {
    L.control.attribution({ prefix: false }).addTo(map);
  }

  return L.tileLayer(OSM_TILE_URL, {
    maxZoom: 19,
    opacity,
    attribution: OSM_ATTRIBUTION,
    className: dark ? 'map-tiles-dark' : ''
  }).addTo(map);
};
