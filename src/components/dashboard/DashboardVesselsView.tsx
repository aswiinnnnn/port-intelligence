import React, { useState } from 'react';
import { listVessels } from './dashboardData';
import { t } from '../../i18n';

interface DashboardVesselsViewProps {
  onPageChange?: (pageId: string) => void;
  onSelectVesselForAllocation?: (vesselName: string) => void;
}

export const DashboardVesselsView: React.FC<DashboardVesselsViewProps> = ({
  onPageChange,
  onSelectVesselForAllocation
}) => {
  const [vesselSearch, setVesselSearch] = useState('');
  const [vesselFilter, setVesselFilter] = useState('All Vessels');

  const filteredVessels = listVessels.filter((vessel) => {
    const matchesSearch = t(vessel.name).toLowerCase().includes(vesselSearch.toLowerCase()) ||
                          t(vessel.type).toLowerCase().includes(vesselSearch.toLowerCase()) ||
                          t(vessel.operator).toLowerCase().includes(vesselSearch.toLowerCase());
    
    if (vesselFilter === 'All Vessels') return matchesSearch;
    if (vesselFilter === 'Approaching') return matchesSearch && vessel.status === 'APPR';
    if (vesselFilter === 'Anchored') return matchesSearch && vessel.status === 'ANCH';
    if (vesselFilter === 'Berthing') return matchesSearch && vessel.statusLabel === 'Berthing';
    if (vesselFilter === 'Berthed') return matchesSearch && vessel.statusLabel === 'Berthed';
    if (vesselFilter === 'Departing') return matchesSearch && vessel.status === 'DEP';
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '24px', padding: '24px 40px 0 40px', overflowY: 'auto' }}>
      
      {/* Search & Filter Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Search Box */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: '44px', borderRadius: '12px', maxWidth: '400px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.7)' }}>
          <input 
            type="text" 
            placeholder={t("Search vessels...")} 
            value={vesselSearch}
            onChange={(e) => setVesselSearch(e.target.value)}
            className="dark-placeholder"
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#1e293b',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All Vessels', 'Approaching', 'Anchored', 'Berthing', 'Berthed', 'Departing'].map((filter) => {
            const isActive = vesselFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setVesselFilter(filter)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid ' + (isActive ? '#1e293b' : 'rgba(0,0,0,0.08)'),
                  backgroundColor: isActive ? '#1e293b' : 'rgba(255,255,255,0.5)',
                  color: isActive ? 'white' : '#475569',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {t(filter)}
              </button>
            );
          })}
        </div>

      </div>

      {/* Vessel Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>
        {filteredVessels.length > 0 ? (
          filteredVessels.map((vessel) => {
            const getRiskColor = (level: string) => {
              if (level === 'CRITICAL RISK') return '#ef4444';
              if (level === 'HIGH RISK') return '#f97316';
              if (level === 'MEDIUM RISK') return '#eab308';
              return '#10b981';
            };

            const getStatusBg = (status: string) => {
              if (status === 'APPR') return 'rgba(16, 185, 129, 0.1)';
              if (status === 'ANCH') return 'rgba(251, 191, 36, 0.1)';
              return 'rgba(16, 185, 129, 0.1)';
            };

            const getStatusColor = (status: string) => {
              if (status === 'APPR') return '#10b981';
              if (status === 'ANCH') return '#d97706';
              return '#16a34a';
            };

            return (
              <div 
                key={vessel.name}
                className="glass-panel" 
                onClick={() => {
                  if (onPageChange) {
                    onPageChange('vessels');
                  }
                  if (onSelectVesselForAllocation) {
                    onSelectVesselForAllocation(vessel.name);
                  }
                }}
                style={{ 
                  padding: '20px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  flexDirection: 'row', 
                  gap: '24px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  backgroundColor: '#EAF1F3',
                  boxShadow: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {/* Left Column: Ship Name and Image */}
                <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1, borderRight: '1px solid rgba(0,0,0,0.06)', paddingRight: '20px', flexShrink: 0 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '18px' }}>{t(vessel.flag)}</span>
                      <div 
                        style={{ 
                          fontSize: '9px', 
                          fontWeight: 700, 
                          color: getStatusColor(vessel.status), 
                          backgroundColor: getStatusBg(vessel.status), 
                          padding: '2px 6px', 
                          borderRadius: '5px',
                          border: `1px solid ${getStatusColor(vessel.status)}15`
                        }}
                      >
                        {t(vessel.status)}
                      </div>
                    </div>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: 0, lineHeight: 1.2 }}>
                      {t(vessel.name)}
                    </h2>
                    <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '3px' }}>
                      {t(vessel.type)}
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', width: '100%', minHeight: '100px' }}>
                    <img 
                      src={vessel.image} 
                      alt={t(vessel.name)} 
                      style={{ 
                        maxHeight: '100px', 
                        maxWidth: '100%', 
                        objectFit: 'contain'
                      }} 
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("OPERATOR")}</span>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                        {t(vessel.operator)}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectVesselForAllocation) {
                          onSelectVesselForAllocation(vessel.name);
                        }
                        if (onPageChange) {
                          onPageChange('allocation');
                        }
                      }}
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'white',
                        backgroundColor: '#10b981',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
                    >
                      {t("Show Allocation")}</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("DIMENSIONS")}</span>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                        {t("LOA: ")}{t(vessel.loa)} {t(" · Draft: ")}{t(vessel.draft)} {t(" · GT: ")}{t(vessel.gt)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("ETA")}</span>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                        {t(vessel.eta)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("CARGO & BERTH")}</span>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                        {t(vessel.cargo)} · {t(vessel.berth)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("RISK PROFILE & TUGS")}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: getRiskColor(vessel.riskLevel) }}>
                          {t(vessel.riskLevel)} ({vessel.risk})
                        </span>
                        <span style={{ fontSize: '11px', color: '#475569' }}>
                          · {vessel.tugs} {t(" Tugs")}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("OPERATIONAL PROCESS PROGRESSION")}</span>
                    <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', maxWidth: '800px', overflowX: 'auto', padding: '6px 0' }}>
                      {vessel.checklist.map((step, sIdx) => {
                        const isFirstUncompleted = !step.done && (sIdx === 0 || vessel.checklist[sIdx - 1].done);
                        
                        let circleBg = 'rgba(0, 0, 0, 0.02)';
                        let circleBorder = '1.5px solid rgba(0, 0, 0, 0.08)';
                        let circleColor = 'rgba(0, 0, 0, 0.35)';
                        
                        if (step.done) {
                          circleBg = 'rgba(16, 185, 129, 0.08)';
                          circleBorder = '1.5px solid #10b981';
                          circleColor = '#10b981';
                        } else if (isFirstUncompleted) {
                          circleBg = 'rgba(59, 130, 246, 0.08)';
                          circleBorder = '1.5px solid #3b82f6';
                          circleColor = '#3b82f6';
                        }

                        const hasLine = sIdx < vessel.checklist.length - 1;
                        const lineColors = step.done ? '#10b981' : 'rgba(0, 0, 0, 0.08)';

                        return (
                          <React.Fragment key={sIdx}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
                              <div style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: circleBg,
                                border: circleBorder,
                                color: circleColor,
                                fontSize: '12px',
                                fontWeight: 600,
                                marginBottom: '4px'
                              }}>
                                {t(step.done ? '✓' : (step.num || sIdx + 1))}
                              </div>
                              <span style={{ fontSize: '10px', color: isFirstUncompleted ? '#0f172a' : '#475569', fontWeight: isFirstUncompleted ? 600 : 400, textAlign: 'center', whiteSpace: 'nowrap' }}>
                                {t(step.label)}
                              </span>
                            </div>
                            
                            {hasLine && (
                              <div style={{
                                flex: 1,
                                height: '1.5px',
                                backgroundColor: lineColors,
                                minWidth: '16px',
                                maxWidth: '50px',
                                marginTop: '15px'
                              }} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
            {t("No vessels match search or filter.")}</div>
        )}
      </div>

    </div>
  );
};
