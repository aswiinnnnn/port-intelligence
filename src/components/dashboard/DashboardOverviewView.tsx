import React from 'react';
import { Anchor, Clock, Ship } from 'lucide-react';
import { t } from '../../i18n';

export const DashboardOverviewView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '24px', padding: '24px 40px 0 40px', overflowY: 'auto' }}>
      {/* 4 Top KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {/* Card 1 */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(91, 226, 200, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ship size={20} color="var(--accent-cyan)" />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {t("↑ +2 vs yesterday")}</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '16px', color: 'white' }}>7</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginTop: '4px' }}>{t("Vessels Today")}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{t("3 pending arrival")}</div>
        </div>
        {/* Card 2 */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Anchor size={20} color="var(--accent-blue)" />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {t("↑ +8%")}</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '16px', color: 'white' }}>71%</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginTop: '4px' }}>{t("Berth Utilization")}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{t("5 of 7 berths active")}</div>
        </div>
        {/* Card 3 */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(251, 191, 36, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="var(--accent-amber)" />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {t("↑ +3%")}</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '16px', color: 'white' }}>87%</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginTop: '4px' }}>{t("On-Time Rate")}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{t("Avg turnaround: 14.2h")}</div>
        </div>
        {/* Card 4 */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(74, 222, 128, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '18px' }}>🌿</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {t("↑ +1.2T")}</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '16px', color: 'white' }}>18.4T</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginTop: '4px' }}>{t("CO₂ Saved Today")}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{t("6.2T fuel via JIT")}</div>
        </div>
      </div>

      {/* 2 Lists side-by-side */}
      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: '400px', paddingBottom: '24px' }}>
        {/* Live Vessel Status */}
        <div className="glass-panel" style={{ flex: 2.2, borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'white' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>🚢</span> {t(" LIVE VESSEL STATUS")}</h2>
            <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600, cursor: 'pointer' }}>{t("View all →")}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
            {[
              { label: 'DK', name: 'MAERSK DHOFAR', status: 'APPROACHING', statusColor: 'var(--accent-cyan)', statusBg: 'rgba(91,226,200,0.1)', desc: 'Container Ship · Containers · SCT-B04', eta: 'ETA 11:56', risk: '35', riskColor: '#f59e0b' },
              { label: 'OM', name: 'ASYAD HORIZON', status: 'APPROACHING', statusColor: 'var(--accent-cyan)', statusBg: 'rgba(91,226,200,0.1)', desc: 'Cruise Ship · Passengers · GCT-B30', eta: 'ETA 12:38', risk: '22', riskColor: '#10b981' },
              { label: 'MH', name: 'DHOFAR SPIRIT', status: 'BERTHING', statusColor: '#3b82f6', statusBg: 'rgba(59,130,246,0.1)', desc: 'Bulk Carrier · Gypsum · GCT-B24', eta: 'ETA 10:44', risk: '58', riskColor: '#f59e0b' },
              { label: 'MT', name: 'GULF ZENITH', status: 'ANCHORED', statusColor: '#fbbf24', statusBg: 'rgba(251,191,36,0.1)', desc: 'Ro-Ro Vessel · Vehicles & Trucks · GCT-B31', eta: 'ETA 14:56', risk: '44', riskColor: '#f59e0b' },
              { label: 'OM', name: 'AL MIRBAT', status: 'APPROACHING', statusColor: 'var(--accent-cyan)', statusBg: 'rgba(91,226,200,0.1)', desc: 'Chemical Tanker · Chemical Products · LBT-J2', eta: 'ETA 16:26', risk: '72', riskColor: '#ef4444' },
              { label: 'LR', name: 'ARABIAN SEA EXPRESS', status: 'APPROACHING', statusColor: 'var(--accent-cyan)', statusBg: 'rgba(91,226,200,0.1)', desc: 'Container Ship · Containers · SCT-B05', eta: 'ETA 18:26', risk: '82', riskColor: '#ef4444' },
              { label: 'IN', name: 'RAYSUT TRADER', status: 'BERTHED', statusColor: '#10b981', statusBg: 'rgba(16,185,129,0.1)', desc: 'Supply Vessel · General Cargo · GCT-B27', eta: 'ETA 08:26', risk: '15', riskColor: '#10b981' }
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {t(v.label)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>{t(v.name)}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: v.statusColor, backgroundColor: v.statusBg, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${v.statusColor}33` }}>{t(v.status)}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{t(v.desc)}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>{t(v.eta)}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {t("Risk: ")}<span style={{ color: v.riskColor, fontWeight: 700 }}>{t(v.risk)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Activity */}
        <div className="glass-panel" style={{ flex: 1, borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'white' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>🤖</span> {t(" AI AGENT ACTIVITY")}</h2>
            <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600, cursor: 'pointer' }}>{t("Console →")}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
            {[
              { name: 'Port Call Coordinator', value: '94%', time: '2 min ago', desc: 'Generating arrival workflow for MAERSK DHOFAR (ETA T+90m...' },
              { name: 'Multilingual Comms Agent', value: '91%', time: '45 sec ago', desc: 'Translating Arabic radio message from AL MIRBAT crew' },
              { name: 'Risk Prediction Agent', value: '87%', time: '8 sec ago', desc: 'CRITICAL: ARABIAN SEA EXPRESS deep draft + tidal window conflict...' },
              { name: 'Optimization Agent', value: '89%', time: '1 min ago', desc: 'Solving tug allocation puzzle: 3 vessels arriving within 2-hour ...' },
              { name: 'Compliance Agent', value: '98%', time: '3 min ago', desc: 'ISPS check for AL MIRBAT — chemical cargo declaration' },
              { name: 'Digital Twin Agent', value: '99%', time: '2 sec ago', desc: 'Synchronizing AIS feed — updating positions for 7 vessels' },
              { name: 'Incident Response Agent', value: '96%', time: '18 min ago', desc: 'Monitoring...' }
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'white' }}>{t(a.name)}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)' }}>{t(a.value)}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t(a.desc)}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '2px' }}>{t(a.time)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
