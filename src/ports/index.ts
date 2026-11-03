import { omanPort } from './oman';
import { qatarPort } from './qatar';
import { saudiPort } from './saudi';
import { barcelonaPort } from './barcelona';
import type { PortConfig, PortId } from './types';

export type { PortConfig, PortId } from './types';

export const PORTS: PortConfig[] = [omanPort, qatarPort, saudiPort, barcelonaPort];
export const DEFAULT_PORT = omanPort;

export const portPath = (port: PortConfig) => `/${port.slug}`;

// The port is fixed for the lifetime of the page: it is read from the first URL segment
// (/PortofOman, /PortofQatar, /PortofSaudi, /PortofBarcelona — case-insensitive). Any other path is
// normalised to the default port's URL. Switching ports reloads the app on the new URL,
// so no state from one port can carry over into another.
const resolveActivePort = (): PortConfig => {
  const segment = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  const match = PORTS.find(p => p.slug.toLowerCase() === segment);
  const port = match ?? DEFAULT_PORT;
  if (window.location.pathname !== portPath(port)) {
    window.history.replaceState(null, '', portPath(port) + window.location.search + window.location.hash);
  }
  return port;
};

export const activePort: PortConfig = resolveActivePort();

// --- Port-specific text -----------------------------------------------------------------
// Shared content references the reference port's entities (see PortConfig.entities).
// portText swaps every such term for the active port's counterpart in one pass, matching
// case-insensitively and keeping the casing of the original ("MAERSK DHOFAR", "Maersk Dhofar").

const isLatinWordChar = (ch: string) => /[A-Za-z0-9]/.test(ch);
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const entityLookup = new Map(Object.entries(activePort.entities).map(([from, to]) => [from.toLowerCase(), { from, to }]));

// Longest terms first so "MAERSK DHOFAR" wins over "Dhofar". Latin terms only match whole
// words; Arabic terms match anywhere, since Arabic attaches prefixes (بـ، و، لـ) to words.
const entityPattern = entityLookup.size === 0 ? null : new RegExp(
  [...entityLookup.values()]
    .map(e => e.from)
    .sort((a, b) => b.length - a.length)
    .map(term => {
      const start = isLatinWordChar(term[0]) ? '(?<![A-Za-z0-9])' : '';
      const end = isLatinWordChar(term[term.length - 1]) ? '(?![A-Za-z0-9])' : '';
      return start + escapeRegExp(term) + end;
    })
    .join('|'),
  'gi'
);

const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());

const withCasingOf = (matched: string, from: string, to: string) => {
  if (matched === from) return to;
  const hasCase = matched !== matched.toLowerCase() || matched !== matched.toUpperCase();
  if (!hasCase) return to;
  if (matched === matched.toUpperCase()) return to.toUpperCase();
  if (matched === matched.toLowerCase()) return to.toLowerCase();
  return from === from.toUpperCase() ? titleCase(to) : to;
};

const textCache = new Map<string, string>();

export function portText(value: string): string {
  if (!entityPattern || !value) return value;
  const cached = textCache.get(value);
  if (cached !== undefined) return cached;
  const out = value.replace(entityPattern, matched => {
    const entity = entityLookup.get(matched.toLowerCase());
    return entity ? withCasingOf(matched, entity.from, entity.to) : matched;
  });
  if (textCache.size > 5000) textCache.clear();
  textCache.set(value, out);
  return out;
}

// --- Switching ports --------------------------------------------------------------------

const HANDOFF_KEY = 'port-ops-port-switch';

export interface PortSwitchHandoff {
  role: string;
  page: string;
}

// Signed-in users keep their role and page when moving to another port. The handoff is
// one-shot: it is read once on the next load and then removed.
export const switchPort = (portId: PortId, handoff?: PortSwitchHandoff) => {
  const port = PORTS.find(p => p.id === portId);
  if (!port || port.id === activePort.id) return;
  try {
    if (handoff) sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
  } catch {
    // Storage unavailable — the user simply signs in again on the new port.
  }
  window.location.assign(portPath(port));
};

export const takePortSwitchHandoff = (): PortSwitchHandoff | null => {
  try {
    const raw = sessionStorage.getItem(HANDOFF_KEY);
    sessionStorage.removeItem(HANDOFF_KEY);
    return raw ? (JSON.parse(raw) as PortSwitchHandoff) : null;
  } catch {
    return null;
  }
};
