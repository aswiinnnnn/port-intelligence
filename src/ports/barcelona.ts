import type { PortConfig } from './types';

// Port of Barcelona on the Mediterranean. Container berths sit on the Moll Sud (APM) and
// Moll Prat (BEST) quays; general cargo on the Moll Ponent; Ro-Ro near the Moll de Costa.
// Shown in English only — the language switcher is hidden for this port.
export const barcelonaPort: PortConfig = {
  id: 'barcelona',
  slug: 'PortofBarcelona',
  name: 'Port of Barcelona',
  nameAr: 'ميناء برشلونة',
  country: 'Spain',
  flag: '🇪🇸',
  operatingPort: 'Port of Barcelona',
  englishOnly: true,
  geo: {
    lngScale: 0.751,
    overviewMap: { center: [41.335, 2.172], zoom: 13 },
    harbourCenter: [41.338, 2.165],
    approach: { start: [41.3000, 2.2150], target: [41.3200, 2.1820] },
    docks: {
      S: { lat: 41.3240, lng: 2.1700, angle: 40, length: 0.0008 },
      A: { lat: 41.3350, lng: 2.1640, angle: 32, length: 0.0011 },
      B: { lat: 41.3300, lng: 2.1600, angle: 32, length: 0.0011 },
      C: { lat: 41.3470, lng: 2.1650, angle: 20, length: 0.0009 },
      D: { lat: 41.3430, lng: 2.1625, angle: 20, length: 0.0008 },
      E: { lat: 41.3560, lng: 2.1700, angle: 45, length: 0.0009 },
      H: { lat: 41.3205, lng: 2.1550, angle: 25, length: 0.0011 }
    },
    vessels: {
      'GULF ZENITH': [41.2950, 2.2050],
      'MAERSK DHOFAR': [41.3200, 2.1820],
      'ASYAD HORIZON': [41.3260, 2.1740],
      'DHOFAR SPIRIT': [41.3468, 2.1660],
      'QALHAT STAR': [41.3300, 2.2400],
      'KHAREEF BREEZE': [41.2850, 2.1800]
    },
    resourcesMap: { center: [41.3360, 2.1650] },
    tugs: {
      'tug-1': [41.3475, 2.1668],
      'tug-2': [41.3550, 2.1745],
      'tug-3': [41.3554, 2.1752],
      'tug-4': [41.3558, 2.1759],
      'tug-5': [41.3546, 2.1738]
    },
    tugAssignedShip: [41.3470, 2.1658],
    cranes: {
      'crane-1': [41.3346, 2.1648],
      'crane-2': [41.3350, 2.1652],
      'crane-3': [41.3354, 2.1655],
      'crane-4': [41.3358, 2.1659]
    },
    liveMap: {
      center: [41.330, 2.180],
      tracks: {
        // Inbound from the Mediterranean towards the south harbour entrance
        'Nizwa Empress': { position: [41.3100, 2.1980], heading: 305, route: [[41.3000, 2.2150], [41.3100, 2.1980], [41.3200, 2.1820]] },
        // Outbound through the south entrance, bound SE into the Mediterranean
        'Hasik Spirit': { position: [41.3150, 2.1950], heading: 130, route: [[41.3240, 2.1780], [41.3150, 2.1950], [41.3050, 2.2150]] },
        // Manoeuvring in the inner basin towards the container quay
        'Sur Venture': { position: [41.3320, 2.1700], heading: 330, route: [[41.3250, 2.1760], [41.3320, 2.1700]] },
        'Qalhat Star': { position: [41.3300, 2.2400], heading: 240, route: [[41.3400, 2.2600], [41.3300, 2.2400]] },
        'Khareef Breeze': { position: [41.2850, 2.1800], heading: 20, route: [[41.2700, 2.1700], [41.2850, 2.1800]] }
      }
    }
  },
  entities: {
    // Port, country and region
    'Port of Oman': 'Port of Barcelona',
    'Port of Salalah': 'Port of Barcelona',
    'Salalah Container Terminal': 'Barcelona Container Terminal',
    'Oman PCS': 'Barcelona PCS',
    'Omani': 'Spanish',
    'Oman': 'Spain',
    'Arabian Sea': 'Mediterranean Sea',
    'Yemen': 'France',
    'Salalah': 'Barcelona',
    'Dhofar': 'Catalonia',
    '🇴🇲': '🇪🇸',
    'UTC+4': 'UTC+1',
    'GST': 'CET',
    'OMR': 'EUR',
    'SCT': 'BCT',

    // Organisations and email domains
    'SPS': 'SAR',
    'Oman Shipping Company': 'Grimaldi Lines',
    'Oman LNG Shipping': 'Enagás LNG Shipping',
    'Asyad Line': 'Boluda Lines',
    'Asyad Shipping Tankers': 'Ibaizabal Tankers',
    'Asyad': 'Boluda',
    'Khimji Ramdas Shipping': 'Bergé Marítima',
    'salalahport.com': 'portdebarcelona.cat',
    'dhofarshipping.om': 'catalunyashipping.es',
    'spsmarine.om': 'sarmarine.es',
    'salalahpilots.om': 'barcelonapilots.es',
    'salalah-ct.com': 'bct-terminal.com',
    'salalah-ct': 'bct-terminal',
    'spsmarine': 'sarmarine',

    // Vessels — names and IMO / MMSI identifiers
    'MAERSK DHOFAR': 'MAERSK CATALONIA',
    'ASYAD HORIZON': 'BOLUDA HORIZON',
    'DHOFAR SPIRIT': 'CATALONIA SPIRIT',
    'GULF ZENITH': 'BALEARIC ZENITH',
    'AL MIRBAT': 'COSTA BRAVA',
    'ARABIAN SEA EXPRESS': 'MEDITERRANEAN EXPRESS',
    'RAYSUT TRADER': 'TARRAGONA TRADER',
    'SADAH STAR': 'SITGES STAR',
    'TAQAH EXPRESS': 'GIRONA EXPRESS',
    'QALHAT STAR': 'MONTJUIC STAR',
    'KHAREEF BREEZE': 'TRAMUNTANA BREEZE',
    'MASIRAH TRADER': 'MALLORCA TRADER',
    'HALLANIYAT GALAXY': 'MENORCA GALAXY',
    'MAERSK RAYSUT': 'MAERSK TARRAGONA',
    'CMA CGM SOHAR': 'CMA CGM VALENCIA',
    'Dhofar Bunker I': 'Barcelona Bunker I',
    'Nizwa Empress': 'Montserrat Empress',
    'Hasik Spirit': 'Badalona Spirit',
    'Sur Venture': 'Llobregat Venture',
    '9786528': '9762318',
    '9623312': '9641207',
    '9498717': '9503518',
    '9833149': '9820465',
    '9437024': '9452961',
    '9875408': '9867334',
    '9374167': '9381129',
    '9812078': '9805273',
    '9315587': '9329846',
    '9466130': '9470516',
    '219018452': '224018452',
    '249612000': '225612000',
    '636018734': '224108734',
    '538007312': '225007312',
    '461000087': '224000087',
    '419001563': '225001563',

    // Harbour tugs
    'MIRBAT': 'TIBIDABO',
    'RAYSUT': 'BESOS',
    'TAQAH': 'MARESME',
    'SADAH': 'GARRAF',
    'HASIK': 'PENEDES',

    // Staff personas, pilots and their accounts — full names first so first names change too
    'Fatma Al Balushi': 'Laia Puig',
    'Salim Al Mashani': 'Sergi Martí',
    'Hamed Al Busaidi': 'Jordi Ferrer',
    'Khalid Al Amri': 'Carlos Vidal',
    'Maryam Al Kindi': 'Marta Soler',
    'Ahmed Al Hinai': 'Albert Serra',
    'Aisha Al Shanfari': 'Anna Casals',
    'Huda Al Lawati': 'Núria Costa',
    'Yousuf Al Farsi': 'Xavier Mas',
    'Saif Al Harthy': 'Pau Bosch',
    'Noor Al Zadjali': 'Clara Pujol',
    'Saeed Al Hajri': 'Joan Camps',
    'Al Balushi': 'Puig',
    'Al Amri': 'Vidal',
    'Al Kindi': 'Soler',
    'Al Rawahi': 'Roca',
    'Al Mashani': 'Martí',
    'Al Hinai': 'Serra',
    'Al Busaidi': 'Ferrer',
    'Al Shanfari': 'Casals',
    'Al Saadi': 'Font',
    'Al Hashmi': 'Riera',
    'Al-Mansoor': 'Navarro',
    'Al Lawati': 'Costa',
    'Al Harthy': 'Bosch',
    'Al Zadjali': 'Pujol',
    'Al Farsi': 'Mas',
    'Al Hajri': 'Camps',
    'fatma.albalushi': 'laia.puig',
    'k.alamri': 'c.vidal',
    'maryam.alkindi': 'marta.soler',
    'k.alrawahi': 'k.roca',
    's.almashani': 's.marti',
    'ahmed.alhinai': 'albert.serra',
    'a.alshanfari': 'a.casals'
  }
};
