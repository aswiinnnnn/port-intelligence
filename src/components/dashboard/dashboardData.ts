import { activePort } from '../../ports';

export interface DockDetail {
  id: string;
  label: string;
  name: string;
  pier: string;
  lat: number;
  lng: number;
  length: number;
  width: number;
  angle: number;
  status: 'Occupied' | 'Vacant' | 'Reserved';
  vessel?: string;
  vesselType?: string;
  maxLoa: string;
  depth: string;
  nextArrival?: string;
}

type DockData = Omit<DockDetail, 'lat' | 'lng' | 'length' | 'angle'> & { id: keyof typeof activePort.geo.docks };

// Berth positions come from the active port's geography; everything else is shared.
const DOCKS: DockData[] = [
  {
    id: 'S',
    label: '30',
    name: 'General Cargo Terminal - Berth 30 (Cruise)',
    pier: 'General Cargo Terminal (South Quay)',
    width: 0.00018,
    status: 'Occupied',
    vessel: 'ASYAD HORIZON',
    vesselType: 'Cruise Ship',
    maxLoa: '260m',
    depth: '12.0m',
    nextArrival: 'Today, 12:38'
  },
  {
    id: 'A',
    label: '4',
    name: 'Salalah Container Terminal - Berth 4',
    pier: 'Salalah Container Terminal (Phase 1)',
    width: 0.00018,
    status: 'Occupied',
    vessel: 'MAERSK DHOFAR',
    vesselType: 'Container Ship',
    maxLoa: '400m',
    depth: '18.0m',
    nextArrival: 'Today, 11:56'
  },
  {
    id: 'B',
    label: '2',
    name: 'Salalah Container Terminal - Berth 2',
    pier: 'Salalah Container Terminal (Phase 1)',
    width: 0.00018,
    status: 'Vacant',
    maxLoa: '350m',
    depth: '16.0m',
    nextArrival: 'Tomorrow, 06:00'
  },
  {
    id: 'C',
    label: '24',
    name: 'General Cargo Terminal - Berth 24 (Dry Bulk)',
    pier: 'General Cargo Terminal (West Quay)',
    width: 0.00018,
    status: 'Occupied',
    vessel: 'DHOFAR SPIRIT',
    vesselType: 'Bulk Carrier',
    maxLoa: '260m',
    depth: '14.0m',
    nextArrival: 'Today, 10:44'
  },
  {
    id: 'D',
    label: '22',
    name: 'General Cargo Terminal - Berth 22',
    pier: 'General Cargo Terminal (West Quay)',
    width: 0.00018,
    status: 'Vacant',
    maxLoa: '240m',
    depth: '13.0m',
    nextArrival: 'Today, 16:30'
  },
  {
    id: 'E',
    label: '31',
    name: 'General Cargo Terminal - Berth 31 (Ro-Ro)',
    pier: 'General Cargo Terminal (North Basin)',
    width: 0.00018,
    status: 'Reserved',
    vessel: 'GULF ZENITH',
    vesselType: 'Ro-Ro Vessel',
    maxLoa: '240m',
    depth: '12.0m',
    nextArrival: 'Today, 14:56'
  },
  {
    id: 'H',
    label: '5',
    name: 'Salalah Container Terminal - Berth 5',
    pier: 'Salalah Container Terminal (Phase 2)',
    width: 0.00018,
    status: 'Occupied',
    vessel: 'ARABIAN SEA EXPRESS',
    vesselType: 'Container Ship',
    maxLoa: '400m',
    depth: '18.0m',
    nextArrival: 'Today, 18:26'
  }
];

export const docks: DockDetail[] = DOCKS.map(dock => ({ ...dock, ...activePort.geo.docks[dock.id] }));

export interface VesselChecklistStep {
  label: string;
  done: boolean;
  num?: number;
}

export interface VesselListItem {
  flag: string;
  status: string;
  statusLabel: string;
  name: string;
  type: string;
  image: string;
  loa: string;
  draft: string;
  gt: string;
  eta: string;
  etd: string;
  cargo: string;
  berth: string;
  risk: number;
  riskLevel: string;
  tugs: number;
  operator: string;
  checklist: VesselChecklistStep[];
}

// Canonical ship ETA/ETD format used across the whole app: YY-MM-DD HH:MM (2-digit year).
export const formatShipDateTime = (d: Date): string => {
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yy}-${mm}-${dd} ${hh}:${mi}`;
};

const getCurrentEtaString = (offsetDays = 0, hour?: number, min?: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  if (hour !== undefined) d.setHours(hour);
  if (min !== undefined) d.setMinutes(min);
  return formatShipDateTime(d);
};

export const listVessels: VesselListItem[] = [
  {
    flag: '🇩🇰',
    status: 'APPR',
    statusLabel: 'Approaching',
    name: 'MAERSK DHOFAR',
    type: 'Container Ship · Denmark · IMO 9786528',
    image: '/ships/ship_1.png',
    loa: '366m',
    draft: '14.2m',
    gt: '153K',
    eta: getCurrentEtaString(0),
    etd: getCurrentEtaString(1, 19, 0),
    cargo: 'Containers',
    berth: 'SCT-B04',
    risk: 35,
    riskLevel: 'MEDIUM RISK',
    tugs: 4,
    operator: 'Maersk Line Oman',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'Pilot', done: false, num: 2 },
      { label: 'Tug', done: false, num: 3 },
      { label: 'Berthing', done: false, num: 4 },
      { label: 'Customs', done: false, num: 5 },
      { label: 'Cargo', done: false, num: 6 },
      { label: 'Departure', done: false, num: 7 }
    ]
  },
  {
    flag: '🇴🇲',
    status: 'APPR',
    statusLabel: 'Approaching',
    name: 'ASYAD HORIZON',
    type: 'Container Cargo Ship · Oman · IMO 9623312',
    image: '/ships/ship_2.png',
    loa: '272m',
    draft: '8.2m',
    gt: '103K',
    eta: '26-07-09 08:00',
    etd: '26-07-10 18:30',
    cargo: 'Containers',
    berth: 'GCT-B30',
    risk: 22,
    riskLevel: 'LOW RISK',
    tugs: 2,
    operator: 'Asyad Line',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'Pilot', done: false, num: 2 },
      { label: 'Berthing', done: false, num: 3 },
      { label: 'Passenger', done: false, num: 4 },
      { label: 'Provisioning', done: false, num: 5 },
      { label: 'Departure', done: false, num: 6 }
    ]
  },
  {
    flag: '🇲🇭',
    status: 'BERT',
    statusLabel: 'Berthing',
    name: 'DHOFAR SPIRIT',
    type: 'Bulk Carrier · Marshall Islands · IMO 9498717',
    image: '/ships/ship_3.png',
    loa: '225m',
    draft: '13.5m',
    gt: '44K',
    eta: '26-07-08 15:00',
    etd: '26-07-09 20:15',
    cargo: 'Gypsum (Bulk)',
    berth: 'GCT-B24',
    risk: 58,
    riskLevel: 'HIGH RISK',
    tugs: 3,
    operator: 'Oman Shipping Company',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'Pilot', done: true },
      { label: 'Berthing', done: false, num: 3 },
      { label: 'Mooring', done: false, num: 4 },
      { label: 'Cargo', done: false, num: 5 }
    ]
  },
  {
    flag: '🇲🇹',
    status: 'ANCH',
    statusLabel: 'Anchored',
    name: 'GULF ZENITH',
    type: 'Ro-Ro Vessel · Malta · IMO 9833149',
    image: '/ships/ship_4.png',
    loa: '198m',
    draft: '6.8m',
    gt: '31K',
    eta: '26-07-08 19:12',
    etd: '26-07-09 21:00',
    cargo: 'Vehicles & Trucks',
    berth: 'GCT-B31',
    risk: 44,
    riskLevel: 'MEDIUM RISK',
    tugs: 1,
    operator: 'Wallenius Wilhelmsen',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'Waiting', done: false, num: 2 },
      { label: 'Berthing', done: false, num: 3 },
      { label: 'Cargo', done: false, num: 4 }
    ]
  },
  {
    flag: '🇴🇲',
    status: 'APPR',
    statusLabel: 'Approaching',
    name: 'AL MIRBAT',
    type: 'Chemical Tanker · Oman · IMO 9437024',
    image: '/ships/ship_6.png',
    loa: '183m',
    draft: '11.2m',
    gt: '28K',
    eta: '26-07-08 20:42',
    etd: '26-07-10 09:30',
    cargo: 'Chemical Products',
    berth: 'LBT-J2',
    risk: 72,
    riskLevel: 'HIGH RISK',
    tugs: 2,
    operator: 'Asyad Shipping Tankers',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'ISPS', done: false, num: 2 },
      { label: 'Hazmat', done: false, num: 3 },
      { label: 'Berthing', done: false, num: 4 }
    ]
  },
  {
    flag: '🇱🇷',
    status: 'APPR',
    statusLabel: 'Approaching',
    name: 'ARABIAN SEA EXPRESS',
    type: 'Container Ship · Liberia · IMO 9875408',
    image: '/ships/ship_1.png',
    loa: '399m',
    draft: '15.8m',
    gt: '215K',
    eta: '26-07-08 22:42',
    etd: '26-07-10 06:15',
    cargo: 'Containers',
    berth: 'SCT-B05',
    risk: 82,
    riskLevel: 'CRITICAL RISK',
    tugs: 6,
    operator: 'Hapag-Lloyd',
    checklist: [
      { label: 'AIS', done: true },
      { label: 'Deep', done: false, num: 2 },
      { label: 'Special', done: false, num: 3 },
      { label: 'Berthing', done: false, num: 4 }
    ]
  },
  {
    flag: '🇮🇳',
    status: 'BERT',
    statusLabel: 'Berthed',
    name: 'RAYSUT TRADER',
    type: 'General Cargo · India · IMO 9374167',
    image: '/ships/ship_3.png',
    loa: '142m',
    draft: '7.4m',
    gt: '9K',
    eta: '26-07-08 12:42',
    etd: '26-07-09 08:00',
    cargo: 'General Cargo',
    berth: 'GCT-B27',
    risk: 15,
    riskLevel: 'LOW RISK',
    tugs: 0,
    operator: 'Khimji Ramdas Shipping',
    checklist: [
      { label: 'AIS', done: true }
    ]
  }
];

// cos(latitude) at the active port: converts east-west offsets into degrees of longitude.
export const LNG_SCALE = activePort.geo.lngScale;

export const getRotatedCoords = (
  centerLat: number,
  centerLng: number,
  length: number,
  width: number,
  angleDeg: number
): [number, number][] => {
  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const hl = (length * 2.5) / 2;
  const hw = (width * 2.5) / 2;

  const corners = [
    [-hl, -hw],
    [hl, -hw],
    [hl, hw],
    [-hl, hw]
  ];

  return corners.map(([x, y]) => {
    const rotLat = x * cos - (y * sin * LNG_SCALE);
    const rotLng = (x * sin) / LNG_SCALE + y * cos;
    return [centerLat + rotLat, centerLng + rotLng] as [number, number];
  });
};

export interface ShipData {
  name: string;
  image: string;
  flag: string;
  status: string;
  type: string;
  loa: string;
  draft: string;
  gt: string;
  eta: string;
  cargo: string;
  berth: string;
  risk: number;
  tugs: number;
  riskLevel: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK';
  operator: string;
  lat: number;
  lng: number;
  routeColor: string;
}

type ShipListData = Omit<ShipData, 'lat' | 'lng'>;

const SHIPS: ShipListData[] = [
  {
    name: 'GULF ZENITH',
    image: '/ships/ship_3.png',
    flag: '🇲🇹',
    status: 'ANCH',
    type: 'Ro-Ro Vessel · Malta · IMO 9833149',
    loa: '200m',
    draft: '9.2m',
    gt: '56K',
    eta: '26-07-08 14:56',
    cargo: 'Vehicles & Trucks',
    berth: 'GCT-B31',
    risk: 44,
    tugs: 2,
    riskLevel: 'MEDIUM RISK',
    operator: 'Wallenius Wilhelmsen Agency',
    routeColor: '#fbbf24'
  },
  {
    name: 'MAERSK DHOFAR',
    image: '/ships/ship_1.png',
    flag: '🇩🇰',
    status: 'APPR',
    type: 'Container Ship · Denmark · IMO 9786528',
    loa: '366m',
    draft: '14.2m',
    gt: '153K',
    eta: '26-07-08 16:12',
    cargo: 'Containers',
    berth: 'SCT-B04',
    risk: 35,
    tugs: 4,
    riskLevel: 'MEDIUM RISK',
    operator: 'Maersk Line Oman',
    routeColor: '#10b981'
  },
  {
    name: 'ASYAD HORIZON',
    image: '/ships/ship_1.png',
    flag: '🇴🇲',
    status: 'APPR',
    type: 'Container Cargo Ship · Oman · IMO 9623312',
    loa: '272m',
    draft: '8.3m',
    gt: '102K',
    eta: '26-07-08 16:54',
    cargo: 'Containers',
    berth: 'GCT-B30',
    risk: 22,
    tugs: 2,
    riskLevel: 'LOW RISK',
    operator: 'Asyad Line',
    routeColor: '#3b82f6'
  },
  {
    name: 'DHOFAR SPIRIT',
    image: '/ships/ship_3.png',
    flag: '🇲🇭',
    status: 'BERTH',
    type: 'Bulk Carrier · Marshall Is. · IMO 9498717',
    loa: '225m',
    draft: '12.5m',
    gt: '43K',
    eta: '26-07-08 10:44',
    cargo: 'Gypsum (Bulk)',
    berth: 'GCT-B24',
    risk: 58,
    tugs: 3,
    riskLevel: 'HIGH RISK',
    operator: 'Oman Shipping Company',
    routeColor: '#4ade80'
  },
  {
    name: 'QALHAT STAR',
    image: '/ships/ship_1.png',
    flag: '🇴🇲',
    status: 'APPR',
    type: 'LNG Tanker · Oman · IMO 9812078',
    loa: '299m',
    draft: '11.8m',
    gt: '110K',
    eta: '26-07-09 04:15',
    cargo: 'Gas',
    berth: 'SCT-B05',
    risk: 18,
    tugs: 2,
    riskLevel: 'LOW RISK',
    operator: 'Oman LNG Shipping',
    routeColor: '#fbbf24'
  },
  {
    name: 'KHAREEF BREEZE',
    image: '/ships/ship_2.png',
    flag: '🇵🇦',
    status: 'APPR',
    type: 'General Cargo · Panama · IMO 9315587',
    loa: '180m',
    draft: '7.8m',
    gt: '28K',
    eta: '26-07-09 08:30',
    cargo: 'Grain',
    berth: 'GCT-B22',
    risk: 42,
    tugs: 2,
    riskLevel: 'MEDIUM RISK',
    operator: 'Gulf Navigation Chartering',
    routeColor: '#ef4444'
  }
];

export const shipsData: ShipData[] = SHIPS.map(ship => {
  const [lat, lng] = activePort.geo.vessels[ship.name];
  return { ...ship, lat, lng };
});
