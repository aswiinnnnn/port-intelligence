import { listVessels, docks, type VesselListItem } from '../pages/UnifiedDashboard';
import { getLanguage, t } from '../i18n';

const inArabic = () => getLanguage() === 'ar';

interface TugBoat {
  id: string;
  name: string;
  bollardPull: string;
  status: 'Available' | 'On Assignment' | 'Maintenance';
}

interface HarborPilot {
  id: string;
  name: string;
  certification: string;
  status: 'Available' | 'On Assignment' | 'Off Duty';
}

// Kept identical to src/pages/ResourceAllocation.tsx so explanations always
// match what the allocation modal actually assigns.
const TUG_FLEET: TugBoat[] = [
  { id: 'tug-1', name: 'Tug Poseidon', bollardPull: '65t', status: 'Available' },
  { id: 'tug-2', name: 'Tug Neptune', bollardPull: '60t', status: 'Available' },
  { id: 'tug-3', name: 'Tug Triton', bollardPull: '55t', status: 'On Assignment' },
  { id: 'tug-4', name: 'Tug Meridian', bollardPull: '70t', status: 'Available' },
  { id: 'tug-5', name: 'Tug Aegis', bollardPull: '50t', status: 'Maintenance' },
  { id: 'tug-6', name: 'Tug Orion', bollardPull: '62t', status: 'Available' }
];

const PILOT_ROSTER: HarborPilot[] = [
  { id: 'pilot-1', name: 'Capt. Huda Al Lawati', certification: 'Deep Draft Certified', status: 'Available' },
  { id: 'pilot-2', name: 'Capt. Saif Al Harthy', certification: 'LNG/Hazmat Certified', status: 'Available' },
  { id: 'pilot-3', name: 'Capt. Noor Al Zadjali', certification: 'Cruise Vessel Certified', status: 'On Assignment' },
  { id: 'pilot-4', name: 'Capt. Yousuf Al Farsi', certification: 'Standard Certified', status: 'Available' },
  { id: 'pilot-5', name: 'Capt. Aisha Al Shanfari', certification: 'Deep Draft Certified', status: 'Off Duty' }
];

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const pickAvailable = <T extends { status: string }>(pool: T[], seed: number): T => {
  const available = pool.filter(item => item.status === 'Available');
  const source = available.length > 0 ? available : pool;
  return source[seed % source.length];
};

interface AllocationExplanation {
  vessel: VesselListItem;
  arrivalTug: TugBoat;
  arrivalPilot: HarborPilot;
  arrivalBerth: (typeof docks)[number];
  departureTug: TugBoat;
  departurePilot: HarborPilot;
  departureBerth: (typeof docks)[number];
  reasons: string[];
}

const explainAllocation = (vessel: VesselListItem): AllocationExplanation => {
  const seed = hashString(vessel.name);
  const vacantBerths = docks.filter(d => d.status !== 'Occupied');
  const berthPool = vacantBerths.length > 0 ? vacantBerths : docks;

  // Arrival allocations
  const arrivalTug = pickAvailable(TUG_FLEET, seed);
  const arrivalPilot = pickAvailable(PILOT_ROSTER, seed + 1);
  const arrivalBerth = berthPool[seed % berthPool.length];

  // Departure allocations
  const departureTug = pickAvailable(TUG_FLEET, seed + 3);
  const departurePilot = pickAvailable(PILOT_ROSTER, seed + 4);
  const departureBerth = berthPool[(seed + 1) % berthPool.length];

  const availableTugs = TUG_FLEET.filter(tug => tug.status === 'Available').map(tug => tug.name);
  const reasons: string[] = [];

  if (inArabic()) {
    reasons.push(
      `📥 تخصيص الوصول:\n` +
      `• القاطرة: ${t(arrivalTug.name)} (${arrivalTug.bollardPull}) لمرافقة الدخول ومناورة الرسو بناءً على الغاطس (${vessel.draft}). القاطرات المتاحة: ${availableTugs.map(name => t(name)).join('، ')}.\n` +
      `• المرشد: ${t(arrivalPilot.name)} (${t(arrivalPilot.certification)}) للملاحة إلى داخل الميناء.\n` +
      `• الرصيف: ${t(arrivalBerth.name)} (أقصى طول ${arrivalBerth.maxLoa}، العمق ${arrivalBerth.depth}) مخصص للتفريغ.`
    );
    reasons.push(
      `🛫 تخصيص المغادرة:\n` +
      `• القاطرة: ${t(departureTug.name)} (${departureTug.bollardPull}) لقطر الإقلاع والاستدارة في حوض المناورة.\n` +
      `• المرشد: ${t(departurePilot.name)} (${t(departurePilot.certification)}) لعبور قناة الخروج.\n` +
      `• الرصيف/الموعد: تصريح مغادرة ${t(departureBerth.name)} مجدول وفق موعد المغادرة المتوقع.`
    );
  } else {
    reasons.push(
      `📥 ARRIVAL ALLOCATION:\n` +
      `• Tug: ${arrivalTug.name} (${arrivalTug.bollardPull}) selected for inbound escort & berthing maneuver based on draft (${vessel.draft}). Available tugs: ${availableTugs.join(', ')}.\n` +
      `• Pilot: ${arrivalPilot.name} (${arrivalPilot.certification}) matched for inward navigation.\n` +
      `• Berth: ${arrivalBerth.name} (max LOA ${arrivalBerth.maxLoa}, depth ${arrivalBerth.depth}) allocated for discharge.`
    );
    reasons.push(
      `🛫 DEPARTURE ALLOCATION:\n` +
      `• Tug: ${departureTug.name} (${departureTug.bollardPull}) assigned for outbound unberthing towage and turning basin rotation.\n` +
      `• Pilot: ${departurePilot.name} (${departurePilot.certification}) assigned for departure channel exit transit.\n` +
      `• Berth/Slot: ${departureBerth.name} departure clearance scheduled for ETD.`
    );
  }

  reasons.push(
    t(`The dual-phase allocation is fully deterministic & AI-optimized for reproducible port operations auditability.`)
  );

  return { vessel, arrivalTug, arrivalPilot, arrivalBerth, departureTug, departurePilot, departureBerth, reasons };
};

// Questions may use the reference name (suggested prompts) or the name shown for the active port.
const vesselNames = (v: VesselListItem) => [v.name, t(v.name).toUpperCase()];

export const findVesselByFuzzyName = (query: string): VesselListItem | undefined => {
  const normalized = query.toUpperCase();
  return listVessels.find(v => vesselNames(v).some(name => normalized.includes(name))) ??
    listVessels.find(v => vesselNames(v).some(name => name.split(' ').some(word => word.length > 3 && normalized.includes(word))));
};

export interface AssistantAnswer {
  text: string;
  vessel?: VesselListItem;
}

// Keyword matchers accept English and Arabic phrasing.
const WHY = /\bwhy\b|لماذا|ليش|سبب/;
const TUG = /tug|قاطر/;
const PILOT = /pilot|مرشد/;
const BERTH = /berth|رصيف|أرصفة|ارصفة/;
const ALLOCATION = /allocat|assign|تخصيص|خصص|مخصص/;
const STATUS = /status|risk|eta|cargo|operator|where|حالة|وضع|مخاطر|وصول|بضائع|أين|اين/;
const AVAILABLE = /available|free|open|vacant|متاح|متاحة|شاغر|شاغرة/;

/**
 * Very small rule-based NLU: looks for "why" + tug/pilot/berth/allocation
 * keywords plus a vessel name mention, and returns a reasoned explanation
 * built from the same deterministic logic the allocation modal uses.
 * Falls back to vessel status lookups and a generic help message otherwise.
 * Replies follow the language currently selected in the UI.
 */
export const answerQuestion = (question: string): AssistantAnswer => {
  const q = question.trim();
  const qLower = q.toLowerCase();
  const arabic = inArabic();

  if (!q) {
    return { text: t("Ask me something like: \"Why is Tug Poseidon assigned to GULF ZENITH?\" or \"What's the status of MAERSK DHOFAR?\"") };
  }

  const vessel = findVesselByFuzzyName(q);

  const isAllocationQuestion =
    WHY.test(qLower) &&
    (TUG.test(qLower) || PILOT.test(qLower) || BERTH.test(qLower) || ALLOCATION.test(qLower));

  if (isAllocationQuestion) {
    if (!vessel) {
      const tracked = listVessels.map(v => v.name).join(', ');
      return {
        text: arabic
          ? `لم أجد سفينة مطابقة في قائمة زيارات الميناء الحالية. جرّب ذكر اسمها مباشرة، مثل: "لماذا تم تخصيص القاطرات للسفينة GULF ZENITH؟" السفن المتابعة حالياً: ${tracked}.`
          : `I couldn't find a matching vessel in the current port call list. Try naming one directly, e.g. "Why is the tug boat allocation done for GULF ZENITH?" Vessels currently tracked: ${tracked}.`
      };
    }
    const explanation = explainAllocation(vessel);
    const focusTug = TUG.test(qLower);
    const focusPilot = PILOT.test(qLower);
    const focusBerth = BERTH.test(qLower);

    let lines: string[];
    if (focusTug && !focusPilot && !focusBerth) {
      lines = [explanation.reasons[0], explanation.reasons[1]];
    } else if (focusPilot && !focusTug && !focusBerth) {
      lines = [explanation.reasons[2]];
    } else if (focusBerth && !focusTug && !focusPilot) {
      lines = [explanation.reasons[3]];
    } else {
      lines = explanation.reasons;
    }
    lines = lines.filter(Boolean);

    const header = arabic
      ? `مبررات التخصيص للسفينة ${explanation.vessel.flag} ${explanation.vessel.name}:`
      : `Allocation reasoning for ${explanation.vessel.flag} ${explanation.vessel.name}:`;
    return {
      text: `${header}\n\n${lines.map(l => `• ${l}`).join('\n\n')}`,
      vessel: explanation.vessel
    };
  }

  // Status / info lookups
  if (vessel && (STATUS.test(qLower) || BERTH.test(qLower))) {
    return {
      text: arabic
        ? `${vessel.flag} ${vessel.name} (${t(vessel.type)})\n\n` +
          `• الحالة: ${t(vessel.statusLabel)}\n` +
          `• الرصيف: ${vessel.berth}\n` +
          `• الوصول المتوقع: ${vessel.eta}\n` +
          `• البضائع: ${t(vessel.cargo)}\n` +
          `• المخاطر: ${t(vessel.riskLevel)} (الدرجة ${vessel.risk})\n` +
          `• القاطرات المطلوبة: ${vessel.tugs}\n` +
          `• المشغل: ${t(vessel.operator)}`
        : `${vessel.flag} ${vessel.name} (${vessel.type})\n\n` +
          `• Status: ${vessel.statusLabel}\n` +
          `• Berth: ${vessel.berth}\n` +
          `• ETA: ${vessel.eta}\n` +
          `• Cargo: ${vessel.cargo}\n` +
          `• Risk: ${vessel.riskLevel} (score ${vessel.risk})\n` +
          `• Tugs required: ${vessel.tugs}\n` +
          `• Operator: ${vessel.operator}`,
      vessel
    };
  }

  if (vessel) {
    const explanation = explainAllocation(vessel);
    return {
      text: arabic
        ? `${vessel.flag} ${vessel.name} مخصص لها حالياً — القاطرة: ${t(explanation.arrivalTug.name)}، المرشد: ${t(explanation.arrivalPilot.name)}، الرصيف: ${t(explanation.arrivalBerth.name)}. اسأل "لماذا" للحصول على المبررات الكاملة.`
        : `${vessel.flag} ${vessel.name} is currently allocated Tug: ${explanation.arrivalTug.name}, Pilot: ${explanation.arrivalPilot.name}, Berth: ${explanation.arrivalBerth.name}. Ask "why" to get the full reasoning.`,
      vessel
    };
  }

  if (BERTH.test(qLower) && AVAILABLE.test(qLower)) {
    const vacant = docks.filter(d => d.status === 'Vacant');
    if (vacant.length === 0) return { text: t('No berths are currently vacant.') };
    const names = vacant.map(d => t(d.name));
    return { text: arabic ? `الأرصفة الشاغرة الآن: ${names.join('، ')}.` : `Vacant berths right now: ${names.join(', ')}.` };
  }

  if (TUG.test(qLower) && AVAILABLE.test(qLower)) {
    const available = TUG_FLEET.filter(tug => tug.status === 'Available');
    if (available.length === 0) return { text: t('No tugs are currently available.') };
    const names = available.map(tug => `${t(tug.name)} (${tug.bollardPull})`);
    return { text: arabic ? `القاطرات المتاحة الآن: ${names.join('، ')}.` : `Available tugs right now: ${names.join(', ')}.` };
  }

  if (PILOT.test(qLower) && AVAILABLE.test(qLower)) {
    const available = PILOT_ROSTER.filter(p => p.status === 'Available');
    if (available.length === 0) return { text: t('No pilots are currently available.') };
    const names = available.map(p => `${t(p.name)} (${t(p.certification)})`);
    return { text: arabic ? `المرشدون المتاحون الآن: ${names.join('، ')}.` : `Available pilots right now: ${names.join(', ')}.` };
  }

  return {
    text: t("I can explain resource allocation decisions (e.g. \"Why is Tug Poseidon assigned to GULF ZENITH?\"), vessel status, or fleet availability. Try mentioning a vessel name or asking about tugs, pilots, or berths.")
  };
};
