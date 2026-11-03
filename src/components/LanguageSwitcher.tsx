import React from 'react';
import { Languages } from 'lucide-react';
import { LANGUAGE_OPTIONS, setLanguage, t, useLanguage } from '../i18n';
import { activePort } from '../ports';

interface LanguageSwitcherProps {
  isLightMode?: boolean;
  size?: 'compact' | 'regular';
}

// Segmented English / العربية toggle. The choice is saved and flips the page to RTL for Arabic.
// Not shown on English-only ports.
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isLightMode = true, size = 'compact' }) => {
  const language = useLanguage();
  const compact = size === 'compact';

  if (activePort.englishOnly) return null;

  return (
    <div
      role="group"
      aria-label={t('Language')}
      title={t('Language')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        padding: '3px',
        height: compact ? '42px' : 'auto',
        boxSizing: 'border-box',
        borderRadius: '10px',
        border: isLightMode ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.15)',
        backgroundColor: isLightMode ? 'rgba(255,255,255,0.7)' : 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)',
        flexShrink: 0
      }}
    >
      <Languages size={14} color={isLightMode ? '#64748b' : '#94a3b8'} style={{ margin: '0 4px' }} />
      {LANGUAGE_OPTIONS.map(option => {
        const active = option.code === language;
        return (
          <button
            key={option.code}
            type="button"
            lang={option.code}
            aria-pressed={active}
            onClick={() => setLanguage(option.code)}
            style={{
              border: 'none',
              cursor: 'pointer',
              borderRadius: '7px',
              padding: compact ? '0 10px' : '8px 16px',
              height: compact ? '100%' : 'auto',
              fontSize: compact ? '12px' : '13px',
              fontWeight: 700,
              fontFamily: option.code === 'ar' ? "'Segoe UI', Tahoma, 'Noto Sans Arabic', sans-serif" : 'inherit',
              backgroundColor: active ? '#2563eb' : 'transparent',
              color: active ? '#ffffff' : (isLightMode ? '#334155' : '#cbd5e1'),
              transition: 'all 0.2s ease'
            }}
          >
            {compact ? (option.code === 'ar' ? 'عربي' : 'EN') : option.nativeLabel}
          </button>
        );
      })}
    </div>
  );
};
