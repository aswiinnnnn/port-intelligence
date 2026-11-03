import type { PortConfig } from './types';

// Reference port: the shared operational content is written for the Port of Salalah,
// so Oman needs no entity substitutions.
export const omanPort: PortConfig = {
  id: 'oman',
  slug: 'PortofOman',
  name: 'Port of Oman',
  nameAr: 'ميناء عُمان',
  country: 'Oman',
  flag: '🇴🇲',
  operatingPort: 'Port of Salalah',
  geo: {
    lngScale: 0.957,
    overviewMap: { center: [16.940, 54.025], zoom: 13 },
    harbourCenter: [16.944, 54.010],
    approach: { start: [16.9180, 54.0560], target: [16.9260, 54.0360] },
    docks: {
      S: { lat: 16.9369, lng: 54.0053, angle: 129, length: 0.0008 },
      A: { lat: 16.9473, lng: 54.0117, angle: 66, length: 0.0011 },
      B: { lat: 16.9446, lng: 54.0052, angle: 66, length: 0.0011 },
      C: { lat: 16.9403, lng: 54.0005, angle: 165, length: 0.0009 },
      D: { lat: 16.9377, lng: 54.0012, angle: 165, length: 0.0008 },
      E: { lat: 16.9523, lng: 54.0123, angle: 72, length: 0.0009 },
      H: { lat: 16.9489, lng: 54.0153, angle: 66, length: 0.0011 }
    },
    vessels: {
      'GULF ZENITH': [16.9090, 54.0520],
      'MAERSK DHOFAR': [16.9260, 54.0360],
      'ASYAD HORIZON': [16.9420, 54.0270],
      'DHOFAR SPIRIT': [16.9385, 54.0050],
      'QALHAT STAR': [16.9700, 54.0450],
      'KHAREEF BREEZE': [16.9050, 54.0300]
    },
    resourcesMap: { center: [16.946, 54.008] },
    tugs: {
      'tug-1': [16.9409, 54.0013],
      'tug-2': [16.9510, 54.0072],
      'tug-3': [16.9513, 54.0062],
      'tug-4': [16.9516, 54.0048],
      'tug-5': [16.9508, 54.0080]
    },
    tugAssignedShip: [16.9403, 54.0006],
    cranes: {
      'crane-1': [16.9473, 54.0108],
      'crane-2': [16.9476, 54.0114],
      'crane-3': [16.9478, 54.0120],
      'crane-4': [16.9481, 54.0126]
    },
    liveMap: {
      center: [16.942, 54.022],
      tracks: {
        // Inbound from the pilot boarding ground, rounding the breakwater head
        'Nizwa Empress': { position: [16.926, 54.042], heading: 345, route: [[16.912, 54.052], [16.926, 54.042], [16.948, 54.036]] },
        // Outbound through the harbour entrance, bound NE for the Arabian Sea
        'Hasik Spirit': { position: [16.955, 54.038], heading: 71, route: [[16.951, 54.026], [16.955, 54.038], [16.958, 54.052]] },
        // Manoeuvring in the main basin towards the container quay
        'Sur Venture': { position: [16.9445, 54.014], heading: 244, route: [[16.948, 54.0215], [16.9445, 54.014]] },
        'Qalhat Star': { position: [16.970, 54.045], heading: 232, route: [[16.985, 54.065], [16.970, 54.045]] },
        'Khareef Breeze': { position: [16.905, 54.030], heading: 295, route: [[16.895, 54.052], [16.905, 54.030]] }
      }
    }
  },
  entities: {}
};
