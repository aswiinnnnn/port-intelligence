import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { t, useLanguage } from '../i18n';
import { PORTS, activePort, switchPort, type PortConfig, type PortSwitchHandoff } from '../ports';

interface PortSwitcherProps {
  isLightMode?: boolean;
  // 'brand' renders the port name as the header title; 'pill' is a standalone selector
  variant?: 'brand' | 'pill';
  // Supplied when signed in, so the user keeps their role and page on the new port
  getHandoff?: () => PortSwitchHandoff | undefined;
}

// Lists the supported ports. Choosing one navigates to its URL (/PortofOman, /PortofQatar,
// /PortofSaudi, /PortofBarcelona), which reloads the app with that port's data.
export const PortSwitcher: React.FC<PortSwitcherProps> = ({ isLightMode = true, variant = 'pill', getHandoff }) => {
  const language = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const portName = (port: PortConfig) => (language === 'ar' ? port.nameAr : port.name);
  const textColor = isLightMode ? '#1e293b' : '#ffffff';
  const mutedColor = isLightMode ? '#64748b' : '#94a3b8';
  const isBrand = variant === 'brand';

  const choose = (port: PortConfig) => {
    setOpen(false);
    switchPort(port.id, getHandoff?.());
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('Switch port')}
        title={t('Switch port')}
        data-port={activePort.id}
        onClick={() => setOpen(o => !o)}
        style={isBrand ? {
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginInlineStart: '6px',
          padding: '4px 6px',
          border: 'none',
          borderRadius: '8px',
          background: open ? (isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)') : 'transparent',
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          fontSize: '15px',
          fontWeight: 800,
          letterSpacing: '-0.3px',
          color: textColor,
          whiteSpace: 'nowrap'
        } : {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '10px',
          border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)',
          backgroundColor: isLightMode ? 'rgba(255,255,255,0.7)' : 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 700,
          color: textColor
        }}
      >
        <span>{portName(activePort)}</span>
        <ChevronDown size={14} color={mutedColor} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t('Ports')}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            insetInlineStart: isBrand ? '12px' : 0,
            minWidth: '240px',
            padding: '6px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
            zIndex: 2000
          }}
        >
          {PORTS.map(port => {
            const selected = port.id === activePort.id;
            return (
              <button
                key={port.id}
                type="button"
                role="option"
                aria-selected={selected}
                data-port-option={port.id}
                onClick={() => choose(port)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 10px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: selected ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  cursor: selected ? 'default' : 'pointer',
                  textAlign: 'start',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{portName(port)}</span>
                  <span dir="ltr" style={{ fontSize: '11px', color: '#64748b', textAlign: 'start' }}>/{port.slug}</span>
                </span>
                {selected && <Check size={15} color="#2563eb" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
