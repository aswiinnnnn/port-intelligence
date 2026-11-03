export type PortId = 'oman' | 'qatar' | 'saudi' | 'barcelona';

export type LatLng = [number, number];

// Berth rectangle on the map. `length` is in the scaled-degree units used by getRotatedCoords.
export interface DockGeometry {
  lat: number;
  lng: number;
  angle: number;
  length: number;
}

export interface VesselTrack {
  position: LatLng;
  heading: number;
  route: LatLng[];
}

// Every coordinate the app draws for a port. Keys mirror the shared operational data:
// dock ids from dashboardData, vessel names from shipsData, resource ids from Resources.
export interface PortGeography {
  // cos(latitude) at the port — converts east-west offsets into degrees of longitude
  lngScale: number;
  overviewMap: { center: LatLng; zoom: number };
  // Centre of the 2 NM operations radius around the harbour
  harbourCenter: LatLng;
  // Automated inbound vessel animation: starts outside the radius, stops inside it
  approach: { start: LatLng; target: LatLng };
  docks: Record<'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'H', DockGeometry>;
  vessels: Record<string, LatLng>;
  resourcesMap: { center: LatLng };
  tugs: Record<string, LatLng>;
  tugAssignedShip: LatLng;
  cranes: Record<string, LatLng>;
  liveMap: { center: LatLng; tracks: Record<string, VesselTrack> };
}

export interface PortConfig {
  id: PortId;
  // URL path segment, e.g. /PortofOman
  slug: string;
  name: string;
  nameAr: string;
  country: string;
  flag: string;
  // The physical port whose operations the platform shows
  operatingPort: string;
  // When set, the platform is shown in English only and the language switcher is hidden
  englishOnly?: boolean;
  geo: PortGeography;
  // The shared operational content (vessels, terminals, staff, organisations, contacts) is
  // authored once against the reference port, Oman. Each other port maps every reference
  // term — English and Arabic — to its own counterpart, so no Oman data leaks into it.
  entities: Record<string, string>;
}
