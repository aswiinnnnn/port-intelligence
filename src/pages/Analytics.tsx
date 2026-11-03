import React from 'react';
import { t } from '../i18n';

interface BerthUtil {
  label: string;
  value: number;
  color: string;
}

const BERTH_UTIL: BerthUtil[] = [
  { label: 'SCT-P1', value: 88, color: '#f97316' },
  { label: 'SCT-P2', value: 62, color: '#f59e0b' },
  { label: 'General Cargo Terminal', value: 71, color: '#f59e0b' },
  { label: 'Cruise', value: 54, color: '#2563eb' },
  { label: 'GCT-B31', value: 47, color: '#2563eb' },
  { label: 'LBT-J2', value: 44, color: '#2563eb' }
];

interface SavingsPoint {
  month: string;
  co2: number;
  fuel: number;
}

const SAVINGS: SavingsPoint[] = [
  { month: 'Feb', co2: 9.8, fuel: 4.6 },
  { month: 'Mar', co2: 12.4, fuel: 5.1 },
  { month: 'Apr', co2: 15.1, fuel: 5.8 },
  { month: 'May', co2: 16.3, fuel: 6.0 },
  { month: 'Jun', co2: 17.6, fuel: 6.2 },
  { month: 'Jul', co2: 18.4, fuel: 6.2 }
];

interface AgentPerf {
  name: string;
  accuracy: number;
  tasks: number;
}

const AGENT_PERFORMANCE: AgentPerf[] = [
  { name: 'Coordinator', accuracy: 97, tasks: 142 },
  { name: 'Comms', accuracy: 99, tasks: 289 },
  { name: 'Risk', accuracy: 93, tasks: 78 },
  { name: 'Optimizer', accuracy: 95, tasks: 67 },
  { name: 'Compliance', accuracy: 100, tasks: 123 },
  { name: 'Twin', accuracy: 100, tasks: 4521 },
  { name: 'Incident', accuracy: 100, tasks: 8 }
];

interface VesselMix {
  label: string;
  value: number;
  color: string;
}

const VESSEL_MIX: VesselMix[] = [
  { label: 'Container', value: 38, color: '#2563eb' },
  { label: 'Bulk Carrier', value: 21, color: '#10b981' },
  { label: 'Cruise', value: 14, color: '#f59e0b' },
  { label: 'RoRo', value: 12, color: '#a78bfa' },
  { label: 'Tanker', value: 10, color: '#f97316' },
  { label: 'Other', value: 5, color: 'rgba(100,116,139,0.4)' }
];

const YOY_THROUGHPUT = [61, 58, 66, 72, 69, 78, 84, 80, 88, 91, 87, 95];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const cardStyle: React.CSSProperties = {
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid rgba(0,0,0,0.06)',
  backgroundColor: 'rgba(255,255,255,0.5)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '1.2px',
  marginBottom: '18px'
};

export const Analytics: React.FC = () => {
  const maxThroughput = Math.max(...YOY_THROUGHPUT);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minWidth: 0, height: '100%', gap: '16px', overflow: 'auto', paddingRight: '8px' }}>

      {/* Row 1: Berth Utilization + CO2 & Fuel Savings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Berth Utilization */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t("Berth Utilization (%)")}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {BERTH_UTIL.map(b => (
              <div key={b.label} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>{t(b.label)}</span>
                <div style={{ position: 'relative', height: '22px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${b.value}%`, height: '100%', backgroundColor: b.color, borderRadius: '4px', transition: 'width 0.4s ease' }} />
                  <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', fontWeight: 700, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{b.value}%</span>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', marginTop: '2px', paddingLeft: '102px' }}>
              <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
            </div>
          </div>
        </div>

        {/* CO2 & Fuel Savings */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t("CO₂ & Fuel Savings (JIT Arrivals)")}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '90px' }}>
            {/* Y axis */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', fontSize: '9px', color: '#94a3b8', textAlign: 'right', paddingBottom: '20px' }}>
              <span>20</span><span>15</span><span>10</span><span>5</span><span>0</span>
            </div>
            {/* Bars */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%' }}>
              {SAVINGS.map(s => (
                <div key={s.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '70px' }}>
                    <div title={t(`CO₂ saved: ${s.co2}T`)} style={{ width: '14px', height: `${(s.co2 / 20) * 70}px`, backgroundColor: '#10b981', borderRadius: '3px 3px 0 0' }} />
                    <div title={t(`Fuel saved: ${s.fuel}T`)} style={{ width: '14px', height: `${(s.fuel / 20) * 70}px`, backgroundColor: '#2563eb', borderRadius: '3px 3px 0 0' }} />
                  </div>
                  <span style={{ fontSize: '9px', color: '#94a3b8' }}>{t(s.month)}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '14px', fontSize: '10px', color: '#475569' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#10b981' }} /> {t(" CO₂ Saved (T)")}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#2563eb' }} /> {t(" Fuel Saved (T)")}</div>
          </div>
        </div>
      </div>

      {/* Row 2: Vessel Type Mix + YoY Throughput */}
      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '16px' }}>
        {/* Vessel Type Mix (donut-style bars) */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t("Vessel Type Mix (YTD Calls)")}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {VESSEL_MIX.map(v => (
              <div key={v.label} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 36px', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: '#475569' }}>{t(v.label)}</span>
                <div style={{ height: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${v.value}%`, height: '100%', backgroundColor: v.color, borderRadius: '5px' }} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#1e293b', textAlign: 'right' }}>{v.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* YoY Throughput */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t("Container Throughput (K TEU / Month)")}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '90px' }}>
            {YOY_THROUGHPUT.map((v, i) => (
              <div key={MONTH_LABELS[i]} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', maxWidth: '18px', height: `${(v / maxThroughput) * 80}px`, background: 'linear-gradient(180deg, #2563eb 0%, rgba(37,99,235,0.25) 100%)', borderRadius: '3px 3px 0 0' }} />
                <span style={{ fontSize: '8px', color: '#94a3b8' }}>{t(MONTH_LABELS[i])}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '11px' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' }}>{t("YTD Total")}</div>
              <div style={{ color: '#1e293b', fontWeight: 700, fontSize: '15px', marginTop: '2px' }}>{t("929K TEU")}</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' }}>{t("vs Last Year")}</div>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '15px', marginTop: '2px' }}>+12.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: AI Agent Performance */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>{t("AI Agent Performance")}</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${AGENT_PERFORMANCE.length}, 1fr)`, gap: '12px' }}>
          {AGENT_PERFORMANCE.map(agent => (
            <div key={agent.name} style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#2563eb' }}>{agent.accuracy}%</div>
              <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 600, marginBottom: '6px' }}>{t("Accuracy")}</div>
              <div style={{ fontSize: '12px', color: '#1e293b', fontWeight: 600 }}>{t(agent.name)}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '10px' }}>{t(agent.tasks.toLocaleString())} {t(" tasks")}</div>
              <div style={{ height: '4px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${agent.accuracy}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #10b981)', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Operational KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>{t("Avg Pilot Response")}</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{t("11.4 min")}</div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>{t("▼ 2.1 min vs last month")}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>{t("Safety Incidents")}</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>2</div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>{t("▼ 4 vs last month")}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>{t("On-Time Berthing")}</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>94.2%</div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>{t("▲ 3.6% vs last month")}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>{t("Demurrage Cost Avoided")}</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{t("OMR 77K")}</div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>{t("▲ OMR 9K vs last month")}</div>
        </div>
      </div>
    </div>
  );
};
