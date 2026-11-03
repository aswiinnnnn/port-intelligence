import { useSyncExternalStore } from 'react';
import { ar } from './ar';
import { activePort, portText } from '../ports';

// Lightweight i18n: English source strings are the lookup keys, so untranslated
// text (vessel names, berth codes, radio transcripts) simply passes through.
// Every displayed string also goes through portText, which swaps the reference port's
// entities (vessels, terminals, staff…) for the active port's — see src/ports.

export type Language = 'en' | 'ar';

export const LANGUAGE_OPTIONS: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' }
];

const STORAGE_KEY = 'port-ops-language';

const readStoredLanguage = (): Language => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'ar' ? 'ar' : 'en';
  } catch {
    return 'en';
  }
};

// English-only ports ignore the saved choice (without overwriting it, so it still applies
// on the other ports) and never switch language.
let current: Language = activePort.englishOnly ? 'en' : readStoredLanguage();
const listeners = new Set<() => void>();

const applyToDocument = () => {
  document.documentElement.lang = current;
  document.documentElement.dir = current === 'ar' ? 'rtl' : 'ltr';
  document.title = current === 'ar' ? `${activePort.nameAr} — منصة عمليات الميناء` : `${activePort.name} — Port Operations Platform`;
};
applyToDocument();

export const getLanguage = (): Language => current;

export const setLanguage = (lang: Language) => {
  if (lang === current || activePort.englishOnly) return;
  current = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage unavailable (private mode) — language still applies for this session.
  }
  applyToDocument();
  listeners.forEach(listener => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Subscribe a component to language changes. App uses this, so a change re-renders the whole tree.
export const useLanguage = (): Language => useSyncExternalStore(subscribe, getLanguage);

export const isRtl = () => current === 'ar';

// Rules for strings that embed live values (times, counts, names).
const PATTERNS: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Today, (.+)$/, m => `اليوم، ${m[1]}`],
  [/^Tomorrow, (.+)$/, m => `غداً، ${m[1]}`],
  [/^Scheduled Tomorrow (.+)$/, m => `مجدول غداً ${m[1]}`],
  [/^ETA (.+)$/, m => `الوصول المتوقع ${m[1]}`],
  [/^(\d+) sec ago$/, m => `منذ ${m[1]} ثانية`],
  [/^(\d+) min ago$/, m => `منذ ${m[1]} دقيقة`],
  [/^(\d+)h ago$/, m => `منذ ${m[1]} ساعة`],
  [/^(\d+)d ago$/, m => `منذ ${m[1]} يوم`],
  [/^(\d+) vessels$/, m => `${m[1]} سفن`],
  [/^(\d+) cranes$/, m => `${m[1]} رافعات`],
  [/^(\d+) mins$/, m => `${m[1]} دقيقة`],
  [/^([\d.]+) min$/, m => `${m[1]} دقيقة`],
  [/^(\d+) past messages$/, m => `${m[1]} رسائل سابقة`],
  [/^([\d.]+) knots$/i, m => `${m[1]} عقدة`],
  [/^(\+?[\d.]+) meters$/, m => `${m[1]} متر`],
  [/^([\d.]+) tonnes$/, m => `${m[1]} طن`],
  [/^([\d.]+) Hours$/, m => `${m[1]} ساعة`],
  [/^(\d+)h remain$/, m => `متبقي ${m[1]} ساعة`],
  [/^(\d+)x? Tugs$/, m => `${m[1]} قاطرات`],
  [/^Wave height (.+)$/, m => `ارتفاع الموج ${m[1]}`],
  [/^(.+) Passage Plan$/, m => `خطة عبور ${m[1]}`],
  [/^([A-Z][a-z]+) Master$/, m => `ربان ${m[1]}`],
  [/^Berth (.+)$/, m => `الرصيف ${m[1]}`],
  [/^Due: (.+)$/, m => `الاستحقاق: ${translate(m[1]) ?? m[1]}`],
  [/^\((.+)\)$/, m => {
    const inner = translate(m[1]);
    return inner === undefined ? '' : `(${inner})`;
  }],
  [/^(.+) berthing$/, m => `رسو ${m[1]}`],
  [/^(.+) loading$/, m => `تحميل ${m[1]}`],
  [/^Capt\. (.+)$/, m => `الكابتن ${translate(m[1]) ?? m[1]}`],
  [/^Tug ([A-Z][a-z]+)$/, m => `القاطرة ${m[1]}`],
  [/^SPS Tug ([A-Z]+)$/, m => `قاطرة SPS ${m[1]}`],
  [/^STS Crane #(\d+)$/, m => `رافعة رصيف STS رقم ${m[1]}`],
  [/^SCT Berth (\d+)$/, m => `رصيف محطة الحاويات ${m[1]}`],
  [/^GCT Berth (\d+)$/, m => `رصيف البضائع العامة ${m[1]}`],
  [/^Salalah Container Terminal - Berth (\d+)$/, m => `محطة حاويات صلالة - الرصيف ${m[1]}`],
  [/^General Cargo Terminal - Berth (\d+)(?: \((.+)\))?$/, m =>
    `محطة البضائع العامة - الرصيف ${m[1]}${m[2] ? ` (${translate(m[2]) ?? m[2]})` : ''}`],
  [/^(.+) \((.+)\)$/, m => {
    const a = translate(m[1]);
    const b = translate(m[2]);
    return a === undefined && b === undefined ? '' : `${a ?? m[1]} (${b ?? m[2]})`;
  }]
];

function translate(key: string): string | undefined {
  const hit = ar[key];
  if (hit !== undefined) return hit;
  for (const [re, fn] of PATTERNS) {
    const m = key.match(re);
    if (m) {
      const out = fn(m);
      if (out) return out;
    }
  }
  // Compound labels such as "Container Ship · Denmark · IMO 9786528"
  for (const sep of [' · ', ' — ', ' / ']) {
    if (!key.includes(sep)) continue;
    const parts = key.split(sep);
    const translated = parts.map(p => translate(p) ?? p);
    if (translated.some((p, i) => p !== parts[i])) return translated.join(sep);
  }
  return undefined;
}

// Translate a UI value for the current language and port. Non-strings are returned unchanged.
// Translation runs first because the dictionary is keyed by the reference port's English text.
export function t<T>(value: T): T {
  if (typeof value !== 'string') return value;
  return portText(translateValue(value)) as T;
}

function translateValue(value: string): string {
  if (current === 'en') return value;
  const key = value.trim();
  if (!key) return value;
  const translated = translate(key);
  if (translated === undefined) return value;
  const start = value.indexOf(key);
  return value.slice(0, start) + translated + value.slice(start + key.length);
}
